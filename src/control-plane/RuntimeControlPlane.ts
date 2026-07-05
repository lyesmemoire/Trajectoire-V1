// src/control-plane/RuntimeControlPlane.ts
import { ControlPlaneState, ControlPlaneSnapshot, HealthMetrics } from "./ControlPlaneTypes";
import { HealthCalculator } from "./HealthCalculator";
import { EventStreamBus } from "../distributed/stream/EventStreamBus";
import { GlobalStateStore } from "../observability/GlobalStateStore";
import { LoopGovernor } from "../governor/LoopGovernor";
import { AutonomousLoopEngine } from "../distributed/loop/AutonomousLoopEngine";
// TODO: Fix circular dependency - control-plane should not import from apps
// import { HealingEngine } from "../../apps/realtime-gateway/src/voice-interview/runtime/fsm/distributed/healing/HealingEngine";
import { CoordinatorNode } from "../distributed/core/CoordinatorNode";

/**
 * RuntimeControlPlane – the single source of execution authority.
 * It maintains a simple state machine, computes a health score each tick,
 * reacts to Governor decisions, and can safely start/stop the autonomous loop.
 */
export class RuntimeControlPlane {
  private state: ControlPlaneState = ControlPlaneState.START;
  private lastGovernorAction: string | undefined = undefined;
  private tickInterval?: NodeJS.Timeout;
  private stopCallbacks: Array<() => void> = [];

  constructor(
    private engine: AutonomousLoopEngine,
    private governor: LoopGovernor,
    private healing: any, // TODO: Type properly after fixing circular dependency
    private coordinator: CoordinatorNode,
    private tickMs: number = 1000 // default tick period
  ) {
    // Listen for governor actions emitted on the EventStreamBus
    EventStreamBus.subscribe((event) => {
      if (event.type === "GOVERNOR_ACTION") {
        this.lastGovernorAction = event.action;
        // Store for snapshot
      }
    });
  }

  /** Register a callback that will be invoked when the control plane stops */
  public onStop(callback: () => void) {
    this.stopCallbacks.push(callback);
  }

  /** Start the control plane – warmup then running */
  start() {
    if (this.state !== ControlPlaneState.START) return;
    this.transitionTo(ControlPlaneState.WARMUP);

    // Simple warmup delay then start engine
    setTimeout(() => {
      this.engine.start();
      this.transitionTo(ControlPlaneState.RUNNING);
      this.startTickLoop();
    }, 500); // 0.5s warmup
  }

  /** Gracefully stop everything */
  stop() {
    this.transitionTo(ControlPlaneState.SHUTDOWN);
    this.engine.stop();
    this.healing.stop?.(); // healing may expose stop method; safe‑call
    this.stopTickLoop();
    // Notify registered callbacks
    this.stopCallbacks.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error("[RuntimeControlPlane] stop callback error", e);
      }
    });
  }

  /** Main periodic evaluation */
  private tick() {
    const snapshot = GlobalStateStore.snapshot();
    const metrics: HealthMetrics = {
      trustAvg: snapshot.activeNodes ? snapshot.activeNodes / (snapshot.activeNodes + snapshot.deadNodes) : 0,
      replaySuccessRate: 1, // placeholder – would be derived from replay engine
      nodeAvailability: snapshot.activeNodes / (snapshot.activeNodes + snapshot.deadNodes || 1),
      queueSaturation: snapshot.queuedTasks / 100, // assume 100 max capacity
      governorInterventions: this.lastGovernorAction ? 1 : 0,
    };

    const healthScore = HealthCalculator.compute(metrics);
    const cpSnapshot: ControlPlaneSnapshot = {
      state: this.state,
      healthScore,
      activeNodes: snapshot.activeNodes,
      failedNodes: snapshot.deadNodes,
      trustAvg: metrics.trustAvg,
      replaySuccessRate: metrics.replaySuccessRate,
      ...(this.lastGovernorAction !== undefined ? { lastGovernorAction: this.lastGovernorAction } : {}),
      timestamp: Date.now(),
    };

    // Publish snapshot for observers
    EventStreamBus.publish({
      type: "CONTROL_PLANE_SNAPSHOT",
      payload: cpSnapshot,
      ts: Date.now(),
    });

    // Decision logic based on healthScore and governor actions
    if (healthScore < 30) {
      this.transitionTo(ControlPlaneState.DEGRADED);
    }

    if (cpSnapshot.lastGovernorAction === "STOP" || healthScore < 20) {
      this.handleCriticalStop();
    } else if (cpSnapshot.lastGovernorAction === "THROTTLE") {
      // simple back‑off – pause engine for a tick
      this.engine.stop();
      setTimeout(() => this.engine.start(), this.tickMs * 2);
    }
  }

  private handleCriticalStop() {
    this.transitionTo(ControlPlaneState.SAFE_STOP);
    this.engine.stop();
    // optionally instruct healing to quarantine all nodes
    // (not implemented here – placeholder)
    this.stop(); // proceed to shutdown after safe stop
  }

  private transitionTo(newState: ControlPlaneState) {
    this.state = newState;
  }

  private startTickLoop() {
    this.tickInterval = setInterval(() => this.tick(), this.tickMs);
  }

  private stopTickLoop() {
    if (this.tickInterval) clearInterval(this.tickInterval);
  }
}
