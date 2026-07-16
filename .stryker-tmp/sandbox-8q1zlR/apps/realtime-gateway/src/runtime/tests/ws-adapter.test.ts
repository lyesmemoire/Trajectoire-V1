// @ts-nocheck
import { describe, it, expect } from "vitest";
import { WebSocketAdapter } from "../ws-adapter.js";
import { TransportCommand } from "@trajectoire/voice-core/p6";

describe("P6.6 - W1 WebSocket Adapter", () => {
  it("should correctly translate WS message to CandidateMessage", () => {
    const adapter = new WebSocketAdapter();
    const wsMsg = { event: "message", payload: { text: "Hello", confidence: 0.99 } };
    
    const candidate = adapter.toCandidateMessage(wsMsg);
    expect(candidate.text).toBe("Hello");
    expect(candidate.metadata?.confidence).toBe(0.99);
  });

  it("should correctly translate TransportCommands to WS frames", () => {
    const adapter = new WebSocketAdapter();
    const commands: TransportCommand[] = [
      { type: "WAIT", ms: 500 },
      { type: "INTERRUPT" },
      { type: "SPEAK", text: "Hi there", speechRate: 1.2 },
      { type: "START_LISTENING" }
    ];
    
    const frames = adapter.toWebSocketFrames(commands);
    expect(frames).toEqual([
      { type: "control", data: { action: "wait", duration: 500 } },
      { type: "control", data: { action: "interrupt" } },
      { type: "tts", data: { text: "Hi there", speed: 1.2 } },
      { type: "control", data: { action: "listen" } }
    ]);
  });
});
