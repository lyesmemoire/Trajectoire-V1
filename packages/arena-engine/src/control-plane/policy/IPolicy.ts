import { DecisionInput, DecisionAction } from "./DecisionPolicy";
import { PolicyGenome } from "../../evolution/types";

export interface PolicyState {
  genome: Readonly<PolicyGenome>;
  internalState?: unknown;
}

export interface IPolicy {
  decide(input: DecisionInput): DecisionAction;
  serialize(): PolicyState;
  restore(state: PolicyState): void;
  getGenome(): Readonly<PolicyGenome>;
}
