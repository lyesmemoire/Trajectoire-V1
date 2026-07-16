/**
 * All possible states of the Voice Interview client FSM.
 */

export const ClientState = {
  Disconnected: "Disconnected",
  Authenticating: "Authenticating",
  Connecting: "Connecting",
  WaitingInterview: "WaitingInterview",
  Listening: "Listening",
  UploadingAudio: "UploadingAudio",
  WaitingAI: "WaitingAI",
  PlayingTTS: "PlayingTTS",
  Paused: "Paused",
  Reconnecting: "Reconnecting",
  Completed: "Completed",
  Error: "Error",
} as const;

export type ClientState = (typeof ClientState)[keyof typeof ClientState];

export const TERMINAL_STATES: ReadonlySet<ClientState> = new Set([
  ClientState.Completed,
  ClientState.Error,
]);

export const ACTIVE_STATES: ReadonlySet<ClientState> = new Set([
  ClientState.Listening,
  ClientState.UploadingAudio,
  ClientState.WaitingAI,
  ClientState.PlayingTTS,
]);

/**
 * All possible events (triggers) for the FSM.
 */
export const ClientEvent = {
  CONNECT: "CONNECT",
  TICKET_RECEIVED: "TICKET_RECEIVED",
  AUTH_FAILED: "AUTH_FAILED",
  WS_OPENED: "WS_OPENED",
  WS_FAILED: "WS_FAILED",
  WS_LOST: "WS_LOST",
  MAX_RETRIES_EXCEEDED: "MAX_RETRIES_EXCEEDED",
  START_INTERVIEW: "START_INTERVIEW",
  DISCONNECT: "DISCONNECT",
  SPEECH_END: "SPEECH_END",
  TURN_SENT: "TURN_SENT",
  AUDIO_RECEIVED: "AUDIO_RECEIVED",
  TEXT_ONLY_RECEIVED: "TEXT_ONLY_RECEIVED",
  SERVER_COMPLETED: "SERVER_COMPLETED",
  PLAYBACK_ENDED: "PLAYBACK_ENDED",
  BARGE_IN: "BARGE_IN",
  PAUSE: "PAUSE",
  RESUME: "RESUME",
  RECONNECT_AUTH: "RECONNECT_AUTH",
  RESET: "RESET",
} as const;

export type ClientEvent = (typeof ClientEvent)[keyof typeof ClientEvent];
