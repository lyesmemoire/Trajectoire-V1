import { IPolicy, PolicyState } from "./IPolicy";
import { DecisionInput, DecisionAction } from "./DecisionPolicy";
import { PolicyGenome } from "../../evolution/types";

/**
 * CausalThresholdPolicy — A policy that reacts to causal anomalies
 * detected via Lamport Clock gaps.
 * 
 * Genome parameters:
 * - criticalThreshold: healthScore below this → CRITICAL_STOP
 * - degradeThreshold: healthScore below this → DEGRADE
 * - maxAllowedLamportGap: causal gap above this → NETWORK_DEFENSIVE
 * - lamportPenaltyFactor: multiplier applied to lamportGap to reduce effective healthScore
 * - ignoreStaleProbability: probability [0,1] of silently ignoring a stale message
 *   (allows the GA to discover trade-offs between paranoia and throughput)
 * 
 * The GA optimizes these parameters to find the best trade-off between
 * resilience (reacting to chaos) and stability (avoiding false positives).
 */
export class CausalThresholdPolicy implements IPolicy {
  private genome: PolicyGenome;

  constructor(genome?: PolicyGenome) {
    if (genome) {
      this.genome = structuredClone(genome);
    } else {
      this.genome = {
        version: 2,
        parameters: {
          criticalThreshold: 20,
          degradeThreshold: 30,
          maxAllowedLamportGap: 10,
          lamportPenaltyFactor: 1.0,
          ignoreStaleProbability: 0.0,
          burstDetectionThreshold: 50,
          burstToleranceMultiplier: 1.0, // Default: no reduction
        },
      };
    }
  }

  decide(input: DecisionInput): DecisionAction {
    const { 
      criticalThreshold, 
      degradeThreshold, 
      maxAllowedLamportGap, 
      lamportPenaltyFactor,
      burstDetectionThreshold = 50,
      burstToleranceMultiplier = 1.0
    } = this.genome.parameters;

    // 1. Context-Aware Burst Detection (Continuous Modulation)
    const queueSize = input.queueSize ?? 0;
    const rawIntensity = queueSize / burstDetectionThreshold;
    const burstIntensity = Math.max(0, Math.min(1, rawIntensity)); // clamp between 0 and 1

    // 2. Compute effective health with context-aware causal penalty
    const activePenaltyFactor = lamportPenaltyFactor * (1 - burstIntensity * (1 - burstToleranceMultiplier));
    
    const lamportGap = input.lamportGap ?? 0;
    const causalPenalty = lamportGap * activePenaltyFactor;
    const effectiveHealth = input.healthScore - causalPenalty;

    // 1.5 Phase 8C Load Shedding (Back-Pressure)
    if (this.genome.parameters.backpressureThreshold !== undefined && queueSize > this.genome.parameters.backpressureThreshold) {
      return { type: "REJECT_BACKPRESSURE" };
    }

    // 2. Critical faults supersede everything
    if (input.lastGovernorAction === "STOP" || effectiveHealth < criticalThreshold) {
      return { type: "CRITICAL_STOP" };
    }

    // 3. Causal anomaly detection — network-level defense
    if (lamportGap > maxAllowedLamportGap) {
      return { type: "NETWORK_DEFENSIVE" };
    }

    // 4. Governor throttle
    if (input.lastGovernorAction === "THROTTLE") {
      return { type: "THROTTLE" };
    }

    // 5. Health degradation (including causal penalty)
    if (effectiveHealth < degradeThreshold) {
      return { type: "DEGRADE" };
    }

    return { type: "NONE" };
  }

  serialize(): PolicyState {
    return {
      genome: structuredClone(this.genome),
    };
  }

  restore(state: PolicyState): void {
    this.genome = structuredClone(state.genome);
  }

  getGenome(): Readonly<PolicyGenome> {
    return structuredClone(this.genome);
  }
}

