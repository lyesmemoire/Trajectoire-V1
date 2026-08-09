import { Timeline, TimelineNode } from "./TimelineBuilder";

// ===================================================================
// TEMPORAL VALIDATOR — Pure TypeScript Temporal Consistency Validation
// ===================================================================

export interface ValidationResult {
  isValid: boolean;
  violations: TemporalViolation[];
  warnings: TemporalWarning[];
  metadata: {
    totalViolations: number;
    totalWarnings: number;
    criticalViolations: number;
  };
}

export interface TemporalViolation {
  id: string;
  type: "overlap" | "sequence" | "impossible" | "gap";
  severity: "critical" | "high" | "medium" | "low";
  nodeId: string;
  relatedNodeId?: string;
  description: string;
  ruleId: string;
  ruleVersion: string;
}

export interface TemporalWarning {
  id: string;
  type: "low_confidence" | "missing_timestamp" | "ambiguous_duration";
  severity: "low" | "medium";
  nodeId: string;
  description: string;
  ruleId: string;
  ruleVersion: string;
}

export class TemporalValidator {
  /**
   * Validate a timeline for temporal consistency
   */
  validate(timeline: Timeline): ValidationResult {
    const violations: TemporalViolation[] = [];
    const warnings: TemporalWarning[] = [];

    // Check for overlaps
    const overlapViolations = this.checkOverlaps(timeline);
    violations.push(...overlapViolations);

    // Check for sequence violations
    const sequenceViolations = this.checkSequence(timeline);
    violations.push(...sequenceViolations);

    // Check for impossible dates
    const impossibleViolations = this.checkImpossibleDates(timeline);
    violations.push(...impossibleViolations);

    // Check for gaps
    const gapViolations = this.checkGaps(timeline);
    violations.push(...gapViolations);

    // Check for low confidence events
    const confidenceWarnings = this.checkConfidence(timeline);
    warnings.push(...confidenceWarnings);

    // Check for missing timestamps
    const timestampWarnings = this.checkMissingTimestamps(timeline);
    warnings.push(...timestampWarnings);

    // Check for ambiguous durations
    const durationWarnings = this.checkAmbiguousDurations(timeline);
    warnings.push(...durationWarnings);

    const criticalViolations = violations.filter(v => v.severity === "critical").length;

    return {
      isValid: violations.length === 0,
      violations,
      warnings,
      metadata: {
        totalViolations: violations.length,
        totalWarnings: warnings.length,
        criticalViolations,
      },
    };
  }

  /**
   * Check for overlapping events that should not overlap
   */
  private checkOverlaps(timeline: Timeline): TemporalViolation[] {
    const violations: TemporalViolation[] = [];
    const overlapEdges = timeline.edges.filter(e => e.type === "overlap");

    for (const edge of overlapEdges) {
      const nodeA = timeline.nodes.find(n => n.id === edge.from);
      const nodeB = timeline.nodes.find(n => n.id === edge.to);

      if (nodeA && nodeB) {
        // Check if overlap is valid based on event types
        if (this.isInvalidOverlap(nodeA, nodeB)) {
          violations.push({
            id: `violation-overlap-${edge.id}`,
            type: "overlap",
            severity: "high",
            nodeId: nodeA.id,
            relatedNodeId: nodeB.id,
            description: `Events '${nodeA.event.eventType}' and '${nodeB.event.eventType}' overlap but should not`,
            ruleId: "TEMPORAL-001",
            ruleVersion: "1.0.0",
          });
        }
      }
    }

    return violations;
  }

  /**
   * Check if overlap between two events is invalid
   */
  private isInvalidOverlap(nodeA: TimelineNode, nodeB: TimelineNode): boolean {
    // Full-time employment should not overlap
    if (nodeA.event.eventType === "employment" && nodeB.event.eventType === "employment") {
      return true;
    }

    // Projects should not overlap if they require full attention
    if (nodeA.event.eventType === "project" && nodeB.event.eventType === "project") {
      return true;
    }

    return false;
  }

  /**
   * Check for sequence violations (effect before cause)
   */
  private checkSequence(timeline: Timeline): TemporalViolation[] {
    const violations: TemporalViolation[] = [];

    for (const node of timeline.nodes) {
      // Check if learning happened before the skill was used
      if (node.event.eventType === "learning") {
        const successors = node.successors.map(id => timeline.nodes.find(n => n.id === id)).filter((n): n is TimelineNode => n !== undefined);
        
        for (const successor of successors) {
          if (successor.event.eventType === "project" || successor.event.eventType === "employment") {
            // This is valid - learning before using the skill
            continue;
          }
        }
      }

      // Check if incident happened before the system was deployed
      if (node.event.eventType === "incident") {
        const predecessors = node.predecessors.map(id => timeline.nodes.find(n => n.id === id)).filter((n): n is TimelineNode => n !== undefined);
        
        for (const predecessor of predecessors) {
          if (predecessor.event.eventType === "project" && predecessor.event.description.toLowerCase().includes("deploy")) {
            violations.push({
              id: `violation-sequence-${node.id}-${predecessor.id}`,
              type: "sequence",
              severity: "critical",
              nodeId: node.id,
              relatedNodeId: predecessor.id,
              description: `Incident occurred before deployment of system`,
              ruleId: "TEMPORAL-002",
              ruleVersion: "1.0.0",
            });
          }
        }
      }
    }

    return violations;
  }

  /**
   * Check for impossible dates
   */
  private checkImpossibleDates(timeline: Timeline): TemporalViolation[] {
    const violations: TemporalViolation[] = [];
    const now = new Date();

    for (const node of timeline.nodes) {
      // Check if end date is before start date
      if (node.startTime && node.endTime && node.endTime.getTime() < node.startTime.getTime()) {
        violations.push({
          id: `violation-impossible-${node.id}`,
          type: "impossible",
          severity: "critical",
          nodeId: node.id,
          description: `End date is before start date`,
          ruleId: "TEMPORAL-003",
          ruleVersion: "1.0.0",
        });
      }

      // Check if dates are in the future (unless explicitly stated)
      if (node.startTime && node.startTime.getTime() > now.getTime()) {
        // Only warn if not explicitly about future plans
        if (!node.event.description.toLowerCase().includes("plan") && 
            !node.event.description.toLowerCase().includes("will") &&
            !node.event.description.toLowerCase().includes("going to")) {
          violations.push({
            id: `violation-future-${node.id}`,
            type: "impossible",
            severity: "medium",
            nodeId: node.id,
            description: `Event date is in the future without explicit future context`,
            ruleId: "TEMPORAL-004",
            ruleVersion: "1.0.0",
          });
        }
      }

      // Check if dates are too far in the past (before reasonable career start)
      const careerStart = new Date(1990, 0, 1);
      if (node.startTime && node.startTime.getTime() < careerStart.getTime()) {
        violations.push({
          id: `violation-too-old-${node.id}`,
          type: "impossible",
          severity: "high",
          nodeId: node.id,
          description: `Event date is before reasonable career start (1990)`,
          ruleId: "TEMPORAL-005",
          ruleVersion: "1.0.0",
        });
      }
    }

    return violations;
  }

  /**
   * Check for suspicious gaps
   */
  private checkGaps(timeline: Timeline): TemporalViolation[] {
    const violations: TemporalViolation[] = [];
    const gapEdges = timeline.edges.filter(e => e.type === "gap");

    for (const edge of gapEdges) {
      const gapDuration = edge.weight;
      const gapDays = gapDuration / (1000 * 60 * 60 * 24);

      // Gaps longer than 1 year are suspicious for continuous employment
      if (gapDays > 365) {
        const nodeA = timeline.nodes.find(n => n.id === edge.from);
        const nodeB = timeline.nodes.find(n => n.id === edge.to);

        if (nodeA && nodeB && 
            (nodeA.event.eventType === "employment" || nodeB.event.eventType === "employment")) {
          violations.push({
            id: `violation-gap-${edge.id}`,
            type: "gap",
            severity: "medium",
            nodeId: nodeA.id,
            relatedNodeId: nodeB.id,
            description: `Gap of ${Math.round(gapDays)} days between employment events`,
            ruleId: "TEMPORAL-006",
            ruleVersion: "1.0.0",
          });
        }
      }
    }

    return violations;
  }

  /**
   * Check for low confidence events
   */
  private checkConfidence(timeline: Timeline): TemporalWarning[] {
    const warnings: TemporalWarning[] = [];

    for (const node of timeline.nodes) {
      if (node.event.confidence < 0.5) {
        warnings.push({
          id: `warning-confidence-${node.id}`,
          type: "low_confidence",
          severity: "medium",
          nodeId: node.id,
          description: `Event has low confidence (${node.event.confidence.toFixed(2)})`,
          ruleId: "TEMPORAL-WARN-001",
          ruleVersion: "1.0.0",
        });
      }
    }

    return warnings;
  }

  /**
   * Check for missing timestamps
   */
  private checkMissingTimestamps(timeline: Timeline): TemporalWarning[] {
    const warnings: TemporalWarning[] = [];

    for (const node of timeline.nodes) {
      if (!node.event.timestamp && !node.event.startDate) {
        warnings.push({
          id: `warning-timestamp-${node.id}`,
          type: "missing_timestamp",
          severity: "low",
          nodeId: node.id,
          description: `Event has no timestamp or start date`,
          ruleId: "TEMPORAL-WARN-002",
          ruleVersion: "1.0.0",
        });
      }
    }

    return warnings;
  }

  /**
   * Check for ambiguous durations
   */
  private checkAmbiguousDurations(timeline: Timeline): TemporalWarning[] {
    const warnings: TemporalWarning[] = [];

    for (const node of timeline.nodes) {
      if (!node.duration && node.event.eventType === "employment") {
        warnings.push({
          id: `warning-duration-${node.id}`,
          type: "ambiguous_duration",
          severity: "low",
          nodeId: node.id,
          description: `Employment event has no duration`,
          ruleId: "TEMPORAL-WARN-003",
          ruleVersion: "1.0.0",
        });
      }
    }

    return warnings;
  }

  /**
   * Get validation statistics
   */
  getStatistics(result: ValidationResult): {
    isValid: boolean;
    totalViolations: number;
    totalWarnings: number;
    criticalViolations: number;
    highViolations: number;
    mediumViolations: number;
    lowViolations: number;
  } {
    return {
      isValid: result.isValid,
      totalViolations: result.metadata.totalViolations,
      totalWarnings: result.metadata.totalWarnings,
      criticalViolations: result.violations.filter(v => v.severity === "critical").length,
      highViolations: result.violations.filter(v => v.severity === "high").length,
      mediumViolations: result.violations.filter(v => v.severity === "medium").length,
      lowViolations: result.violations.filter(v => v.severity === "low").length,
    };
  }
}
