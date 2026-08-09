/**
 * Data Lineage Service
 * Provides complete traceability for all data in the system
 * No anonymous data allowed
 */

import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import {
  DataLineage,
  DataSource,
  SourceType,
  Transformation,
  TransformationType,
  DataRelation,
  RelationType,
  DataStorage,
  StorageType,
  RetentionPolicy,
  LineageQuery,
  LineageTrace,
  LineageStatistics,
  LineageValidation,
  LineageAudit,
  LineageError,
  ErrorType,
  ErrorSeverity,
  LineageWarning,
  WarningType,
  WarningSeverity,
} from './lineage.types';

@Injectable()
export class LineageService {
  private lineageMap: Map<string, DataLineage> = new Map();

  /**
   * Create a new data lineage record
   */
  createLineage(params: {
    source: DataSource;
    parentUuid?: string;
    transformation: Transformation;
    graphNodeId?: string;
    relation?: DataRelation;
    storage: DataStorage;
    metadata?: Record<string, unknown>;
  }): DataLineage {
    const uuid = uuidv4();
    const parent = params.parentUuid
      ? this.lineageMap.get(params.parentUuid)
      : undefined;
    const version = parent ? parent.version + 1 : 1;

    const lineage: DataLineage = {
      uuid,
      source: params.source,
      version,
      timestamp: new Date(),
      confidence: this.calculateConfidence(params.transformation, parent),
      transformation: params.transformation,
      hash: this.calculateHash(uuid, params.transformation, params.storage),
      storage: params.storage,
    };

    if (params.parentUuid) {
      lineage.parentUuid = params.parentUuid;
    }

    if (params.graphNodeId) {
      lineage.graphNodeId = params.graphNodeId;
    }

    if (params.relation) {
      lineage.relation = params.relation;
    }

    if (params.metadata) {
      lineage.metadata = params.metadata;
    }

    this.lineageMap.set(uuid, lineage);
    return lineage;
  }

  /**
   * Get lineage by UUID
   */
  getLineage(uuid: string): DataLineage | undefined {
    return this.lineageMap.get(uuid);
  }

  /**
   * Query lineage records
   */
  queryLineage(query: LineageQuery): DataLineage[] {
    const results: DataLineage[] = [];

    for (const lineage of this.lineageMap.values()) {
      if (this.matchesQuery(lineage, query)) {
        results.push(lineage);
      }
    }

    return results;
  }

  /**
   * Trace lineage from root to leaf
   */
  traceLineage(rootUuid: string): LineageTrace {
    const path: DataLineage[] = [];
    const visited = new Set<string>();
    const current = this.lineageMap.get(rootUuid);

    if (!current) {
      return {
        rootUuid,
        path: [],
        depth: 0,
        totalNodes: 0,
        branches: 0,
      };
    }

    // Trace forward (children)
    this.traceForward(rootUuid, path, visited);

    // Calculate statistics
    const depth = this.calculateDepth(rootUuid);
    const totalNodes = path.length;
    const branches = this.countBranches(rootUuid);

    return {
      rootUuid,
      path,
      depth,
      totalNodes,
      branches,
    };
  }

  /**
   * Get lineage statistics
   */
  getStatistics(): LineageStatistics {
    const totalDataItems = this.lineageMap.size;
    const bySourceType: Record<SourceType, number> = {} as any;
    const byTransformationType: Record<TransformationType, number> = {} as any;
    const byStorageType: Record<StorageType, number> = {} as any;

    let totalConfidence = 0;
    let totalDepth = 0;
    let orphanedItems = 0;
    const circularReferences = this.detectCircularReferences();

    for (const lineage of this.lineageMap.values()) {
      // Count by source type
      bySourceType[lineage.source.type] =
        (bySourceType[lineage.source.type] || 0) + 1;

      // Count by transformation type
      byTransformationType[lineage.transformation.type] =
        (byTransformationType[lineage.transformation.type] || 0) + 1;

      // Count by storage type
      byStorageType[lineage.storage.type] =
        (byStorageType[lineage.storage.type] || 0) + 1;

      // Accumulate confidence
      totalConfidence += lineage.confidence;

      // Calculate depth
      totalDepth += this.calculateDepth(lineage.uuid);

      // Count orphaned items
      if (lineage.parentUuid && !this.lineageMap.has(lineage.parentUuid)) {
        orphanedItems++;
      }
    }

    const averageConfidence =
      totalDataItems > 0 ? totalConfidence / totalDataItems : 0;
    const averageDepth = totalDataItems > 0 ? totalDepth / totalDataItems : 0;

    return {
      totalDataItems,
      bySourceType,
      byTransformationType,
      byStorageType,
      averageConfidence,
      averageDepth,
      orphanedItems,
      circularReferences: circularReferences.length,
    };
  }

  /**
   * Validate lineage integrity
   */
  validateLineage(): LineageValidation {
    const errors: LineageError[] = [];
    const warnings: LineageWarning[] = [];
    const orphanedItems: string[] = [];
    const circularReferences = this.detectCircularReferences();
    const missingParents: string[] = [];

    for (const lineage of this.lineageMap.values()) {
      // Check for missing parent
      if (lineage.parentUuid && !this.lineageMap.has(lineage.parentUuid)) {
        errors.push({
          uuid: lineage.uuid,
          type: ErrorType.MISSING_PARENT,
          message: `Parent UUID ${lineage.parentUuid} not found`,
          severity: ErrorSeverity.HIGH,
        });
        missingParents.push(lineage.uuid);
        orphanedItems.push(lineage.uuid);
      }

      // Check confidence range
      if (lineage.confidence < 0 || lineage.confidence > 1) {
        errors.push({
          uuid: lineage.uuid,
          type: ErrorType.INVALID_CONFIDENCE,
          message: `Confidence ${lineage.confidence} is out of range [0, 1]`,
          severity: ErrorSeverity.MEDIUM,
        });
      }

      // Check timestamp
      if (lineage.timestamp > new Date()) {
        errors.push({
          uuid: lineage.uuid,
          type: ErrorType.INVALID_TIMESTAMP,
          message: `Timestamp ${lineage.timestamp} is in the future`,
          severity: ErrorSeverity.HIGH,
        });
      }

      // Check for low confidence
      if (lineage.confidence < 0.5) {
        warnings.push({
          uuid: lineage.uuid,
          type: WarningType.LOW_CONFIDENCE,
          message: `Confidence ${lineage.confidence} is below 0.5`,
          severity: WarningSeverity.WARNING,
        });
      }

      // Check for old data
      const age = Date.now() - lineage.timestamp.getTime();
      if (age > 365 * 24 * 60 * 60 * 1000) {
        // 1 year
        warnings.push({
          uuid: lineage.uuid,
          type: WarningType.OLD_DATA,
          message: `Data is older than 1 year`,
          severity: WarningSeverity.WARNING,
        });
      }

      // Check for temporary storage
      if (lineage.storage.retention === RetentionPolicy.TEMPORARY) {
        warnings.push({
          uuid: lineage.uuid,
          type: WarningType.TEMPORARY_STORAGE,
          message: `Data is stored with temporary retention policy`,
          severity: WarningSeverity.INFO,
        });
      }
    }

    // Add circular reference errors
    for (const circularRef of circularReferences) {
      errors.push({
        uuid: circularRef,
        type: ErrorType.CIRCULAR_REFERENCE,
        message: `Circular reference detected`,
        severity: ErrorSeverity.CRITICAL,
      });
    }

    const isValid = errors.length === 0;

    return {
      isValid,
      errors,
      warnings,
      orphanedItems,
      circularReferences,
      missingParents,
    };
  }

  /**
   * Perform lineage audit
   */
  auditLineage(): LineageAudit {
    const statistics = this.getStatistics();
    const validation = this.validateLineage();
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
   * Delete lineage record
   */
  deleteLineage(uuid: string): boolean {
    return this.lineageMap.delete(uuid);
  }

  /**
   * Clear all lineage records
   */
  clearLineage(): void {
    this.lineageMap.clear();
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private calculateConfidence(
    transformation: Transformation,
    parent?: DataLineage,
  ): number {
    // Base confidence based on transformation type
    const baseConfidence = this.getBaseConfidence(transformation.type);

    // Adjust based on parent confidence
    if (parent) {
      return (baseConfidence + parent.confidence) / 2;
    }

    return baseConfidence;
  }

  private getBaseConfidence(transformationType: TransformationType): number {
    const confidenceMap: Record<TransformationType, number> = {
      [TransformationType.EXTRACTION]: 0.8,
      [TransformationType.NORMALIZATION]: 0.9,
      [TransformationType.VALIDATION]: 0.95,
      [TransformationType.ENRICHMENT]: 0.7,
      [TransformationType.AGGREGATION]: 0.85,
      [TransformationType.FILTERING]: 0.9,
      [TransformationType.MATCHING]: 0.75,
      [TransformationType.SEARCH]: 0.8,
      [TransformationType.REASONING]: 0.7,
      [TransformationType.SERIALIZATION]: 0.95,
    };

    return confidenceMap[transformationType] || 0.5;
  }

  private calculateHash(
    uuid: string,
    transformation: Transformation,
    storage: DataStorage,
  ): string {
    const data = JSON.stringify({
      uuid,
      transformation,
      storage,
    });

    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private matchesQuery(lineage: DataLineage, query: LineageQuery): boolean {
    if (query.uuid && lineage.uuid !== query.uuid) return false;
    if (query.parentUuid && lineage.parentUuid !== query.parentUuid)
      return false;
    if (query.sourceType && lineage.source.type !== query.sourceType)
      return false;
    if (
      query.transformationType &&
      lineage.transformation.type !== query.transformationType
    )
      return false;
    if (query.relationType && lineage.relation?.type !== query.relationType)
      return false;
    if (query.storageType && lineage.storage.type !== query.storageType)
      return false;
    if (query.graphNodeId && lineage.graphNodeId !== query.graphNodeId)
      return false;

    if (query.startDate && lineage.timestamp < query.startDate) return false;
    if (query.endDate && lineage.timestamp > query.endDate) return false;

    if (
      query.minConfidence !== undefined &&
      lineage.confidence < query.minConfidence
    )
      return false;
    if (
      query.maxConfidence !== undefined &&
      lineage.confidence > query.maxConfidence
    )
      return false;

    return true;
  }

  private traceForward(
    uuid: string,
    path: DataLineage[],
    visited: Set<string>,
  ): void {
    if (visited.has(uuid)) return;
    visited.add(uuid);

    const lineage = this.lineageMap.get(uuid);
    if (lineage) {
      path.push(lineage);
    }

    // Find all children
    for (const [childUuid, childLineage] of this.lineageMap.entries()) {
      if (childLineage.parentUuid === uuid) {
        this.traceForward(childUuid, path, visited);
      }
    }
  }

  private calculateDepth(uuid: string): number {
    const lineage = this.lineageMap.get(uuid);
    if (!lineage || !lineage.parentUuid) return 0;

    const parentDepth = this.calculateDepth(lineage.parentUuid);
    return parentDepth + 1;
  }

  private countBranches(uuid: string): number {
    let count = 0;

    for (const [childUuid, childLineage] of this.lineageMap.entries()) {
      if (childLineage.parentUuid === uuid) {
        count++;
        count += this.countBranches(childUuid);
      }
    }

    return count;
  }

  private detectCircularReferences(): string[] {
    const circularRefs: string[] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    for (const uuid of this.lineageMap.keys()) {
      if (this.detectCircularDFS(uuid, visited, recursionStack)) {
        circularRefs.push(uuid);
      }
    }

    return circularRefs;
  }

  private detectCircularDFS(
    uuid: string,
    visited: Set<string>,
    recursionStack: Set<string>,
  ): boolean {
    if (!visited.has(uuid)) {
      visited.add(uuid);
      recursionStack.add(uuid);

      const lineage = this.lineageMap.get(uuid);
      if (lineage && lineage.parentUuid) {
        if (
          !visited.has(lineage.parentUuid) &&
          this.detectCircularDFS(lineage.parentUuid, visited, recursionStack)
        ) {
          return true;
        } else if (recursionStack.has(lineage.parentUuid)) {
          return true;
        }
      }
    }

    recursionStack.delete(uuid);
    return false;
  }

  private generateRecommendations(
    statistics: LineageStatistics,
    validation: LineageValidation,
  ): string[] {
    const recommendations: string[] = [];

    // Orphaned items
    if (statistics.orphanedItems > 0) {
      recommendations.push(
        `Fix ${statistics.orphanedItems} orphaned items by restoring or deleting their parents`,
      );
    }

    // Circular references
    if (statistics.circularReferences > 0) {
      recommendations.push(
        `Resolve ${statistics.circularReferences} circular references to prevent infinite loops`,
      );
    }

    // Low confidence
    if (statistics.averageConfidence < 0.7) {
      recommendations.push(
        `Improve data quality to increase average confidence from ${statistics.averageConfidence.toFixed(2)} to > 0.7`,
      );
    }

    // Deep lineage
    if (statistics.averageDepth > 10) {
      recommendations.push(
        `Consider flattening lineage graph to reduce average depth from ${statistics.averageDepth.toFixed(2)}`,
      );
    }

    // Temporary storage
    const temporaryStorageCount =
      statistics.byStorageType[StorageType.CACHE] +
      statistics.byStorageType[StorageType.MEMORY];
    if (temporaryStorageCount > statistics.totalDataItems * 0.5) {
      recommendations.push(
        `Reduce reliance on temporary storage (${temporaryStorageCount}/${statistics.totalDataItems} items)`,
      );
    }

    // Validation errors
    if (validation.errors.length > 0) {
      recommendations.push(
        `Fix ${validation.errors.length} validation errors to ensure data integrity`,
      );
    }

    return recommendations;
  }
}
