import { RuntimeOrchestrator } from "../interview/runtime/fsm/orchestrator/RuntimeOrchestrator";
import { RuntimeEventBus } from "../interview/runtime/fsm/orchestrator/RuntimeEventBus";

/** Simple deterministic random generator (LCG) */
class PRNG {
  private state: number;
  constructor(seed: number) {
    this.state = seed;
  }
  next(): number {
    this.state = (this.state * 1664525 + 1013904223) >>> 0;
    return this.state / 4294967296;
  }
  nextRange(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

/** Mock FSM for the stress test */
const createMockFsm = () => ({
  transition: (sequence: number, event: any) => {
    return {
      transitionId: `t-${sequence}-${event.type}`,
      newState: { lastEvent: event.type, time: event.timestamp },
    };
  },
});

/** Generate a deterministic stream of events */
const generateEventStream = (numEvents: number, seed: number) => {
  const prng = new PRNG(seed);
  const stream: any[] = [];
  
  const types = ["VOICE_STARTED", "QUESTION_EMITTED", "ANSWER_RECEIVED", "SILENCE_DETECTED", "INTERRUPTION_DETECTED", "TIMEOUT"];
  const sessions = ["sess-1", "sess-2", "sess-3", "sess-4", "sess-5"];

  let timestamp = 1600000000000;

  for (let i = 1; i <= numEvents; i++) {
    timestamp += prng.nextRange(100, 5000); // monotonic increase
    const sessionId = sessions[prng.nextRange(0, sessions.length - 1)];
    const type = i === numEvents ? "SESSION_ENDED" : types[prng.nextRange(0, types.length - 1)];

    const event = {
      eventId: `evt-${i}-${prng.nextRange(1000, 9999)}`,
      sessionId,
      timestamp,
      sequence: i, // We can simulate gaps by occasionally skipping, but let's keep sequence mostly monotonic
      source: "stress-test",
      type,
    };

    stream.push(event);

    // Simulate duplicates (approx 2% chance)
    if (prng.next() < 0.02 && i < numEvents) {
      stream.push({ ...event }); // exact duplicate
    }
    
    // Simulate gaps (approx 1% chance, just increment i without pushing an event)
    if (prng.next() < 0.01 && i < numEvents) {
      i++;
    }
  }

  return stream;
};

async function runStressTest() {
  console.log("🚀 Starting ReplayStressTest...");
  console.log("Generating 100k events...");
  const STREAM_SIZE = 100000;
  
  // Generating identical streams for both runs
  const stream1 = generateEventStream(STREAM_SIZE, 42);
  const stream2 = generateEventStream(STREAM_SIZE, 42);

  // Assert stream generator is deterministic
  if (stream1.length !== stream2.length) {
    throw new Error("PRNG is not deterministic!");
  }

  console.log(`Stream generated with ${stream1.length} events (including duplicates).`);

  async function processStream(stream: any[], label: string) {
    console.time(`⏱️  Run ${label}`);
    let orchestrator = new RuntimeOrchestrator(
      RuntimeEventBus.create(),
      createMockFsm() as any
    );
    
    let finalHash = "";
    // Process events
    for (let i = 0; i < stream.length; i++) {
      const res = await orchestrator.process(stream[i]);
      orchestrator = res.nextOrchestrator;
      finalHash = res.replayHash;
      
      if (i > 0 && i % 25000 === 0) {
        console.log(`  [${label}] Processed ${i} events...`);
      }
    }
    console.timeEnd(`⏱️  Run ${label}`);
    return finalHash;
  }

  const hash1 = await processStream(stream1, "A");
  const hash2 = await processStream(stream2, "B");

  console.log("\n📊 Results:");
  console.log(`Hash Run A: ${hash1}`);
  console.log(`Hash Run B: ${hash2}`);

  if (hash1 === hash2) {
    console.log("✅ SUCCESS: hashRun1 === hashRun2");
    console.log("The deterministic kernel is rock solid.");
    process.exit(0);
  } else {
    console.error("❌ FAILURE: Hashes do not match!");
    process.exit(1);
  }
}

runStressTest().catch((err) => {
  console.error("Fatal error during stress test:", err);
  process.exit(1);
});
