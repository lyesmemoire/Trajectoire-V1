/**
 * runtime/voice-runtime.ts — Orchestrateur runtime du tour vocal (P4.2).
 * TurnPlan -> séquence d'instructions transport + réalisation des délais (Clock).
 * Aucune I/O réseau. Déterministe à Clock+RNG fixés.
 */
import type { Clock } from "./clock.js";
import type { PerceptionUX } from "../core/simulation/perception-ux.js";
import type { Rng } from "./rng.js";
import { buildTurnPlan, type TurnPlan } from "./turn-timing.js";
import { createChildLogger } from "../../../../../lib/logger.js";

export type VoiceInstruction =
  | { type: "wait"; ms: number }
  | { type: "emphatic_silence"; ms: number }
  | { type: "interrupt_candidate"; atMs: number }
  | { type: "speak"; text: string; speechRate: number; estimatedMs: number }
  | { type: "speaking_stop" }
  | { type: "turn_done"; latencyMs: number };

export interface RuntimeTurnResult {
  plan: TurnPlan;
  instructions: VoiceInstruction[];
  totalLatencyMs: number;
}

export interface RunTurnInput {
  ux: PerceptionUX;
  replyText: string;
  candidateSpeechMs?: number;
  clock: Clock;
  rng: Rng;
}

export async function runVoiceTurn(
  input: RunTurnInput,
  options?: {
    signal?: AbortSignal;
    onEmit?: (instr: VoiceInstruction) => void;
  }
): Promise<RuntimeTurnResult> {
  const { ux, replyText, clock, rng } = input;
  const signal = options?.signal;
  const onEmit = options?.onEmit ?? (() => {});
  const candidateSpeechMs = input.candidateSpeechMs ?? 0;
  
  const start = clock.now();
  const plan = buildTurnPlan(ux, replyText, rng);
  const instructions: VoiceInstruction[] = [];

  const emit = (instr: VoiceInstruction) => {
    instructions.push(instr);
    onEmit(instr);
  };

  if (plan.recruiterInterrupts) {
    const atMs = Math.round(candidateSpeechMs * 0.6);
    emit({ type: "interrupt_candidate", atMs });
  }

  if (plan.delayBeforeReplyMs > 0) {
    emit({ type: "wait", ms: plan.delayBeforeReplyMs });
    await clock.sleep(plan.delayBeforeReplyMs, { signal });
  }

  if (plan.emphaticSilence) {
    const silenceMs = plan.totalLeadMs - plan.delayBeforeReplyMs;
    emit({ type: "emphatic_silence", ms: silenceMs });
    await clock.sleep(silenceMs, { signal });
  }

  emit({
    type: "speak",
    text: replyText,
    speechRate: plan.speechRate,
    estimatedMs: plan.estimatedSpeakMs,
  });
  await clock.sleep(plan.estimatedSpeakMs, { signal });

  const totalLatencyMs = clock.now() - start;
  emit({ type: "turn_done", latencyMs: totalLatencyMs });
  
  return { plan, instructions, totalLatencyMs };
}

import type { TransportBinding } from "./transport-binding.js";
import { nextStep } from "../core/interview-engine.js";
import { SessionManager } from "../sessions/session-manager.js";
import { SystemClock } from "./clock.js";
import { perceiveUX } from "../core/simulation/perception-ux.js";
import { metrics } from "../metrics.js";

/**
 * Orchestrateur de cycle de vie qui connecte le TransportBinding au moteur d'entretien.
 */
export class VoiceRuntime {
  private currentTurn: AbortController | null = null;
  private isSpeaking = false;
  private disposed = false;

  constructor(
    private readonly binding: TransportBinding,
    private readonly sessions: SessionManager,
    private readonly sessionId: string
  ) {}

  private get log() {
    return createChildLogger({
      sessionId: this.sessionId,
      component: 'voice-runtime'
    });
  }

  start(): void {
    this.binding.onEvent(async (event) => {
      // Guard: ne rien traiter si le runtime est disposé
      if (this.disposed) return;

      if (event.type === "transcript" && event.isFinal) {
        
        // 1. Interrompre le tour précédent (Barge-in)
        if (this.currentTurn) {
          this.log.warn({ 
            event: 'barge_in_triggered',
            stopReason: 'superseded_by_new_transcript' 
          });
          this.currentTurn.abort(new Error("superseded_by_new_transcript"));
        }
        
        this.currentTurn = new AbortController();
        const signal = this.currentTurn.signal;

        try {
          const session = this.sessions.getSession(this.sessionId);
          if (!session) return;

          // 2. Logique métier pure (nextStep)
          const step = nextStep(session.state, event.text);
          this.sessions.updateSession(this.sessionId, step.updatedState);

          // 3. Exécution avec délai asynchrone via runVoiceTurn
          const ux = perceiveUX({
            emotion: "neutral",
            trust: 0.5,
            suspicion: 0.1,
            engagement: 0.8,
            pressure: 0.2,
            fatigue: 0,
            confidenceInCandidate: 0,
            momentum: 0
          });
          const clock = new SystemClock();
          const rng = { 
            next: () => Math.random(),
            chance: (prob: number) => Math.random() < prob
          };

          const eventTime = Date.now();
          
          await runVoiceTurn(
            { ux, replyText: step.nextQuestion, clock, rng },
            {
              signal,
              onEmit: (instr) => {
                // Ne pas émettre si disposé entre-temps
                if (this.disposed) return;
                if (instr.type === "speak") {
                  if (!this.isSpeaking) {
                    metrics.recordLatencyToFirstAudio(Date.now() - eventTime);
                  }
                  this.isSpeaking = true;
                } else if (instr.type === "turn_done") {
                  this.isSpeaking = false;
                }
                this.binding.send(instr);
              }
            }
          );
        } catch (err: any) {
          if (err.name === "AbortError" || err.message === "superseded_by_new_transcript") {
            metrics.recordAbort();
            if (this.isSpeaking && !this.disposed) {
              this.binding.send({ type: "speaking_stop" });
              this.isSpeaking = false;
            }
          } else {
            this.log.error({ err, event: 'runtime_error' });
          }
        }
      }
    });
  }

  /**
   * Arrête proprement le runtime : annule le tour en cours et empêche tout
   * traitement futur. Appelé par le SessionManager lors du delete/TTL/disconnect.
   */
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    if (this.currentTurn) {
      this.currentTurn.abort(new Error("session_disposed"));
      this.currentTurn = null;
    }
    this.isSpeaking = false;
  }
}

