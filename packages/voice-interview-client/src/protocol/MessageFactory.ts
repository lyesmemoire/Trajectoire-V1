/**
 * Factory for creating inbound messages (Client → Server).
 * Ensures every message includes the correct protocolVersion.
 */

import type {
  InboundStartMessage,
  InboundTurnMessage,
  InboundLifecycleMessage,
  InboundPingMessage,
  TurnIntent,
} from "../types/protocol.js";
import { PROTOCOL_VERSION } from "./ProtocolConstants.js";

export class MessageFactory {
  static createStartMessage(candidateId: string, targetRole: string): InboundStartMessage {
    return Object.freeze({
      protocolVersion: PROTOCOL_VERSION,
      type: "START" as const,
      candidateId,
      targetRole,
    });
  }

  static createTurnMessage(
    sessionId: string,
    turnId: string,
    transcript: string,
    intent: TurnIntent,
    timingMs: number
  ): InboundTurnMessage {
    return Object.freeze({
      protocolVersion: PROTOCOL_VERSION,
      type: "TURN" as const,
      sessionId,
      turnId,
      transcript,
      intent,
      timingMs,
    });
  }

  static createLifecycleMessage(
    type: "PAUSE" | "RESUME" | "STOP",
    sessionId: string
  ): InboundLifecycleMessage {
    return Object.freeze({
      protocolVersion: PROTOCOL_VERSION,
      type,
      sessionId,
    });
  }

  static createPingMessage(): InboundPingMessage {
    return Object.freeze({
      protocolVersion: PROTOCOL_VERSION,
      type: "PING" as const,
    });
  }
}
