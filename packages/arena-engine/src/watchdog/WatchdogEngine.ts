// src/watchdog/WatchdogEngine.ts
import { WatchdogConfig } from "./WatchdogConfig";
import { WatchdogState } from "./WatchdogState";
import { NodeHealth } from "./federation/types";
import { ProcessProbe } from "./ProcessProbe";
import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { EventEmitter } from "events";
import { IClock, ITimer, TimerHandle } from "../ports/IInfra";

/**
 * Hardened watchdog supervising the runtime process.
 * - Atomic PID lock to avoid split‑brain.
 * - Cached health failures window to reduce false positives.
 * - Separate memory‑check interval.
 * - Restart cooldown to prevent rapid restart loops.
 * - Detailed restart reason logging.
 */
export class WatchdogEngine extends EventEmitter {
  private state: WatchdogState;
  private probe: ProcessProbe;
  private failureCount = 0;
  private lastMemoryCheck = 0;
  private lockFile: string;
  private interval: TimerHandle | null = null;

  constructor(
    private readonly clock: IClock,
    private readonly timer: ITimer,
    private config: WatchdogConfig
  ) {
    super();
    this.state = {
      lastHeartbeat: this.clock.now(),
      restartCount: 0,
      lastKnownHealth: 1,
      crashDetected: false,
      lastRestartTime: 0,
    };
    this.probe = new ProcessProbe(this.config.healthEndpoint);
    // Use OS temp directory for lock file (cross‑platform safe)
    this.lockFile = path.join(os.tmpdir(), "runtime-watchdog.lock");
    this.acquireLock();
    this.setupExitHandler();
  }

  /** Acquire atomic PID lock – exit if another watchdog is running */
  private acquireLock() {
    try {
      fs.writeFileSync(this.lockFile, process.pid.toString(), { flag: "wx" });
      console.log(`[WATCHDOG] Acquired lock ${this.lockFile} (pid ${process.pid})`);
    } catch (e) {
      console.error(
        "[WATCHDOG] Another watchdog instance detected. Exiting to avoid split‑brain."
      );
      process.exit(1);
    }
  }

  /** Ensure lock file removal on process termination */
  private setupExitHandler() {
    const cleanup = () => {
      try {
        if (fs.existsSync(this.lockFile)) {
          fs.unlinkSync(this.lockFile);
        }
      } catch (_) {
        // ignore errors during cleanup
      }
    };
    process.on("exit", cleanup);
    process.on("SIGINT", () => {
      cleanup();
      process.exit(0);
    });
    process.on("SIGTERM", () => {
      cleanup();
      process.exit(0);
    });
  }

  public start() {
    // Main health probe tick
    if (!this.interval) {
      this.interval = this.timer.setInterval(() => this.tick(), this.config.tickIntervalMs);
    }
  }

  public shutdown(reason: string) {
    console.log(`[WATCHDOG] Shutting down system – reason: ${reason}`);
    if (this.interval !== null && this.interval !== undefined) {
      this.timer.clearInterval(this.interval);
      this.interval = null;
    }
    process.exit(0);
  }

  public heartbeat() {
    this.state.lastHeartbeat = this.clock.now();
  }

  public getHealthReport(): NodeHealth {
    return {
      nodeId: "self", // Requires actual node ID injection later
      health: this.state.lastKnownHealth,
      lastSeen: this.state.lastHeartbeat,
    };
  }

  public getClusterHealth(): NodeHealth[] {
    return [this.getHealthReport()];
  }

  private async tick() {
    const alive = await this.probe.ping();
    const now = this.clock.now();

    if (!alive) {
      this.state.crashDetected = true;
      this.handleFailure("CRASH");
      return;
    }

    // Derive simple health metric from ping success
    const healthValue = 1; // 1 = healthy, 0 = unhealthy (ping succeeded)
    this.state.lastKnownHealth = healthValue;
    this.state.lastHeartbeat = now;

    // Emit federation health as NodeHealth[]
    this.emit("health", [
      {
        nodeId: "self",
        health: healthValue,
        lastSeen: now,
        weight: 1,
      } as NodeHealth,
    ]);

    if (healthValue < this.config.healthFailureThreshold) {
      this.handleFailure("HEALTH_FAILURE");
    } else {
      // Reset consecutive failure count on success
      this.failureCount = 0;
    }

    // Memory check throttled
    if (now - this.lastMemoryCheck >= this.config.memoryCheckIntervalMs) {
      this.lastMemoryCheck = now;
      const memMb = process.memoryUsage().heapUsed / (1024 * 1024);
      if (memMb > this.config.memoryLimitMB) {
        this.handleFailure("MEMORY_LIMIT");
      }
    }
  }

  private handleFailure(reason: "CRASH" | "HEALTH_FAILURE" | "MEMORY_LIMIT") {
    this.failureCount++;
    console.warn(`[WATCHDOG] Failure #${this.failureCount} detected: ${reason}`);

    if (this.failureCount >= (this.config.failureWindowSize ?? 3)) {
      // Check cooldown before restarting
      const now = this.clock.now();
      if (
        now - this.state.lastRestartTime <
        this.config.minRestartIntervalMs
      ) {
        console.warn(
          `[WATCHDOG] Restart suppressed due to cooldown (${this.config.minRestartIntervalMs} ms)`
        );
        return;
      }

      if (this.state.restartCount >= this.config.maxRestarts) {
        console.error(
          `[WATCHDOG] Max restarts (${this.config.maxRestarts}) exceeded – giving up.`
        );
        return;
      }

      this.restartSystem(reason);
    }
  }

  public restartSystem(reason: string) {
    this.state.restartCount++;
    this.state.lastRestartTime = this.clock.now();
    console.log(`[WATCHDOG] Restarting system – reason: ${reason}`);
    // Spawn detached process to restart the runtime
    spawn("npm", ["run", "system:start"], {
      detached: true,
      stdio: "ignore",
    }).unref();
  }
}
