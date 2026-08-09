/**
 * Knowledge Graph RH Runtime v2
 * Core Types Definition
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
  OFFERED_BY = 'OFFERED_BY',
  HAS_SALARY = 'HAS_SALARY',
  HAS_CONTRACT = 'HAS_CONTRACT',
  ALLOWS_REMOTE = 'ALLOWS_REMOTE',
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
  createdBy: string; // User or system that created this node
  algorithmVersion: string; // Version of the algorithm used to create this node
  sourceDocument?: string | undefined; // Source document ID
  sourceSection?: string | undefined; // Section within the document
  sourceSentence?: string | undefined; // Specific sentence that generated this node
  hash?: string | undefined; // Hash of the source content for deduplication
}

export interface NodeMetadata {
  [key: string]: unknown;
}

export interface Node {
  id: string;
  type: NodeType;
  label: string;
  normalizedLabel: string;
  confidence: number; // 0-1
  source: string; // Source of the data (e.g., 'CV_PARSER', 'JOB_EXTRACTOR')
  metadata: NodeMetadata;
  embeddingPlaceholder?: number[]; // Placeholder for future embeddings
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
  createdBy: string; // User or system that created this edge
  algorithmVersion: string; // Version of the algorithm used to create this edge
  sourceDocument?: string | undefined; // Source document ID
  sourceSection?: string | undefined; // Section within the document
  sourceSentence?: string | undefined; // Specific sentence that generated this edge
  hash?: string | undefined; // Hash of the source content for deduplication
}

export interface Edge {
  id: string;
  type: EdgeType;
  sourceNode: string; // Node ID
  targetNode: string; // Node ID
  weight: number; // 0-1
  confidence: number; // 0-1
  reason?: string | undefined; // Explanation of why this edge exists
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
// NODE INDEX
// ============================================================================

export interface NodeIndexEntry {
  nodeId: string;
  type: NodeType;
  normalizedLabel: string;
  label: string;
}

export class NodeIndex {
  private byId: Map<string, Node> = new Map();
  private byType: Map<NodeType, Set<string>> = new Map();
  private byLabel: Map<string, Set<string>> = new Map();
  private byNormalizedLabel: Map<string, Set<string>> = new Map();

  add(node: Node): void {
    this.byId.set(node.id, node);

    if (!this.byType.has(node.type)) {
      this.byType.set(node.type, new Set());
    }
    this.byType.get(node.type)!.add(node.id);

    if (!this.byLabel.has(node.label)) {
      this.byLabel.set(node.label, new Set());
    }
    this.byLabel.get(node.label)!.add(node.id);

    if (!this.byNormalizedLabel.has(node.normalizedLabel)) {
      this.byNormalizedLabel.set(node.normalizedLabel, new Set());
    }
    this.byNormalizedLabel.get(node.normalizedLabel)!.add(node.id);
  }

  remove(nodeId: string): void {
    const node = this.byId.get(nodeId);
    if (!node) return;

    this.byId.delete(nodeId);
    this.byType.get(node.type)?.delete(nodeId);
    this.byLabel.get(node.label)?.delete(nodeId);
    this.byNormalizedLabel.get(node.normalizedLabel)?.delete(nodeId);
  }

  getById(nodeId: string): Node | undefined {
    return this.byId.get(nodeId);
  }

  getByType(type: NodeType): Node[] {
    const ids = this.byType.get(type);
    if (!ids) return [];
    return Array.from(ids).map((id) => this.byId.get(id)!);
  }

  getByLabel(label: string): Node[] {
    const ids = this.byLabel.get(label);
    if (!ids) return [];
    return Array.from(ids).map((id) => this.byId.get(id)!);
  }

  getByNormalizedLabel(normalizedLabel: string): Node[] {
    const ids = this.byNormalizedLabel.get(normalizedLabel);
    if (!ids) return [];
    return Array.from(ids).map((id) => this.byId.get(id)!);
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
// EDGE INDEX
// ============================================================================

export class EdgeIndex {
  private byId: Map<string, Edge> = new Map();
  private byType: Map<EdgeType, Set<string>> = new Map();
  private bySource: Map<string, Set<string>> = new Map();
  private byTarget: Map<string, Set<string>> = new Map();
  private bySourceTarget: Map<string, Map<string, Set<string>>> = new Map();

  add(edge: Edge): void {
    this.byId.set(edge.id, edge);

    if (!this.byType.has(edge.type)) {
      this.byType.set(edge.type, new Set());
    }
    this.byType.get(edge.type)!.add(edge.id);

    if (!this.bySource.has(edge.sourceNode)) {
      this.bySource.set(edge.sourceNode, new Set());
    }
    this.bySource.get(edge.sourceNode)!.add(edge.id);

    if (!this.byTarget.has(edge.targetNode)) {
      this.byTarget.set(edge.targetNode, new Set());
    }
    this.byTarget.get(edge.targetNode)!.add(edge.id);

    if (!this.bySourceTarget.has(edge.sourceNode)) {
      this.bySourceTarget.set(edge.sourceNode, new Map());
    }
    if (!this.bySourceTarget.get(edge.sourceNode)!.has(edge.targetNode)) {
      this.bySourceTarget.get(edge.sourceNode)!.set(edge.targetNode, new Set());
    }
    this.bySourceTarget
      .get(edge.sourceNode)!
      .get(edge.targetNode)!
      .add(edge.id);
  }

  remove(edgeId: string): void {
    const edge = this.byId.get(edgeId);
    if (!edge) return;

    this.byId.delete(edgeId);
    this.byType.get(edge.type)?.delete(edgeId);
    this.bySource.get(edge.sourceNode)?.delete(edgeId);
    this.byTarget.get(edge.targetNode)?.delete(edgeId);
    this.bySourceTarget
      .get(edge.sourceNode)
      ?.get(edge.targetNode)
      ?.delete(edgeId);
  }

  getById(edgeId: string): Edge | undefined {
    return this.byId.get(edgeId);
  }

  getByType(type: EdgeType): Edge[] {
    const ids = this.byType.get(type);
    if (!ids) return [];
    return Array.from(ids).map((id) => this.byId.get(id)!);
  }

  getBySource(sourceNodeId: string): Edge[] {
    const ids = this.bySource.get(sourceNodeId);
    if (!ids) return [];
    return Array.from(ids).map((id) => this.byId.get(id)!);
  }

  getByTarget(targetNodeId: string): Edge[] {
    const ids = this.byTarget.get(targetNodeId);
    if (!ids) return [];
    return Array.from(ids).map((id) => this.byId.get(id)!);
  }

  getBySourceTarget(sourceNodeId: string, targetNodeId: string): Edge[] {
    const targetMap = this.bySourceTarget.get(sourceNodeId);
    if (!targetMap) return [];
    const ids = targetMap.get(targetNodeId);
    if (!ids) return [];
    return Array.from(ids).map((id) => this.byId.get(id)!);
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
