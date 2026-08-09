/**
 * Node Explainability Service
 * Provides complete explainability for every node in the graph
 * Each node must be explainable with history, relationships, confidence, and versions
 */

import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Node, Edge } from './graph-types';
import {
  NodeExplanation,
  ExplanationDetail,
  DetailType,
  Evidence,
  EvidenceType,
  NodeHistory,
  NodeHistoryEntry,
  ChangeType,
  NodeState,
  RelationshipHistory,
  RelationshipHistoryEntry,
  RelationshipChangeType,
  RelationshipState,
  ConfidenceEvolution,
  ConfidencePoint,
  ConfidenceTrend,
  VersionHistory,
  NodeVersion,
  ExplainabilityQuery,
  ExplainabilityStatistics,
  ExplainabilityValidation,
  ExplainabilityAudit,
  ErrorType,
  ErrorSeverity,
  WarningType,
  WarningSeverity,
} from './node-explainability.types';

@Injectable()
export class NodeExplainabilityService {
  private explanationMap: Map<string, NodeExplanation> = new Map();
  private nodeHistoryMap: Map<string, NodeHistory> = new Map();
  private relationshipHistoryMap: Map<string, RelationshipHistory> = new Map();
  private confidenceEvolutionMap: Map<string, ConfidenceEvolution> = new Map();
  private versionHistoryMap: Map<string, VersionHistory> = new Map();

  /**
   * Explain a node
   */
  explain(
    node: Node,
    graph: { nodes: Map<string, Node>; edges: Map<string, Edge> },
  ): NodeExplanation {
    const explanationId = uuidv4();

    // Generate explanation details
    const details: ExplanationDetail[] = this.generateExplanationDetails(
      node,
      graph,
    );

    // Generate evidence
    const evidence: Evidence[] = this.generateEvidence(node, graph);

    // Calculate confidence
    const confidence = this.calculateExplanationConfidence(details, evidence);

    const explanation: NodeExplanation = {
      nodeId: node.id,
      explanation: this.generateExplanationText(node, details, evidence),
      summary: this.generateSummary(node, details),
      details,
      evidence,
      confidence,
      timestamp: new Date(),
    };

    this.explanationMap.set(node.id, explanation);
    return explanation;
  }

  /**
   * Get node explanation by ID
   */
  getNodeExplanation(nodeId: string): NodeExplanation | undefined {
    return this.explanationMap.get(nodeId);
  }

  /**
   * Get node history
   */
  getNodeHistory(nodeId: string): NodeHistory | undefined {
    return this.nodeHistoryMap.get(nodeId);
  }

  /**
   * Add node history entry
   */
  addNodeHistoryEntry(entry: NodeHistoryEntry): void {
    let history = this.nodeHistoryMap.get(entry.newState.nodeId);

    if (!history) {
      history = {
        nodeId: entry.newState.nodeId,
        history: [],
        totalChanges: 0,
        firstSeen: entry.timestamp,
        lastModified: entry.timestamp,
      };
    }

    history.history.push(entry);
    history.totalChanges++;
    history.lastModified = entry.timestamp;

    this.nodeHistoryMap.set(entry.newState.nodeId, history);
  }

  /**
   * Get relationship history
   */
  getRelationshipHistory(nodeId: string): RelationshipHistory | undefined {
    return this.relationshipHistoryMap.get(nodeId);
  }

  /**
   * Add relationship history entry
   */
  addRelationshipHistoryEntry(entry: RelationshipHistoryEntry): void {
    const nodeId = entry.newState.sourceNodeId;
    let history = this.relationshipHistoryMap.get(nodeId);

    if (!history) {
      history = {
        nodeId,
        history: [],
        totalRelationships: 0,
        activeRelationships: 0,
        inactiveRelationships: 0,
      };
    }

    history.history.push(entry);
    history.totalRelationships++;

    if (entry.changeType === RelationshipChangeType.DELETED) {
      history.inactiveRelationships++;
    } else {
      history.activeRelationships++;
    }

    this.relationshipHistoryMap.set(nodeId, history);
  }

  /**
   * Get confidence evolution
   */
  getConfidenceEvolution(nodeId: string): ConfidenceEvolution | undefined {
    return this.confidenceEvolutionMap.get(nodeId);
  }

  /**
   * Add confidence point
   */
  addConfidencePoint(nodeId: string, point: ConfidencePoint): void {
    let evolution = this.confidenceEvolutionMap.get(nodeId);

    if (!evolution) {
      evolution = {
        nodeId,
        evolution: [],
        currentConfidence: point.confidence,
        initialConfidence: point.confidence,
        averageConfidence: point.confidence,
        trend: ConfidenceTrend.STABLE,
        volatility: 0,
      };
    }

    evolution.evolution.push(point);
    evolution.currentConfidence = point.confidence;
    evolution.averageConfidence = this.calculateAverageConfidence(
      evolution.evolution,
    );
    evolution.trend = this.calculateConfidenceTrend(evolution.evolution);
    evolution.volatility = this.calculateVolatility(evolution.evolution);

    this.confidenceEvolutionMap.set(nodeId, evolution);
  }

  /**
   * Get version history
   */
  getVersionHistory(nodeId: string): VersionHistory | undefined {
    return this.versionHistoryMap.get(nodeId);
  }

  /**
   * Add node version
   */
  addNodeVersion(version: NodeVersion): void {
    let versionHistory = this.versionHistoryMap.get(version.state.nodeId);

    if (!versionHistory) {
      versionHistory = {
        nodeId: version.state.nodeId,
        versions: [],
        currentVersion: 0,
        totalVersions: 0,
      };
    }

    versionHistory.versions.push(version);
    versionHistory.currentVersion = version.version;
    versionHistory.totalVersions++;

    this.versionHistoryMap.set(version.state.nodeId, versionHistory);
  }

  /**
   * Query explainability records
   */
  queryExplainability(query: ExplainabilityQuery): {
    explanations: NodeExplanation[];
    histories: NodeHistory[];
    relationshipHistories: RelationshipHistory[];
    confidenceEvolutions: ConfidenceEvolution[];
    versionHistories: VersionHistory[];
  } {
    const explanations: NodeExplanation[] = [];
    const histories: NodeHistory[] = [];
    const relationshipHistories: RelationshipHistory[] = [];
    const confidenceEvolutions: ConfidenceEvolution[] = [];
    const versionHistories: VersionHistory[] = [];

    for (const explanation of this.explanationMap.values()) {
      if (this.matchesExplanationQuery(explanation, query)) {
        explanations.push(explanation);
      }
    }

    for (const history of this.nodeHistoryMap.values()) {
      if (this.matchesHistoryQuery(history, query)) {
        histories.push(history);
      }
    }

    for (const relHistory of this.relationshipHistoryMap.values()) {
      if (this.matchesRelationshipHistoryQuery(relHistory, query)) {
        relationshipHistories.push(relHistory);
      }
    }

    for (const confidence of this.confidenceEvolutionMap.values()) {
      if (this.matchesConfidenceQuery(confidence, query)) {
        confidenceEvolutions.push(confidence);
      }
    }

    for (const version of this.versionHistoryMap.values()) {
      if (this.matchesVersionQuery(version, query)) {
        versionHistories.push(version);
      }
    }

    return {
      explanations,
      histories,
      relationshipHistories,
      confidenceEvolutions,
      versionHistories,
    };
  }

  /**
   * Get explainability statistics
   */
  getStatistics(): ExplainabilityStatistics {
    const totalNodes = this.explanationMap.size;
    const totalHistoryEntries = Array.from(this.nodeHistoryMap.values()).reduce(
      (sum, h) => sum + h.totalChanges,
      0,
    );
    const totalRelationshipEntries = Array.from(
      this.relationshipHistoryMap.values(),
    ).reduce((sum, h) => sum + h.totalRelationships, 0);
    const totalConfidencePoints = Array.from(
      this.confidenceEvolutionMap.values(),
    ).reduce((sum, e) => sum + e.evolution.length, 0);
    const totalVersions = Array.from(this.versionHistoryMap.values()).reduce(
      (sum, v) => sum + v.totalVersions,
      0,
    );

    const averageHistoryDepth =
      totalNodes > 0 ? totalHistoryEntries / totalNodes : 0;
    const averageRelationshipCount =
      totalNodes > 0 ? totalRelationshipEntries / totalNodes : 0;
    const averageConfidence =
      totalNodes > 0 ? this.calculateGlobalAverageConfidence() : 0;
    const averageVersionCount = totalNodes > 0 ? totalVersions / totalNodes : 0;

    const byChangeType: Record<ChangeType, number> = {} as any;
    const byRelationshipChangeType: Record<RelationshipChangeType, number> =
      {} as any;
    const byConfidenceTrend: Record<ConfidenceTrend, number> = {} as any;

    for (const history of this.nodeHistoryMap.values()) {
      for (const entry of history.history) {
        byChangeType[entry.changeType] =
          (byChangeType[entry.changeType] || 0) + 1;
      }
    }

    for (const relHistory of this.relationshipHistoryMap.values()) {
      for (const entry of relHistory.history) {
        byRelationshipChangeType[entry.changeType] =
          (byRelationshipChangeType[entry.changeType] || 0) + 1;
      }
    }

    for (const confidence of this.confidenceEvolutionMap.values()) {
      byConfidenceTrend[confidence.trend] =
        (byConfidenceTrend[confidence.trend] || 0) + 1;
    }

    return {
      totalNodes,
      totalHistoryEntries,
      totalRelationshipEntries,
      totalConfidencePoints,
      totalVersions,
      averageHistoryDepth,
      averageRelationshipCount,
      averageConfidence,
      averageVersionCount,
      byChangeType,
      byRelationshipChangeType,
      byConfidenceTrend,
    };
  }

  /**
   * Validate explainability integrity
   */
  validateExplainability(): ExplainabilityValidation {
    const errors: any[] = [];
    const warnings: any[] = [];
    const orphanedNodes: string[] = [];
    const circularRelationships: string[] = [];
    const inconsistentConfidence: string[] = [];

    for (const [nodeId, explanation] of this.explanationMap.entries()) {
      // Check for missing history
      if (!this.nodeHistoryMap.has(nodeId)) {
        errors.push({
          errorId: uuidv4(),
          nodeId,
          type: ErrorType.MISSING_HISTORY,
          message: 'Node has explanation but no history',
          severity: ErrorSeverity.HIGH,
        });
      }

      // Check for missing version
      if (!this.versionHistoryMap.has(nodeId)) {
        errors.push({
          errorId: uuidv4(),
          nodeId,
          type: ErrorType.MISSING_VERSION,
          message: 'Node has explanation but no version history',
          severity: ErrorSeverity.HIGH,
        });
      }

      // Check for low confidence
      if (explanation.confidence < 0.5) {
        warnings.push({
          warningId: uuidv4(),
          nodeId,
          type: WarningType.LOW_CONFIDENCE,
          message: `Low explanation confidence: ${explanation.confidence}`,
          severity: WarningSeverity.WARNING,
        });
      }

      // Check for missing evidence
      if (explanation.evidence.length === 0) {
        errors.push({
          errorId: uuidv4(),
          nodeId,
          type: ErrorType.MISSING_EVIDENCE,
          message: 'Node explanation has no evidence',
          severity: ErrorSeverity.MEDIUM,
        });
      }
    }

    for (const confidence of this.confidenceEvolutionMap.values()) {
      const nodeId = confidence.nodeId;
      // Check for high volatility
      if (confidence.volatility > 0.3) {
        warnings.push({
          warningId: uuidv4(),
          nodeId,
          type: WarningType.HIGH_VOLATILITY,
          message: `High confidence volatility: ${confidence.volatility}`,
          severity: WarningSeverity.WARNING,
        });
      }

      // Check for inconsistent confidence
      if (
        confidence.currentConfidence < 0.3 &&
        confidence.averageConfidence > 0.7
      ) {
        inconsistentConfidence.push(nodeId);
        warnings.push({
          warningId: uuidv4(),
          nodeId,
          type: WarningType.STALE_DATA,
          message: 'Current confidence significantly different from average',
          severity: WarningSeverity.WARNING,
        });
      }
    }

    for (const history of this.nodeHistoryMap.values()) {
      const nodeId = history.nodeId;
      // Check for many changes
      if (history.totalChanges > 20) {
        warnings.push({
          warningId: uuidv4(),
          nodeId,
          type: WarningType.MANY_CHANGES,
          message: `Many history changes: ${history.totalChanges}`,
          severity: WarningSeverity.INFO,
        });
      }
    }

    for (const version of this.versionHistoryMap.values()) {
      const nodeId = version.nodeId;
      // Check for old version
      if (version.totalVersions > 10) {
        warnings.push({
          warningId: uuidv4(),
          nodeId,
          type: WarningType.OLD_VERSION,
          message: `Many versions: ${version.totalVersions}`,
          severity: WarningSeverity.INFO,
        });
      }
    }

    const isValid = errors.length === 0;

    return {
      isValid,
      errors,
      warnings,
      orphanedNodes,
      circularRelationships,
      inconsistentConfidence,
    };
  }

  /**
   * Perform explainability audit
   */
  auditExplainability(): ExplainabilityAudit {
    const statistics = this.getStatistics();
    const validation = this.validateExplainability();
    const recommendations = this.generateRecommendations(
      statistics,
      validation,
    );

    return {
      auditId: uuidv4(),
      timestamp: new Date(),
      statistics,
      validation,
      recommendations,
    };
  }

  /**
   * Delete node explanation
   */
  deleteNodeExplanation(nodeId: string): boolean {
    return this.explanationMap.delete(nodeId);
  }

  /**
   * Clear all explainability records
   */
  clearExplainability(): void {
    this.explanationMap.clear();
    this.nodeHistoryMap.clear();
    this.relationshipHistoryMap.clear();
    this.confidenceEvolutionMap.clear();
    this.versionHistoryMap.clear();
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private generateExplanationDetails(
    node: Node,
    graph: { nodes: Map<string, Node>; edges: Map<string, Edge> },
  ): ExplanationDetail[] {
    const details: ExplanationDetail[] = [];

    // Attribute details
    for (const [key, value] of Object.entries(node.metadata)) {
      details.push({
        detailId: uuidv4(),
        type: DetailType.ATTRIBUTE,
        description: `Attribute: ${key}`,
        value,
        source: node.source,
        confidence: node.confidence,
      });
    }

    // Relationship details
    for (const edge of graph.edges.values()) {
      if (edge.sourceNode === node.id || edge.targetNode === node.id) {
        details.push({
          detailId: uuidv4(),
          type: DetailType.RELATIONSHIP,
          description: `Relationship: ${edge.type}`,
          value: { type: edge.type, weight: edge.weight },
          source:
            edge.sourceNode === node.id ? edge.targetNode : edge.sourceNode,
          confidence: edge.confidence,
        });
      }
    }

    return details;
  }

  private generateEvidence(
    node: Node,
    graph: { nodes: Map<string, Node>; edges: Map<string, Edge> },
  ): Evidence[] {
    const evidence: Evidence[] = [];

    // Direct evidence from node
    evidence.push({
      evidenceId: uuidv4(),
      type: EvidenceType.DIRECT,
      source: node.source,
      nodeId: node.id,
      value: node.label,
      confidence: node.confidence,
      timestamp: new Date(),
    });

    // Indirect evidence from relationships
    for (const edge of graph.edges.values()) {
      if (edge.sourceNode === node.id || edge.targetNode === node.id) {
        const relatedNodeId =
          edge.sourceNode === node.id ? edge.targetNode : edge.sourceNode;
        const relatedNode = graph.nodes.get(relatedNodeId);

        if (relatedNode) {
          evidence.push({
            evidenceId: uuidv4(),
            type: EvidenceType.INDIRECT,
            source: relatedNodeId,
            nodeId: relatedNodeId,
            edgeId: edge.id,
            value: relatedNode.label,
            confidence: Math.min(node.confidence, relatedNode.confidence),
            timestamp: new Date(),
          });
        }
      }
    }

    return evidence;
  }

  private calculateExplanationConfidence(
    details: ExplanationDetail[],
    evidence: Evidence[],
  ): number {
    if (details.length === 0 && evidence.length === 0) {
      return 0;
    }

    const detailConfidence =
      details.length > 0
        ? details.reduce((sum, d) => sum + d.confidence, 0) / details.length
        : 0;

    const evidenceConfidence =
      evidence.length > 0
        ? evidence.reduce((sum, e) => sum + e.confidence, 0) / evidence.length
        : 0;

    return (detailConfidence + evidenceConfidence) / 2;
  }

  private generateExplanationText(
    node: Node,
    details: ExplanationDetail[],
    evidence: Evidence[],
  ): string {
    const parts: string[] = [];

    parts.push(`Node ${node.id} is a ${node.type} with label "${node.label}".`);
    parts.push(`It has a confidence score of ${node.confidence.toFixed(2)}.`);

    if (details.length > 0) {
      parts.push(`It has ${details.length} attributes and relationships.`);
    }

    if (evidence.length > 0) {
      parts.push(`It is supported by ${evidence.length} pieces of evidence.`);
    }

    return parts.join(' ');
  }

  private generateSummary(node: Node, details: ExplanationDetail[]): string {
    return `${node.type}: ${node.label} (${details.length} attributes)`;
  }

  private calculateAverageConfidence(points: ConfidencePoint[]): number {
    if (points.length === 0) return 0;
    return points.reduce((sum, p) => sum + p.confidence, 0) / points.length;
  }

  private calculateConfidenceTrend(points: ConfidencePoint[]): ConfidenceTrend {
    if (points.length < 2) return ConfidenceTrend.STABLE;

    const recent = points.slice(-5);
    const increasing = recent.filter(
      (p, i) =>
        i === 0 || p.confidence >= (recent[i - 1]?.confidence ?? p.confidence),
    ).length;
    const decreasing = recent.filter(
      (p, i) =>
        i === 0 || p.confidence <= (recent[i - 1]?.confidence ?? p.confidence),
    ).length;

    if (increasing >= recent.length * 0.8) return ConfidenceTrend.INCREASING;
    if (decreasing >= recent.length * 0.8) return ConfidenceTrend.DECREASING;
    if (Math.abs(increasing - decreasing) <= 1) return ConfidenceTrend.VOLATILE;

    return ConfidenceTrend.STABLE;
  }

  private calculateVolatility(points: ConfidencePoint[]): number {
    if (points.length < 2) return 0;

    const changes: number[] = [];
    for (let i = 1; i < points.length; i++) {
      const currentConfidence = points[i]?.confidence ?? 0;
      const previousConfidence = points[i - 1]?.confidence ?? 0;
      changes.push(Math.abs(currentConfidence - previousConfidence));
    }

    return changes.reduce((sum, c) => sum + c, 0) / changes.length;
  }

  private calculateGlobalAverageConfidence(): number {
    const allConfidences: number[] = [];

    for (const explanation of this.explanationMap.values()) {
      allConfidences.push(explanation.confidence);
    }

    for (const evolution of this.confidenceEvolutionMap.values()) {
      allConfidences.push(evolution.currentConfidence);
    }

    if (allConfidences.length === 0) return 0;
    return (
      allConfidences.reduce((sum, c) => sum + c, 0) / allConfidences.length
    );
  }

  private matchesExplanationQuery(
    explanation: NodeExplanation,
    query: ExplainabilityQuery,
  ): boolean {
    if (query.nodeId && explanation.nodeId !== query.nodeId) return false;
    if (
      query.minConfidence !== undefined &&
      explanation.confidence < query.minConfidence
    )
      return false;
    if (
      query.maxConfidence !== undefined &&
      explanation.confidence > query.maxConfidence
    )
      return false;

    return true;
  }

  private matchesHistoryQuery(
    history: NodeHistory,
    query: ExplainabilityQuery,
  ): boolean {
    if (query.nodeId && history.nodeId !== query.nodeId) return false;
    if (
      query.changeType &&
      !history.history.some((e) => e.changeType === query.changeType)
    )
      return false;

    return true;
  }

  private matchesRelationshipHistoryQuery(
    history: RelationshipHistory,
    query: ExplainabilityQuery,
  ): boolean {
    if (query.nodeId && history.nodeId !== query.nodeId) return false;
    if (
      query.relationshipChangeType &&
      !history.history.some(
        (e) => e.changeType === query.relationshipChangeType,
      )
    )
      return false;

    return true;
  }

  private matchesConfidenceQuery(
    confidence: ConfidenceEvolution,
    query: ExplainabilityQuery,
  ): boolean {
    if (query.nodeId && confidence.nodeId !== query.nodeId) return false;
    if (query.confidenceTrend && confidence.trend !== query.confidenceTrend)
      return false;
    if (
      query.minConfidence !== undefined &&
      confidence.currentConfidence < query.minConfidence
    )
      return false;
    if (
      query.maxConfidence !== undefined &&
      confidence.currentConfidence > query.maxConfidence
    )
      return false;

    return true;
  }

  private matchesVersionQuery(
    version: VersionHistory,
    query: ExplainabilityQuery,
  ): boolean {
    if (query.nodeId && version.nodeId !== query.nodeId) return false;

    return true;
  }

  private generateRecommendations(
    statistics: ExplainabilityStatistics,
    validation: ExplainabilityValidation,
  ): string[] {
    const recommendations: string[] = [];

    // Missing history
    if (validation.errors.some((e) => e.type === ErrorType.MISSING_HISTORY)) {
      recommendations.push('Add history entries for nodes without history');
    }

    // Missing version
    if (validation.errors.some((e) => e.type === ErrorType.MISSING_VERSION)) {
      recommendations.push('Add version history for nodes without versions');
    }

    // Low confidence
    if (
      validation.warnings.some((w) => w.type === WarningType.LOW_CONFIDENCE)
    ) {
      recommendations.push(
        'Improve data quality to increase explanation confidence',
      );
    }

    // High volatility
    if (
      validation.warnings.some((w) => w.type === WarningType.HIGH_VOLATILITY)
    ) {
      recommendations.push(
        'Stabilize confidence evolution to reduce volatility',
      );
    }

    // Many changes
    if (statistics.averageHistoryDepth > 10) {
      recommendations.push('Reduce average history depth to improve stability');
    }

    // Many versions
    if (statistics.averageVersionCount > 5) {
      recommendations.push('Consolidate versions to reduce version count');
    }

    return recommendations;
  }
}
