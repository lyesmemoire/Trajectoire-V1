import { IPolicy, PolicyState } from "./IPolicy";
import { DecisionInput, DecisionAction } from "./DecisionPolicy";
import { PolicyGenome } from "../../evolution/types";

export class DefaultThresholdPolicy implements IPolicy {
  private genome: PolicyGenome;

  constructor(genome?: PolicyGenome) {
    if (genome) {
      this.genome = structuredClone(genome);
    } else {
      // Default historical thresholds
      this.genome = {
        version: 1,
        parameters: {
          criticalThreshold: 20,
          degradeThreshold: 30
        }
      };
    }
  }

  decide(input: DecisionInput): DecisionAction {
    const criticalThreshold = this.genome.parameters['criticalThreshold'];
    const degradeThreshold = this.genome.parameters['degradeThreshold'];

    if (input.lastGovernorAction === "STOP" || input.healthScore < criticalThreshold) {
      return { type: "CRITICAL_STOP" };
    }

    if (input.lastGovernorAction === "THROTTLE") {
      return { type: "THROTTLE" };
    }

    if (input.healthScore < degradeThreshold) {
      return { type: "DEGRADE" };
    }

    return { type: "NONE" };
  }

  serialize(): PolicyState {
    return {
      genome: structuredClone(this.genome)
    };
  }

  restore(state: PolicyState): void {
    this.genome = structuredClone(state.genome);
  }

  getGenome(): Readonly<PolicyGenome> {
    return structuredClone(this.genome);
  }
}
