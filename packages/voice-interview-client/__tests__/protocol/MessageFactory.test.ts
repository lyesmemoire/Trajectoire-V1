import { describe, it, expect } from "vitest";
import { MessageFactory } from "../../src/protocol/MessageFactory.js";
import { PROTOCOL_VERSION } from "../../src/protocol/ProtocolConstants.js";

describe("MessageFactory", () => {
  it("should create START message with protocolVersion", () => {
    const msg = MessageFactory.createStartMessage("cand-1", "Backend Engineer");
    expect(msg.protocolVersion).toBe(PROTOCOL_VERSION);
    expect(msg.type).toBe("START");
    expect(msg.candidateId).toBe("cand-1");
    expect(msg.targetRole).toBe("Backend Engineer");
  });

  it("should create TURN message with all fields", () => {
    const msg = MessageFactory.createTurnMessage("sess-1", "turn-1", "My answer", "answer", 1500);
    expect(msg.protocolVersion).toBe(PROTOCOL_VERSION);
    expect(msg.type).toBe("TURN");
    expect(msg.sessionId).toBe("sess-1");
    expect(msg.turnId).toBe("turn-1");
    expect(msg.transcript).toBe("My answer");
    expect(msg.intent).toBe("answer");
    expect(msg.timingMs).toBe(1500);
  });

  it("should create lifecycle messages", () => {
    const pause = MessageFactory.createLifecycleMessage("PAUSE", "sess-1");
    expect(pause.type).toBe("PAUSE");
    expect(pause.sessionId).toBe("sess-1");
    expect(pause.protocolVersion).toBe(PROTOCOL_VERSION);

    const resume = MessageFactory.createLifecycleMessage("RESUME", "sess-1");
    expect(resume.type).toBe("RESUME");

    const stop = MessageFactory.createLifecycleMessage("STOP", "sess-1");
    expect(stop.type).toBe("STOP");
  });

  it("should create PING message", () => {
    const ping = MessageFactory.createPingMessage();
    expect(ping.type).toBe("PING");
    expect(ping.protocolVersion).toBe(PROTOCOL_VERSION);
  });

  it("should produce frozen (immutable) messages", () => {
    const msg = MessageFactory.createStartMessage("cand-1", "Role");
    expect(Object.isFrozen(msg)).toBe(true);
  });
});
