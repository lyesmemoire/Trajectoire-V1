import { VoiceClientError } from "./VoiceClientError.js";

export class ProtocolError extends VoiceClientError {
  constructor(message: string, code: string) {
    super(message, code, false);
    this.name = "ProtocolError";
  }

  static versionMismatch(expected: number, received: number): ProtocolError {
    return new ProtocolError(
      `Protocol version mismatch: expected ${expected}, received ${received}`,
      "PROTOCOL_VERSION_MISMATCH"
    );
  }

  static malformedMessage(raw: string): ProtocolError {
    return new ProtocolError(
      `Malformed message received: ${raw.substring(0, 100)}`,
      "MALFORMED_MESSAGE"
    );
  }

  static unknownMessageType(type: string): ProtocolError {
    return new ProtocolError(
      `Unknown outbound message type: ${type}`,
      "UNKNOWN_MESSAGE_TYPE"
    );
  }

  static missingField(messageType: string, field: string): ProtocolError {
    return new ProtocolError(
      `Missing required field '${field}' in ${messageType} message`,
      "MISSING_FIELD"
    );
  }
}
