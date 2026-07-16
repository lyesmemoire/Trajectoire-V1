/**
 * OpenAI GPT-4o Realtime Error Handler
 *
 * Responsibilities:
 * - Handle connection errors
 * - Handle timeout errors
 * - Handle WebSocket closed errors
 * - Handle provider errors
 * - Handle authentication errors
 * - Propagate errors without blocking Runtime
 * - NO business logic, NO reasoning, NO analysis
 * - ONLY error handling
 */
// @ts-nocheck


import { AuthenticationError } from "./OpenAIRealtimeAuthManager";
import { StreamingError, StreamingErrorType } from "../runtime/StreamingErrorHandler";

// ============================================================================
// OPENAI REALTIME ERROR TYPES
// ============================================================================

export type OpenAIRealtimeErrorType =
  | "ConnectionFailed"
  | "ConnectionTimeout"
  | "WebSocketClosed"
  | "AuthenticationFailed"
  | "SessionCreationFailed"
  | "SessionClosed"
  | "AudioStreamingFailed"
  | "InvalidConfiguration"
  | "NetworkError"
  | "UnknownError";

// ============================================================================
// OPENAI REALTIME ERROR
// ============================================================================

export interface OpenAIRealtimeError {
  type: OpenAIRealtimeErrorType;
  message: string;
  sessionId?: string;
  timestamp: number;
  recoverable: boolean;
  originalError?: Error;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// ERROR HANDLER INTERFACE
// ============================================================================

export interface OpenAIRealtimeErrorHandler {
  handleConnectionError(error: Error, sessionId?: string): OpenAIRealtimeError;
  handleTimeoutError(sessionId?: string): OpenAIRealtimeError;
  handleWebSocketClosedError(sessionId?: string): OpenAIRealtimeError;
  handleAuthenticationError(error: AuthenticationError, sessionId?: string): OpenAIRealtimeError;
  handleSessionCreationError(error: Error, sessionId?: string): OpenAIRealtimeError;
  handleSessionClosedError(sessionId?: string): OpenAIRealtimeError;
  handleAudioStreamingError(error: Error, sessionId?: string): OpenAIRealtimeError;
  handleInvalidConfigurationError(error: Error, sessionId?: string): OpenAIRealtimeError;
  handleNetworkError(error: Error, sessionId?: string): OpenAIRealtimeError;
  handleUnknownError(error: Error, sessionId?: string): OpenAIRealtimeError;
  mapToStreamingError(error: OpenAIRealtimeError): StreamingError;
  subscribeToErrors(callback: (error: OpenAIRealtimeError) => void): void;
  getErrorHistory(): OpenAIRealtimeError[];
  clearErrorHistory(): void;
}

// ============================================================================
// ERROR HANDLER IMPLEMENTATION
// ============================================================================

export class OpenAIRealtimeErrorHandlerImpl implements OpenAIRealtimeErrorHandler {
  private errorHistory: OpenAIRealtimeError[] = [];
  private errorCallbacks: Array<(error: OpenAIRealtimeError) => void> = [];
  private maxHistorySize: number = 1000;

  handleConnectionError(error: Error, sessionId?: string): OpenAIRealtimeError {
    const openAIError: OpenAIRealtimeError = {
      type: "ConnectionFailed",
      message: `Connection failed: ${error.message}`,
      sessionId,
      timestamp: Date.now(),
      recoverable: true,
      originalError: error
    };

    this.recordError(openAIError);
    return openAIError;
  }

  handleTimeoutError(sessionId?: string): OpenAIRealtimeError {
    const openAIError: OpenAIRealtimeError = {
      type: "ConnectionTimeout",
      message: "Connection timeout",
      sessionId,
      timestamp: Date.now(),
      recoverable: true
    };

    this.recordError(openAIError);
    return openAIError;
  }

  handleWebSocketClosedError(sessionId?: string): OpenAIRealtimeError {
    const openAIError: OpenAIRealtimeError = {
      type: "WebSocketClosed",
      message: "WebSocket connection closed",
      sessionId,
      timestamp: Date.now(),
      recoverable: true
    };

    this.recordError(openAIError);
    return openAIError;
  }

  handleAuthenticationError(error: AuthenticationError, sessionId?: string): OpenAIRealtimeError {
    const openAIError: OpenAIRealtimeError = {
      type: "AuthenticationFailed",
      message: `Authentication failed: ${error.message}`,
      sessionId,
      timestamp: Date.now(),
      recoverable: false,
      originalError: error,
      metadata: { code: error.code }
    };

    this.recordError(openAIError);
    return openAIError;
  }

  handleSessionCreationError(error: Error, sessionId?: string): OpenAIRealtimeError {
    const openAIError: OpenAIRealtimeError = {
      type: "SessionCreationFailed",
      message: `Session creation failed: ${error.message}`,
      sessionId,
      timestamp: Date.now(),
      recoverable: true,
      originalError: error
    };

    this.recordError(openAIError);
    return openAIError;
  }

  handleSessionClosedError(sessionId?: string): OpenAIRealtimeError {
    const openAIError: OpenAIRealtimeError = {
      type: "SessionClosed",
      message: "Session closed",
      sessionId,
      timestamp: Date.now(),
      recoverable: false
    };

    this.recordError(openAIError);
    return openAIError;
  }

  handleAudioStreamingError(error: Error, sessionId?: string): OpenAIRealtimeError {
    const openAIError: OpenAIRealtimeError = {
      type: "AudioStreamingFailed",
      message: `Audio streaming failed: ${error.message}`,
      sessionId,
      timestamp: Date.now(),
      recoverable: true,
      originalError: error
    };

    this.recordError(openAIError);
    return openAIError;
  }

  handleInvalidConfigurationError(error: Error, sessionId?: string): OpenAIRealtimeError {
    const openAIError: OpenAIRealtimeError = {
      type: "InvalidConfiguration",
      message: `Invalid configuration: ${error.message}`,
      sessionId,
      timestamp: Date.now(),
      recoverable: false,
      originalError: error
    };

    this.recordError(openAIError);
    return openAIError;
  }

  handleNetworkError(error: Error, sessionId?: string): OpenAIRealtimeError {
    const openAIError: OpenAIRealtimeError = {
      type: "NetworkError",
      message: `Network error: ${error.message}`,
      sessionId,
      timestamp: Date.now(),
      recoverable: true,
      originalError: error
    };

    this.recordError(openAIError);
    return openAIError;
  }

  handleUnknownError(error: Error, sessionId?: string): OpenAIRealtimeError {
    const openAIError: OpenAIRealtimeError = {
      type: "UnknownError",
      message: `Unknown error: ${error.message}`,
      sessionId,
      timestamp: Date.now(),
      recoverable: false,
      originalError: error
    };

    this.recordError(openAIError);
    return openAIError;
  }

  mapToStreamingError(error: OpenAIRealtimeError): StreamingError {
    const errorTypeMap: Record<OpenAIRealtimeErrorType, StreamingErrorType> = {
      ConnectionFailed: "NetworkError",
      ConnectionTimeout: "TimeoutError",
      WebSocketClosed: "ConnectionLost",
      AuthenticationFailed: "ProviderError",
      SessionCreationFailed: "ProviderError",
      SessionClosed: "StreamClosed",
      AudioStreamingFailed: "StreamInterrupted",
      InvalidConfiguration: "InvalidBuffer",
      NetworkError: "NetworkError",
      UnknownError: "ProviderError"
    };

    const streamingError: StreamingError = {
      type: errorTypeMap[error.type],
      message: error.message,
      streamId: error.sessionId,
      timestamp: error.timestamp,
      recoverable: error.recoverable,
      metadata: error.metadata
    };

    return streamingError;
  }

  subscribeToErrors(callback: (error: OpenAIRealtimeError) => void): void {
    this.errorCallbacks.push(callback);
  }

  getErrorHistory(): OpenAIRealtimeError[] {
    return [...this.errorHistory];
  }

  clearErrorHistory(): void {
    this.errorHistory = [];
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private recordError(error: OpenAIRealtimeError): void {
    this.errorHistory.push(error);

    // Trim history if needed
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(-this.maxHistorySize);
    }

    // Notify subscribers
    this.errorCallbacks.forEach(callback => callback(error));

    // Log error
    console.error(`OpenAI Realtime Error [${error.type}]: ${error.message}`, error.metadata);
  }
}
