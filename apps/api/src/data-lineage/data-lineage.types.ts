/**
 * Data Lineage Types
 * Complete tracing system for data from CV upload to Dashboard
 */

export enum DataStage {
  UPLOAD = 'UPLOAD',
  EXTRACTION = 'EXTRACTION',
  NORMALIZATION = 'NORMALIZATION',
  KNOWLEDGE_GRAPH = 'KNOWLEDGE_GRAPH',
  MATCHING = 'MATCHING',
  SEARCH = 'SEARCH',
  COPILOT = 'COPILOT',
  DASHBOARD = 'DASHBOARD',
}

export enum DataType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
  GRAPH_NODE = 'GRAPH_NODE',
  GRAPH_EDGE = 'GRAPH_EDGE',
  GRAPH = 'GRAPH',
}

export enum TransformationType {
  EXTRACTION = 'EXTRACTION',
  NORMALIZATION = 'NORMALIZATION',
  MAPPING = 'MAPPING',
  AGGREGATION = 'AGGREGATION',
  FILTERING = 'FILTERING',
  SCORING = 'SCORING',
  MATCHING = 'MATCHING',
  RANKING = 'RANKING',
  REASONING = 'REASONING',
  SERIALIZATION = 'SERIALIZATION',
  DESERIALIZATION = 'DESERIALIZATION',
}

export interface DataOrigin {
  source: string; // e.g., 'CV_UPLOAD', 'JOB_UPLOAD', 'MANUAL'
  sourceId: string; // e.g., file ID, user ID
  timestamp: Date;
  metadata: Record<string, any> | undefined;
}

export interface DataTransformation {
  type: TransformationType;
  algorithm: string; // e.g., 'pdf-parse', 'mammoth', 'regex', 'KP-001', 'KP-002'
  version: string; // e.g., '1.0.0'
  parameters: Record<string, any> | undefined;
  timestamp: Date;
  duration: number | undefined; // in milliseconds
}

export interface DataVersion {
  version: number;
  timestamp: Date;
  createdBy?: string; // e.g., 'system', 'user:123'
  changeDescription?: string;
}

export interface DataConfidence {
  score: number; // 0-1
  algorithm: string;
  factors: Record<string, number> | undefined;
  timestamp: Date;
}

export interface DataLineageEntry {
  id: string;
  dataId: string; // Unique identifier for the data item
  dataType: DataType;
  stage: DataStage;
  origin: DataOrigin;
  transformations: DataTransformation[];
  versions: DataVersion[];
  currentVersion: number;
  confidence: DataConfidence;
  source: string; // e.g., 'CV', 'JOB', 'GRAPH', 'MATCHING', 'SEARCH', 'COPILOT'
  value: any; // The actual data value
  metadata: Record<string, any> | undefined;
  parentIds: string[] | undefined; // IDs of parent data items
  childIds: string[] | undefined; // IDs of child data items
  createdAt: Date;
  updatedAt: Date;
}

export interface DataLineageQuery {
  dataId?: string;
  dataType?: DataType;
  stage?: DataStage;
  source?: string;
  startDate?: Date;
  endDate?: Date;
  minConfidence?: number;
  transformationType?: TransformationType;
  algorithm?: string;
  parentIds?: string[];
  childIds?: string[];
}

export interface DataLineageTrace {
  dataId: string;
  lineage: DataLineageEntry[];
  path: DataLineageEntry[]; // Ordered path from origin to current stage
  transformations: DataTransformation[];
  confidenceHistory: DataConfidence[];
  versionHistory: DataVersion[];
}

export interface GraphLineageEntry {
  id: string;
  graphId: string;
  nodeId?: string; // For node-level lineage
  edgeId?: string; // For edge-level lineage
  stage: DataStage;
  origin: DataOrigin;
  transformations: DataTransformation[];
  versions: DataVersion[];
  currentVersion: number;
  confidence: DataConfidence;
  source: string;
  metadata: Record<string, any> | undefined;
  parentGraphIds: string[] | undefined;
  childGraphIds: string[] | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface GraphLineageQuery {
  graphId?: string;
  nodeId?: string;
  edgeId?: string;
  stage?: DataStage;
  source?: string;
  startDate?: Date;
  endDate?: Date;
  minConfidence?: number;
  transformationType?: TransformationType;
  algorithm?: string;
}

export interface GraphLineageTrace {
  graphId: string;
  lineage: GraphLineageEntry[];
  nodeLineage: Map<string, GraphLineageEntry[]> | undefined;
  edgeLineage: Map<string, GraphLineageEntry[]> | undefined;
  transformations: DataTransformation[];
  confidenceHistory: DataConfidence[];
  versionHistory: DataVersion[];
}

export interface DataLineageStatistics {
  totalEntries: number;
  entriesByStage: Record<DataStage, number>;
  entriesByDataType: Record<DataType, number>;
  entriesBySource: Record<string, number>;
  averageConfidence: number;
  transformationCount: number;
  transformationByType: Record<TransformationType, number>;
  transformationByAlgorithm: Record<string, number>;
}

export interface DataLineageReport {
  dataId: string;
  trace: DataLineageTrace;
  statistics: DataLineageStatistics;
  recommendations?: string[];
}
