/**
 * Node Explainability Types
 * Complete explainability for every node in the graph
 * Each node must be explainable with history, relationships, confidence, and versions
 */

import { Node, Edge } from './graph-types';

export interface NodeExplanation {
  nodeId: string;
  explanation: string;
  summary: string;
  details: ExplanationDetail[];
  evidence: Evidence[];
  confidence: number;
  timestamp: Date;
}

export interface ExplanationDetail {
  detailId: string;
  type: DetailType;
  description: string;
  value: unknown;
  source: string;
  confidence: number;
}

export enum DetailType {
  ATTRIBUTE = 'ATTRIBUTE',
  RELATIONSHIP = 'RELATIONSHIP',
  TRANSFORMATION = 'TRANSFORMATION',
  VALIDATION = 'VALIDATION',
  ENRICHMENT = 'ENRICHMENT',
}

export interface Evidence {
  evidenceId: string;
  type: EvidenceType;
  source: string;
  nodeId?: string;
  edgeId?: string;
  value: unknown;
  confidence: number;
  timestamp: Date;
}

export enum EvidenceType {
  DIRECT = 'DIRECT',
  INDIRECT = 'INDIRECT',
  INFERRED = 'INFERRED',
  EXTERNAL = 'EXTERNAL',
}

export interface NodeHistory {
  nodeId: string;
  history: NodeHistoryEntry[];
  totalChanges: number;
  firstSeen: Date;
  lastModified: Date;
}

export interface NodeHistoryEntry {
  entryId: string;
  timestamp: Date;
  changeType: ChangeType;
  previousState?: NodeState;
  newState: NodeState;
  reason: string;
  userId?: string;
  algorithm?: string;
}

export enum ChangeType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  MERGED = 'MERGED',
  SPLIT = 'SPLIT',
  RESTORED = 'RESTORED',
}

export interface NodeState {
  nodeId: string;
  type: string;
  label: string;
  normalizedLabel: string;
  confidence: number;
  source: string;
  metadata: Record<string, unknown>;
  version: number;
}

export interface RelationshipHistory {
  nodeId: string;
  history: RelationshipHistoryEntry[];
  totalRelationships: number;
  activeRelationships: number;
  inactiveRelationships: number;
}

export interface RelationshipHistoryEntry {
  entryId: string;
  relationshipId: string;
  timestamp: Date;
  changeType: RelationshipChangeType;
  previousState?: RelationshipState;
  newState: RelationshipState;
  reason: string;
  userId?: string;
  algorithm?: string;
}

export enum RelationshipChangeType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  REVERSED = 'REVERSED',
  WEIGHT_CHANGED = 'WEIGHT_CHANGED',
}

export interface RelationshipState {
  relationshipId: string;
  type: string;
  sourceNodeId: string;
  targetNodeId: string;
  weight: number;
  confidence: number;
  metadata: Record<string, unknown>;
  version: number;
}

export interface ConfidenceEvolution {
  nodeId: string;
  evolution: ConfidencePoint[];
  currentConfidence: number;
  initialConfidence: number;
  averageConfidence: number;
  trend: ConfidenceTrend;
  volatility: number;
}

export interface ConfidencePoint {
  pointId: string;
  timestamp: Date;
  confidence: number;
  reason: string;
  source: string;
  algorithm?: string;
}

export enum ConfidenceTrend {
  INCREASING = 'INCREASING',
  DECREASING = 'DECREASING',
  STABLE = 'STABLE',
  VOLATILE = 'VOLATILE',
}

export interface VersionHistory {
  nodeId: string;
  versions: NodeVersion[];
  currentVersion: number;
  totalVersions: number;
}

export interface NodeVersion {
  versionId: string;
  version: number;
  timestamp: Date;
  state: NodeState;
  relationships: RelationshipState[];
  changeLog: string;
  createdBy?: string;
  algorithm?: string;
}

export interface ExplainabilityQuery {
  nodeId?: string;
  nodeType?: string;
  changeType?: ChangeType;
  relationshipChangeType?: RelationshipChangeType;
  startDate?: Date;
  endDate?: Date;
  minConfidence?: number;
  maxConfidence?: number;
  confidenceTrend?: ConfidenceTrend;
}

export interface ExplainabilityStatistics {
  totalNodes: number;
  totalHistoryEntries: number;
  totalRelationshipEntries: number;
  totalConfidencePoints: number;
  totalVersions: number;
  averageHistoryDepth: number;
  averageRelationshipCount: number;
  averageConfidence: number;
  averageVersionCount: number;
  byChangeType: Record<ChangeType, number>;
  byRelationshipChangeType: Record<RelationshipChangeType, number>;
  byConfidenceTrend: Record<ConfidenceTrend, number>;
}

export interface ExplainabilityValidation {
  isValid: boolean;
  errors: ExplainabilityError[];
  warnings: ExplainabilityWarning[];
  orphanedNodes: string[];
  circularRelationships: string[];
  inconsistentConfidence: string[];
}

export interface ExplainabilityError {
  errorId: string;
  nodeId: string;
  type: ErrorType;
  message: string;
  severity: ErrorSeverity;
}

export enum ErrorType {
  MISSING_HISTORY = 'MISSING_HISTORY',
  MISSING_VERSION = 'MISSING_VERSION',
  INCONSISTENT_STATE = 'INCONSISTENT_STATE',
  INVALID_CONFIDENCE = 'INVALID_CONFIDENCE',
  CIRCULAR_REFERENCE = 'CIRCULAR_REFERENCE',
  MISSING_EVIDENCE = 'MISSING_EVIDENCE',
}

export enum ErrorSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export interface ExplainabilityWarning {
  warningId: string;
  nodeId: string;
  type: WarningType;
  message: string;
  severity: WarningSeverity;
}

export enum WarningType {
  LOW_CONFIDENCE = 'LOW_CONFIDENCE',
  HIGH_VOLATILITY = 'HIGH_VOLATILITY',
  MANY_CHANGES = 'MANY_CHANGES',
  OLD_VERSION = 'OLD_VERSION',
  STALE_DATA = 'STALE_DATA',
}

export enum WarningSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
}

export interface ExplainabilityAudit {
  auditId: string;
  timestamp: Date;
  statistics: ExplainabilityStatistics;
  validation: ExplainabilityValidation;
  recommendations: string[];
}
