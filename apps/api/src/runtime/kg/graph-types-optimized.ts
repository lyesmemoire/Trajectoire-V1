/**
 * Knowledge Graph RH Runtime v2 - Optimized
 * Core Types Definition with performance optimizations
 */

// ============================================================================
// NODE TYPES
// ============================================================================

export enum NodeType {
  PERSON = 'PERSON',
  CANDIDATE = 'CANDIDATE',
  RECRUITER = 'RECRUITER',
  JOB = 'JOB',
  COMPANY = 'COMPANY',
  SKILL = 'SKILL',
  SOFT_SKILL = 'SOFT_SKILL',
  LANGUAGE = 'LANGUAGE',
  CERTIFICATION = 'CERTIFICATION',
  EDUCATION = 'EDUCATION',
  DEGREE = 'DEGREE',
  SCHOOL = 'SCHOOL',
  EXPERIENCE = 'EXPERIENCE',
  PROJECT = 'PROJECT',
  TECHNOLOGY = 'TECHNOLOGY',
  TOOL = 'TOOL',
  FRAMEWORK = 'FRAMEWORK',
  METHODOLOGY = 'METHODOLOGY',
  RESPONSIBILITY = 'RESPONSIBILITY',
  MISSION = 'MISSION',
  ACHIEVEMENT = 'ACHIEVEMENT',
  LOCATION = 'LOCATION',
  INDUSTRY = 'INDUSTRY',
  SALARY_RANGE = 'SALARY_RANGE',
  CONTRACT_TYPE = 'CONTRACT_TYPE',
  REMOTE_POLICY = 'REMOTE_POLICY',
  SECTOR = 'SECTOR',
  ROLE = 'ROLE',
  CAREER_PATH = 'CAREER_PATH',
  TRAINING = 'TRAINING',
  INTERVIEW = 'INTERVIEW',
  QUESTION = 'QUESTION',
  ANSWER = 'ANSWER',
  DOCUMENT = 'DOCUMENT',
}

// ============================================================================
// EDGE TYPES
// ============================================================================

export enum EdgeType {
  HAS_SKILL = 'HAS_SKILL',
  HAS_SOFT_SKILL = 'HAS_SOFT_SKILL',
  HAS_LANGUAGE = 'HAS_LANGUAGE',
  HAS_CERTIFICATION = 'HAS_CERTIFICATION',
  WORKED_AT = 'WORKED_AT',
  STUDIED_AT = 'STUDIED_AT',
  USES_TECH = 'USES_TECH',
  USES_TOOL = 'USES_TOOL',
  USES_FRAMEWORK = 'USES_FRAMEWORK',
  HAS_PROJECT = 'HAS_PROJECT',
  REQUIRES_SKILL = 'REQUIRES_SKILL',
  REQUIRES_LANGUAGE = 'REQUIRES_LANGUAGE',
  REQUIRES_CERTIFICATION = 'REQUIRES_CERTIFICATION',
  MATCHES = 'MATCHES',
  SIMILAR_TO = 'SIMILAR_TO',
  TRANSFERABLE_TO = 'TRANSFERABLE_TO',
  RELATED_TO = 'RELATED_TO',
  PART_OF = 'PART_OF',
  NEXT_STEP = 'NEXT_STEP',
  PREVIOUS_STEP = 'PREVIOUS_STEP',
  RECOMMENDED_FOR = 'RECOMMENDED_FOR',
  LOCATED_AT = 'LOCATED_AT',
  ACHIEVED = 'ACHIEVED',
  HAS_RESPONSIBILITY = 'HAS_RESPONSIBILITY',
}

// ============================================================================
// NODE
// ============================================================================

export interface NodeTimestamps {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | undefined;
}

export interface NodeProvenance {
  createdBy: string;
  algorithmVersion: string;
  sourceDocument?: string | undefined;
  sourceSection?: string | undefined;
  sourceSentence?: string | undefined;
  hash?: string | undefined;
}

export interface NodeMetadata {
  [key: string]: unknown;
}

export interface Node {
  id: string;
  type: NodeType;
  label: string;
  normalizedLabel: string;
  confidence: number;
  source: string;
  metadata: NodeMetadata;
  embeddingPlaceholder?: number[];
  timestamps: NodeTimestamps;
  provenance: NodeProvenance;
}

// ============================================================================
// EDGE
// ============================================================================

export interface EdgeMetadata {
  [key: string]: unknown;
}

export interface EdgeProvenance {
  createdBy: string;
  algorithmVersion: string;
  sourceDocument?: string | undefined;
  sourceSection?: string | undefined;
  sourceSentence?: string | undefined;
  hash?: string | undefined;
}

export interface Edge {
  id: string;
  type: EdgeType;
  sourceNode: string;
  targetNode: string;
  weight: number;
  confidence: number;
  reason?: string | undefined;
  metadata: EdgeMetadata;
  timestamps: NodeTimestamps;
  provenance: EdgeProvenance;
}

// ============================================================================
// GRAPH
// ============================================================================

export interface GraphMetadata {
  version: string;
  createdAt: Date;
  updatedAt: Date;
  source: string;
  [key: string]: unknown;
}

export interface Graph {
  id: string;
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
  metadata: GraphMetadata;
}

// ============================================================================
// OPTIMIZED NODE INDEX
// ============================================================================

export class OptimizedNodeIndex {
  private byId: Map<string, Node> = new Map();
  private byType: Map<NodeType, string[]> = new Map(); // Use arrays instead of Sets for better performance
  private byLabel: Map<string, string[]> = new Map();
  private byNormalizedLabel: Map<string, string[]> = new Map();

  add(node: Node): void {
    this.byId.set(node.id, node);

    // Optimized: Use arrays with direct push instead of Set operations
    if (!this.byType.has(node.type)) {
      this.byType.set(node.type, []);
    }
    this.byType.get(node.type)!.push(node.id);

    if (!this.byLabel.has(node.label)) {
      this.byLabel.set(node.label, []);
    }
    this.byLabel.get(node.label)!.push(node.id);

    if (!this.byNormalizedLabel.has(node.normalizedLabel)) {
      this.byNormalizedLabel.set(node.normalizedLabel, []);
    }
    this.byNormalizedLabel.get(node.normalizedLabel)!.push(node.id);
  }

  remove(nodeId: string): void {
    const node = this.byId.get(nodeId);
    if (!node) return;

    this.byId.delete(nodeId);

    // Optimized: Filter arrays instead of Set.delete
    const typeIds = this.byType.get(node.type);
    if (typeIds) {
      this.byType.set(
        node.type,
        typeIds.filter((id) => id !== nodeId),
      );
    }

    const labelIds = this.byLabel.get(node.label);
    if (labelIds) {
      this.byLabel.set(
        node.label,
        labelIds.filter((id) => id !== nodeId),
      );
    }

    const normalizedLabelIds = this.byNormalizedLabel.get(node.normalizedLabel);
    if (normalizedLabelIds) {
      this.byNormalizedLabel.set(
        node.normalizedLabel,
        normalizedLabelIds.filter((id) => id !== nodeId),
      );
    }
  }

  getById(nodeId: string): Node | undefined {
    return this.byId.get(nodeId);
  }

  // Optimized: Return array directly without Array.from
  getByType(type: NodeType): Node[] {
    const ids = this.byType.get(type);
    if (!ids || ids.length === 0) return [];

    const result: Node[] = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (id) {
        const node = this.byId.get(id);
        if (node) result.push(node);
      }
    }
    return result;
  }

  getByLabel(label: string): Node[] {
    const ids = this.byLabel.get(label);
    if (!ids || ids.length === 0) return [];

    const result: Node[] = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (id) {
        const node = this.byId.get(id);
        if (node) result.push(node);
      }
    }
    return result;
  }

  getByNormalizedLabel(normalizedLabel: string): Node[] {
    const ids = this.byNormalizedLabel.get(normalizedLabel);
    if (!ids || ids.length === 0) return [];

    const result: Node[] = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (id) {
        const node = this.byId.get(id);
        if (node) result.push(node);
      }
    }
    return result;
  }

  clear(): void {
    this.byId.clear();
    this.byType.clear();
    this.byLabel.clear();
    this.byNormalizedLabel.clear();
  }

  size(): number {
    return this.byId.size;
  }
}

// ============================================================================
// OPTIMIZED EDGE INDEX
// ============================================================================

export class OptimizedEdgeIndex {
  private byId: Map<string, Edge> = new Map();
  private byType: Map<EdgeType, string[]> = new Map();
  private bySource: Map<string, string[]> = new Map();
  private byTarget: Map<string, string[]> = new Map();
  private bySourceTarget: Map<string, Map<string, string[]>> = new Map();

  add(edge: Edge): void {
    this.byId.set(edge.id, edge);

    if (!this.byType.has(edge.type)) {
      this.byType.set(edge.type, []);
    }
    this.byType.get(edge.type)!.push(edge.id);

    if (!this.bySource.has(edge.sourceNode)) {
      this.bySource.set(edge.sourceNode, []);
    }
    this.bySource.get(edge.sourceNode)!.push(edge.id);

    if (!this.byTarget.has(edge.targetNode)) {
      this.byTarget.set(edge.targetNode, []);
    }
    this.byTarget.get(edge.targetNode)!.push(edge.id);

    if (!this.bySourceTarget.has(edge.sourceNode)) {
      this.bySourceTarget.set(edge.sourceNode, new Map());
    }
    const targetMap = this.bySourceTarget.get(edge.sourceNode)!;
    if (!targetMap.has(edge.targetNode)) {
      targetMap.set(edge.targetNode, []);
    }
    targetMap.get(edge.targetNode)!.push(edge.id);
  }

  remove(edgeId: string): void {
    const edge = this.byId.get(edgeId);
    if (!edge) return;

    this.byId.delete(edgeId);

    // Optimized: Filter arrays
    const typeIds = this.byType.get(edge.type);
    if (typeIds) {
      this.byType.set(
        edge.type,
        typeIds.filter((id) => id !== edgeId),
      );
    }

    const sourceIds = this.bySource.get(edge.sourceNode);
    if (sourceIds) {
      this.bySource.set(
        edge.sourceNode,
        sourceIds.filter((id) => id !== edgeId),
      );
    }

    const targetIds = this.byTarget.get(edge.targetNode);
    if (targetIds) {
      this.byTarget.set(
        edge.targetNode,
        targetIds.filter((id) => id !== edgeId),
      );
    }

    const targetMap = this.bySourceTarget.get(edge.sourceNode);
    if (targetMap) {
      const sourceTargetIds = targetMap.get(edge.targetNode);
      if (sourceTargetIds) {
        targetMap.set(
          edge.targetNode,
          sourceTargetIds.filter((id) => id !== edgeId),
        );
      }
    }
  }

  getById(edgeId: string): Edge | undefined {
    return this.byId.get(edgeId);
  }

  getByType(type: EdgeType): Edge[] {
    const ids = this.byType.get(type);
    if (!ids || ids.length === 0) return [];

    const result: Edge[] = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (id) {
        const edge = this.byId.get(id);
        if (edge) result.push(edge);
      }
    }
    return result;
  }

  getBySource(sourceNodeId: string): Edge[] {
    const ids = this.bySource.get(sourceNodeId);
    if (!ids || ids.length === 0) return [];

    const result: Edge[] = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (id) {
        const edge = this.byId.get(id);
        if (edge) result.push(edge);
      }
    }
    return result;
  }

  getByTarget(targetNodeId: string): Edge[] {
    const ids = this.byTarget.get(targetNodeId);
    if (!ids || ids.length === 0) return [];

    const result: Edge[] = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (id) {
        const edge = this.byId.get(id);
        if (edge) result.push(edge);
      }
    }
    return result;
  }

  getBySourceTarget(sourceNodeId: string, targetNodeId: string): Edge[] {
    const targetMap = this.bySourceTarget.get(sourceNodeId);
    if (!targetMap) return [];

    const ids = targetMap.get(targetNodeId);
    if (!ids || ids.length === 0) return [];

    const result: Edge[] = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (id) {
        const edge = this.byId.get(id);
        if (edge) result.push(edge);
      }
    }
    return result;
  }

  clear(): void {
    this.byId.clear();
    this.byType.clear();
    this.bySource.clear();
    this.byTarget.clear();
    this.bySourceTarget.clear();
  }

  size(): number {
    return this.byId.size;
  }
}

// ============================================================================
// TRAVERSAL
// ============================================================================

export enum TraversalDirection {
  OUTGOING = 'OUTGOING',
  INCOMING = 'INCOMING',
  BOTH = 'BOTH',
}

export interface TraversalOptions {
  maxDepth?: number;
  edgeTypes?: EdgeType[];
  direction?: TraversalDirection;
  includeSource?: boolean;
}

export interface TraversalResult {
  path: string[];
  nodes: Node[];
  edges: Edge[];
}

// ============================================================================
// GRAPH STATISTICS
// ============================================================================

export interface GraphStatistics {
  totalNodes: number;
  totalEdges: number;
  nodesByType: Record<NodeType, number>;
  edgesByType: Record<EdgeType, number>;
  averageDegree: number;
  connectedComponents: number;
  density: number;
  updatedAt: Date;
}

// ============================================================================
// VALIDATION RESULT
// ============================================================================

export interface ValidationError {
  type:
    | 'DUPLICATE_NODE'
    | 'DUPLICATE_EDGE'
    | 'INVALID_CYCLE'
    | 'ORPHAN_NODE'
    | 'FORBIDDEN_RELATION'
    | 'INVALID_WEIGHT'
    | 'INVALID_CONFIDENCE';
  message: string;
  nodeId?: string;
  edgeId?: string;
  severity: 'ERROR' | 'WARNING';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// ============================================================================
// SERIALIZATION FORMATS
// ============================================================================

export type SerializationFormat = 'JSON' | 'GRAPHML' | 'NEO4J';

export interface SerializedGraph {
  format: SerializationFormat;
  version: string;
  data: unknown;
  serializedAt: Date;
}

// ============================================================================
// CANDIDATE GRAPH INPUT
// ============================================================================

export interface CandidateGraphInput {
  candidateId: string;
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
  };
  skills: {
    technical: string[];
    soft: string[];
  };
  languages: Array<{
    name: string;
    level?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer?: string;
    year?: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    location?: string;
    achievements?: string[];
    technologies?: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
    field?: string;
  }>;
  projects?: Array<{
    name: string;
    description?: string;
    technologies?: string[];
    achievements?: string[];
  }>;
}

// ============================================================================
// JOB GRAPH INPUT
// ============================================================================

export interface JobGraphInput {
  jobId: string;
  title: string;
  company?: string;
  location?: string;
  description?: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  requiredLanguages?: string[];
  requiredCertifications?: string[];
  salaryRange?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  contractType?: string;
  remotePolicy?: string;
  industry?: string;
  responsibilities?: string[];
  missions?: string[];
}
