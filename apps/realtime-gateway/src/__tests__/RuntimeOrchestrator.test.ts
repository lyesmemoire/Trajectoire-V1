import { RuntimeOrchestrator } from "../interview/runtime/fsm/orchestrator/RuntimeOrchestrator";
import { RuntimeEventBus } from "../interview/runtime/fsm/orchestrator/RuntimeEventBus";
import { InMemoryRuntimeEventStore } from "../interview/runtime/fsm/orchestrator/InMemoryRuntimeEventStore";

describe("RuntimeOrchestrator", () => {
  const createMockEvent = (sequence: number, type: string = "VOICE_STARTED") => ({
    eventId: `test-event-${sequence}`,
    sessionId: "test-session",
    timestamp: 1600000000000 + sequence * 1000,
    sequence,
    source: "test",
    type,
  });

  const mockFsm = {
    transition: jest.fn().mockReturnValue({
      transitionId: "trans-1",
      newState: { state: "mock" },
    }),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should process event and return nextOrchestrator without mutating original", async () => {
    const store = new InMemoryRuntimeEventStore();
    const bus = new RuntimeEventBus(store);
    const orchestrator = new RuntimeOrchestrator(bus, mockFsm);

    const event = createMockEvent(1);
    const result = await orchestrator.process(event);

    expect(result.nextOrchestrator).toBeDefined();
    expect(result.nextOrchestrator).not.toBe(orchestrator);

    // Verify the original bus was not mutated (sequence still 0)
    // @ts-expect-error - testing private property indirectly
    expect(orchestrator.bus.getLastSequence()).toBe(0);

    // Verify nextOrchestrator has the new event
    // @ts-expect-error
    expect(result.nextOrchestrator.bus.getLastSequence()).toBe(1);
  });

  test("should produce identical replay hash for identical event streams", async () => {
    const stream = [createMockEvent(1), createMockEvent(2, "ANSWER_RECEIVED")];

    // Run 1
    let orch1 = new RuntimeOrchestrator(RuntimeEventBus.create(), mockFsm);
    let hash1 = "";
    for (const e of stream) {
      const res = await orch1.process(e);
      orch1 = res.nextOrchestrator;
      hash1 = res.replayHash;
    }

    // Run 2
    let orch2 = new RuntimeOrchestrator(RuntimeEventBus.create(), mockFsm);
    let hash2 = "";
    for (const e of stream) {
      const res = await orch2.process(e);
      orch2 = res.nextOrchestrator;
      hash2 = res.replayHash;
    }

    expect(hash1).toBe(hash2);
    expect(hash1).toBeTruthy();
  });

  test("should maintain identical transitionId for same inputs", async () => {
    mockFsm.transition.mockReturnValueOnce({ transitionId: "t-1", newState: {} });
    mockFsm.transition.mockReturnValueOnce({ transitionId: "t-1", newState: {} });

    const orch1 = new RuntimeOrchestrator(new RuntimeEventBus(new InMemoryRuntimeEventStore()), mockFsm);
    const res1 = await orch1.process(createMockEvent(1));

    const orch2 = new RuntimeOrchestrator(new RuntimeEventBus(new InMemoryRuntimeEventStore()), mockFsm);
    const res2 = await orch2.process(createMockEvent(1));

    expect(res1.transitionId).toBe(res2.transitionId);
    expect(res1.orchestrationTraceEntry.transitionId).toBe(res1.transitionId);
  });

  test("should handle duplicate events deterministically", async () => {
    // Note: Deduplication would typically be handled before process or inside FSM/Policies.
    // For orchestration, we ensure that if duplicates slip through, the pipeline remains immutable.
    const orch = new RuntimeOrchestrator(new RuntimeEventBus(new InMemoryRuntimeEventStore()), mockFsm);
    const event = createMockEvent(1);
    
    const res1 = await orch.process(event);
    const res2 = await res1.nextOrchestrator.process(event);

    expect(res2.nextOrchestrator).not.toBe(res1.nextOrchestrator);
    expect(res2.replayHash).toBeDefined();
  });
});
