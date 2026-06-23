 
 
import { RuntimeOrchestrator } from "../apps/realtime-gateway/src/interview/runtime/fsm/orchestrator/RuntimeOrchestrator.ts";
import { RuntimeGuardEngine } from "../apps/realtime-gateway/src/interview/runtime/guards/RuntimeGuardEngine.ts";
import RuntimeEventBus from "../apps/realtime-gateway/src/interview/runtime/fsm/orchestrator/RuntimeEventBus.ts";

async function runSmoke() {
  console.log("🚀 Runtime Smoke Test Starting...");

  // Simple setup: empty bus and a placeholder FSM (using a mock that always returns a transition)
  const bus = RuntimeEventBus.create();
  const mockFsm = {
    transition: (seq: number, event: any) => ({ transitionId: "mock", newState: {} })
  } as any;
  const guardEngine = new RuntimeGuardEngine();
  const orchestrator = new RuntimeOrchestrator(bus, mockFsm);

  const events = Array.from({ length: 50 }).map((_, i) => ({
    id: `evt-${i}`,
    type: "TEST_EVENT",
    payload: { index: i },
    sequence: i
  }));

  let processed = 0;

  for (const event of events) {
    try {
      await orchestrator.process(event as any);
      processed++;
    } catch (e) {
      console.error("❌ Error processing event:", e);
    }
  }

  console.log("✅ Processed:", processed);

  // basic assertions via metrics exposure
  const metrics = await fetch("http://localhost:3000/metrics").then(r => r.text());

  const checks = [
    "runtime_fsm_transitions_total",
    "runtime_fsm_guard_rejections_total",
    "runtime_replay_validations_total",
  ];

  for (const c of checks) {
    console.log(c, metrics.includes(c) ? "✔" : "❌");
  }

  console.log("🏁 Smoke test completed");
}

runSmoke();
