// @ts-nocheck
export interface TraceNode {
  id: string;
  type: string;
}

export interface TraceEdge {
  from: string;
  to: string;
}

export interface TraceGraph {
  sessionId: string;
  nodes: TraceNode[];
  edges: TraceEdge[];
}
