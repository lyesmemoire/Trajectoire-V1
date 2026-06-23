import { ContinuousChaosEngine } from "./ContinuousChaosEngine";
import { ByzantineConsensusEngine } from "../bft/ByzantineConsensus";
import { AutoScorer } from "../scoring/AutoScorer";
import { NodeManager } from "../healing/NodeManager";
import { CertificationLocker } from "../locker/CertificationLocker";
import { ITimer } from "../ports/IInfra";

/**
 * Core engine that runs a full certification cycle on each tick.
 * For simplicity, many sub‑components are injected as `any` or light wrappers.
 */
export class ContinuousCertificationEngine {
  private running = true;
  private tickId = 0;

  constructor(
    private readonly timer: ITimer,
    private chaosEngine: ContinuousChaosEngine,
    private consensusEngine: ByzantineConsensusEngine,
    private scoringEngine: AutoScorer,
    private healingEngine: NodeManager,
    private locker: CertificationLocker,
    private maxTicks: number = 10 // safety bound
  ) {}

  async start() {
    console.log("🚀 Continuous Certification Engine STARTED");
    while (this.running && this.tickId < this.maxTicks) {
      await this.tick();
      await this.sleep(500); // paced ticks
    }
    console.log("🛑 Continuous Certification Engine STOPPED after", this.tickId, "ticks");
  }

  async tick() {
    this.tickId++;
    console.log(`\n🔁 CERT TICK #${this.tickId}`);

    // 1. Chaos injection (rates for this tick – not used further in this minimal demo)
    const chaosParams = this.chaosEngine.inject();
    console.log("Chaos params:", chaosParams);

    // 2. Run consensus – here we just simulate by invoking locker on each node via healing manager
    const nodeResults = this.healingEngine.runRound().results; // dummy results
    const consensus = this.consensusEngine.compute(nodeResults);
    console.log("Consensus result:", consensus);

    // 3. Certification lock (produces rootHash)
    const lock = this.locker.lock();
    console.log("Lock rootHash:", lock.rootHash);

    // 4. Scoring (uses dummy metrics & faultTrace)
    const score = this.scoringEngine.score({
      metrics: {},
      faultTrace: { runId: "dummy", events: [], summary: { total: 0, critical: 0, warnings: 0 } },
    });
    console.log("Score:", score);

    // 5. Healing step – evict/recover based on consensus (simplified)
    const healing = this.healingEngine.healAndRecertify();
    console.log("Healing round:", healing);

    // 6. Stream output (simple console)
    this.stream({ tick: this.tickId, score, consensus, lockRoot: lock.rootHash });
  }

  stream(data: any) {
    console.log("📊 LIVE CERT SCORE:", data);
  }

  stop() {
    this.running = false;
  }

  private sleep(ms: number) {
    return new Promise((r) => this.timer.setTimeout(r, ms));
  }
}
