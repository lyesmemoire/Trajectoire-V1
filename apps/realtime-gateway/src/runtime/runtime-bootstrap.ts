// @ts-nocheck
import { createRuntime } from "./runtime-container.js";
import { SessionRegistry } from "./session-registry.js";
import { WebSocketAdapter, WebSocketMessage, WebSocketFrame } from "./ws-adapter.js";
import { TTSAdapter } from "./tts-adapter.js";
import { STTAdapter } from "./stt-adapter.js";
import { RuntimeTraceCollector } from "./collector/runtime-trace-collector.js";
import { RuntimeTrace } from "@trajectoire/realtime-core/trace-contract";

export class RuntimeBootstrap {
  public readonly container = createRuntime();
  public readonly registry = new SessionRegistry();
  public readonly wsAdapter = new WebSocketAdapter();
  public readonly ttsAdapter = new TTSAdapter();
  public readonly sttAdapter = new STTAdapter();
  public readonly collector = new RuntimeTraceCollector();

  constructor() {
    this.container.facade.onCommit(({ sessionId, snapshotHash, journalPointer }) => {
      this.collector.attachP5Context(sessionId, { snapshotHash, journalPointer });
    });
  }

  public registerSession(sessionId: string) {
    if (!this.registry.has(sessionId)) {
      this.registry.add(sessionId);
      this.collector.startSession(sessionId);
    }
  }

  public async processWebSocketMessage(sessionId: string, message: WebSocketMessage): Promise<WebSocketFrame[]> {
    if (!this.registry.has(sessionId)) {
      throw new Error("Session not found in registry");
    }

    const candidateMessage = this.wsAdapter.toCandidateMessage(message);
    const timestamp = Date.now();

    this.collector.appendEvent({
      type: "USER_MESSAGE",
      sessionId,
      message: candidateMessage.text,
      timestamp,
    });

    const result = this.container.orchestrator.step({ sessionId, timestamp }, candidateMessage);

    if (!result.ok) {
      throw new Error(`Orchestration failed: ${result.reason}`);
    }

    this.collector.appendEvent({
      type: "P6_EVENT",
      sessionId,
      event: "DECISION",
      payload: result.value.decision,
      timestamp: Date.now()
    });

    this.collector.appendEvent({
      type: "P6_EVENT",
      sessionId,
      event: "VOICE_PLAN",
      payload: result.value.voicePlan,
      timestamp: Date.now()
    });

    // Assume all transport commands are voice output for now, or just log utterance
    this.collector.appendEvent({
      type: "VOICE_OUTPUT",
      sessionId,
      utterance: result.value.voicePlan.utterance,
      timestamp: Date.now()
    });

    return this.wsAdapter.toWebSocketFrames(result.value.commands);
  }

  public async processAudioInput(sessionId: string, audio: Uint8Array): Promise<WebSocketFrame[]> {
    if (!this.registry.has(sessionId)) {
      throw new Error("Session not found in registry");
    }

    try {
      const candidateMessage = await this.sttAdapter.recognize(audio);
      const timestamp = Date.now();

      this.collector.appendEvent({
        type: "USER_MESSAGE",
        sessionId,
        message: candidateMessage.text,
        timestamp,
      });

      const result = this.container.orchestrator.step({ sessionId, timestamp }, candidateMessage);

      if (!result.ok) {
        throw new Error(`Orchestration failed: ${result.reason}`);
      }

      this.collector.appendEvent({
        type: "P6_EVENT",
        sessionId,
        event: "DECISION",
        payload: result.value.decision,
        timestamp: Date.now()
      });

      this.collector.appendEvent({
        type: "P6_EVENT",
        sessionId,
        event: "VOICE_PLAN",
        payload: result.value.voicePlan,
        timestamp: Date.now()
      });

      this.collector.appendEvent({
        type: "VOICE_OUTPUT",
        sessionId,
        utterance: result.value.voicePlan.utterance,
        timestamp: Date.now()
      });

      return this.wsAdapter.toWebSocketFrames(result.value.commands);
    } catch {
      throw new Error("STT Processing failed");
    }
  }

  public getTrace(sessionId: string): RuntimeTrace | undefined {
    return this.collector.getTrace(sessionId);
  }
}
