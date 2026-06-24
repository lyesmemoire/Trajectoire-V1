
export type DecisionAction =
  | { type: "CRITICAL_STOP" }
  | { type: "THROTTLE" }
  | { type: "DEGRADE" }
  | { type: "NETWORK_DEFENSIVE" }
  | { type: "REJECT_BACKPRESSURE" }
  | { type: "NONE" };

export interface DecisionInput {
  healthScore: number;
  lastGovernorAction?: string;
  currentState?: any; // Made optional for tests

  // Phase 6.6: Causal network metrics
  localLamportClock?: number;
  lastReceivedMessageClock?: number;
  lamportGap?: number;
  
  // Phase 7: Contextual metrics
  queueSize?: number;
  timeSinceLastMessage?: number;
  recentErrors?: number;
}

/**
 * Pure function that evaluates control plane metrics and returns the 
 * deterministic action the control plane should take.
 */
export function decideNextAction(input: DecisionInput): DecisionAction {
  // Critical faults supersede everything
  if (input.lastGovernorAction === "STOP" || input.healthScore < 20) {
    return { type: "CRITICAL_STOP" };
  }

  // Throttle request from governor
  if (input.lastGovernorAction === "THROTTLE") {
    return { type: "THROTTLE" };
  }

  // Minor health degradation
  if (input.healthScore < 30) {
    return { type: "DEGRADE" };
  }

  return { type: "NONE" };
}
