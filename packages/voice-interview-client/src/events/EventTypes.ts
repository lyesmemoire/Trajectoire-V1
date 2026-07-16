/**
 * Re-export event types from the types module.
 * This file exists for organizational clarity within the events/ module.
 */
export type {
  VoiceClientEventMap,
  VoiceClientEventName,
  StateChangeEvent,
  QuestionEvent,
  AudioEvent,
  TranscriptEvent,
  CompletedEvent,
  ErrorEvent,
  ConnectionEvent,
  AudioLevelEvent,
} from "../types/events.js";
