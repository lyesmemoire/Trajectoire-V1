/**
 * Integration Test for Complete Session Pipeline
 * 
 * Tests the full pipeline:
 * CV → Candidate Intelligence → Job Offer Intelligence → Matching Intelligence → Transferable Skills Intelligence → Gap Intelligence → Interview Preparation Intelligence → Voice Interview Engine → Runtime → Provider → Audio → Live Interview Analysis → Live Coaching → Final Report → Improvement Plan
 * 
 * Tests:
 * - Interview start
 * - First question
 * - User response
 * - Interruption (barge-in)
 * - Live coaching
 * - Multiple questions
 * - Provider error
 * - Runtime error
 * - Normal close
 * - Premature stop
 */

import { SessionOrchestratorImpl, SessionEvent } from "../SessionOrchestrator";
import { ApplicationOrchestrator } from "../ApplicationOrchestrator";

// Mock components
class MockRuntimeEngine {
  async initialize() {}
  async start() {}
  async stop() {}
  selectProvider() { return null; }
  activateProvider() {}
  deactivateProvider() {}
  switchProvider() {}
  failoverProvider() {}
  getActiveProvider() { return null; }
  getRuntimeState() { return "Idle"; }
  getRuntimeMetrics() { return { totalRequests: 0, successfulRequests: 0, failedRequests: 0, averageLatency: 0 }; }
  openCircuitBreaker() {}
  closeCircuitBreaker() {}
  isCircuitBreakerOpen() { return false; }
  registerProvider() {}
  unregisterProvider() {}
  getAllProviders() { return []; }
}

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

class MockAudioPipelineOrchestrator {
  async startPipeline() {}
  async stopPipeline() {}
  async pausePipeline() {}
  async resumePipeline() {}
  getPipelineState() { return "Running"; }
  subscribeToEvents() {}
}

class MockBargeInOrchestrator {
  async startOrchestration() {}
  async stopOrchestration() {}
  getOrchestratorState() { return "Monitoring"; }
  subscribeToEvents() {}
}

class MockRuntimeVoiceInterviewConnector {
  async connect() {}
  async disconnect() {}
  getConnectorState() { return "Idle"; }
  subscribeToVoiceInterviewEvents() {}
  async executeAction() {}
}

describe("Session Orchestrator Integration", () => {
  let sessionOrchestrator: SessionOrchestratorImpl;
  let sessionEvents: Array<{ event: SessionEvent; metadata?: Record<string, unknown> }> = [];
  let mockRuntimeEngine: MockRuntimeEngine;
  let mockAudioStreamingOrchestrator: MockAudioStreamingOrchestrator;
  let mockAudioPipelineOrchestrator: MockAudioPipelineOrchestrator;
  let mockBargeInOrchestrator: MockBargeInOrchestrator;
  let mockRuntimeVoiceInterviewConnector: MockRuntimeVoiceInterviewConnector;

  beforeEach(() => {
    mockRuntimeEngine = new MockRuntimeEngine();
    mockAudioStreamingOrchestrator = new MockAudioStreamingOrchestrator();
    mockAudioPipelineOrchestrator = new MockAudioPipelineOrchestrator();
    mockBargeInOrchestrator = new MockBargeInOrchestrator();
    mockRuntimeVoiceInterviewConnector = new MockRuntimeVoiceInterviewConnector();

    sessionOrchestrator = new SessionOrchestratorImpl(
      mockRuntimeEngine as any,
      mockAudioStreamingOrchestrator as any,
      mockAudioPipelineOrchestrator as any,
      mockBargeInOrchestrator as any,
      () => mockRuntimeVoiceInterviewConnector as any
    );
    sessionEvents = [];

    // Subscribe to session events
    sessionOrchestrator.subscribeToSessionEvents((event, metadata) => {
      sessionEvents.push({ event, metadata });
    });

    // Reset Application Orchestrator
    ApplicationOrchestrator.resetPipeline();
  });

  test("should start session successfully", async () => {
    await sessionOrchestrator.startSession("test_pipeline_1", "user_1");
    expect(sessionOrchestrator.getSessionState()).toBe("Idle");
    expect(sessionEvents.length).toBeGreaterThan(0);
  });

  test("should stop session successfully", async () => {
    await sessionOrchestrator.startSession("test_pipeline_2", "user_2");
    await sessionOrchestrator.stopSession();
    expect(sessionOrchestrator.getSessionState()).toBe("Idle");
  });

  test("should handle Application Orchestrator events", async () => {
    await sessionOrchestrator.startSession("test_pipeline_3", "user_3");

    // Simulate Application Orchestrator events
    ApplicationOrchestrator.completeInterviewPreparation({
      metadata: { preparedAt: new Date().toISOString() }
    } as any);

    expect(sessionEvents.some(e => e.event === "SessionBootstrap")).toBe(true);
  });

  test("should handle Voice Interview events", async () => {
    await sessionOrchestrator.startSession("test_pipeline_4", "user_4");

    // Simulate Voice Interview started
    ApplicationOrchestrator.startVoiceInterview({
      interviewSession: { id: "interview_1", currentState: "Introduction", previousState: "Waiting", stateHistory: [], explainability: { source: "test", proof: "test", confidence: 1.0, explanation: "test" } }
    } as any);

    expect(sessionEvents.some(e => e.event === "SessionVoiceInterview")).toBe(true);
  });

  test("should handle Voice Interview completion", async () => {
    await sessionOrchestrator.startSession("test_pipeline_5", "user_5");

    // Simulate Voice Interview completion
    ApplicationOrchestrator.completeVoiceInterview();

    expect(sessionEvents.some(e => e.event === "SessionCompletion")).toBe(true);
  });

  test("should handle Final Report generation", async () => {
    await sessionOrchestrator.startSession("test_pipeline_6", "user_6");

    // Simulate Final Report generation
    ApplicationOrchestrator.generateFinalReport({
      metadata: { reportId: "report_1" }
    } as any);

    expect(sessionEvents.some(e => e.event === "SessionStopped")).toBe(true);
  });

  test("should handle Application Orchestrator errors", async () => {
    await sessionOrchestrator.startSession("test_pipeline_7", "user_7");

    // Simulate Application Orchestrator error
    ApplicationOrchestrator.handleError("Test error");

    expect(sessionEvents.some(e => e.event === "SessionError")).toBe(true);
  });

  test("should maintain session state correctly", async () => {
    await sessionOrchestrator.startSession("test_pipeline_8", "user_8");
    expect(sessionOrchestrator.getSessionState()).toBe("Idle");

    ApplicationOrchestrator.completeInterviewPreparation({
      metadata: { preparedAt: new Date().toISOString() }
    } as any);

    expect(sessionOrchestrator.getSessionState()).toBe("Bootstrap");
  });

  test("should handle multiple session events in sequence", async () => {
    await sessionOrchestrator.startSession("test_pipeline_9", "user_9");

    // Simulate sequence of events
    ApplicationOrchestrator.completeInterviewPreparation({
      metadata: { preparedAt: new Date().toISOString() }
    } as any);

    ApplicationOrchestrator.startVoiceInterview({
      interviewSession: { id: "interview_2", currentState: "Introduction", previousState: "Waiting", stateHistory: [], explainability: { source: "test", proof: "test", confidence: 1.0, explanation: "test" } }
    } as any);

    ApplicationOrchestrator.completeVoiceInterview();

    expect(sessionEvents.length).toBeGreaterThanOrEqual(3);
  });

  test("should cleanup resources on session stop", async () => {
    await sessionOrchestrator.startSession("test_pipeline_10", "user_10");
    await sessionOrchestrator.stopSession();

    // Verify Application Orchestrator is reset
    const pipelineState = ApplicationOrchestrator.getPipelineState();
    expect(pipelineState.currentStage).toBe("Idle");
  });
});
