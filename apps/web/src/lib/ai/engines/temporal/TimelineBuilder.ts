import { TemporalEvent } from "./TemporalExtractor";

// ===================================================================
// TIMELINE BUILDER — Pure TypeScript Timeline Construction
// ===================================================================

export interface TimelineNode {
  id: string;
  event: TemporalEvent;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  predecessors: string[];
  successors: string[];
  overlaps: string[];
}

export interface Timeline {
  nodes: TimelineNode[];
  edges: TimelineEdge[];
  metadata: {
    totalNodes: number;
    totalEdges: number;
    earliestDate?: Date;
    latestDate?: Date;
    totalDuration: number;
    hasOverlaps: boolean;
    hasGaps: boolean;
  };
}

export interface TimelineEdge {
  id: string;
  from: string;
  to: string;
  type: "sequential" | "parallel" | "overlap" | "gap";
  weight: number;
}

export class TimelineBuilder {
  /**
   * Build a timeline from temporal events
   */
  build(events: TemporalEvent[]): Timeline {
    const nodes = this.createNodes(events);
    const edges = this.createEdges(nodes);
    const metadata = this.calculateMetadata(nodes, edges);

    return {
      nodes,
      edges,
      metadata,
    };
  }

  /**
   * Create timeline nodes from events
   */
  private createNodes(events: TemporalEvent[]): TimelineNode[] {
    const nodes: TimelineNode[] = [];

    for (const event of events) {
      const startTime = event.timestamp || event.startDate || new Date();
      const endTime = event.endDate || (event.duration ? new Date(startTime.getTime() + event.duration) : undefined);
      const duration = event.duration || (endTime ? endTime.getTime() - startTime.getTime() : undefined);

      nodes.push({
        id: event.id,
        event,
        startTime,
        endTime,
        duration,
        predecessors: [],
        successors: [],
        overlaps: [],
      });
    }

    return nodes;
  }

  /**
   * Create edges between timeline nodes
   */
  private createEdges(nodes: TimelineNode[]): TimelineEdge[] {
    const edges: TimelineEdge[] = [];

    // Sort nodes by start time
    const sortedNodes = [...nodes].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    for (let i = 0; i < sortedNodes.length; i++) {
      for (let j = i + 1; j < sortedNodes.length; j++) {
        const nodeA = sortedNodes[i];
        const nodeB = sortedNodes[j];

        const edge = this.determineEdgeType(nodeA, nodeB);
        if (edge) {
          edges.push(edge);

          // Update node relationships
          if (edge.type === "sequential" || edge.type === "gap") {
            nodeA.successors.push(nodeB.id);
            nodeB.predecessors.push(nodeA.id);
          } else if (edge.type === "overlap") {
            nodeA.overlaps.push(nodeB.id);
            nodeB.overlaps.push(nodeA.id);
          }
        }
      }
    }

    return edges;
  }

  /**
   * Determine the type of edge between two nodes
   */
  private determineEdgeType(nodeA: TimelineNode, nodeB: TimelineNode): TimelineEdge | null {
    const aEnd = nodeA.endTime || nodeA.startTime;
    const bStart = nodeB.startTime;

    // Overlap: A ends after B starts
    if (aEnd.getTime() > bStart.getTime()) {
      const overlapDuration = aEnd.getTime() - bStart.getTime();
      return {
        id: `edge-${nodeA.id}-${nodeB.id}`,
        from: nodeA.id,
        to: nodeB.id,
        type: "overlap",
        weight: overlapDuration,
      };
    }

    // Gap: A ends before B starts
    if (aEnd.getTime() < bStart.getTime()) {
      const gapDuration = bStart.getTime() - aEnd.getTime();
      return {
        id: `edge-${nodeA.id}-${nodeB.id}`,
        from: nodeA.id,
        to: nodeB.id,
        type: "gap",
        weight: gapDuration,
      };
    }

    // Sequential: A ends exactly when B starts
    return {
      id: `edge-${nodeA.id}-${nodeB.id}`,
      from: nodeA.id,
      to: nodeB.id,
      type: "sequential",
      weight: 0,
    };
  }

  /**
   * Calculate timeline metadata
   */
  private calculateMetadata(nodes: TimelineNode[], edges: TimelineEdge[]): Timeline["metadata"] {
    const totalNodes = nodes.length;
    const totalEdges = edges.length;

    const timestamps = nodes.flatMap(n => [n.startTime, n.endTime].filter((d): d is Date => d !== undefined));
    const earliestDate = timestamps.length > 0 ? new Date(Math.min(...timestamps.map(d => d.getTime()))) : undefined;
    const latestDate = timestamps.length > 0 ? new Date(Math.max(...timestamps.map(d => d.getTime()))) : undefined;

    const totalDuration = latestDate && earliestDate ? latestDate.getTime() - earliestDate.getTime() : 0;

    const hasOverlaps = edges.some(e => e.type === "overlap");
    const hasGaps = edges.some(e => e.type === "gap");

    return {
      totalNodes,
      totalEdges,
      earliestDate,
      latestDate,
      totalDuration,
      hasOverlaps,
      hasGaps,
    };
  }

  /**
   * Find overlapping events in the timeline
   */
  findOverlaps(timeline: Timeline): TimelineEdge[] {
    return timeline.edges.filter(e => e.type === "overlap");
  }

  /**
   * Find gaps in the timeline
   */
  findGaps(timeline: Timeline): TimelineEdge[] {
    return timeline.edges.filter(e => e.type === "gap");
  }

  /**
   * Find sequential events in the timeline
   */
  findSequential(timeline: Timeline): TimelineEdge[] {
    return timeline.edges.filter(e => e.type === "sequential");
  }

  /**
   * Get timeline statistics
   */
  getStatistics(timeline: Timeline): {
    totalEvents: number;
    withTimestamp: number;
    withDuration: number;
    averageConfidence: number;
    overlapCount: number;
    gapCount: number;
    sequentialCount: number;
  } {
    const withTimestamp = timeline.nodes.filter(n => n.event.timestamp).length;
    const withDuration = timeline.nodes.filter(n => n.duration).length;
    const averageConfidence = timeline.nodes.reduce((sum, n) => sum + n.event.confidence, 0) / (timeline.nodes.length || 1);
    const overlapCount = timeline.edges.filter(e => e.type === "overlap").length;
    const gapCount = timeline.edges.filter(e => e.type === "gap").length;
    const sequentialCount = timeline.edges.filter(e => e.type === "sequential").length;

    return {
      totalEvents: timeline.nodes.length,
      withTimestamp,
      withDuration,
      averageConfidence,
      overlapCount,
      gapCount,
      sequentialCount,
    };
  }
}
