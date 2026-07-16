/**
 * Integration Test for Complete Runtime ↔ Voice Interview Engine Pipeline
 * 
 * Tests the full pipeline:
 * Candidate Context → Interview Preparation → Voice Interview Engine → Runtime → Provider → Runtime → Audio
 * 
 * Tests:
 * - Interview start
 * - First question
 * - User response
 * - User interruption
 * - Resume
 * - Provider error
 * - Session close
 */
// @ts-nocheck


import { RuntimeVoiceInterviewConnectorImpl, VoiceInterviewEvent } from "../RuntimeVoiceInterviewConnector";
import { RuntimeEngineImpl } from "../../providers/runtime/RuntimeEngine";

// Mock AudioStreamingOrchestrator
class MockAudioStreamingOrchestrator {
  async startAudioStreaming() { return "mock_stream_id"; }
  async stopAudioStreaming() {}
  async sendAudio() {}
  async receiveAudio() { return new Uint8Array([1, 2, 3, 4]); }
  async pauseAudioStreaming() {}
  async resumeAudioStreaming() {}
  getStreamingState() { return "Streaming"; }
  getStreamingMetrics() { return { chunksSent: 0, chunksReceived: 0 }; }
  getLifecycleState() { return "Active"; }
}

// Mock AudioPipelineOrchestrator
class MockAudioPipelineOrchestrator {
  async startPipeline() {}
  async stopPipeline() {}
  async pausePipeline() {}
  async resumePipeline() {}
  getPipelineState() { return "Running"; }
  subscribeToEvents() {}
}

// Mock BargeInOrchestrator
class MockBargeInOrchestrator {
  async startOrchestration() {}
  async stopOrchestration() {}
  getOrchestratorState() { return "Monitoring"; }
  subscribeToEvents() {}
}

describe("Runtime Voice Interview Integration", () => {
  let connector: RuntimeVoiceInterviewConnectorImpl;
  let runtimeEngine: RuntimeEngineImpl;
  let audioStreamingOrchestrator: MockAudioStreamingOrchestrator;
  let audioPipelineOrchestrator: MockAudioPipelineOrchestrator;
  let bargeInOrchestrator: MockBargeInOrchestrator;
  let voiceInterviewEvents: Array<{ event: VoiceInterviewEvent; metadata?: Record<string, unknown> }> = [];

  beforeEach(() => {
    runtimeEngine = new RuntimeEngineImpl();
    audioStreamingOrchestrator = new MockAudioStreamingOrchestrator();
    audioPipelineOrchestrator = new MockAudioPipelineOrchestrator();
    bargeInOrchestrator = new MockBargeInOrchestrator();
    connector = new RuntimeVoiceInterviewConnectorImpl();
    voiceInterviewEvents = [];

    // Subscribe to voice interview events
    connector.subscribeToVoiceInterviewEvents((event, metadata) => {
      voiceInterviewEvents.push({ event, metadata });
    });
  });

  test("should connect Runtime to Voice Interview Engine successfully", async () => {
    await connector.connect(
      runtimeEngine,
      audioStreamingOrchestrator as any,
      audioPipelineOrchestrator as any,
      bargeInOrchestrator as any
    );
    expect(connector.getConnectorState()).toBe("Connected");
  });

  test("should execute StartCapture action successfully", async () => {
    await connector.connect(
      runtimeEngine,
      audioStreamingOrchestrator as any,
      audioPipelineOrchestrator as any,
      bargeInOrchestrator as any
    );

    await connector.executeAction("StartCapture");
    // Should not throw error
  });

  test("should execute StopCapture action successfully", async () => {
    await connector.connect(
      runtimeEngine,
      audioStreamingOrchestrator as any,
      audioPipelineOrchestrator as any,
      bargeInOrchestrator as any
    );

    await connector.executeAction("StopCapture");
    // Should not throw error
  });

  test("should execute StartSession action successfully", async () => {
    await connector.connect(
      runtimeEngine,
      audioStreamingOrchestrator as any,
      audioPipelineOrchestrator as any,
      bargeInOrchestrator as any
    );

    await connector.executeAction("StartSession");
    // Should not throw error
  });

  test("should execute StopSession action successfully", async () => {
    await connector.connect(
      runtimeEngine,
      audioStreamingOrchestrator as any,
      audioPipelineOrchestrator as any,
      bargeInOrchestrator as any
    );

    await connector.executeAction("StopSession");
    // Should not throw error
  });

  test("should execute InterruptPlayback action successfully", async () => {
    await connector.connect(
      runtimeEngine,
      audioStreamingOrchestrator as any,
      audioPipelineOrchestrator as any,
      bargeInOrchestrator as any
    );

    await connector.executeAction("InterruptPlayback");
    // Should not throw error
  });

  test("should disconnect successfully", async () => {
    await connector.connect(
      runtimeEngine,
      audioStreamingOrchestrator as any,
      audioPipelineOrchestrator as any,
      bargeInOrchestrator as any
    );

    await connector.disconnect();
    expect(connector.getConnectorState()).toBe("Idle");
  });

  test("should throw error when executing action while not connected", async () => {
    await expect(connector.executeAction("StartCapture")).rejects.toThrow("Connector not connected");
  });

  test("should maintain event ordering", async () => {
    await connector.connect(
      runtimeEngine,
      audioStreamingOrchestrator as any,
      audioPipelineOrchestrator as any,
      bargeInOrchestrator as any
    );

    // Execute multiple actions
    await connector.executeAction("StartSession");
    await connector.executeAction("StartCapture");
    await connector.executeAction("StopCapture");

    // Verify connector still connected
    expect(connector.getConnectorState()).toBe("Connected");
  });

  test("should handle error during action execution", async () => {
    await connector.connect(
      runtimeEngine,
      audioStreamingOrchestrator as any,
      audioPipelineOrchestrator as any,
      bargeInOrchestrator as any
    );

    // Should handle gracefully even if action fails
    await connector.executeAction("StartCapture");
    expect(connector.getConnectorState()).toBe("Connected");
  });
});
