/**
 * Provider Runtime Streaming Error Handler
 *
 * Responsibilities:
 * - Handle interrupted streams
 * - Handle invalid buffers
 * - Handle network errors
 * - Handle connection loss
 * - Handle stream closure
 * - Propagate errors via Runtime events
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY technical error handling
 */

import { RuntimeEvent } from "./RuntimeEngine";
import { AudioStreamingEvent } from "./AudioStreaming";

// ============================================================================
// STREAMING ERROR TYPES
// ============================================================================

export type StreamingErrorType =
  | "StreamInterrupted"
  | "InvalidBuffer"
  | "NetworkError"
  | "ConnectionLost"
  | "StreamClosed"
  | "ProviderError"
  | "TimeoutError"
  | "BufferOverflow";

// ============================================================================
// STREAMING ERROR
// ============================================================================

export interface StreamingError {
  type: StreamingErrorType;
  message: string;
  streamId?: string;
  timestamp: number;
  recoverable: boolean;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// STREAMING ERROR HANDLER INTERFACE
// ============================================================================

export interface StreamingErrorHandler {
  handleError(error: StreamingError): void;
  handleStreamInterrupted(streamId: string): void;
  handleInvalidBuffer(streamId: string, reason: string): void;
  handleNetworkError(streamId: string, error: Error): void;
  handleConnectionLost(streamId: string): void;
  handleStreamClosed(streamId: string): void;
  handleProviderError(streamId: string, error: Error): void;
  handleTimeoutError(streamId: string): void;
  handleBufferOverflow(streamId: string): void;
  subscribeToErrors(callback: (error: StreamingError) => void): void;
  getErrorHistory(): StreamingError[];
  clearErrorHistory(): void;
}

// ============================================================================
// STREAMING ERROR HANDLER IMPLEMENTATION
// ============================================================================

export class StreamingErrorHandlerImpl implements StreamingErrorHandler {
  private errorHistory: StreamingError[] = [];
  private errorCallbacks: Array<(error: StreamingError) => void> = [];
  private maxHistorySize: number = 1000;

  handleError(error: StreamingError): void {
    this.errorHistory.push(error);

    // Trim history if needed
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(-this.maxHistorySize);
    }

    // Notify subscribers
    this.errorCallbacks.forEach(callback => callback(error));

    // Log error
    console.error(`Streaming Error [${error.type}]: ${error.message}`, error.metadata);
  }

  handleStreamInterrupted(streamId: string): void {
    const error: StreamingError = {
      type: "StreamInterrupted",
      message: "Stream was interrupted",
      streamId,
      timestamp: Date.now(),
      recoverable: true
    };
    this.handleError(error);
  }

  handleInvalidBuffer(streamId: string, reason: string): void {
    const error: StreamingError = {
      type: "InvalidBuffer",
      message: `Invalid buffer: ${reason}`,
      streamId,
      timestamp: Date.now(),
      recoverable: true
    };
    this.handleError(error);
  }

  handleNetworkError(streamId: string, error: Error): void {
    const streamingError: StreamingError = {
      type: "NetworkError",
      message: `Network error: ${error.message}`,
      streamId,
      timestamp: Date.now(),
      recoverable: true,
      metadata: { originalError: error.message }
    };
    this.handleError(streamingError);
  }

  handleConnectionLost(streamId: string): void {
    const error: StreamingError = {
      type: "ConnectionLost",
      message: "Connection to provider was lost",
      streamId,
      timestamp: Date.now(),
      recoverable: true
    };
    this.handleError(error);
  }

  handleStreamClosed(streamId: string): void {
    const error: StreamingError = {
      type: "StreamClosed",
      message: "Stream was closed",
      streamId,
      timestamp: Date.now(),
      recoverable: false
    };
    this.handleError(error);
  }

  handleProviderError(streamId: string, error: Error): void {
    const streamingError: StreamingError = {
      type: "ProviderError",
      message: `Provider error: ${error.message}`,
      streamId,
      timestamp: Date.now(),
      recoverable: true,
      metadata: { originalError: error.message }
    };
    this.handleError(streamingError);
  }

  handleTimeoutError(streamId: string): void {
    const error: StreamingError = {
      type: "TimeoutError",
      message: "Stream operation timed out",
      streamId,
      timestamp: Date.now(),
      recoverable: true
    };
    this.handleError(error);
  }

  handleBufferOverflow(streamId: string): void {
    const error: StreamingError = {
      type: "BufferOverflow",
      message: "Buffer overflow detected",
      streamId,
      timestamp: Date.now(),
      recoverable: true
    };
    this.handleError(error);
  }

  subscribeToErrors(callback: (error: StreamingError) => void): void {
    this.errorCallbacks.push(callback);
  }

  getErrorHistory(): StreamingError[] {
    return [...this.errorHistory];
  }

  clearErrorHistory(): void {
    this.errorHistory = [];
  }
}

// ============================================================================
// ERROR TO RUNTIME EVENT MAPPER
// ============================================================================

export function mapStreamingErrorToRuntimeEvent(error: StreamingError): RuntimeEvent {
  switch (error.type) {
    case "StreamInterrupted":
    case "NetworkError":
    case "ConnectionLost":
    case "ProviderError":
    case "TimeoutError":
      return "RuntimeError";
    default:
      return "RuntimeError";
  }
}

export function mapStreamingErrorToAudioEvent(_error: StreamingError): AudioStreamingEvent {
  return "AudioStreamError";
}
