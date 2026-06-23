import { TraceGraph, TraceNode, TraceEdge } from "../../contracts/trace-graph";
import { EventQueryService } from "../../contracts/query";

export class TraceGraphBuilder {
  constructor(private readonly query: EventQueryService) {}

  async build(tenantId: string, sessionId: string): Promise<TraceGraph> {
    const events = await this.query.getSessionEvents(tenantId, sessionId);
    
    // Sort events to ensure deterministic temporal ordering
    const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);

    const nodes: TraceNode[] = [];
    const edges: TraceEdge[] = [];
    
    let previousNodeId: string | null = null;

    for (const event of sortedEvents) {
      const nodeId = event.eventId;
      nodes.push({
        id: nodeId,
        type: event.type
      });

      if (previousNodeId) {
        edges.push({
          from: previousNodeId,
          to: nodeId
        });
      }

      previousNodeId = nodeId;
    }

    return {
      sessionId,
      nodes,
      edges
    };
  }
}
