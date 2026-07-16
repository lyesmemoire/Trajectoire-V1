/**
 * Complete transition table for the Voice Interview FSM.
 * Every valid (state, event) → nextState is defined here.
 * Any pair not present is an invalid transition.
 */

import { ClientState, ClientEvent } from "./States.js";
import type { GuardName } from "./Guards.js";

export interface TransitionDefinition {
  readonly from: ClientState;
  readonly event: ClientEvent;
  readonly to: ClientState;
  readonly guard: GuardName | null;
}

export const TRANSITION_TABLE: readonly TransitionDefinition[] = Object.freeze([
  // --- Disconnected ---
  { from: ClientState.Disconnected, event: ClientEvent.CONNECT, to: ClientState.Authenticating, guard: null },

  // --- Authenticating ---
  { from: ClientState.Authenticating, event: ClientEvent.TICKET_RECEIVED, to: ClientState.Connecting, guard: "hasValidTicket" },
  { from: ClientState.Authenticating, event: ClientEvent.AUTH_FAILED, to: ClientState.Error, guard: null },

  // --- Connecting ---
  { from: ClientState.Connecting, event: ClientEvent.WS_OPENED, to: ClientState.WaitingInterview, guard: null },
  { from: ClientState.Connecting, event: ClientEvent.WS_FAILED, to: ClientState.Reconnecting, guard: "hasRetriesLeft" },
  { from: ClientState.Connecting, event: ClientEvent.MAX_RETRIES_EXCEEDED, to: ClientState.Error, guard: null },

  // --- WaitingInterview ---
  { from: ClientState.WaitingInterview, event: ClientEvent.START_INTERVIEW, to: ClientState.Listening, guard: null },
  { from: ClientState.WaitingInterview, event: ClientEvent.DISCONNECT, to: ClientState.Disconnected, guard: null },

  // --- Listening ---
  { from: ClientState.Listening, event: ClientEvent.SPEECH_END, to: ClientState.UploadingAudio, guard: "hasTranscript" },
  { from: ClientState.Listening, event: ClientEvent.PAUSE, to: ClientState.Paused, guard: null },
  { from: ClientState.Listening, event: ClientEvent.DISCONNECT, to: ClientState.Disconnected, guard: null },
  { from: ClientState.Listening, event: ClientEvent.WS_LOST, to: ClientState.Reconnecting, guard: null },
  { from: ClientState.Listening, event: ClientEvent.SERVER_COMPLETED, to: ClientState.Completed, guard: null },

  // --- UploadingAudio ---
  { from: ClientState.UploadingAudio, event: ClientEvent.TURN_SENT, to: ClientState.WaitingAI, guard: null },
  { from: ClientState.UploadingAudio, event: ClientEvent.WS_LOST, to: ClientState.Reconnecting, guard: null },

  // --- WaitingAI ---
  { from: ClientState.WaitingAI, event: ClientEvent.AUDIO_RECEIVED, to: ClientState.PlayingTTS, guard: null },
  { from: ClientState.WaitingAI, event: ClientEvent.TEXT_ONLY_RECEIVED, to: ClientState.Listening, guard: null },
  { from: ClientState.WaitingAI, event: ClientEvent.SERVER_COMPLETED, to: ClientState.Completed, guard: null },
  { from: ClientState.WaitingAI, event: ClientEvent.WS_LOST, to: ClientState.Reconnecting, guard: null },

  // --- PlayingTTS ---
  { from: ClientState.PlayingTTS, event: ClientEvent.PLAYBACK_ENDED, to: ClientState.Listening, guard: null },
  { from: ClientState.PlayingTTS, event: ClientEvent.BARGE_IN, to: ClientState.Listening, guard: null },
  { from: ClientState.PlayingTTS, event: ClientEvent.PAUSE, to: ClientState.Paused, guard: null },
  { from: ClientState.PlayingTTS, event: ClientEvent.WS_LOST, to: ClientState.Reconnecting, guard: null },
  { from: ClientState.PlayingTTS, event: ClientEvent.SERVER_COMPLETED, to: ClientState.Completed, guard: null },

  // --- Paused ---
  { from: ClientState.Paused, event: ClientEvent.RESUME, to: ClientState.Listening, guard: null },
  { from: ClientState.Paused, event: ClientEvent.DISCONNECT, to: ClientState.Disconnected, guard: null },
  { from: ClientState.Paused, event: ClientEvent.WS_LOST, to: ClientState.Reconnecting, guard: null },

  // --- Reconnecting ---
  { from: ClientState.Reconnecting, event: ClientEvent.RECONNECT_AUTH, to: ClientState.Authenticating, guard: null },
  { from: ClientState.Reconnecting, event: ClientEvent.MAX_RETRIES_EXCEEDED, to: ClientState.Error, guard: null },

  // --- Terminal (Completed / Error) ---
  { from: ClientState.Completed, event: ClientEvent.RESET, to: ClientState.Disconnected, guard: null },
  { from: ClientState.Error, event: ClientEvent.RESET, to: ClientState.Disconnected, guard: null },
]);

/**
 * Pre-built lookup map for O(1) transition resolution.
 * Key format: "State:Event"
 */
export type TransitionKey = `${ClientState}:${ClientEvent}`;

const transitionMap: Map<TransitionKey, TransitionDefinition> = new Map();
for (const t of TRANSITION_TABLE) {
  const key: TransitionKey = `${t.from}:${t.event}`;
  transitionMap.set(key, t);
}

export function lookupTransition(
  from: ClientState,
  event: ClientEvent
): TransitionDefinition | undefined {
  const key: TransitionKey = `${from}:${event}`;
  return transitionMap.get(key);
}
