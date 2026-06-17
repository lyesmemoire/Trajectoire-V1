import { performance } from "perf_hooks";
import { EventRouter } from "../utils/EventRouter";
import { RuntimeEventBus } from "./RuntimeEventBus";
import { RetryPolicy } from "../policies/RetryPolicy";
import { TimeoutPolicy } from "../policies/TimeoutPolicy";
import { CancellationPolicy } from "../policies/CancellationPolicy";
import type { InterviewRuntimeEvent } from "../types/InterviewRuntimeEvent";
import { DeduplicationFilter } from "./DeduplicationFilter";
import type { DeterministicTransitionResult } from "../engine/DeterministicTransitionResult";
import { deepFreeze } from "../../utils/deepFreeze";
import { RuntimeValidationSystem } from "../../validation/RuntimeValidationSystem";
import { RuntimeGuardEngine } from "../../guards/RuntimeGuardEngine";
import { noSelfTransitionGuard, validEventGuard } from "../../guards/defaultGuards";
import { runtime_fsm_guard_rejections_total, runtime_orchestrator_duration_ms } from "../../fsm/metrics/RuntimeMetrics";
import { CircuitBreakerRegistry } from "../../circuit/CircuitBreakerRegistry";
import { ChaosEngine, ChaosConfig } from "@chaos/ChaosEngine";

export interface IFsmEngine {
  transition(sequence: number, event: any): DeterministicTransitionResult<any, any>;
}

export type RetryPolicyResult = ReturnType<typeof RetryPolicy.apply>;
export type TimeoutPolicyResult = ReturnType<typeof TimeoutPolicy.apply>;
export type CancellationPolicyResult = ReturnType<typeof CancellationPolicy.apply>;

export type OrchestrationResult = {
  event: InterviewRuntimeEvent;
  transitionId: string;
  replayHash: string;
  snapshot: unknown;
  policiesApplied: {
    retry: RetryPolicyResult;
    timeout: TimeoutPolicyResult;
    cancellation: CancellationPolicyResult;
  };
  orchestrationTraceEntry: Readonly<{
    event: InterviewRuntimeEvent;
    transitionId: string;
    replayHash: string;
  }>;
  nextOrchestrator: RuntimeOrchestrator;
  isDuplicate: boolean;
};

export class RuntimeOrchestrator {
  private readonly bus: RuntimeEventBus;
  private readonly fsm: IFsmEngine;
  private readonly dedupFilter: DeduplicationFilter;
  private readonly validator: RuntimeValidationSystem;
  private readonly guardEngine: RuntimeGuardEngine;
  private readonly circuit: CircuitBreakerRegistry;
  private readonly chaosEngine: ChaosEngine;

  constructor(bus: RuntimeEventBus, fsm: IFsmEngine, dedupFilter?: DeduplicationFilter) {
    this.bus = bus;
    this.fsm = fsm;
    this.dedupFilter = dedupFilter ?? new DeduplicationFilter();
    this.validator = new RuntimeValidationSystem();
    this.guardEngine = new RuntimeGuardEngine();
    this.circuit = new CircuitBreakerRegistry();
    this.guardEngine.register(noSelfTransitionGuard);
    this.guardEngine.register(validEventGuard);

    const chaosConfig: ChaosConfig = {
      enabled: process.env.CHAOS_ENABLED === "true",
      mode: (process.env.CHAOS_MODE as any) ?? "PAYLOAD_TAMPER",
      intensity: Number(process.env.CHAOS_INTENSITY ?? 0.1),
      seed: Number(process.env.CHAOS_SEED ?? 1337),
    };
    this.chaosEngine = new ChaosEngine(chaosConfig);
  }

  public async process(rawEvent: unknown): Promise<OrchestrationResult> {
    const end = runtime_orchestrator_duration_ms.startTimer();
    try {
      const chaosResult = this.chaosEngine.apply(rawEvent as any);
      if (chaosResult === null) {
        console.warn(`[RuntimeOrchestrator] Event dropped by chaos`);
        const dummyEvent = EventRouter.route(rawEvent);
        return {
          event: dummyEvent,
          transitionId: "CHAOS_DROP",
          replayHash: "chaos-drop",
          snapshot: null,
          policiesApplied: {
            retry: RetryPolicy.apply(rawEvent as any, "CHAOS_DROP"),
            timeout: TimeoutPolicy.apply(this.bus.getLastSequence(), this.bus.getLastSequence()),
            cancellation: CancellationPolicy.apply(rawEvent as any),
          },
          orchestrationTraceEntry: deepFreeze({
            event: dummyEvent,
            transitionId: "CHAOS_DROP",
            replayHash: "chaos-drop",
          }),
          nextOrchestrator: this,
          isDuplicate: false,
        };
      }

      const events = Array.isArray(chaosResult) ? chaosResult : [chaosResult];
      const event = EventRouter.route(events[0]);

      const [isDuplicate, nextDedupFilter] = this.dedupFilter.checkAndAdd(event);
      if (isDuplicate) {
        return {
          event,
          transitionId: "DUPLICATE", 
          replayHash: "mock-hash-" + this.bus.getLastSequence(),
          snapshot: null,
          policiesApplied: {
            retry: RetryPolicy.apply(event, "DUPLICATE"),
            timeout: TimeoutPolicy.apply(this.bus.getLastSequence(), this.bus.getLastSequence()),
            cancellation: CancellationPolicy.apply(event),
          },
          orchestrationTraceEntry: deepFreeze({
            event,
            transitionId: "DUPLICATE",
            replayHash: "mock-hash-" + this.bus.getLastSequence(),
          }),
          nextOrchestrator: this,
          isDuplicate: true
        };
      }

      const guardResult = this.guardEngine.evaluate({
        from: "unknown",
        to: "unknown",
        event,
        state: null,
      });

      if (!guardResult.allowed) {
        runtime_fsm_guard_rejections_total.inc({ guard: guardResult.reason ?? "UNKNOWN" });
        return {
          event,
          transitionId: "GUARD_REJECTED",
          replayHash: "guard-reject",
          snapshot: null,
          policiesApplied: {
            retry: RetryPolicy.apply(event, "GUARD_REJECTED"),
            timeout: TimeoutPolicy.apply(this.bus.getLastSequence(), this.bus.getLastSequence()),
            cancellation: CancellationPolicy.apply(event),
          },
          orchestrationTraceEntry: deepFreeze({
            event,
            transitionId: "GUARD_REJECTED",
            replayHash: "guard-reject",
          }),
          nextOrchestrator: this,
          isDuplicate: false,
        };
      }

      const key = `${event.type}:${event.eventId ?? "unknown"}`;
      const breaker = this.circuit.get(key);
      if (!breaker.allow()) {
        throw new Error(`CIRCUIT_OPEN:${key}`);
      }

      let transitionResult;
      try {
        const nextBus = this.bus.append(event);
        const start = performance.now();
        const { transitionId, nextState } = this.fsm.transition(nextBus.getLastSequence(), event);
        const duration = performance.now() - start;
        breaker.success();
        transitionResult = { nextBus, transitionId, newState: nextState };
      } catch (err) {
        breaker.failure();
        throw err;
      }
      const { nextBus, transitionId, newState } = transitionResult;

      const fsmResult = this.validator.validate({
        from: "unknown",
        to: (newState && (newState as any).name) || "unknown",
        event,
      } as any);

      if (!fsmResult.ok) {
        console.error("FSM validation errors:", fsmResult.errors);
      }

      const replayHash = "mock-hash-" + nextBus.getLastSequence();
      const debugResult = { replayHash, snapshot: newState };

      const retryResult = RetryPolicy.apply(event, transitionId);
      const timeoutResult = TimeoutPolicy.apply(
        nextBus.getLastSequence(),
        nextBus.getLastSequence(),
      );
      const cancellationResult = CancellationPolicy.apply(event);

      const traceEntry = deepFreeze({
        event,
        transitionId,
        replayHash: debugResult.replayHash,
      });

      const nextOrchestrator = new RuntimeOrchestrator(nextBus, this.fsm, nextDedupFilter);

      return {
        event,
        transitionId,
        replayHash: debugResult.replayHash,
        snapshot: debugResult.snapshot,
        policiesApplied: {
          retry: retryResult,
          timeout: timeoutResult,
          cancellation: cancellationResult,
        },
        orchestrationTraceEntry: traceEntry,
        nextOrchestrator,
        isDuplicate: false
      };
    } finally {
      end();
    }
  }
}
