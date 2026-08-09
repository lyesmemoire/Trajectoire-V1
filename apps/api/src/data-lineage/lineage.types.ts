/**
 * Data Lineage Types
 * Complete traceability for all data in the system
 * No anonymous data allowed
 */

export interface DataLineage {
  uuid: string;
  source: DataSource;
  parentUuid?: string;
  version: number;
  timestamp: Date;
  confidence: number;
  transformation: Transformation;
  hash: string;
  graphNodeId?: string;
  relation?: DataRelation;
  storage: DataStorage;
  metadata?: Record<string, unknown>;
}

export interface DataSource {
  type: SourceType;
  origin: string;
  provenance: string;
  pipeline: string;
  stage: string;
}

export enum SourceType {
  USER_UPLOAD = 'USER_UPLOAD',
  API_CALL = 'API_CALL',
  DATABASE = 'DATABASE',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  TRANSFORMATION = 'TRANSFORMATION',
  DERIVED = 'DERIVED',
}

export interface Transformation {
  type: TransformationType;
  operation: string;
  inputUuids: string[];
  outputUuids: string[];
  parameters?: Record<string, unknown>;
  description: string;
}

export enum TransformationType {
  EXTRACTION = 'EXTRACTION',
  NORMALIZATION = 'NORMALIZATION',
  VALIDATION = 'VALIDATION',
  ENRICHMENT = 'ENRICHMENT',
  AGGREGATION = 'AGGREGATION',
  FILTERING = 'FILTERING',
  MATCHING = 'MATCHING',
  SEARCH = 'SEARCH',
  REASONING = 'REASONING',
  SERIALIZATION = 'SERIALIZATION',
}

export interface DataRelation {
  type: RelationType;
  targetUuid: string;
  relationName: string;
  weight?: number;
  metadata?: Record<string, unknown>;
}

export enum RelationType {
  PARENT_OF = 'PARENT_OF',
  CHILD_OF = 'CHILD_OF',
  DERIVED_FROM = 'DERIVED_FROM',
  TRANSFORMED_TO = 'TRANSFORMED_TO',
  MATCHED_WITH = 'MATCHED_WITH',
  RELATED_TO = 'RELATED_TO',
  PART_OF = 'PART_OF',
  CONTAINS = 'CONTAINS',
}

export interface DataStorage {
  type: StorageType;
  location: string;
  format: string;
  size?: number;
  compressed: boolean;
  encrypted: boolean;
  retention: RetentionPolicy;
}

export enum StorageType {
  DATABASE = 'DATABASE',
  FILE_SYSTEM = 'FILE_SYSTEM',
  OBJECT_STORAGE = 'OBJECT_STORAGE',
  CACHE = 'CACHE',
  MEMORY = 'MEMORY',
}

export enum RetentionPolicy {
  PERMANENT = 'PERMANENT',
  ONE_YEAR = 'ONE_YEAR',
  SIX_MONTHS = 'SIX_MONTHS',
  THREE_MONTHS = 'THREE_MONTHS',
  ONE_MONTH = 'ONE_MONTH',
  ONE_WEEK = 'ONE_WEEK',
  TEMPORARY = 'TEMPORARY',
}

export interface LineageQuery {
  uuid?: string;
  parentUuid?: string;
  sourceType?: SourceType;
  transformationType?: TransformationType;
  relationType?: RelationType;
  storageType?: StorageType;
  startDate?: Date;
  endDate?: Date;
  minConfidence?: number;
  maxConfidence?: number;
  graphNodeId?: string;
}

export interface LineageTrace {
  rootUuid: string;
  path: DataLineage[];
  depth: number;
  totalNodes: number;
  branches: number;
}

export interface LineageStatistics {
  totalDataItems: number;
  bySourceType: Record<SourceType, number>;
  byTransformationType: Record<TransformationType, number>;
  byStorageType: Record<StorageType, number>;
  averageConfidence: number;
  averageDepth: number;
  orphanedItems: number;
  circularReferences: number;
}

export interface LineageValidation {
  isValid: boolean;
  errors: LineageError[];
  warnings: LineageWarning[];
  orphanedItems: string[];
  circularReferences: string[];
  missingParents: string[];
}

export interface LineageError {
  uuid: string;
  type: ErrorType;
  message: string;
  severity: ErrorSeverity;
}

export enum ErrorType {
  MISSING_PARENT = 'MISSING_PARENT',
  INVALID_HASH = 'INVALID_HASH',
  CIRCULAR_REFERENCE = 'CIRCULAR_REFERENCE',
  INVALID_CONFIDENCE = 'INVALID_CONFIDENCE',
  INVALID_TIMESTAMP = 'INVALID_TIMESTAMP',
  MISSING_SOURCE = 'MISSING_SOURCE',
  INVALID_STORAGE = 'INVALID_STORAGE',
}

export enum ErrorSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export interface LineageWarning {
  uuid: string;
  type: WarningType;
  message: string;
  severity: WarningSeverity;
}

export enum WarningType {
  LOW_CONFIDENCE = 'LOW_CONFIDENCE',
  OLD_DATA = 'OLD_DATA',
  TEMPORARY_STORAGE = 'TEMPORARY_STORAGE',
  LARGE_DATA = 'LARGE_DATA',
  MANY_TRANSFORMATIONS = 'MANY_TRANSFORMATIONS',
}

export enum WarningSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
}

export interface LineageAudit {
  auditId: string;
  timestamp: Date;
  statistics: LineageStatistics;
  validation: LineageValidation;
  recommendations: string[];
}
