import { describe, it, expect } from "vitest";
import { MessageParser } from "../../src/protocol/MessageParser.js";
import { ProtocolError } from "../../src/errors/ProtocolError.js";

describe("MessageParser", () => {
  it("should parse TEXT message with feedbackSignal", () => {
    const raw = JSON.stringify({
      type: "TEXT",
      sessionId: "s-1",
      text: "What is your experience?",
      feedbackSignal: "probe",
    });
    const msg = MessageParser.parse(raw);
    expect(msg.type).toBe("TEXT");
    if (msg.type === "TEXT") {
      expect(msg.sessionId).toBe("s-1");
      expect(msg.text).toBe("What is your experience?");
      expect(msg.feedbackSignal).toBe("probe");
    }
  });

  it("should parse TEXT message with null feedbackSignal", () => {
    const raw = JSON.stringify({
      type: "TEXT",
      sessionId: "s-1",
      text: "Hello",
      feedbackSignal: null,
    });
    const msg = MessageParser.parse(raw);
    if (msg.type === "TEXT") {
      expect(msg.feedbackSignal).toBeNull();
    }
  });

  it("should reject invalid feedbackSignal values", () => {
    const raw = JSON.stringify({
      type: "TEXT",
      sessionId: "s-1",
      text: "Hello",
      feedbackSignal: "invalid-signal",
    });
    const msg = MessageParser.parse(raw);
    if (msg.type === "TEXT") {
      expect(msg.feedbackSignal).toBeNull();
    }
  });

  it("should parse AUDIO message", () => {
    const raw = JSON.stringify({
      type: "AUDIO",
      sessionId: "s-1",
      audioChunk: "base64data==",
    });
    const msg = MessageParser.parse(raw);
    expect(msg.type).toBe("AUDIO");
    if (msg.type === "AUDIO") {
      expect(msg.audioChunk).toBe("base64data==");
    }
  });

  it("should parse COMPLETED message", () => {
    const raw = JSON.stringify({
      type: "COMPLETED",
      sessionId: "s-1",
    });
    const msg = MessageParser.parse(raw);
    expect(msg.type).toBe("COMPLETED");
  });

  it("should parse PONG message", () => {
    const raw = JSON.stringify({ type: "PONG" });
    const msg = MessageParser.parse(raw);
    expect(msg.type).toBe("PONG");
  });

  it("should parse ERROR message", () => {
    const raw = JSON.stringify({
      type: "ERROR",
      code: 4000,
      message: "Invalid session",
      correlationId: "corr-123",
    });
    const msg = MessageParser.parse(raw);
    expect(msg.type).toBe("ERROR");
    if (msg.type === "ERROR") {
      expect(msg.code).toBe(4000);
      expect(msg.correlationId).toBe("corr-123");
    }
  });

  it("should throw ProtocolError on malformed JSON", () => {
    expect(() => MessageParser.parse("not json")).toThrow(ProtocolError);
  });

  it("should throw ProtocolError on unknown type", () => {
    expect(() => MessageParser.parse(JSON.stringify({ type: "UNKNOWN" }))).toThrow(ProtocolError);
  });

  it("should throw ProtocolError on missing required field", () => {
    const raw = JSON.stringify({ type: "TEXT", sessionId: "s-1" });
    expect(() => MessageParser.parse(raw)).toThrow(ProtocolError);
  });
});
