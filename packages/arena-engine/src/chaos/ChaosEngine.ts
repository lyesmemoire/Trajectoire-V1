/**
 * src/chaos/ChaosEngine.ts — Universal Enterprise Chaos Engineering Engine harnessed for LGTM Stack
 *
 * Architecture (Staff SRE / Distributed Real-Time Bastion):
 * 1. Unified Injection: Simulates OpenAI down, Deepgram down, ElevenLabs down, Redis down, PostgreSQL down, Supabase down, and WebSocket Gateway overload.
 * 2. Blast Radius Enforcement: Absolute preservation of real users. Chaos faults only engage on synthetic canary candidates, test tenants, or in non-production test harnesses.
 * 3. Probes & Metrics: Asserts exact retries, fallback activation, Circuit Breakers (FinOps & DBRE), graceful degradation, and SLO burn rates.
 * 4. Hybrid Tooling Ready: Exposes JSON/YAML export contracts compatible with Litmus Chaos and Gremlin platforms.
 * 5. Full Backward Compatibility: Transparent preservation of existing distributed SIL stream fault modes.
 */

import { IChaosInfra, ICounter, IHistogram } from "../ports/IInfra";

// ── Chaos Configuration Data Types ────────────────────────────

export type CoreStreamChaosMode =
  | "ORDER_CORRUPTION"
  | "PAYLOAD_TAMPER"
  | "EVENT_DUPLICATION"
  | "EVENT_DROP"
  | "TIMESTAMP_SKEW"
  | "STATE_NOISE";

export type InfrastructureChaosTarget =
  | "OpenAI"
  | "Deepgram"
  | "ElevenLabs"
  | "Redis"
  | "PostgreSQL"
  | "Supabase"
  | "WebSocketGateway";

export type InfrastructureFailureType =
  | "TIMEOUT"
  | "HTTP_503"
  | "CONNECTION_REFUSED"
  | "LATENCY_SPIKE"
  | "POOL_EXHAUSTION"
  | "EVENT_LOOP_STARVATION";

export interface ChaosConfig {
  enabled: boolean;
  mode: CoreStreamChaosMode | "INFRASTRUCTURE_BLAST";
  intensity: number; // 0.0 → 1.0 failure probability
  seed?: number;
  infrastructureTarget?: InfrastructureChaosTarget;
  failureType?: InfrastructureFailureType;
  injectedLatencyMs?: number; // For LATENCY_SPIKE
}

// ── Master Chaos Fault Injection & Resilience Runner ──────────

export class ChaosEngine {
  private faultsCounter: ICounter;
  private mitigationLatencyMs: IHistogram;

  constructor(private config: ChaosConfig, private infra: IChaosInfra) {
    
    this.faultsCounter = this.infra.metrics.createCounter({
      name: "trajectoire_chaos_faults_injected_total",
      help: "Total number of simulated infrastructure faults injected to verify SRE sub-system resilience",
      labelNames: ["target_service", "failure_type", "blast_radius"],
    });

    this.mitigationLatencyMs = this.infra.metrics.createHistogram({
      name: "trajectoire_chaos_mitigation_latency_ms",
      help: "Execution latency of asserting retries, Circuit Breaker auto-trips, and graceful fallback modes under chaos fault simulation",
      buckets: [1, 5, 15, 50, 100, 250, 500, 1000],
      labelNames: ["target_service", "mitigation_mode"],
    });
  }

  private shouldTrigger(): boolean {
    if (!this.config.enabled) return false;
    return this.infra.random.next() < this.config.intensity;
  }

  /**
   * Blast Radius Verification Gate. Guaranteed preservation of real active production users.
   * Activation exclusively on synthetic testers, explicit chaos canary profiles, or test tenants.
   */
  public isChaosAllowedForUser(userId: string, tenantDid?: string): boolean {
    if (this.infra.env.NODE_ENV === "test") return true;

    if (this.infra.env.NODE_ENV === "production" && this.infra.env.get("ENABLE_PRODUCTION_CHAOS") !== "true") {
      return false; // Absolute barrier for open real traffic
    }

    if (
      userId.startsWith("test_") ||
      userId.startsWith("synthetic_") ||
      userId === "chaos_canary" ||
      userId === "synthetic_canary_candidate"
    ) {
      return true;
    }

    if (tenantDid === "did:trajectoire:tenant:chaos_lab") {
      return true;
    }

    return false;
  }

  /**
   * Apply distributed stream mutations for SIL events.
   * Full transparent backward compatibility with legacy Spec suites.
   */
  public apply<T extends Record<string, unknown>>(event: T): T | T[] | null {
    if (!this.shouldTrigger() || this.config.mode === "INFRASTRUCTURE_BLAST") return event;

    switch (this.config.mode) {
      case "EVENT_DROP":
        return null;

      case "EVENT_DUPLICATION":
        return [event, structuredClone(event)] as unknown as T | T[];

      case "PAYLOAD_TAMPER":
        return {
          ...event,
          payload: {
            ...(event as Record<string, Record<string, unknown>>).payload,
            _chaos_tampered: true,
          },
        } as T;

      case "TIMESTAMP_SKEW":
        return {
          ...event,
          timestamp: this.infra.clock.now() + 86400000, // +24 hours
        } as T;

      case "ORDER_CORRUPTION":
        return {
          ...event,
          _order: Math.floor(this.infra.random.next() * 100000),
        } as T;

      case "STATE_NOISE":
        return {
          ...event,
          _chaos_noise: this.infra.random.next().toString(36),
        } as T;

      default:
        return event;
    }
  }

  /**
   * Core Programmatic Chaos Experiment Execution Runner.
   *
   * @param target Sub-system target (e.g. "OpenAI", "PostgreSQL", "WebSocketGateway")
   * @param failure Failure mode ("TIMEOUT", "HTTP_503", "CONNECTION_REFUSED", "POOL_EXHAUSTION", "LATENCY_SPIKE")
   * @param userId Active profile identifier to assert strict Blast Radius safety
   * @param actualOperation Real resilient operation callback wrapped under test
   * @param assertMitigation Callback asserting retries, Circuit Breaker trips, graceful fallbacks, and SLO adherence
   */
  public async executeChaosExperiment<T>(
    target: InfrastructureChaosTarget,
    failure: InfrastructureFailureType,
    userId: string,
    actualOperation: () => Promise<T>,
    assertMitigation: (error: unknown, durationMs: number) => Promise<T>
  ): Promise<T> {
    const t0 = performance.now();

    // 1. Precise Blast Radius Screening
    if (!this.config.enabled || !this.isChaosAllowedForUser(userId)) {
      return await actualOperation(); // Execute normal unhindered operation for real users
    }

    const log = this.infra.loggerFactory.createChildLogger({ targetService: target, failureType: failure, userId, component: "chaos-engine" });
    log.warn({ event: "chaos_fault_simulation_initialized" }, `Simulating external infrastructure target failure (${target} -> ${failure})`);

    return await this.infra.tracer.startActiveSpan(`chaos_simulation_${target.toLowerCase()}_${failure.toLowerCase()}`, async (span) => {
      span.setAttribute("chaos.target", target);
      span.setAttribute("chaos.failure", failure);
      span.setAttribute("user.id", userId);

      this.faultsCounter.labels(target, failure, userId.startsWith("synthetic_") ? "SyntheticCanary" : "TestHarness").inc();

      this.infra.errorReporter.addBreadcrumb({
        category: "chaos.experiment",
        message: `Chaos Simulation active on ${target}: injecting ${failure}`,
        level: "warning",
        data: { target, failure, userId },
      });

      // 2. Programmatic Fault Injection Execution
      try {
        if (failure === "TIMEOUT") {
          if (this.config.injectedLatencyMs !== 0) {
            await new Promise((resolve) => this.infra.timer.setTimeout(resolve, this.config.injectedLatencyMs ?? 5000));
          }
          throw new Error(`[Chaos Simulated] ${target} external API response timeout exceeded`);
        } else if (failure === "HTTP_503") {
          throw new Error(`[Chaos Simulated] ${target} external API returned HTTP 503 Service Unavailable`);
        } else if (failure === "CONNECTION_REFUSED") {
          const err = new Error(`[Chaos Simulated] connect ECONNREFUSED ${target.toLowerCase()}.trajectoire.internal:443`);
          (err as { code?: string }).code = "ECONNREFUSED";
          throw err;
        } else if (failure === "POOL_EXHAUSTION") {
          throw new Error(`[Chaos Simulated] FATAL: ${target} connection pool max_connections limit breached (1000 active instances)`);
        } else if (failure === "EVENT_LOOP_STARVATION") {
          // Synchronous CPU blocking loop
          const end = performance.now() + (this.config.injectedLatencyMs ?? 200);
          while (performance.now() < end) { /* sync block */ }
          throw new Error(`[Chaos Simulated] WebSocket Gateway Event Loop Starvation Attack Executed (${this.config.injectedLatencyMs ?? 200}ms CPU freeze)`);
        } else if (failure === "LATENCY_SPIKE") {
          if (this.config.injectedLatencyMs !== 0) {
            await new Promise((resolve) => this.infra.timer.setTimeout(resolve, this.config.injectedLatencyMs ?? 1500));
          }
          return await actualOperation(); // Return successful after heavy latency addition
        }
        
        return await actualOperation();
      } catch (injectedError) {
        // 3. Execution of Assertive SRE Mitigation Validation Callback
        const durationMs = performance.now() - t0;
        span.setAttribute("mitigation.latency_ms", durationMs);
        this.mitigationLatencyMs.labels(target, "AssertResilience").observe(durationMs);

        log.error({ err: injectedError, durationMs }, "Chaos simulated fault successfully intercepted. Triggering autonomous SRE fallback and Circuit Breaker validation callbacks.");

        try {
          const mitigationResult = await assertMitigation(injectedError, durationMs);
          span.setStatus({ code: 1 });
          return mitigationResult;
        } catch (mitigationBreachError) {
          log.error({ err: mitigationBreachError }, `CRITICAL: SRE resilience mechanisms failed to contain simulated chaos fault on target ${target}`);
          span.setStatus({ code: 2, message: String(mitigationBreachError) });
          throw mitigationBreachError;
        }
      } finally {
        span.end();
      }
    });
  }
}

// ── Open Enterprise Tooling Specifications Contracts (Litmus / Gremlin) ──

export interface EnterpriseChaosHarnessContract {
  experimentId: string;
  experimentName: string;
  platform: "Gremlin" | "LitmusChaos";
  targetCapability: InfrastructureChaosTarget;
  injectedFailure: InfrastructureFailureType;
  blastRadiusGuards: string[];
  automatedRollbackTriggers: string[];
}

/**
 * Enterprise Canonical Tooling Definitions.
 * Exportable YAML/JSON structures ready for integration into GitOps Chaos pipelines.
 */
export const ENTERPRISE_CHAOS_HARNESS_SPECIFICATIONS: EnterpriseChaosHarnessContract[] = [
  {
    experimentId: "litmus_openai_outage_resilience",
    experimentName: "OpenAI Core ML Outage Auto-Breaker and Mock Recovery Verification",
    platform: "LitmusChaos",
    targetCapability: "OpenAI",
    injectedFailure: "HTTP_503",
    blastRadiusGuards: ['HTTP Header x-chaos-blast-radius: synthetic_candidate', 'Profile ID starts with synthetic_'],
    automatedRollbackTriggers: ['Prometheus Metric: trajectoire_slo_error_budget_remaining_percent < 50.0'],
  },
  {
    experimentId: "gremlin_deepgram_asr_pool_exhaustion",
    experimentName: "Deepgram ASR Socket Connection Pool Drop and Text Fallback Teardown",
    platform: "Gremlin",
    targetCapability: "Deepgram",
    injectedFailure: "CONNECTION_REFUSED",
    blastRadiusGuards: ['Environment Variable ENABLE_PRODUCTION_CHAOS=true', 'Canary Session Only'],
    automatedRollbackTriggers: ['Prometheus Metric: trajectoire_ws_message_flood{frame_type="stt_error"} > 50'],
  },
  {
    experimentId: "litmus_elevenlabs_tts_latency_spike",
    experimentName: "TwelveLabs Voice Synthesis Latency Spike (>3s) and Silent WAV Auto-Replacement",
    platform: "LitmusChaos",
    targetCapability: "ElevenLabs",
    injectedFailure: "LATENCY_SPIKE",
    blastRadiusGuards: ['Staging Environment Exclusive (https://staging.trajectoire.app)'],
    automatedRollbackTriggers: ['Prometheus Metric: trajectoire_finops_circuit_breaker_trips_total > 5'],
  },
  {
    experimentId: "gremlin_postgresql_db_starvation",
    experimentName: "PostgreSQL Database Max_Connections Breach and Exponential Backoff Assert Logic",
    platform: "Gremlin",
    targetCapability: "PostgreSQL",
    injectedFailure: "POOL_EXHAUSTION",
    blastRadiusGuards: ['Synthetic Testing Worker Sockets Only'],
    automatedRollbackTriggers: ['Prometheus Target Up Check: up{job="postgresql"} == 0'],
  },
  {
    experimentId: "litmus_redis_cache_outage",
    experimentName: "Upstash Redis Cache Tripped Failure and Ingestion Shield Fail-Open Performance",
    platform: "LitmusChaos",
    targetCapability: "Redis",
    injectedFailure: "TIMEOUT",
    blastRadiusGuards: ['Non-Production Kubernetes Cluster exclusive'],
    automatedRollbackTriggers: ['Sentry Fatal Alert Rate > 10 errors/min'],
  },
  {
    experimentId: "gremlin_ws_gateway_event_loop_starvation",
    experimentName: "WebSocket Realtime Gateway CPU Saturation Loop Attack and Auto Disconnect Guard",
    platform: "Gremlin",
    targetCapability: "WebSocketGateway",
    injectedFailure: "EVENT_LOOP_STARVATION",
    blastRadiusGuards: ['Load Testing Harness Spec (stress-test-bypass token active)'],
    automatedRollbackTriggers: ['Fastify Heartbeat Health Endpoint HTTP/503'],
  },
];
