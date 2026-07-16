// @ts-nocheck
export type NodeType =
  | "event"
  | "agent_opinion"
  | "consensus_step"
  | "override"
  | "final_decision";

export interface DecisionNode {
  id: string;
  type: NodeType;
  agent?: string;
  input: unknown;
  output: unknown;
  score?: number;
  weight?: number;
  parentIds: string[];
  timestamp: number;
}

export interface DecisionGraph {
  traceId: string;
  userId: string;
  sessionId?: string;
  nodes: DecisionNode[];
  finalDecision: {
    status: "allow" | "block" | "freeze" | "review";
    globalScore: number;
    reason: string;
  };
  createdAt: number;
}
