import { VoiceClientError } from "./VoiceClientError.js";

export class ConnectionError extends VoiceClientError {
  public readonly attempt: number;

  constructor(message: string, code: string, attempt: number = 0, recoverable: boolean = true) {
    super(message, code, recoverable);
    this.name = "ConnectionError";
    this.attempt = attempt;
  }

  static ticketFailed(reason: string): ConnectionError {
    return new ConnectionError(`Ticket authentication failed: ${reason}`, "TICKET_AUTH_FAILED", 0, false);
  }

  static websocketFailed(attempt: number, reason: string): ConnectionError {
    return new ConnectionError(`WebSocket connection failed (attempt ${attempt}): ${reason}`, "WS_CONNECT_FAILED", attempt, true);
  }

  static maxRetriesExceeded(maxAttempts: number): ConnectionError {
    return new ConnectionError(`Max reconnection attempts exceeded (${maxAttempts})`, "MAX_RETRIES_EXCEEDED", maxAttempts, false);
  }

  static timeout(timeoutMs: number): ConnectionError {
    return new ConnectionError(`Connection timed out after ${timeoutMs}ms`, "CONNECTION_TIMEOUT", 0, true);
  }

  static heartbeatTimeout(): ConnectionError {
    return new ConnectionError("Heartbeat timeout — server unresponsive", "HEARTBEAT_TIMEOUT", 0, true);
  }
}
