/**
 * runtime/voice-runtime.ts — Orchestrateur runtime du tour vocal (P4.2).
 * TurnPlan -> séquence d'instructions transport + réalisation des délais (Clock).
 * Aucune I/O réseau. Déterministe à Clock+RNG fixés.
 */
import type { Clock } from "./clock";
import type { PerceptionUX } from "../core/simulation/perception-ux";
import type { Rng } from "./rng";
import { buildTurnPlan, type TurnPlan } from "./turn-timing";

export type VoiceInstruction =
  | { type: "wait"; ms: number }
  | { type: "emphatic_silence"; ms: number }
  | { type: "interrupt_candidate"; atMs: number }
  | { type: "speak"; text: string; speechRate: number; estimatedMs: number }
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
): Promise<RuntimeTurnResult> {
  const { ux, replyText, clock, rng } = input;
  const candidateSpeechMs = input.candidateSpeechMs ?? 0;
  const start = clock.now();
  const plan = buildTurnPlan(ux, replyText, rng);
  const instructions: VoiceInstruction[] = [];

  if (plan.recruiterInterrupts) {
    const atMs = Math.round(candidateSpeechMs * 0.6);
    instructions.push({ type: "interrupt_candidate", atMs });
  }

  if (plan.delayBeforeReplyMs > 0) {
    instructions.push({ type: "wait", ms: plan.delayBeforeReplyMs });
    await clock.sleep(plan.delayBeforeReplyMs);
  }

  if (plan.emphaticSilence) {
    const silenceMs = plan.totalLeadMs - plan.delayBeforeReplyMs;
    instructions.push({ type: "emphatic_silence", ms: silenceMs });
    await clock.sleep(silenceMs);
  }

  instructions.push({
    type: "speak",
    text: replyText,
    speechRate: plan.speechRate,
    estimatedMs: plan.estimatedSpeakMs,
  });
  await clock.sleep(plan.estimatedSpeakMs);

  const totalLatencyMs = clock.now() - start;
  instructions.push({ type: "turn_done", latencyMs: totalLatencyMs });
  return { plan, instructions, totalLatencyMs };
}
