/**
 * Data Lineage Repository
 * Handles persistence of data lineage entries
 * Note: Currently using in-memory storage. Should be migrated to Prisma when schema is updated.
 */

import { Injectable } from '@nestjs/common';
import {
  DataLineageEntry,
  DataLineageQuery,
  DataLineageTrace,
  GraphLineageEntry,
  GraphLineageQuery,
  GraphLineageTrace,
  DataLineageStatistics,
  DataStage,
  DataType,
  TransformationType,
} from './data-lineage.types';

@Injectable()
export class DataLineageRepository {
  private dataLineageEntries: Map<string, DataLineageEntry> = new Map();
  private graphLineageEntries: Map<string, GraphLineageEntry> = new Map();

  // ============================================================================
  // DATA LINEAGE OPERATIONS
  // ============================================================================

  async createEntry(entry: DataLineageEntry): Promise<DataLineageEntry> {
    this.dataLineageEntries.set(entry.id, entry);
    return entry;
  }

  async getEntry(id: string): Promise<DataLineageEntry | null> {
    return this.dataLineageEntries.get(id) || null;
  }

  async updateEntry(
    id: string,
    updates: Partial<DataLineageEntry>,
  ): Promise<DataLineageEntry | null> {
    const entry = this.dataLineageEntries.get(id);
    if (!entry) return null;

    const updated = { ...entry, ...updates, updatedAt: new Date() };
    this.dataLineageEntries.set(id, updated);
    return updated;
  }

  async deleteEntry(id: string): Promise<boolean> {
    return this.dataLineageEntries.delete(id);
  }

  async queryEntries(query: DataLineageQuery): Promise<DataLineageEntry[]> {
    const entries = Array.from(this.dataLineageEntries.values());

    return entries.filter((entry) => {
      if (query.dataId && entry.dataId !== query.dataId) return false;
      if (query.dataType && entry.dataType !== query.dataType) return false;
      if (query.stage && entry.stage !== query.stage) return false;
      if (query.source && entry.source !== query.source) return false;
      if (query.startDate && entry.createdAt < query.startDate) return false;
      if (query.endDate && entry.createdAt > query.endDate) return false;
      if (query.minConfidence && entry.confidence.score < query.minConfidence)
        return false;
      if (
        query.transformationType &&
        !entry.transformations.some((t) => t.type === query.transformationType)
      )
        return false;
      if (
        query.algorithm &&
        !entry.transformations.some((t) => t.algorithm === query.algorithm)
      )
        return false;
      if (
        query.parentIds &&
        !query.parentIds.some((pid) => entry.parentIds?.includes(pid))
      )
        return false;
      if (
        query.childIds &&
        !query.childIds.some((cid) => entry.childIds?.includes(cid))
      )
        return false;

      return true;
    });
  }

  async getTrace(dataId: string): Promise<DataLineageTrace | null> {
    const entries = await this.queryEntries({ dataId });
    if (entries.length === 0) return null;

    // Build lineage path from origin to current stage
    const path = this.buildPath(entries);

    const transformations = entries.flatMap((e) => e.transformations);
    const confidenceHistory = entries.map((e) => e.confidence);
    const versionHistory = entries.flatMap((e) => e.versions);

    return {
      dataId,
      lineage: entries,
      path,
      transformations,
      confidenceHistory,
      versionHistory,
    };
  }

  private buildPath(entries: DataLineageEntry[]): DataLineageEntry[] {
    // Sort by stage order and timestamp
    const stageOrder = {
      [DataStage.UPLOAD]: 0,
      [DataStage.EXTRACTION]: 1,
      [DataStage.NORMALIZATION]: 2,
      [DataStage.KNOWLEDGE_GRAPH]: 3,
      [DataStage.MATCHING]: 4,
      [DataStage.SEARCH]: 5,
      [DataStage.COPILOT]: 6,
      [DataStage.DASHBOARD]: 7,
    };

    return entries.sort((a, b) => {
      const stageDiff = stageOrder[a.stage] - stageOrder[b.stage];
      if (stageDiff !== 0) return stageDiff;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  async getStatistics(
    query?: DataLineageQuery,
  ): Promise<DataLineageStatistics> {
    const entries = query
      ? await this.queryEntries(query)
      : Array.from(this.dataLineageEntries.values());

    const entriesByStage: Record<DataStage, number> = {
      [DataStage.UPLOAD]: 0,
      [DataStage.EXTRACTION]: 0,
      [DataStage.NORMALIZATION]: 0,
      [DataStage.KNOWLEDGE_GRAPH]: 0,
      [DataStage.MATCHING]: 0,
      [DataStage.SEARCH]: 0,
      [DataStage.COPILOT]: 0,
      [DataStage.DASHBOARD]: 0,
    };

    const entriesByDataType: Record<DataType, number> = {
      [DataType.TEXT]: 0,
      [DataType.NUMBER]: 0,
      [DataType.BOOLEAN]: 0,
      [DataType.DATE]: 0,
      [DataType.ARRAY]: 0,
      [DataType.OBJECT]: 0,
      [DataType.GRAPH_NODE]: 0,
      [DataType.GRAPH_EDGE]: 0,
      [DataType.GRAPH]: 0,
    };

    const entriesBySource: Record<string, number> = {};
    const transformationByType: Record<TransformationType, number> = {
      [TransformationType.EXTRACTION]: 0,
      [TransformationType.NORMALIZATION]: 0,
      [TransformationType.MAPPING]: 0,
      [TransformationType.AGGREGATION]: 0,
      [TransformationType.FILTERING]: 0,
      [TransformationType.SCORING]: 0,
      [TransformationType.MATCHING]: 0,
      [TransformationType.RANKING]: 0,
      [TransformationType.REASONING]: 0,
      [TransformationType.SERIALIZATION]: 0,
      [TransformationType.DESERIALIZATION]: 0,
    };
    const transformationByAlgorithm: Record<string, number> = {};

    let totalConfidence = 0;
    let transformationCount = 0;

    entries.forEach((entry) => {
      entriesByStage[entry.stage]++;
      entriesByDataType[entry.dataType]++;

      entriesBySource[entry.source] = (entriesBySource[entry.source] || 0) + 1;

      totalConfidence += entry.confidence.score;

      entry.transformations.forEach((t) => {
        transformationCount++;
        transformationByType[t.type]++;
        transformationByAlgorithm[t.algorithm] =
          (transformationByAlgorithm[t.algorithm] || 0) + 1;
      });
    });

    return {
      totalEntries: entries.length,
      entriesByStage,
      entriesByDataType,
      entriesBySource,
      averageConfidence:
        entries.length > 0 ? totalConfidence / entries.length : 0,
      transformationCount,
      transformationByType,
      transformationByAlgorithm,
    };
  }

  // ============================================================================
  // GRAPH LINEAGE OPERATIONS
  // ============================================================================

  async createGraphEntry(entry: GraphLineageEntry): Promise<GraphLineageEntry> {
    this.graphLineageEntries.set(entry.id, entry);
    return entry;
  }

  async getGraphEntry(id: string): Promise<GraphLineageEntry | null> {
    return this.graphLineageEntries.get(id) || null;
  }

  async updateGraphEntry(
    id: string,
    updates: Partial<GraphLineageEntry>,
  ): Promise<GraphLineageEntry | null> {
    const entry = this.graphLineageEntries.get(id);
    if (!entry) return null;

    const updated = { ...entry, ...updates, updatedAt: new Date() };
    this.graphLineageEntries.set(id, updated);
    return updated;
  }

  async deleteGraphEntry(id: string): Promise<boolean> {
    return this.graphLineageEntries.delete(id);
  }

  async queryGraphEntries(
    query: GraphLineageQuery,
  ): Promise<GraphLineageEntry[]> {
    const entries = Array.from(this.graphLineageEntries.values());

    return entries.filter((entry) => {
      if (query.graphId && entry.graphId !== query.graphId) return false;
      if (query.nodeId && entry.nodeId !== query.nodeId) return false;
      if (query.edgeId && entry.edgeId !== query.edgeId) return false;
      if (query.stage && entry.stage !== query.stage) return false;
      if (query.source && entry.source !== query.source) return false;
      if (query.startDate && entry.createdAt < query.startDate) return false;
      if (query.endDate && entry.createdAt > query.endDate) return false;
      if (query.minConfidence && entry.confidence.score < query.minConfidence)
        return false;
      if (
        query.transformationType &&
        !entry.transformations.some((t) => t.type === query.transformationType)
      )
        return false;
      if (
        query.algorithm &&
        !entry.transformations.some((t) => t.algorithm === query.algorithm)
      )
        return false;

      return true;
    });
  }

  async getGraphTrace(graphId: string): Promise<GraphLineageTrace | null> {
    const entries = await this.queryGraphEntries({ graphId });
    if (entries.length === 0) return null;

    // Build node and edge lineage maps
    const nodeLineage = new Map<string, GraphLineageEntry[]>();
    const edgeLineage = new Map<string, GraphLineageEntry[]>();

    entries.forEach((entry) => {
      if (entry.nodeId) {
        if (!nodeLineage.has(entry.nodeId)) {
          nodeLineage.set(entry.nodeId, []);
        }
        nodeLineage.get(entry.nodeId)!.push(entry);
      }
      if (entry.edgeId) {
        if (!edgeLineage.has(entry.edgeId)) {
          edgeLineage.set(entry.edgeId, []);
        }
        edgeLineage.get(entry.edgeId)!.push(entry);
      }
    });

    const transformations = entries.flatMap((e) => e.transformations);
    const confidenceHistory = entries.map((e) => e.confidence);
    const versionHistory = entries.flatMap((e) => e.versions);

    return {
      graphId,
      lineage: entries,
      nodeLineage: nodeLineage.size > 0 ? nodeLineage : undefined,
      edgeLineage: edgeLineage.size > 0 ? edgeLineage : undefined,
      transformations,
      confidenceHistory,
      versionHistory,
    };
  }

  // ============================================================================
  // BATCH OPERATIONS
  // ============================================================================

  async createEntries(
    entries: DataLineageEntry[],
  ): Promise<DataLineageEntry[]> {
    entries.forEach((entry) => this.dataLineageEntries.set(entry.id, entry));
    return entries;
  }

  async createGraphEntries(
    entries: GraphLineageEntry[],
  ): Promise<GraphLineageEntry[]> {
    entries.forEach((entry) => this.graphLineageEntries.set(entry.id, entry));
    return entries;
  }

  async clearAll(): Promise<void> {
    this.dataLineageEntries.clear();
    this.graphLineageEntries.clear();
  }
}
