/**
 * Parses and validates outbound messages from the server.
 * Returns a discriminated union or throws ProtocolError.
 */

import type { OutboundMessage, OutboundMessageType, FeedbackSignal } from "../types/protocol.js";
import { ProtocolError } from "../errors/ProtocolError.js";

const VALID_FEEDBACK_SIGNALS: ReadonlySet<string> = new Set(["probe", "deepen", "move-on", "clarify"]);

const VALID_OUTBOUND_TYPES: ReadonlySet<OutboundMessageType> = new Set([
  "AUDIO", "TEXT", "STATE", "ERROR", "COMPLETED", "PONG",
]);

export class MessageParser {
  static parse(raw: string): OutboundMessage {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      throw ProtocolError.malformedMessage(raw);
    }

    const type = parsed["type"];
    if (typeof type !== "string" || !VALID_OUTBOUND_TYPES.has(type as OutboundMessageType)) {
      throw ProtocolError.unknownMessageType(String(type));
    }

    switch (type) {
      case "TEXT": {
        MessageParser.requireString(parsed, "sessionId", "TEXT");
        MessageParser.requireString(parsed, "text", "TEXT");
        const rawSignal = parsed["feedbackSignal"];
        const feedbackSignal: FeedbackSignal | null =
          typeof rawSignal === "string" && VALID_FEEDBACK_SIGNALS.has(rawSignal)
            ? (rawSignal as FeedbackSignal)
            : null;
        return Object.freeze({
          type: "TEXT" as const,
          sessionId: parsed["sessionId"] as string,
          text: parsed["text"] as string,
          feedbackSignal,
        });
      }

      case "AUDIO":
        MessageParser.requireString(parsed, "sessionId", "AUDIO");
        MessageParser.requireString(parsed, "audioChunk", "AUDIO");
        return Object.freeze({
          type: "AUDIO" as const,
          sessionId: parsed["sessionId"] as string,
          audioChunk: parsed["audioChunk"] as string,
        });

      case "STATE":
        MessageParser.requireString(parsed, "sessionId", "STATE");
        MessageParser.requireString(parsed, "status", "STATE");
        MessageParser.requireString(parsed, "phase", "STATE");
        return Object.freeze({
          type: "STATE" as const,
          sessionId: parsed["sessionId"] as string,
          status: parsed["status"] as string,
          phase: parsed["phase"] as string,
        });

      case "ERROR":
        if (typeof parsed["code"] !== "number") {
          throw ProtocolError.missingField("ERROR", "code");
        }
        MessageParser.requireString(parsed, "message", "ERROR");
        MessageParser.requireString(parsed, "correlationId", "ERROR");
        return Object.freeze({
          type: "ERROR" as const,
          code: parsed["code"] as number,
          message: parsed["message"] as string,
          correlationId: parsed["correlationId"] as string,
        });

      case "COMPLETED":
        MessageParser.requireString(parsed, "sessionId", "COMPLETED");
        return Object.freeze({
          type: "COMPLETED" as const,
          sessionId: parsed["sessionId"] as string,
        });

      case "PONG":
        return Object.freeze({ type: "PONG" as const });

      default:
        throw ProtocolError.unknownMessageType(type);
    }
  }

  private static requireString(
    obj: Record<string, unknown>,
    field: string,
    messageType: string
  ): void {
    if (typeof obj[field] !== "string") {
      throw ProtocolError.missingField(messageType, field);
    }
  }
}
