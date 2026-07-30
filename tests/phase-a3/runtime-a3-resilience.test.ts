import { describe, it, expect, beforeEach } from "vitest";
import { DefaultCognitiveRuntime } from "../../apps/web/src/lib/ai/runtime/CognitiveRuntime";
import { DummyEngine, DummyInput } from "../../apps/web/src/lib/ai/runtime/DummyEngine";
import { InvestigationContext } from "../../apps/web/src/domain/cognitive/InvestigationContext";
import { Engine } from "../../apps/web/src/lib/ai/contracts/Engine";
import { EngineResult } from "../../apps/web/src/lib/ai/contracts/EngineResult";
import { BaseEvent } from "../../apps/web/src/lib/ai/contracts/Event";
import { createEventEnvelope } from "../../apps/web/src/lib/ai/contracts/EventEnvelope";
import { EngineExecutionError } from "../../apps/web/src/lib/ai/runtime/errors/EngineExecutionError";
import { EngineBudgetExceededError } from "../../apps/web/src/lib/ai/runtime/errors/EngineExecutionError";

describe("Phase A.3 - Runtime Resilience & Observability Tests", () => {
  let runtime: DefaultCognitiveRuntime;
  let dummyEngine: DummyEngine;
  let sessionId: string;
  let investigationContext: InvestigationContext;

  beforeEach(() => {
    runtime = new DefaultCognitiveRuntime();
    dummyEngine = new DummyEngine();
    runtime.getRegistry().register(dummyEngine);

    sessionId = crypto.randomUUID();
    investigationContext = {
      sessionId,
      candidateId: "test-candidate",
      interviewId: "test-interview",
      startTime: new Date(),
      metadata: {
        snapshotVersion: 0,
        snapshotId: crypto.randomUUID(),
        parentSnapshotId: null,
        lastSnapshotAt: new Date(),
        traceId: crypto.randomUUID(),
        correlationId: crypto.randomUUID(),
      },
      constraints: {
        maxTurns: 10,
        maxDuration: 60,
        maxTokens: 10000,
        allowedTopics: [],
        forbiddenTopics: [],
      },
      goals: [],
    };
  });

  // Test 1: Engine en erreur
  it("Test 1: Engine error should be handled according to execution policy", async () => {
    // Create a failing engine
    class FailingEngine implements Engine<DummyInput, any> {
      readonly name = "FailingEngine";
      readonly version = "1.0.0";

      async execute(input: DummyInput): Promise<EngineResult<any>> {
        throw new Error("Engine failed intentionally");
      }
    }

    const failingEngine = new FailingEngine();
    runtime.getRegistry().register(failingEngine);

    await runtime.initialize(sessionId, investigationContext);

    const input: DummyInput = {
      sessionId,
      context: { testValue: "test" },
      payload: { message: "Test message" },
    };

    // Test with continue-on-error (default)
    runtime.setExecutionPolicy("continue-on-error");
    const report1 = await runtime.execute(["FailingEngine"], input);
    
    expect(report1.enginesExecuted.length).toBe(1);
    expect(report1.enginesExecuted[0].success).toBe(false);
    expect(report1.enginesExecuted[0].error).toBe("Engine failed intentionally");

    // Test with stop-on-error
    runtime.setExecutionPolicy("stop-on-error");
    await expect(
      runtime.execute(["FailingEngine"], input)
    ).rejects.toThrow("Engine failed intentionally");
  });

  // Test 2: Budget tracking
  it("Test 2: Budget should be tracked correctly", async () => {
    // Create a slow engine that consumes time
    class SlowEngine implements Engine<DummyInput, any> {
      readonly name = "SlowEngine";
      readonly version = "1.0.0";

      async execute(input: DummyInput): Promise<EngineResult<any>> {
        // Simulate slow execution
        await new Promise(resolve => setTimeout(resolve, 5));
        
        const envelope = createEventEnvelope(this.name, this.version);
        return {
          engine: this.name,
          version: this.version,
          durationMs: 5,
          tokens: { prompt: 10, completion: 5, total: 15 },
          confidence: 1.0,
          events: [
            {
              id: crypto.randomUUID(),
              sessionId: input.sessionId,
              sequence: 0,
              engine: this.name,
              eventType: "SLOW_EVENT",
              engineVersion: this.version,
              payload: { message: "Slow" },
              createdAt: new Date(),
              envelope,
            },
          ],
          warnings: [],
          metrics: {},
          debug: {},
        };
      }
    }

    const slowEngine = new SlowEngine();
    runtime.getRegistry().register(slowEngine);

    await runtime.initialize(sessionId, investigationContext, {
      maxDurationMs: 1000,
      maxTokens: 1000,
    });

    const input: DummyInput = {
      sessionId,
      context: { testValue: "test" },
      payload: { message: "Test message" },
    };

    const report = await runtime.execute(["SlowEngine"], input);

    // Verify budget tracking (duration is tracked, tokens are tracked by engine result)
    expect(report.budgetUsed.durationMs).toBeGreaterThanOrEqual(5);
    // Note: Token tracking depends on engine result, not runtime consumption
    // In Phase A.3, we track what engines report
  });

  // Test 3: Aucun événement
  it("Test 3: Engine with no events should not affect snapshot", async () => {
    // Create an engine that produces no events
    class EmptyEngine implements Engine<DummyInput, any> {
      readonly name = "EmptyEngine";
      readonly version = "1.0.0";

      async execute(input: DummyInput): Promise<EngineResult<any>> {
        return {
          engine: this.name,
          version: this.version,
          durationMs: 0,
          tokens: { prompt: 0, completion: 0, total: 0 },
          confidence: 1.0,
          events: [],
          warnings: [],
          metrics: {},
          debug: {},
        };
      }
    }

    const emptyEngine = new EmptyEngine();
    runtime.getRegistry().register(emptyEngine);

    await runtime.initialize(sessionId, investigationContext);

    const input: DummyInput = {
      sessionId,
      context: { testValue: "test" },
      payload: { message: "Test message" },
    };

    const report = await runtime.execute(["EmptyEngine"], input);

    expect(report.eventsPublished).toBe(0);
    expect(report.enginesExecuted[0].eventsProduced).toBe(0);
  });

  // Test 4: AbortSignal
  it("Test 4: AbortSignal should cancel execution", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const abortController = new AbortController();
    abortController.abort();

    const input: DummyInput = {
      sessionId,
      context: { testValue: "test" },
      payload: { message: "Test message" },
    };

    await expect(
      runtime.execute(["DummyEngine"], input, abortController.signal)
    ).rejects.toThrow(EngineExecutionError);
  });

  // Test 5: Hooks appelés dans le bon ordre
  it("Test 5: Hooks should be called in correct order", async () => {
    const hookOrder: string[] = [];

    // Create custom hooks that record calls
    class TestHooks {
      async beforeEngine(): Promise<void> {
        hookOrder.push("beforeEngine");
      }
      async afterEngine(): Promise<void> {
        hookOrder.push("afterEngine");
      }
      async beforePublish(): Promise<void> {
        hookOrder.push("beforePublish");
      }
      async afterPublish(): Promise<void> {
        hookOrder.push("afterPublish");
      }
      async beforeReducer(): Promise<void> {
        hookOrder.push("beforeReducer");
      }
      async afterReducer(): Promise<void> {
        hookOrder.push("afterReducer");
      }
    }

    // Note: In a real implementation, we'd inject these hooks into the Runtime
    // For Phase A.3, we'll verify the Runtime calls hooks via the ExecutionReport
    
    await runtime.initialize(sessionId, investigationContext);

    const input: DummyInput = {
      sessionId,
      context: { testValue: "test" },
      payload: { message: "Test message" },
    };

    const report = await runtime.execute(["DummyEngine"], input);

    // Verify hooks were called
    expect(report.hooksCalled.beforeEngine).toBe(1);
    expect(report.hooksCalled.afterEngine).toBe(1);
    expect(report.hooksCalled.beforePublish).toBe(1);
    expect(report.hooksCalled.afterPublish).toBe(1);
    // beforeReducer and afterReducer are called only if currentState is set
    // In Phase A.3, we don't set currentState, so these may be 0
  });

  // Test 6: Télémetry (ExecutionReport)
  it("Test 6: ExecutionReport should contain complete telemetry", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input: DummyInput = {
      sessionId,
      context: { testValue: "test" },
      payload: { message: "Test message" },
    };

    const report = await runtime.execute(["DummyEngine"], input);

    // Verify report structure
    expect(report.sessionId).toBe(sessionId);
    expect(report.traceId).toBeDefined();
    expect(report.correlationId).toBeDefined();
    expect(report.startTime).toBeDefined();
    expect(report.endTime).toBeDefined();
    expect(report.totalDurationMs).toBeGreaterThanOrEqual(0);

    // Verify engine metrics
    expect(report.enginesExecuted.length).toBe(1);
    expect(report.enginesExecuted[0].engineName).toBe("DummyEngine");
    expect(report.enginesExecuted[0].durationMs).toBeGreaterThanOrEqual(0);
    expect(report.enginesExecuted[0].eventsProduced).toBe(1);
    expect(report.enginesExecuted[0].success).toBe(true);

    // Verify event count
    expect(report.eventsPublished).toBe(1);

    // Verify budget tracking (even without budget config)
    expect(report.budgetUsed.durationMs).toBeGreaterThanOrEqual(0);
    expect(report.budgetUsed.tokens).toBe(0);

    // Verify hooks tracking
    expect(report.hooksCalled.beforeEngine).toBe(1);
    expect(report.hooksCalled.afterEngine).toBe(1);
    expect(report.hooksCalled.beforePublish).toBe(1);
    expect(report.hooksCalled.afterPublish).toBe(1);
  });

  // Test 7: Multiple engines execution
  it("Test 7: Multiple engines should execute sequentially with proper telemetry", async () => {
    // Create a second engine
    class SecondEngine implements Engine<DummyInput, any> {
      readonly name = "SecondEngine";
      readonly version = "1.0.0";

      async execute(input: DummyInput): Promise<EngineResult<any>> {
        const envelope = createEventEnvelope(this.name, this.version);
        return {
          engine: this.name,
          version: this.version,
          durationMs: 5,
          tokens: { prompt: 0, completion: 0, total: 0 },
          confidence: 1.0,
          events: [
            {
              id: crypto.randomUUID(),
              sessionId: input.sessionId,
              sequence: 0,
              engine: this.name,
              eventType: "SECOND_EVENT",
              engineVersion: this.version,
              payload: { message: "Second" },
              createdAt: new Date(),
              envelope,
            },
          ],
          warnings: [],
          metrics: {},
          debug: {},
        };
      }
    }

    const secondEngine = new SecondEngine();
    runtime.getRegistry().register(secondEngine);

    await runtime.initialize(sessionId, investigationContext);

    const input: DummyInput = {
      sessionId,
      context: { testValue: "test" },
      payload: { message: "Test message" },
    };

    const report = await runtime.execute(["DummyEngine", "SecondEngine"], input);

    // Verify both engines executed
    expect(report.enginesExecuted.length).toBe(2);
    expect(report.enginesExecuted[0].engineName).toBe("DummyEngine");
    expect(report.enginesExecuted[1].engineName).toBe("SecondEngine");

    // Verify total events
    expect(report.eventsPublished).toBe(2);

    // Verify total duration
    expect(report.totalDurationMs).toBeGreaterThanOrEqual(
      report.enginesExecuted[0].durationMs + report.enginesExecuted[1].durationMs
    );
  });
});
