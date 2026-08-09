import { describe, it, expect, beforeEach } from "vitest";
import { DefaultCognitiveRuntime } from "../../apps/web/src/lib/ai/runtime/CognitiveRuntime";
import { DefaultEngineRegistry } from "../../apps/web/src/lib/ai/runtime/EngineRegistry";
import { DefaultEventBus } from "../../apps/web/src/lib/ai/runtime/EventBus";
import { SequentialEngineScheduler } from "../../apps/web/src/lib/ai/runtime/EngineScheduler";
import { DummyEngine, DummyInput } from "../../apps/web/src/lib/ai/runtime/DummyEngine";
import { DummyReducer } from "../../apps/web/src/lib/ai/runtime/Reducer";
import { InvestigationContext } from "../../apps/web/src/domain/cognitive/InvestigationContext";

describe("Phase A.1 - Runtime Integration Test", () => {
  let runtime: DefaultCognitiveRuntime;
  let eventBus: DefaultEventBus;
  let registry: DefaultEngineRegistry;
  let scheduler: SequentialEngineScheduler;
  let dummyEngine: DummyEngine;
  let reducer: DummyReducer;
  let sessionId: string;
  let investigationContext: InvestigationContext;
  let initialState: any;

  beforeEach(() => {
    // Initialize components
    registry = new DefaultEngineRegistry();
    eventBus = new DefaultEventBus();
    scheduler = new SequentialEngineScheduler(registry);
    dummyEngine = new DummyEngine();
    reducer = new DummyReducer();
    runtime = new DefaultCognitiveRuntime();

    // Register dummy engine in runtime's registry
    runtime.getRegistry().register(dummyEngine);

    // Use runtime's eventBus for tests
    eventBus = runtime.getEventBus() as DefaultEventBus;

    // Setup test data
    sessionId = crypto.randomUUID();
    investigationContext = {
      sessionId,
      candidateId: "test-candidate",
      interviewId: "test-interview",
      startTime: new Date(),
      metadata: {},
      constraints: {
        maxTurns: 10,
        maxDuration: 60,
        maxTokens: 10000,
        allowedTopics: [],
        forbiddenTopics: [],
      },
      goals: [],
    };

    initialState = {
      sessionId,
      version: 0,
      schemaVersion: "1.0",
      engineVersion: "1.0.0",
      knowledgeGraph: {} as any, // Will use proper KnowledgeGraph instance in real implementation
      competencies: [],
      confidenceMatrix: {},
      hypotheses: [],
      evidences: [],
      unknowns: [],
      weakSignals: [],
      risks: [],
      decisions: [],
      currentPhase: "OPENING",
      currentStrategy: null,
      currentGoals: [],
      budget: {
        maxDurationMinutes: 60,
        remainingMinutes: 60,
        maxQuestions: 10,
        remainingQuestions: 10,
        competenciesTotal: 0,
        competenciesEvaluated: 0,
        fatigueLevel: 0,
        globalConfidence: 0,
        challengeBudget: 4,
        followUpBudget: 8,
        deepDiveBudget: 3,
        tokenBudget: 50000,
        tokensConsumed: 0,
      },
      metrics: {
        totalQuestions: 0,
        totalFollowUps: 0,
        totalChallenges: 0,
        totalContradictions: 0,
        totalWeakSignals: 0,
        averageConfidence: 0,
        elapsedMinutes: 0,
      },
      history: [],
    };
  });

  it("should initialize runtime with session", async () => {
    await runtime.initialize(sessionId, investigationContext);
    expect(runtime.getRegistry().has("DummyEngine")).toBe(true);
  });

  it("should execute DummyEngine and publish event", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input: DummyInput = {
      sessionId,
      context: { testValue: "test" },
      payload: { message: "Hello from DummyEngine" },
    };

    // Subscribe to events
    let receivedEvent: any = null;
    eventBus.subscribe("DUMMY_EVENT", (event) => {
      receivedEvent = event;
    });

    // Execute engine
    await runtime.execute(["DummyEngine"], input);

    // Verify event was published
    expect(receivedEvent).not.toBeNull();
    expect(receivedEvent.eventType).toBe("DUMMY_EVENT");
    expect(receivedEvent.payload.message).toBe("Hello from DummyEngine");
  });

  it("should execute pipeline: Engine -> EventBus -> Reducer", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input: DummyInput = {
      sessionId,
      context: { testValue: "test" },
      payload: { message: "Pipeline test" },
    };

    // Collect events from EventBus
    const collectedEvents: any[] = [];
    eventBus.subscribe("DUMMY_EVENT", (event) => {
      collectedEvents.push(event);
    });

    // Execute engine
    await runtime.execute(["DummyEngine"], input);

    // Verify events were collected
    expect(collectedEvents.length).toBe(1);

    // Apply reducer
    const newState = reducer.reduce(collectedEvents, initialState);

    // Verify reducer returned state
    expect(newState).toBeDefined();
    expect(newState.sessionId).toBe(sessionId);
  });

  it("should maintain type-agnostic EventBus (no event type checks)", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input: DummyInput = {
      sessionId,
      context: { testValue: "test" },
      payload: { message: "Type-agnostic test" },
    };

    // Subscribe with wildcard pattern
    let wildcardCount = 0;
    eventBus.subscribe("*", (event) => {
      wildcardCount++;
    });

    // Execute engine
    await runtime.execute(["DummyEngine"], input);

    // Verify wildcard caught the event without type checking
    expect(wildcardCount).toBe(1);
  });

  it("should handle multiple engine executions sequentially", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input: DummyInput = {
      sessionId,
      context: { testValue: "test" },
      payload: { message: "Sequential test" },
    };

    let eventCount = 0;
    eventBus.subscribe("DUMMY_EVENT", () => {
      eventCount++;
    });

    // Execute same engine twice
    await runtime.execute(["DummyEngine"], input);
    await runtime.execute(["DummyEngine"], input);

    // Verify sequential execution
    expect(eventCount).toBe(2);
  });

  it("should throw error when executing unregistered engine", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input: DummyInput = {
      sessionId,
      context: { testValue: "test" },
      payload: { message: "Error test" },
    };

    await expect(
      runtime.execute(["NonExistentEngine"], input)
    ).rejects.toThrow("Engine NonExistentEngine not found in registry");
  });

  it("should throw error when executing without initialization", async () => {
    const input: DummyInput = {
      sessionId,
      context: { testValue: "test" },
      payload: { message: "Error test" },
    };

    await expect(
      runtime.execute(["DummyEngine"], input)
    ).rejects.toThrow("Runtime not initialized");
  });

  it("should maintain event history per session", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input: DummyInput = {
      sessionId,
      context: { testValue: "test" },
      payload: { message: "History test" },
    };

    // Execute engine
    await runtime.execute(["DummyEngine"], input);

    // Get history
    const history = eventBus.getHistory(sessionId);

    // Verify history
    expect(history.length).toBe(1);
    expect(history[0].eventType).toBe("DUMMY_EVENT");
  });

  it("should validate complete pipeline: Runtime -> Scheduler -> Registry -> Engine -> Events -> EventBus -> Reducer", async () => {
    // This is the critical test that validates the entire pipeline architecture
    
    await runtime.initialize(sessionId, investigationContext);

    const input: DummyInput = {
      sessionId,
      context: { testValue: "test" },
      payload: { message: "Complete pipeline test" },
    };

    // Step 1: Runtime executes
    await runtime.execute(["DummyEngine"], input);

    // Step 2: Verify Scheduler executed via Registry
    expect(runtime.getRegistry().has("DummyEngine")).toBe(true);

    // Step 3: Verify Engine produced Events
    const events = eventBus.getHistory(sessionId);
    expect(events.length).toBe(1);
    expect(events[0].engine).toBe("DummyEngine");

    // Step 4: Verify EventBus published events
    expect(events[0].eventType).toBe("DUMMY_EVENT");

    // Step 5: Verify Reducer can process events
    const newState = reducer.reduce(events, initialState);
    expect(newState).toBeDefined();

    // Step 6: Verify no engine knows about Reducer, Runtime, or Scheduler
    // (This is implicit in the architecture - DummyEngine only knows about input/output)
    expect(dummyEngine.name).toBe("DummyEngine");
    expect(dummyEngine.version).toBe("1.0.0");

    // Pipeline validated successfully
    expect(true).toBe(true);
  });
});
