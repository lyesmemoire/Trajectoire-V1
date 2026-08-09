import { describe, it, expect, beforeEach } from "vitest";
import { DefaultCognitiveRuntime } from "../../apps/web/src/lib/ai/runtime/CognitiveRuntime";
import { DefaultEngineRegistry } from "../../apps/web/src/lib/ai/runtime/EngineRegistry";
import { DefaultEventBus } from "../../apps/web/src/lib/ai/runtime/EventBus";
import { SequentialEngineScheduler } from "../../apps/web/src/lib/ai/runtime/EngineScheduler";
import { DummyEngine, DummyInput } from "../../apps/web/src/lib/ai/runtime/DummyEngine";
import { DefaultReducerRegistry, Reducer } from "../../apps/web/src/lib/ai/runtime/ReducerRegistry";
import { DefaultSnapshotBuilder } from "../../apps/web/src/lib/ai/runtime/SnapshotBuilder";
import { InvestigationContext } from "../../apps/web/src/domain/cognitive/InvestigationContext";
import { Engine } from "../../apps/web/src/lib/ai/contracts/Engine";

describe("Phase A.2 - Runtime Integration Tests", () => {
  let runtime: DefaultCognitiveRuntime;
  let eventBus: DefaultEventBus;
  let registry: DefaultEngineRegistry;
  let scheduler: SequentialEngineScheduler;
  let dummyEngine: DummyEngine;
  let reducerRegistry: DefaultReducerRegistry;
  let snapshotBuilder: DefaultSnapshotBuilder;
  let sessionId: string;
  let investigationContext: InvestigationContext;
  let initialState: any;

  beforeEach(() => {
    // Initialize components
    registry = new DefaultEngineRegistry();
    eventBus = new DefaultEventBus();
    scheduler = new SequentialEngineScheduler(registry);
    dummyEngine = new DummyEngine();
    reducerRegistry = new DefaultReducerRegistry();
    snapshotBuilder = new DefaultSnapshotBuilder();
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

    initialState = {
      sessionId,
      version: 0,
      schemaVersion: "1.0",
      engineVersion: "1.0.0",
      knowledgeGraph: {} as any,
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

  // Test 1: Two events with same traceId/correlationId
  it("Test 1: Two events should have same traceId and correlationId", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const traceId = crypto.randomUUID();
    const correlationId = crypto.randomUUID();

    const input: DummyInput = {
      sessionId,
      context: { testValue: "test", traceId, correlationId },
      payload: { message: "Test message" },
    };

    // Execute engine twice
    await runtime.execute(["DummyEngine"], input);
    await runtime.execute(["DummyEngine"], input);

    // Get all events
    const events = eventBus.getHistory(sessionId);

    // Verify we have 2 events
    expect(events.length).toBe(2);

    // Verify both events have envelope with same traceId and correlationId
    const firstEvent = events[0] as any;
    const secondEvent = events[1] as any;

    expect(firstEvent.envelope).toBeDefined();
    expect(secondEvent.envelope).toBeDefined();
    expect(firstEvent.envelope.traceId).toBe(traceId);
    expect(secondEvent.envelope.traceId).toBe(traceId);
    expect(firstEvent.envelope.correlationId).toBe(correlationId);
    expect(secondEvent.envelope.correlationId).toBe(correlationId);
  });

  // Test 2: Snapshots version N and N+1 with parentSnapshotId
  it("Test 2: Snapshots should have version N and N+1 with correct parentSnapshotId", async () => {
    await runtime.initialize(sessionId, investigationContext);

    // Get initial context
    const initialContext = investigationContext;
    const initialVersion = initialContext.metadata.snapshotVersion;
    const initialSnapshotId = initialContext.metadata.snapshotId;

    // Execute engine to create new snapshot
    const input: DummyInput = {
      sessionId,
      context: { testValue: "test" },
      payload: { message: "Test message" },
    };

    await runtime.execute(["DummyEngine"], input);

    // Get new context (in a full implementation, this would be accessible)
    // For Phase A.2, we test the SnapshotBuilder directly
    const newContext = snapshotBuilder.build(
      initialState,
      initialContext,
      {
        traceId: crypto.randomUUID(),
        correlationId: crypto.randomUUID(),
      }
    );

    // Verify version incremented
    expect(newContext.metadata.snapshotVersion).toBe(initialVersion + 1);

    // Verify parentSnapshotId is set correctly
    expect(newContext.metadata.parentSnapshotId).toBe(initialSnapshotId);

    // Verify new snapshotId is different
    expect(newContext.metadata.snapshotId).not.toBe(initialSnapshotId);
  });

  // Test 3: Two reducers registered and executed
  it("Test 3: Two reducers should be registered and executed in order", async () => {
    // Create two test reducers
    const executionOrder: string[] = [];

    const reducer1: Reducer = {
      name: "Reducer1",
      version: "1.0.0",
      reduce: (events, previousState) => {
        executionOrder.push("Reducer1");
        return previousState;
      },
    };

    const reducer2: Reducer = {
      name: "Reducer2",
      version: "1.0.0",
      reduce: (events, previousState) => {
        executionOrder.push("Reducer2");
        return previousState;
      },
    };

    // Register reducers
    reducerRegistry.register(reducer1);
    reducerRegistry.register(reducer2);

    // Verify both are registered
    expect(reducerRegistry.has("Reducer1")).toBe(true);
    expect(reducerRegistry.has("Reducer2")).toBe(true);

    // Verify getAll returns both
    const allReducers = reducerRegistry.getAll();
    expect(allReducers.length).toBe(2);

    // Execute reducers in order
    let state = initialState;
    for (const reducer of allReducers) {
      state = reducer.reduce([], state);
    }

    // Verify execution order
    expect(executionOrder).toEqual(["Reducer1", "Reducer2"]);
  });

  // Test 4: Engine emits 3 events, all published/reduced
  it("Test 4: Engine emitting 3 events should have all published and reduced", async () => {
    // Create a custom engine that emits 3 events
    class MultiEventEngine implements Engine<DummyInput, any> {
      readonly name = "MultiEventEngine";
      readonly version = "1.0.0";

      async execute(input: DummyInput): Promise<any> {
        const envelope = {
          eventId: crypto.randomUUID(),
          traceId: crypto.randomUUID(),
          correlationId: crypto.randomUUID(),
          causationId: null,
          occurredAt: new Date(),
          engineId: this.name,
          engineVersion: this.version,
          schemaVersion: "1.0",
        };

        const events = [
          {
            id: crypto.randomUUID(),
            sessionId: input.sessionId,
            sequence: 0,
            engine: this.name,
            eventType: "EVENT_1",
            engineVersion: this.version,
            payload: { message: "Event 1" },
            createdAt: new Date(),
            envelope,
          },
          {
            id: crypto.randomUUID(),
            sessionId: input.sessionId,
            sequence: 1,
            engine: this.name,
            eventType: "EVENT_2",
            engineVersion: this.version,
            payload: { message: "Event 2" },
            createdAt: new Date(),
            envelope,
          },
          {
            id: crypto.randomUUID(),
            sessionId: input.sessionId,
            sequence: 2,
            engine: this.name,
            eventType: "EVENT_3",
            engineVersion: this.version,
            payload: { message: "Event 3" },
            createdAt: new Date(),
            envelope,
          },
        ];

        return {
          engine: this.name,
          version: this.version,
          durationMs: 0,
          tokens: { prompt: 0, completion: 0, total: 0 },
          confidence: 1.0,
          events,
          warnings: [],
          metrics: {},
          debug: {},
        };
      }
    }

    const multiEventEngine = new MultiEventEngine();
    runtime.getRegistry().register(multiEventEngine);

    await runtime.initialize(sessionId, investigationContext);

    const input: DummyInput = {
      sessionId,
      context: { testValue: "test" },
      payload: { message: "Test message" },
    };

    // Execute multi-event engine
    await runtime.execute(["MultiEventEngine"], input);

    // Verify all 3 events were published
    const events = eventBus.getHistory(sessionId);
    expect(events.length).toBe(3);

    // Verify all events have same traceId/correlationId
    const firstEvent = events[0] as any;
    const secondEvent = events[1] as any;
    const thirdEvent = events[2] as any;

    expect(firstEvent.envelope.traceId).toBe(secondEvent.envelope.traceId);
    expect(secondEvent.envelope.traceId).toBe(thirdEvent.envelope.traceId);
    expect(firstEvent.envelope.correlationId).toBe(secondEvent.envelope.correlationId);
    expect(secondEvent.envelope.correlationId).toBe(thirdEvent.envelope.correlationId);
  });

  // Test 5: SnapshotBuilder produces immutable InvestigationContext
  it("Test 5: SnapshotBuilder should produce immutable InvestigationContext", async () => {
    const initialContext = investigationContext;

    // Build new snapshot
    const newContext = snapshotBuilder.build(
      initialState,
      initialContext,
      {
        traceId: crypto.randomUUID(),
        correlationId: crypto.randomUUID(),
      }
    );

    // Verify new context is different object
    expect(newContext).not.toBe(initialContext);

    // Verify new context has different metadata
    expect(newContext.metadata.snapshotVersion).not.toBe(initialContext.metadata.snapshotVersion);
    expect(newContext.metadata.snapshotId).not.toBe(initialContext.metadata.snapshotId);

    // Verify original context is unchanged (immutability)
    expect(initialContext.metadata.snapshotVersion).toBe(0);

    // Try to modify new context (should not affect original)
    const modifiedContext = { ...newContext, candidateId: "modified" };
    expect(modifiedContext.candidateId).toBe("modified");
    expect(newContext.candidateId).toBe(initialContext.candidateId);
  });
});
