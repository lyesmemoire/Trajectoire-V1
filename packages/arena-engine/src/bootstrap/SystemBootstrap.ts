import { BootstrapConfig } from "./BootstrapConfig";
import { WatchdogEngine } from "../watchdog/WatchdogEngine";
import { FederatedWatchdog } from "../watchdog/federation/FederatedWatchdog";
import { NodeId } from "../watchdog/federation/NodeId";
import { EventEmitter } from "events";
import { NodeHealth } from "../watchdog/federation/types";
import { SystemClock } from "../infra/real/SystemClock";
import { SystemTimer } from "../infra/real/SystemTimer";

export class SystemBootstrap {
  private watchdog: WatchdogEngine | null = null;
  private fedWatchdog: FederatedWatchdog | null = null;
  private healthEmitter: EventEmitter = new EventEmitter();
  private readonly clock = new SystemClock();
  private readonly timer = new SystemTimer();

  constructor(private config: BootstrapConfig) {}

  public async start() {
    console.log("[SystemBootstrap] Initialising system...");

    this.watchdog = new WatchdogEngine(this.clock, this.timer, {
      targetProcessName: "runtime",
      tickIntervalMs: 5000,
      maxRestarts: 5,
      minRestartIntervalMs: 10000,
      memoryLimitMB: 512,
      memoryCheckIntervalMs: 10000,
      healthEndpoint: `http://127.0.0.1:${this.config.healthPort || 8089}/health`,
      healthFailureThreshold: 0.5,
    });

    this.watchdog.start();

    if (this.config.federationEnabled) {
      console.log("[SystemBootstrap] Federation enabled, starting FederatedWatchdog...");
      
      const nodeId = NodeId.get();
      
      this.watchdog.on("health", (nodes: NodeHealth[]) => {
        if (!Array.isArray(nodes)) {
          throw new Error("FATAL: invalid health contract");
        }
        this.healthEmitter.emit("health", [...nodes]); // copy to enforce immutability
      });

      this.fedWatchdog = new FederatedWatchdog(this.clock, this.timer, {
        nodeId,
        listenPort: 9000, 
        peers: ["127.0.0.1:9001", "127.0.0.1:9002"], 
        healthSource: this.healthEmitter,
      });

      this.fedWatchdog.start();
      
      this.timer.setInterval(() => {
        if (this.fedWatchdog) {
          this.fedWatchdog.tick();
        }
      }, 5000);
    }
  }

  public stop(reason: string) {
    console.log(`[SystemBootstrap] Stopping system: ${reason}`);
    if (this.watchdog) {
      this.watchdog.shutdown(reason);
    }
    
    if (this.fedWatchdog) {
      this.fedWatchdog.shutdown();
    }
  }
}
