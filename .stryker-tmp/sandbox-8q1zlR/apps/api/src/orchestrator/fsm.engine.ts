// @ts-nocheck
import { Injectable, Logger } from '@nestjs/common';
import { SessionState, InterviewSession } from '../common/session.types';

// -----------------------------------------------------
// Voice event definitions (centralized for FSM engine)
// -----------------------------------------------------
export enum VoiceEventType {
  AUDIO_CHUNK = 'AUDIO_CHUNK',
  TRANSCRIPT_PARTIAL = 'TRANSCRIPT_PARTIAL',
  TRANSCRIPT_FINAL = 'TRANSCRIPT_FINAL',
  LLM_TOKEN = 'LLM_TOKEN',
  TTS_CHUNK = 'TTS_CHUNK',
  INTERRUPT = 'INTERRUPT',
  DISCONNECT = 'DISCONNECT',
}

/**
 * Core FSM engine: validates transitions and updates session state.
 *
 * The engine is deliberately pure – it only mutates the supplied session
 * object and logs the transition. All side‑effects (provider calls, socket
 * emission, etc.) are performed by dedicated handlers after the state has
 * been updated.
 */
@Injectable()
export class FsmEngine {
  private readonly logger = new Logger(FsmEngine.name);

  // -----------------------------------------------------------------
  // Transition table – maps (currentState, event) → nextState
  // -----------------------------------------------------------------
  private static readonly transitionTable: Record<string, SessionState> = {
    // Normal flow
    [`${SessionState.IDLE}:${VoiceEventType.AUDIO_CHUNK}`]:
      SessionState.LISTENING,
    [`${SessionState.LISTENING}:${VoiceEventType.TRANSCRIPT_FINAL}`]:
      SessionState.TRANSCRIBING,
    // LLM tokens are produced while thinking; we stay in THINKING after first token
    [`${SessionState.TRANSCRIBING}:${VoiceEventType.LLM_TOKEN}`]:
      SessionState.THINKING,
    // The first TTS chunk moves us to SPEAKING
    [`${SessionState.THINKING}:${VoiceEventType.TTS_CHUNK}`]:
      SessionState.SPEAKING,
    // After speaking, new audio restarts the loop
    [`${SessionState.SPEAKING}:${VoiceEventType.AUDIO_CHUNK}`]:
      SessionState.LISTENING,

    // Interrupt overrides – any active state may be interrupted
    [`${SessionState.IDLE}:${VoiceEventType.INTERRUPT}`]:
      SessionState.INTERRUPTED,
    [`${SessionState.LISTENING}:${VoiceEventType.INTERRUPT}`]:
      SessionState.INTERRUPTED,
    [`${SessionState.TRANSCRIBING}:${VoiceEventType.INTERRUPT}`]:
      SessionState.INTERRUPTED,
    [`${SessionState.THINKING}:${VoiceEventType.INTERRUPT}`]:
      SessionState.INTERRUPTED,
    [`${SessionState.SPEAKING}:${VoiceEventType.INTERRUPT}`]:
      SessionState.INTERRUPTED,

    // Disconnect resets to IDLE (safety net)
    [`${SessionState.SPEAKING}:${VoiceEventType.DISCONNECT}`]:
      SessionState.IDLE,
    [`${SessionState.LISTENING}:${VoiceEventType.DISCONNECT}`]:
      SessionState.IDLE,
  };

  /**
   * Guard – does the given event make sense from the current state?
   */
  canTransition(state: SessionState, event: VoiceEventType): boolean {
    const key = `${state}:${event}`;
    return Object.prototype.hasOwnProperty.call(FsmEngine.transitionTable, key);
  }

  /**
   * Perform the transition, update the session, and log the change.
   *
   * Returns the new state (may be identical to the previous state if the
   * transition is not allowed).
   */
  transition(session: InterviewSession, event: VoiceEventType): SessionState {
    const from = session.state;
    const key = `${from}:${event}`;
    const to = (FsmEngine as any).transitionTable[key] ?? from;

    if (to !== from) {
      session.state = to;
      this.logger.log({
        sessionId: session.sessionId,
        from,
        to,
        event,
        timestamp: Date.now(),
      });
    } else {
      this.logger.warn({
        sessionId: session.sessionId,
        state: from,
        event,
        reason: 'invalid_transition',
      });
    }
    return session.state;
  }
}
