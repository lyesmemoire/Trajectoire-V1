/**
 * OpenAI GPT-4o Realtime Event Mapper Implementation
 *
 * Responsibilities:
 * - Map OpenAI Realtime events to abstract runtime events
 * - Map abstract runtime events to OpenAI Realtime events
 * - NO business logic, NO reasoning, NO analysis
 * - ONLY event mapping
 */

import { OpenAIRealtimeEventMapper } from "./OpenAIRealtimeConversationProvider";
import { AudioStreamingEvent } from "../runtime/AudioStreaming";
import { StreamingLifecycleEvent } from "../runtime/StreamingLifecycle";
import { RuntimeEvent } from "../runtime/RuntimeEngine";

// ============================================================================
// OPENAI REALTIME EVENT TYPES
// ============================================================================

export type OpenAIRealtimeEventType =
  | "session.created"
  | "session.updated"
  | "input_audio_buffer.speech_started"
  | "input_audio_buffer.speech_stopped"
  | "input_audio_buffer.committed"
  | "input_audio_buffer.cleared"
  | "input_audio_buffer.appended"
  | "conversation.item.created"
  | "conversation.item.deleted"
  | "conversation.item.truncated"
  | "response.audio_transcript.delta"
  | "response.audio.delta"
  | "response.done"
  | "response.text.delta"
  | "response.text.done"
  | "error";

// ============================================================================
// EVENT MAPPER IMPLEMENTATION
// ============================================================================

export class OpenAIRealtimeEventMapperImpl implements OpenAIRealtimeEventMapper {
  mapToRuntime(event: Record<string, unknown>): Record<string, unknown> {
    const eventType = event.type as OpenAIRealtimeEventType;
    
    const mappedEvent: Record<string, unknown> = {
      originalType: eventType,
      timestamp: Date.now()
    };

    // Map OpenAI events to runtime events
    switch (eventType) {
      case "session.created":
      case "session.updated":
        mappedEvent.runtimeEvent = "RuntimeInitialized";
        mappedEvent.audioStreamingEvent = "AudioStreamStarted";
        mappedEvent.lifecycleEvent = "LifecycleInitialized";
        break;
      
      case "input_audio_buffer.speech_started":
        mappedEvent.runtimeEvent = "RuntimeStarted";
        mappedEvent.audioStreamingEvent = "AudioStreamResumed";
        mappedEvent.lifecycleEvent = "LifecycleResumed";
        break;
      
      case "input_audio_buffer.speech_stopped":
        mappedEvent.runtimeEvent = "RuntimeShuttingDown";
        mappedEvent.audioStreamingEvent = "AudioStreamPaused";
        mappedEvent.lifecycleEvent = "LifecyclePaused";
        break;
      
      case "input_audio_buffer.committed":
      case "input_audio_buffer.appended":
        mappedEvent.runtimeEvent = "RuntimeStarted";
        mappedEvent.audioStreamingEvent = "AudioChunkSent";
        break;
      
      case "response.audio.delta":
      case "response.audio_transcript.delta":
        mappedEvent.runtimeEvent = "RuntimeStarted";
        mappedEvent.audioStreamingEvent = "AudioChunkReceived";
        break;
      
      case "response.done":
      case "response.text.done":
        mappedEvent.runtimeEvent = "RuntimeStarted";
        mappedEvent.audioStreamingEvent = "AudioStreamStarted";
        break;
      
      case "error":
        mappedEvent.runtimeEvent = "RuntimeError";
        mappedEvent.audioStreamingEvent = "AudioStreamError";
        mappedEvent.lifecycleEvent = "LifecycleError";
        mappedEvent.error = event.error;
        break;
      
      default:
        mappedEvent.runtimeEvent = "RuntimeStarted";
        break;
    }

    // Copy relevant data from original event
    if (event.event_id) {
      mappedEvent.eventId = event.event_id;
    }
    if (event.session_id) {
      mappedEvent.sessionId = event.session_id;
    }

    return mappedEvent;
  }

  mapFromRuntime(event: Record<string, unknown>): Record<string, unknown> {
    const runtimeEvent = event.runtimeEvent as RuntimeEvent;
    
    const mappedEvent: Record<string, unknown> = {
      timestamp: Date.now()
    };

    // Map runtime events to OpenAI events
    switch (runtimeEvent) {
      case "RuntimeInitializing":
        mappedEvent.type = "session.created";
        break;
      
      case "RuntimeStarted":
        mappedEvent.type = "input_audio_buffer.appended";
        break;
      
      case "RuntimeShuttingDown":
        mappedEvent.type = "input_audio_buffer.speech_stopped";
        break;
      
      case "RuntimeShutdown":
        mappedEvent.type = "session.updated";
        break;
      
      case "RuntimeError":
        mappedEvent.type = "error";
        mappedEvent.error = event.error;
        break;
      
      default:
        mappedEvent.type = "input_audio_buffer.appended";
        break;
    }

    // Copy relevant data from original event
    if (event.sessionId) {
      mappedEvent.session_id = event.sessionId;
    }
    if (event.eventId) {
      mappedEvent.event_id = event.eventId;
    }

    return mappedEvent;
  }
}

// ============================================================================
// EVENT TYPE MAPPERS
// ============================================================================

export function mapOpenAIEventToRuntimeEvent(openAIEvent: OpenAIRealtimeEventType): RuntimeEvent {
  switch (openAIEvent) {
    case "session.created":
    case "session.updated":
      return "RuntimeInitialized";
    case "input_audio_buffer.speech_started":
      return "RuntimeStarted";
    case "input_audio_buffer.speech_stopped":
      return "RuntimeShuttingDown";
    case "error":
      return "RuntimeError";
    default:
      return "RuntimeStarted";
  }
}

export function mapOpenAIEventToAudioStreamingEvent(openAIEvent: OpenAIRealtimeEventType): AudioStreamingEvent {
  switch (openAIEvent) {
    case "session.created":
    case "session.updated":
      return "AudioStreamStarted";
    case "input_audio_buffer.speech_started":
      return "AudioStreamResumed";
    case "input_audio_buffer.speech_stopped":
      return "AudioStreamPaused";
    case "input_audio_buffer.committed":
    case "input_audio_buffer.appended":
      return "AudioChunkSent";
    case "response.audio.delta":
    case "response.audio_transcript.delta":
      return "AudioChunkReceived";
    case "error":
      return "AudioStreamError";
    default:
      return "AudioChunkSent";
  }
}

export function mapOpenAIEventToLifecycleEvent(openAIEvent: OpenAIRealtimeEventType): StreamingLifecycleEvent {
  switch (openAIEvent) {
    case "session.created":
      return "LifecycleInitialized";
    case "session.updated":
      return "LifecycleStarted";
    case "input_audio_buffer.speech_started":
      return "LifecycleResumed";
    case "input_audio_buffer.speech_stopped":
      return "LifecyclePaused";
    case "error":
      return "LifecycleError";
    default:
      return "LifecycleStarted";
  }
}
