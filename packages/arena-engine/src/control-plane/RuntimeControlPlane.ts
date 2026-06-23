// src/control-plane/RuntimeControlPlane.ts
import { ControlPlaneState, ControlPlaneSnapshot, HealthMetrics } from "./ControlPlaneTypes";
import { HealthCalculator } from "./HealthCalculator";
import { IWorldRuntime } from "../ports/IWorldRuntime";
import { LoopGovernor } from "../governor/LoopGovernor";
import { AutonomousLoopEngine } from "../distributed/loop/AutonomousLoopEngine";
import { IHealingEngine } from "../ports/IHealing";
import { CoordinatorNode } from "../distributed/core/CoordinatorNode";
import { IClock, ITimer, TimerHandle } from "../ports/IInfra";
import { IPolicy } from "./policy/IPolicy";
import { DefaultThresholdPolicy } from "./policy/DefaultThresholdPolicy";

/**
 * RuntimeControlPlane – the single source of execution authority.
 * It maintains a simple state machine, computes a health score each tick,
 * reacts to Governor decisions, and can safely start/stop the autonomous loop.
 */
export class RuntimeControlPlane {
  private state: ControlPlaneState = ControlPlaneState.START;
  private lastGovernorAction: string | undefined = undefined;
  private tickInterval?: TimerHandle;
  private stopCallbacks: Array<() => void> = [];
  private policy: IPolicy;
  private _isTicking: boolean = false;

  constructor(
    private readonly clock: IClock,
    private readonly timer: ITimer,
    private world: IWorldRuntime,
    private engine: AutonomousLoopEngine,
    private governor: LoopGovernor,
    private healing: IHealingEngine,
    private coordinator: CoordinatorNode,
    private tickMs: number = 1000, // default tick period
    policy?: IPolicy
  ) {
    this.policy = policy ?? new DefaultThresholdPolicy();
    // Listen for governor actions emitted on the EventStreamBus
    this.world.eventBus.subscribe((event) => {
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

  public isAtSafePoint(): boolean {
    // Currently simply not in the middle of a tick
    return !this._isTicking;
  }

  public setPolicy(newPolicy: IPolicy): void {
    if (!this.isAtSafePoint()) {
      throw new Error("Policy swap only allowed at Safe Point");
    }
    this.policy = newPolicy;
  }

  /** Start the control plane – warmup then running */
  start() {
    if (this.state !== ControlPlaneState.START) return;
    this.transitionTo(ControlPlaneState.WARMUP);

    // Simple warmup delay then start engine
    this.timer.setTimeout(() => {
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
    this._isTicking = true;
    try {
      const snapshot = this.world.stateStore.snapshot();
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
      timestamp: this.clock.now(),
    };

    // Publish snapshot for observers
    this.world.eventBus.publish({
      type: "CONTROL_PLANE_SNAPSHOT",
      payload: cpSnapshot,
      ts: this.clock.now(),
    });

    // Pure decision logic via injected Policy
    const decision = this.policy.decide({
      healthScore,
      lastGovernorAction: cpSnapshot.lastGovernorAction,
      currentState: this.state,
    });

    // Execute side-effects based on decision
    switch (decision.type) {
      case "CRITICAL_STOP":
        this.handleCriticalStop();
        break;
      case "THROTTLE":
        this.engine.stop();
        this.timer.setTimeout(() => this.engine.start(), this.tickMs * 2);
        break;
      case "DEGRADE":
        this.transitionTo(ControlPlaneState.DEGRADED);
        break;
      case "NONE":
        // do nothing
        break;
    }
    } finally {
      this._isTicking = false;
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
    this.tickInterval = this.timer.setInterval(() => this.tick(), this.tickMs);
  }

  private stopTickLoop() {
    if (this.tickInterval !== undefined) {
      this.timer.clearInterval(this.tickInterval);
      this.tickInterval = undefined;
    }
  }

  serialize(): any {
    return {
      state: this.state,
      lastGovernorAction: this.lastGovernorAction,
      policyState: this.policy.serialize(),
    };
  }

  restore(data: any): void {
    this.state = data.state;
    this.lastGovernorAction = data.lastGovernorAction;
    if (data.policyState) {
      this.policy.restore(data.policyState);
    }
  }

  rehydrate(): void {
    // Only restart the tick loop if the state implies it should be running
    if (this.state === ControlPlaneState.RUNNING || this.state === ControlPlaneState.DEGRADED) {
      this.startTickLoop();
    }
  }
}
