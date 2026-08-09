/**
 * Data Lineage Repository
 * Prisma-based persistence for data lineage records
 */

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
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
} from './lineage.types';

@Injectable()
export class LineageRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Create a new data lineage record
   */
  async createLineage(lineage: DataLineage): Promise<DataLineage> {
    const prismaLineage = await (this.prisma as any).dataLineage.create({
      data: {
        uuid: lineage.uuid,
        sourceType: lineage.source.type,
        sourceOrigin: lineage.source.origin,
        sourceProvenance: lineage.source.provenance,
        sourcePipeline: lineage.source.pipeline,
        sourceStage: lineage.source.stage,
        parentUuid: lineage.parentUuid || null,
        version: lineage.version,
        timestamp: lineage.timestamp,
        confidence: lineage.confidence,
        transformationType: lineage.transformation.type,
        transformationOperation: lineage.transformation.operation,
        transformationInputUuids: lineage.transformation.inputUuids,
        transformationOutputUuids: lineage.transformation.outputUuids,
        transformationParameters: lineage.transformation.parameters as any,
        transformationDescription: lineage.transformation.description,
        hash: lineage.hash,
        graphNodeId: lineage.graphNodeId,
        relationType: lineage.relation?.type,
        relationTargetUuid: lineage.relation?.targetUuid,
        relationName: lineage.relation?.relationName,
        relationWeight: lineage.relation?.weight,
        relationMetadata: lineage.relation?.metadata as any,
        storageType: lineage.storage.type,
        storageLocation: lineage.storage.location,
        storageFormat: lineage.storage.format,
        storageSize: lineage.storage.size,
        storageCompressed: lineage.storage.compressed,
        storageEncrypted: lineage.storage.encrypted,
        storageRetention: lineage.storage.retention,
        metadata: lineage.metadata as any,
      },
    });

    return this.mapPrismaToLineage(prismaLineage);
  }

  /**
   * Get lineage by UUID
   */
  async getLineageByUuid(uuid: string): Promise<DataLineage | null> {
    const prismaLineage = await (this.prisma as any).dataLineage.findUnique({
      where: { uuid },
    });

    if (!prismaLineage) {
      return null;
    }

    return this.mapPrismaToLineage(prismaLineage);
  }

  /**
   * Query lineage records
   */
  async queryLineage(query: LineageQuery): Promise<DataLineage[]> {
    const where: any = {};

    if (query.uuid) {
      where.uuid = query.uuid;
    }

    if (query.parentUuid) {
      where.parentUuid = query.parentUuid;
    }

    if (query.sourceType) {
      where.sourceType = query.sourceType;
    }

    if (query.transformationType) {
      where.transformationType = query.transformationType;
    }

    if (query.relationType) {
      where.relationType = query.relationType;
    }

    if (query.storageType) {
      where.storageType = query.storageType;
    }

    if (query.graphNodeId) {
      where.graphNodeId = query.graphNodeId;
    }

    if (query.startDate) {
      where.timestamp = { ...where.timestamp, gte: query.startDate };
    }

    if (query.endDate) {
      where.timestamp = { ...where.timestamp, lte: query.endDate };
    }

    if (query.minConfidence !== undefined) {
      where.confidence = { ...where.confidence, gte: query.minConfidence };
    }

    if (query.maxConfidence !== undefined) {
      where.confidence = { ...where.confidence, lte: query.maxConfidence };
    }

    const prismaLineages = await (this.prisma as any).dataLineage.findMany({
      where,
      orderBy: { timestamp: 'desc' },
    });

    return prismaLineages.map((pl: any) => this.mapPrismaToLineage(pl));
  }

  /**
   * Get all children of a lineage record
   */
  async getChildren(parentUuid: string): Promise<DataLineage[]> {
    const prismaLineages = await (this.prisma as any).dataLineage.findMany({
      where: { parentUuid },
      orderBy: { timestamp: 'desc' },
    });

    return prismaLineages.map((pl: any) => this.mapPrismaToLineage(pl));
  }

  /**
   * Get all parents of a lineage record (trace back to root)
   */
  async getAncestors(uuid: string): Promise<DataLineage[]> {
    const ancestors: DataLineage[] = [];
    let currentUuid = uuid;

    while (currentUuid) {
      const lineage = await this.getLineageByUuid(currentUuid);
      if (!lineage || !lineage.parentUuid) {
        break;
      }

      const parent = await this.getLineageByUuid(lineage.parentUuid);
      if (parent) {
        ancestors.push(parent);
        currentUuid = parent.uuid;
      } else {
        break;
      }
    }

    return ancestors;
  }

  /**
   * Delete lineage by UUID
   */
  async deleteLineage(uuid: string): Promise<boolean> {
    try {
      await (this.prisma as any).dataLineage.delete({
        where: { uuid },
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Delete all lineage records
   */
  async deleteAllLineage(): Promise<number> {
    const result = await (this.prisma as any).dataLineage.deleteMany({});
    return result.count;
  }

  /**
   * Get lineage statistics
   */
  async getStatistics(): Promise<LineageStatistics> {
    const totalDataItems = await (this.prisma as any).dataLineage.count();

    const bySourceType = await (this.prisma as any).dataLineage.groupBy({
      by: ['sourceType'],
      _count: true,
    });

    const byTransformationType = await (this.prisma as any).dataLineage.groupBy(
      {
        by: ['transformationType'],
        _count: true,
      },
    );

    const byStorageType = await (this.prisma as any).dataLineage.groupBy({
      by: ['storageType'],
      _count: true,
    });

    const avgConfidence = await (this.prisma as any).dataLineage.aggregate({
      _avg: { confidence: true },
    });

    const orphanedItems = await (this.prisma as any).dataLineage.count({
      where: {
        parentUuid: { not: null },
        AND: [
          {
            parentUuid: {
              notIn: (
                await (this.prisma as any).dataLineage.findMany({
                  select: { uuid: true },
                  distinct: ['uuid'],
                })
              ).map((l: any) => l.uuid),
            },
          },
        ],
      },
    });

    // Calculate average depth
    const allLineages = await (this.prisma as any).dataLineage.findMany();
    let totalDepth = 0;
    for (const lineage of allLineages) {
      totalDepth += await this.calculateDepth(lineage.uuid);
    }
    const averageDepth = totalDataItems > 0 ? totalDepth / totalDataItems : 0;

    // Detect circular references
    const circularReferences = await this.detectCircularReferences();

    const bySourceTypeMap: Record<SourceType, number> = {} as any;
    for (const group of bySourceType) {
      bySourceTypeMap[group.sourceType as SourceType] = group._count;
    }

    const byTransformationTypeMap: Record<TransformationType, number> =
      {} as any;
    for (const group of byTransformationType) {
      byTransformationTypeMap[group.transformationType as TransformationType] =
        group._count;
    }

    const byStorageTypeMap: Record<StorageType, number> = {} as any;
    for (const group of byStorageType) {
      byStorageTypeMap[group.storageType as StorageType] = group._count;
    }

    return {
      totalDataItems,
      bySourceType: bySourceTypeMap,
      byTransformationType: byTransformationTypeMap,
      byStorageType: byStorageTypeMap,
      averageConfidence: avgConfidence._avg.confidence || 0,
      averageDepth,
      orphanedItems,
      circularReferences: circularReferences.length,
    };
  }

  /**
   * Trace lineage from root to leaf
   */
  async traceLineage(rootUuid: string): Promise<LineageTrace> {
    const path: DataLineage[] = [];
    const visited = new Set<string>();

    await this.traceForward(rootUuid, path, visited);

    const depth = await this.calculateDepth(rootUuid);
    const totalNodes = path.length;
    const branches = await this.countBranches(rootUuid);

    return {
      rootUuid,
      path,
      depth,
      totalNodes,
      branches,
    };
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private mapPrismaToLineage(prismaLineage: any): DataLineage {
    return {
      uuid: prismaLineage.uuid,
      source: {
        type: prismaLineage.sourceType as SourceType,
        origin: prismaLineage.sourceOrigin,
        provenance: prismaLineage.sourceProvenance,
        pipeline: prismaLineage.sourcePipeline,
        stage: prismaLineage.sourceStage,
      },
      parentUuid: prismaLineage.parentUuid || undefined,
      version: prismaLineage.version,
      timestamp: prismaLineage.timestamp,
      confidence: prismaLineage.confidence,
      transformation: {
        type: prismaLineage.transformationType as TransformationType,
        operation: prismaLineage.transformationOperation,
        inputUuids: prismaLineage.transformationInputUuids || [],
        outputUuids: prismaLineage.transformationOutputUuids || [],
        parameters: prismaLineage.transformationParameters,
        description: prismaLineage.transformationDescription,
      },
      hash: prismaLineage.hash,
      graphNodeId: prismaLineage.graphNodeId || undefined,
      relation: prismaLineage.relationType
        ? {
            type: prismaLineage.relationType as RelationType,
            targetUuid: prismaLineage.relationTargetUuid || '',
            relationName: prismaLineage.relationName || '',
            weight: prismaLineage.relationWeight || 0,
            metadata: prismaLineage.relationMetadata || {},
          }
        : {
            type: RelationType.RELATED_TO,
            targetUuid: '',
            relationName: '',
            weight: 0,
            metadata: {},
          },
      storage: {
        type: prismaLineage.storageType as StorageType,
        location: prismaLineage.storageLocation,
        format: prismaLineage.storageFormat,
        size: prismaLineage.storageSize,
        compressed: prismaLineage.storageCompressed,
        encrypted: prismaLineage.storageEncrypted,
        retention: prismaLineage.storageRetention as RetentionPolicy,
      },
      metadata: prismaLineage.metadata,
    };
  }

  private async traceForward(
    uuid: string,
    path: DataLineage[],
    visited: Set<string>,
  ): Promise<void> {
    if (visited.has(uuid)) return;
    visited.add(uuid);

    const lineage = await this.getLineageByUuid(uuid);
    if (lineage) {
      path.push(lineage);
    }

    const children = await this.getChildren(uuid);
    for (const child of children) {
      await this.traceForward(child.uuid, path, visited);
    }
  }

  private async calculateDepth(uuid: string): Promise<number> {
    const lineage = await this.getLineageByUuid(uuid);
    if (!lineage || !lineage.parentUuid) return 0;

    const parentDepth = await this.calculateDepth(lineage.parentUuid);
    return parentDepth + 1;
  }

  private async countBranches(uuid: string): Promise<number> {
    let count = 0;
    const children = await this.getChildren(uuid);

    for (const child of children) {
      count++;
      count += await this.countBranches(child.uuid);
    }

    return count;
  }

  private async detectCircularReferences(): Promise<string[]> {
    const circularRefs: string[] = [];
    const allLineages = await (this.prisma as any).dataLineage.findMany();
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    for (const lineage of allLineages) {
      if (await this.detectCircularDFS(lineage.uuid, visited, recursionStack)) {
        circularRefs.push(lineage.uuid);
      }
    }

    return circularRefs;
  }

  private async detectCircularDFS(
    uuid: string,
    visited: Set<string>,
    recursionStack: Set<string>,
  ): Promise<boolean> {
    if (!visited.has(uuid)) {
      visited.add(uuid);
      recursionStack.add(uuid);

      const lineage = await this.getLineageByUuid(uuid);
      if (lineage && lineage.parentUuid) {
        if (
          !visited.has(lineage.parentUuid) &&
          (await this.detectCircularDFS(
            lineage.parentUuid,
            visited,
            recursionStack,
          ))
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
}
