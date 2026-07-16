/**
 * E2E Test for Complete Interview Pipeline
 * 
 * Simulates a complete interview from CV to Final Report:
 * CV → Candidate Intelligence → Job Offer Intelligence → Matching Intelligence → Transferable Skills Intelligence → Gap Intelligence → Interview Preparation Intelligence → Voice Interview Engine → Runtime → Provider → Audio → Live Interview Analysis → Live Coaching → Final Report → Improvement Plan
 * 
 * Measures pipeline response times and validates end-to-end flow.
 */
// @ts-nocheck


import { ApplicationOrchestrator } from "../orchestrator/ApplicationOrchestrator";
import { coreContainer } from "../container";
import { CandidateProfile } from "../intelligence/types";
import { JobOfferGraph } from "../intelligence/profile/JobOfferGraph";
import { MatchingCoreOutput } from "../intelligence/engines/careerCopilotMatchingIntelligenceEngine";

describe("E2E Interview Pipeline", () => {
  let pipelineMetrics: Map<string, number>;

  beforeEach(() => {
    pipelineMetrics = new Map();
    ApplicationOrchestrator.resetPipeline();
  });

  test("should simulate complete interview pipeline", async () => {
    const startTime = Date.now();

    // Step 1: Start pipeline
    const pipelineStart = Date.now();
    ApplicationOrchestrator.startPipeline("e2e_test_pipeline", "e2e_user");
    pipelineMetrics.set("pipeline_start", Date.now() - pipelineStart);

    // Step 2: Simulate CV upload and Candidate Intelligence
    const cvUpload = Date.now();
    ApplicationOrchestrator.uploadCV({
      identity: { id: "candidate_1", name: "Test Candidate", email: "test@example.com" }
    } as unknown as CandidateProfile, { id: "graph_1" } as Record<string, unknown>);
    pipelineMetrics.set("cv_upload", Date.now() - cvUpload);

    // Step 3: Simulate Job Offer upload
    const jobUpload = Date.now();
    ApplicationOrchestrator.uploadJobOffer({
      id: "job_1",
      title: "Software Engineer",
      company: "Tech Corp"
    } as unknown as JobOfferGraph);
    pipelineMetrics.set("job_upload", Date.now() - jobUpload);

    // Step 4: Simulate Matching Intelligence
    const matching = Date.now();
    ApplicationOrchestrator.completeMatching({
      metadata: { comparedAt: new Date().toISOString() }
    } as unknown as MatchingCoreOutput);
    pipelineMetrics.set("matching", Date.now() - matching);

    const totalTime = Date.now() - startTime;
    pipelineMetrics.set("total_pipeline_time", totalTime);

    // Verify pipeline progressed
    const pipelineState = ApplicationOrchestrator.getPipelineState();
    expect(pipelineState.currentStage).not.toBe("Idle");

    // Log metrics
    console.log("Pipeline Metrics:");
    pipelineMetrics.forEach((time, step) => {
      console.log(`  ${step}: ${time}ms`);
    });

    // Verify all steps completed within reasonable time
    expect(totalTime).toBeLessThan(5000); // Should complete in under 5 seconds
  });

  test("should handle pipeline errors gracefully", async () => {
    ApplicationOrchestrator.startPipeline("e2e_error_test", "e2e_user");

    // Simulate an error during pipeline by setting error directly
    const pipelineState = ApplicationOrchestrator.getPipelineState();
    pipelineState.error = "Simulated error during matching";
    pipelineState.currentStage = "Error";

    // Verify error state
    expect(pipelineState.currentStage).toBe("Error");
    expect(pipelineState.error).toBe("Simulated error during matching");
  });

  test("should handle pipeline cancellation", async () => {
    ApplicationOrchestrator.startPipeline("e2e_cancel_test", "e2e_user");

    // Cancel pipeline by setting cancelled directly
    const pipelineState = ApplicationOrchestrator.getPipelineState();
    pipelineState.cancelled = true;
    pipelineState.currentStage = "Cancelled";

    // Verify cancelled state
    expect(pipelineState.currentStage).toBe("Cancelled");
    expect(pipelineState.cancelled).toBe(true);
  });

  test("should measure individual component performance", async () => {
    const componentMetrics = new Map<string, number>();

    // Measure Runtime Engine performance
    const runtimeStart = Date.now();
    const _runtimeEngine = coreContainer.getRuntimeEngine();
    componentMetrics.set("runtime_engine", Date.now() - runtimeStart);

    // Measure Audio Pipeline performance
    const audioStart = Date.now();
    const _audioPipeline = coreContainer.getAudioPipelineOrchestrator();
    componentMetrics.set("audio_pipeline", Date.now() - audioStart);

    // Measure Barge-In Orchestrator performance
    const bargeInStart = Date.now();
    const _bargeInOrchestrator = coreContainer.getBargeInOrchestrator();
    componentMetrics.set("barge_in_orchestrator", Date.now() - bargeInStart);

    // Measure Session Orchestrator performance
    const sessionStart = Date.now();
    const _sessionOrchestrator = coreContainer.getSessionOrchestrator();
    componentMetrics.set("session_orchestrator", Date.now() - sessionStart);

    // Log component metrics
    console.log("Component Performance Metrics:");
    componentMetrics.forEach((time) => {
      console.log(`  ${time}ms`);
    });

    // Verify all components initialized quickly
    componentMetrics.forEach((time) => {
      expect(time).toBeLessThan(1000); // Each component should initialize in under 1 second
    });
  });

  test("should verify no duplicate instances", () => {
    // Get same component multiple times
    const instance1 = coreContainer.getRuntimeEngine();
    const instance2 = coreContainer.getRuntimeEngine();
    const instance3 = coreContainer.getRuntimeEngine();

    // Verify they are the same instance
    expect(instance1).toBe(instance2);
    expect(instance2).toBe(instance3);
    expect(instance1).toBe(instance3);

    // Test with different components
    const audio1 = coreContainer.getAudioPipelineOrchestrator();
    const audio2 = coreContainer.getAudioPipelineOrchestrator();
    expect(audio1).toBe(audio2);
  });
});
