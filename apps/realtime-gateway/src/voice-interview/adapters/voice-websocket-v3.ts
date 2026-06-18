import { z } from "zod";
import { VoiceWsLike } from "./voice-websocket.js";
import { SessionManager, VoiceTurnRecord } from "../sessions/session-manager.js";
import { DeepgramAdapter } from "./deepgram.js";
import { TTSAdapter, DefaultTTSAdapter } from "./tts/index.js";
import { now } from "../core/metrics.js";
import { interviewRepository as repository } from "../persistence/singleton.js";
import { initInterviewV3, nextV3Step, InterviewStateV3 } from "../core/v3/interview-engine-v3.js";
import { generateExecutiveImpression } from "../core/v3/executive-impression.js";
import { simulateDecision } from "../core/v3/decision-simulator.js";
import { createClient } from "@supabase/supabase-js";
import { createChildLogger } from "../../../../../lib/logger.js";
import { envServer } from "../../../../../lib/env.server.js";
import { withTimeout, CircuitBreaker, SessionRateLimiter } from "../../../../../lib/resilience.js";
import { captureError, setSentryContext } from "../../../../../lib/sentry-context.js";

const redisCircuit = new CircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 30000 });
const intentRateLimiter = new SessionRateLimiter(500, 1);

const supabase = createClient(
  envServer.SUPABASE_URL,
  envServer.SUPABASE_SERVICE_ROLE_KEY,
);

export interface VoiceConnectionV3Deps {
  sessions: SessionManager;
  tts?: TTSAdapter;
  createStt?: (cb: {
    onTranscript: (t: string) => void;
    onFinalTranscript: (t: string) => void;
    onError: (e: unknown) => void;
  }) => DeepgramAdapter;
  log?: (event: string, fields: Record<string, unknown>) => void;
}

export interface VoiceConnectionV3Input {
  sessionId: string;
  userId?: string;
  targetRole?: string;
  context: any;
}

let eventSeq = 0;
function nextEventId(): string {
  eventSeq += 1;
  return `e${Date.now().toString(36)}_${eventSeq}`;
}

const WebSocketMessageSchema = z.object({
  type: z.string(),
  text: z.string().optional(),
}).passthrough();

export async function handleVoiceConnectionV3(
  ws: VoiceWsLike,
  input: VoiceConnectionV3Input,
  deps: VoiceConnectionV3Deps
) {
  const tts = deps.tts ?? new DefaultTTSAdapter();
  const connIp = (input as any).ip || "unknown";
  const connUserId = input.userId || "anon";

  const log = createChildLogger({
    sessionId: input.sessionId,
    userId: input.userId,
    component: 'voice-websocket-v3'
  });

  log.info({ event: 'ws_connected', ip: connIp });

  setSentryContext({ sessionId: input.sessionId, userId: input.userId, component: 'voice-websocket-v3' });

  // ── 0. WebSocket Session Guards (Redis) ──
  let sessionAcquired = true;
  try {
    const { acquireWsSession } = await import("../../server/rate-limiter.js");
    sessionAcquired = await redisCircuit.execute(
      () => withTimeout(acquireWsSession(connUserId, connIp), 500),
      true
    );
  } catch (err) {
    log.warn({ event: 'redis_circuit_breaker_open', err });
    captureError(err, { component: 'voice-websocket-v3', event: 'redis_acquire_session', sessionId: input.sessionId });
    sessionAcquired = true;
  }

  if (!sessionAcquired) {
    ws.send(JSON.stringify({
      type: "error",
      message: "Session limit reached. Only one active session per user is allowed."
    }));
    ws.close(1008, "Session limit");
    return;
  }

  const initOptions: any = { context: input.context };
  if (input.targetRole) initOptions.targetRole = input.targetRole;

  const { state: initialState, question: initialQuestion } = initInterviewV3(initOptions);

  // 1. DB Kill Switch (with timeout + fail-open)
  let settings: any = null;
  try {
    const res = await withTimeout(
      supabase.from("engine_settings").select("engine_enabled").eq("id", "default").single(),
      3000,
      { data: { engine_enabled: true }, error: null, count: null, status: 200, statusText: "OK" }
    );
    if (res.error) throw res.error;
    settings = res.data;
  } catch (err) {
    log.warn({ event: 'db_kill_switch_failed_or_timeout', fallback: 'engine_enabled=true', err });
    settings = { engine_enabled: true };
  }

  if (settings && settings.engine_enabled === false) {
    ws.send(JSON.stringify({
      type: "error",
      message: "Interview engine temporarily unavailable"
    }));
    ws.close(1011, "Engine disabled");
    try {
      const { releaseWsSession } = await import("../../server/rate-limiter.js");
      await releaseWsSession(connUserId, connIp);
    } catch { /* noop */ }
    return;
  }

  const sessionInput: any = {
    id: input.sessionId,
    state: initialState
  };
  if (input.userId) sessionInput.userId = input.userId;
  if (input.targetRole) sessionInput.targetRole = input.targetRole;

  const session = deps.sessions.createV3(sessionInput);

  const ttsAudio = await tts.synthesize(initialQuestion).catch(() => undefined);

  const safeSend = (msg: any) => {
    try {
      ws.send(JSON.stringify({ ...msg, eventId: nextEventId() }));
    } catch (e) {
      // socket closed
    }
  };

  // ── Hard Timeout: 30 minutes max ──
  const HARD_TIMEOUT_MS = 30 * 60 * 1000;
  const hardTimer = setTimeout(() => {
    safeSend({ type: "error", message: "Session time limit reached (30 minutes)." });
    ws.close(1000, "Hard timeout");
  }, HARD_TIMEOUT_MS);

  // ── Silence Timeout: 5 minutes without audio ──
  const SILENCE_TIMEOUT_MS = 5 * 60 * 1000;
  let silenceTimer = setTimeout(() => {
    safeSend({ type: "error", message: "Session closed due to inactivity." });
    ws.close(1000, "Silence timeout");
  }, SILENCE_TIMEOUT_MS);

  const resetSilenceTimer = () => {
    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      safeSend({ type: "error", message: "Session closed due to inactivity." });
      ws.close(1000, "Silence timeout");
    }, SILENCE_TIMEOUT_MS);
  };

  safeSend({ type: "ready", sessionId: session.id, question: initialQuestion });

  if (ttsAudio) {
    try {
      ws.send(ttsAudio);
    } catch {
      // closed
    }
  }

  safeSend({ type: "next_question_audio", available: !!ttsAudio });

  let processing = false;

  let sttCallbacks: any = null;

  const stt = (deps.createStt ?? ((cb) => { sttCallbacks = cb; return new DeepgramAdapter(cb); }))({
    onTranscript: (t) => safeSend({ type: "transcript", text: t, final: false }),
    onFinalTranscript: async (transcript) => {
      safeSend({ type: "transcript", text: transcript, final: true });

      if (processing) return;

      // Anti-spam : max 1 intent detection / 500ms
      if (!intentRateLimiter.consume(session.id)) {
        log.warn({ event: 'rate_limit_exceeded_intent', sessionId: session.id });
        return;
      }

      processing = true;

      const t0 = now();
      const state = session.state as InterviewStateV3;

      try {
        const result = await nextV3Step(state, transcript);
        const t1 = now();

        // ── LLM success → reset error counter ──
        try {
          const { resetLlmErrors } = await import("../../server/rate-limiter.js");
          await redisCircuit.execute(() => withTimeout(resetLlmErrors(session.id), 500));
        } catch (err) {
          log.warn({ event: 'redis_reset_llm_errors_failed', err });
        }

        session.state = result.updatedState;
        
        const turnRecord: VoiceTurnRecord = {
          turn: state.turnCount,
          transcript,
          score: result.evaluationScore,
          question: result.question
        };
        session.turns.push(turnRecord);

        safeSend({
          type: "feedback_text",
          feedback: "Analysis complete",
          score: result.evaluationScore,
          question: result.question,
          signal: "probe",
          finished: result.finished
        });

        if (!result.finished && result.question) {
          const ttsT0 = now();
          const audio = await tts.synthesize(result.question).catch(() => undefined);
          const ttsMs = now() - ttsT0;

          if (audio) {
            ws.send(audio);
          }
          safeSend({ type: "next_question_audio", available: !!audio });
          if (deps.log) {
            deps.log("turn_processed", {
              turn_latency_ms: t1 - t0,
              llm_latency_ms: t1 - t0,
              tts_latency_ms: ttsMs,
              tts_provider_used: "default"
            });
          }
        }

        if (result.finished) {
          session.endedAt = new Date().toISOString();
          
          const avgTech = state.techCount > 0 ? state.avgTech / state.techCount : 0;
          const avgComm = state.commCount > 0 ? state.avgComm / state.commCount : 0;
          const avgAlign = state.alignCount > 0 ? state.avgAlign / state.alignCount : 0;
          const avgQuant = state.quantCount > 0 ? state.avgQuant / state.quantCount : 0;

          let leadershipComposite = avgAlign; // fallback
          if (state.phase4Scores) {
            leadershipComposite = (
              state.phase4Scores.strategic_thinking_score + 
              state.phase4Scores.conflict_leadership_score + 
              state.phase4Scores.organizational_impact_score
            ) / 3;
          }

          const FinalExecutiveScore =
            (0.25 * avgTech) +
            (0.20 * avgComm) +
            (0.15 * avgAlign) +
            (0.15 * avgQuant) +
            (0.15 * leadershipComposite) +
            (0.10 * (10 - (state.integrityRiskIndex * 10))); // Scaled 1-10

          const decisionSimulation = simulateDecision({
            technicalDepth: avgTech,
            integrityRisk: state.integrityRiskIndex * 10,
            leadership: leadershipComposite
          });

          const executiveImpression = await generateExecutiveImpression({
            finalExecutiveScore: FinalExecutiveScore,
            integrityRiskIndex: state.integrityRiskIndex,
            technicalDepthScore: avgTech,
            quantificationDepthScore: avgQuant,
            leadershipCompositeScore: leadershipComposite,
            consistencyGap: result.finalScores?.consistencyGap || 0
          });

          try {
            await withTimeout(
              repository.update(session.id, {
                endedAt: session.endedAt,
                transcript: session.turns,
                score: {
                  finalExecutiveScore: FinalExecutiveScore,
                  integrityRiskIndex: state.integrityRiskIndex,
                  integrityRiskLevel: result.finalScores?.integrityRisk,
                  interviewScore: FinalExecutiveScore,
                  communicationScore: avgComm,
                  technicalDepthScore: avgTech,
                  quantificationDepthScore: avgQuant,
                  leadershipCompositeScore: leadershipComposite,
                  consistencyGap: result.finalScores?.consistencyGap,
                  executiveImpression,
                  decisionSimulation,
                  phase1Scores: state.phase1Scores,
                  phase2Scores: state.phase2Scores,
                  phase3Scores: state.phase3Scores,
                  phase4Scores: state.phase4Scores,
                  integrityRiskTimeline: state.integrityRiskTimeline,
                  pressureTimeline: state.pressureTimeline,
                  metadata: {
                    engineVersion: "v3_stable_realistic",
                    model: "gpt-4o-mini",
                    timestamp: new Date().toISOString()
                  }
                }
              }),
              5000
            );
          } catch (dbErr) {
            log.error({ err: dbErr, event: 'db_final_save_failed' });
            captureError(dbErr, { component: 'voice-websocket-v3', event: 'db_final_save_failed', sessionId: session.id });
          }

          safeSend({
            type: "summary",
            summary: {
              overview: "Interview finished.",
              overallScore: result.evaluationScore,
              feedbackPoints: [],
              hireProbability: 0
            }
          });

          // 2. Insert into engine_health_log
          try {
            await supabase.from("engine_health_log").insert({
              interview_id: session.id,
              engine_version: "v3_stable_realistic",
              engine_instance_id: envServer.RENDER_INSTANCE_ID || "local",
              final_executive_score: FinalExecutiveScore,
              integrity_risk_index: state.integrityRiskIndex,
              max_pressure_level: state.maxPressureLevel || 1,
              total_turns: state.turnCount,
              duration_ms: Date.now() - session.startedAt,
              error_occurred: !!state.errorOccurred,
              timeout_occurred: !!state.timeoutOccurred,
              pressure_distribution: state.pressureTimeline || {},
              phase_breakdown: {
                phase1_turns: state.phase1Scores ? Object.keys(state.phase1Scores).length : 0,
                phase2_turns: state.phase2Scores ? Object.keys(state.phase2Scores).length : 0,
                phase3_turns: state.phase3Scores ? Object.keys(state.phase3Scores).length : 0,
                phase4_turns: state.phase4Scores ? Object.keys(state.phase4Scores).length : 0
              },
              job_category: "Executive",
              candidate_level: "C-Level",
              role_target: session.targetRole || "Unknown"
            });
          } catch (logErr) {
            log.error({ err: logErr, event: 'db_health_log_failed' });
            captureError(logErr, { component: 'voice-websocket-v3', event: 'db_health_log_failed', sessionId: session.id });
          }
          
          setTimeout(() => ws.close(), 1000);
        }

      } catch (err) {
        // ── LLM Fail Safe: track consecutive errors ──
        captureError(err, { component: 'voice-websocket-v3', event: 'llm_turn_failed', sessionId: session.id });
        let shouldKill = false;
        try {
          const { trackLlmError } = await import("../../server/rate-limiter.js");
          shouldKill = await redisCircuit.execute(() => withTimeout(trackLlmError(session.id), 500), false);
        } catch (err2) {
          log.warn({ event: 'redis_track_llm_error_failed', err: err2 });
        }

        if (shouldKill) {
          safeSend({ type: "error", message: "Technical interruption. Please restart the session." });
          ws.close(1011, "LLM fail safe");
        } else {
          safeSend({ type: "error", message: (err as Error).message });
        }
      } finally {
        processing = false;
      }
    },
    onError: (e) => safeSend({ type: "error", message: String(e) }),
  });

  stt.start();

  let cumulativeBytes = 0;
  const MAX_CHUNK_SIZE = 50 * 1024; // 50KB per chunk max
  const MAX_TOTAL_BYTES = 50 * 1024 * 1024; // 50MB max per interview

  ws.on("message", (data, isBinary) => {
    // Reset silence timer on any incoming message
    resetSilenceTimer();

    if (isBinary && data instanceof Uint8Array) {
      if (data.byteLength > MAX_CHUNK_SIZE) {
        ws.close(1009, "Chunk too large");
        return;
      }
      cumulativeBytes += data.byteLength;
      if (cumulativeBytes > MAX_TOTAL_BYTES) {
        ws.close(1009, "Payload too large over session");
        return;
      }
      if (!processing) {
        stt.sendAudio(data);
      }
    } else if (typeof data === "string") {
      try {
        const msg = JSON.parse(data);
        const parsed = WebSocketMessageSchema.safeParse(msg);
        if (!parsed.success) return;

        if (parsed.data.type === "end_speech") {
          // just ignore or signal end of speech manually if needed
        } else if (parsed.data.type === "mock_transcript" && sttCallbacks) {
          // E2E testing hook
          sttCallbacks.onFinalTranscript(parsed.data.text!);
        }
      } catch {
        // ignore
      }
    }
  });

  ws.on("close", async () => {
    clearTimeout(hardTimer);
    clearTimeout(silenceTimer);
    stt.stop();
    deps.sessions.close(session.id);

    // Release Redis session lock
    try {
      const { releaseWsSession } = await import("../../server/rate-limiter.js");
      await redisCircuit.execute(() => withTimeout(releaseWsSession(connUserId, connIp), 500));
    } catch (err) {
      log.warn({ event: 'redis_release_failed', err });
    }
    intentRateLimiter.cleanup(session.id);
  });
}
