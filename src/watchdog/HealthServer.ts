import * as http from "http";
import { GlobalStateStore, GlobalStateSnapshot } from "../observability/GlobalStateStore";

/**
 * HealthServer provides a lightweight HTTP endpoint that returns the current global state snapshot.
 * To avoid blocking the control plane, the snapshot is cached and refreshed at a fixed interval.
 */
export class HealthServer {
  private cachedSnapshot: GlobalStateSnapshot | null = null;
  private cacheIntervalMs: number;

  constructor(private port: number = 8089, cacheIntervalMs: number = 500) {
    this.cacheIntervalMs = cacheIntervalMs;
    // Pre‑populate cache
    this.refreshCache();
    // Periodically refresh without blocking event loop
    setInterval(() => this.refreshCache(), this.cacheIntervalMs);
  }

  private refreshCache() {
    this.cachedSnapshot = GlobalStateStore.snapshot();
  }

  public start() {
    const server = http.createServer((_req, res) => {
      if (!this.cachedSnapshot) {
        res.writeHead(503, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "snapshot not ready" }));
        return;
      }
      const payload = {
        health: 1, // placeholder – can be computed from metrics if needed
        trust: 1, // placeholder
        nodes: {
          active: this.cachedSnapshot.activeNodes,
          dead: this.cachedSnapshot.deadNodes,
        },
        queue: {
          pending: this.cachedSnapshot.queuedTasks,
        },
        timestamp: this.cachedSnapshot.timestamp,
        lastEvents: this.cachedSnapshot.lastEvents,
      };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(payload));
    });

    server.listen(this.port, () => {
      console.log(`[HealthServer] Listening on http://127.0.0.1:${this.port}/health`);
    });
  }
}
