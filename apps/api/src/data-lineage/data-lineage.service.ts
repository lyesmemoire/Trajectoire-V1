/**
 * Data Lineage Service
 * Main service for tracking data lineage across all stages
 */

import { Injectable } from '@nestjs/common';
import { DataLineageRepository } from './data-lineage.repository';
import {
  DataLineageEntry,
  DataLineageQuery,
  DataLineageTrace,
  GraphLineageEntry,
  GraphLineageQuery,
  GraphLineageTrace,
  DataLineageStatistics,
  DataLineageReport,
  DataStage,
  DataType,
  TransformationType,
  DataOrigin,
  DataTransformation,
  DataVersion,
  DataConfidence,
} from './data-lineage.types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DataLineageService {
  constructor(private readonly repository: DataLineageRepository) {}

  // ============================================================================
  // DATA LINEAGE TRACKING
  // ============================================================================

  /**
   * Track a data item at a specific stage
   */
  async trackData(
    dataId: string,
    dataType: DataType,
    stage: DataStage,
    source: string,
    value: any,
    origin: DataOrigin,
    transformation: DataTransformation,
    confidence: DataConfidence,
    parentIds?: string[],
    metadata?: Record<string, any>,
  ): Promise<DataLineageEntry> {
    const existingEntries = await this.repository.queryEntries({
      dataId,
      stage,
    });

    let currentVersion = 1;
    if (existingEntries.length > 0) {
      currentVersion =
        Math.max(...existingEntries.map((e) => e.currentVersion)) + 1;
    }

    const version: DataVersion = {
      version: currentVersion,
      timestamp: new Date(),
      createdBy: 'system',
      changeDescription: `Data processed at ${stage} stage`,
    };

    const entry: DataLineageEntry = {
      id: uuidv4(),
      dataId,
      dataType,
      stage,
      origin,
      transformations: [transformation],
      versions: [version],
      currentVersion,
      confidence,
      source,
      value,
      metadata,
      parentIds,
      childIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update parent entries to include this entry as a child
    if (parentIds) {
      for (const parentId of parentIds) {
        const parentEntry = await this.repository.getEntry(parentId);
        if (parentEntry) {
          parentEntry.childIds = [...(parentEntry.childIds || []), entry.id];
          await this.repository.updateEntry(parentId, {
            childIds: parentEntry.childIds,
          });
        }
      }
    }

    return await this.repository.createEntry(entry);
  }

  /**
   * Track multiple transformations for a data item
   */
  async trackTransformations(
    dataId: string,
    transformations: DataTransformation[],
  ): Promise<void> {
    const entries = await this.repository.queryEntries({ dataId });

    for (const entry of entries) {
      const updatedTransformations = [
        ...entry.transformations,
        ...transformations,
      ];
      await this.repository.updateEntry(entry.id, {
        transformations: updatedTransformations,
      });
    }
  }

  /**
   * Update confidence score for a data item
   */
  async updateConfidence(
    dataId: string,
    confidence: DataConfidence,
  ): Promise<void> {
    const entries = await this.repository.queryEntries({ dataId });

    for (const entry of entries) {
      await this.repository.updateEntry(entry.id, { confidence });
    }
  }

  /**
   * Get complete trace for a data item
   */
  async getTrace(dataId: string): Promise<DataLineageTrace | null> {
    return await this.repository.getTrace(dataId);
  }

  /**
   * Query data lineage entries
   */
  async query(query: DataLineageQuery): Promise<DataLineageEntry[]> {
    return await this.repository.queryEntries(query);
  }

  /**
   * Get statistics for data lineage
   */
  async getStatistics(
    query?: DataLineageQuery,
  ): Promise<DataLineageStatistics> {
    return await this.repository.getStatistics(query);
  }

  /**
   * Generate a complete report for a data item
   */
  async generateReport(dataId: string): Promise<DataLineageReport | null> {
    const trace = await this.getTrace(dataId);
    if (!trace) return null;

    const statistics = await this.getStatistics({ dataId });

    // Generate recommendations based on lineage analysis
    const recommendations = this.generateRecommendations(trace, statistics);

    return {
      dataId,
      trace,
      statistics,
      recommendations,
    };
  }

  private generateRecommendations(
    trace: DataLineageTrace,
    statistics: DataLineageStatistics,
  ): string[] {
    const recommendations: string[] = [];

    // Check confidence
    if (statistics.averageConfidence < 0.7) {
      recommendations.push(
        'Low confidence detected. Consider improving data quality at extraction stage.',
      );
    }

    // Check transformation count
    if (statistics.transformationCount > 10) {
      recommendations.push(
        'High number of transformations. Consider simplifying the pipeline.',
      );
    }

    // Check for missing stages
    const stagesWithData = new Set(trace.lineage.map((e) => e.stage));
    const requiredStages = [
      DataStage.UPLOAD,
      DataStage.EXTRACTION,
      DataStage.NORMALIZATION,
      DataStage.KNOWLEDGE_GRAPH,
    ];

    for (const stage of requiredStages) {
      if (!stagesWithData.has(stage)) {
        recommendations.push(`Missing data at ${stage} stage.`);
      }
    }

    return recommendations;
  }

  // ============================================================================
  // GRAPH LINEAGE TRACKING
  // ============================================================================

  /**
   * Track a graph at a specific stage
   */
  async trackGraph(
    graphId: string,
    stage: DataStage,
    source: string,
    origin: DataOrigin,
    transformation: DataTransformation,
    confidence: DataConfidence,
    parentGraphIds?: string[],
    metadata?: Record<string, any>,
  ): Promise<GraphLineageEntry> {
    const existingEntries = await this.repository.queryGraphEntries({
      graphId,
      stage,
    });

    let currentVersion = 1;
    if (existingEntries.length > 0) {
      currentVersion =
        Math.max(...existingEntries.map((e) => e.currentVersion)) + 1;
    }

    const version: DataVersion = {
      version: currentVersion,
      timestamp: new Date(),
      createdBy: 'system',
      changeDescription: `Graph processed at ${stage} stage`,
    };

    const entry: GraphLineageEntry = {
      id: uuidv4(),
      graphId,
      stage,
      origin,
      transformations: [transformation],
      versions: [version],
      currentVersion,
      confidence,
      source,
      metadata,
      parentGraphIds,
      childGraphIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.repository.createGraphEntry(entry);
  }

  /**
   * Track a graph node at a specific stage
   */
  async trackGraphNode(
    graphId: string,
    nodeId: string,
    stage: DataStage,
    source: string,
    origin: DataOrigin,
    transformation: DataTransformation,
    confidence: DataConfidence,
    metadata?: Record<string, any>,
  ): Promise<GraphLineageEntry> {
    const existingEntries = await this.repository.queryGraphEntries({
      graphId,
      nodeId,
      stage,
    });

    let currentVersion = 1;
    if (existingEntries.length > 0) {
      currentVersion =
        Math.max(...existingEntries.map((e) => e.currentVersion)) + 1;
    }

    const version: DataVersion = {
      version: currentVersion,
      timestamp: new Date(),
      createdBy: 'system',
      changeDescription: `Node processed at ${stage} stage`,
    };

    const entry: GraphLineageEntry = {
      id: uuidv4(),
      graphId,
      nodeId,
      stage,
      origin,
      transformations: [transformation],
      versions: [version],
      currentVersion,
      confidence,
      source,
      metadata,
      parentGraphIds: undefined,
      childGraphIds: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.repository.createGraphEntry(entry);
  }

  /**
   * Track a graph edge at a specific stage
   */
  async trackGraphEdge(
    graphId: string,
    edgeId: string,
    stage: DataStage,
    source: string,
    origin: DataOrigin,
    transformation: DataTransformation,
    confidence: DataConfidence,
    metadata?: Record<string, any>,
  ): Promise<GraphLineageEntry> {
    const existingEntries = await this.repository.queryGraphEntries({
      graphId,
      edgeId,
      stage,
    });

    let currentVersion = 1;
    if (existingEntries.length > 0) {
      currentVersion =
        Math.max(...existingEntries.map((e) => e.currentVersion)) + 1;
    }

    const version: DataVersion = {
      version: currentVersion,
      timestamp: new Date(),
      createdBy: 'system',
      changeDescription: `Edge processed at ${stage} stage`,
    };

    const entry: GraphLineageEntry = {
      id: uuidv4(),
      graphId,
      edgeId,
      stage,
      origin,
      transformations: [transformation],
      versions: [version],
      currentVersion,
      confidence,
      source,
      metadata,
      parentGraphIds: undefined,
      childGraphIds: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.repository.createGraphEntry(entry);
  }

  /**
   * Get complete trace for a graph
   */
  async getGraphTrace(graphId: string): Promise<GraphLineageTrace | null> {
    return await this.repository.getGraphTrace(graphId);
  }

  /**
   * Query graph lineage entries
   */
  async queryGraph(query: GraphLineageQuery): Promise<GraphLineageEntry[]> {
    return await this.repository.queryGraphEntries(query);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Create a data origin
   */
  createOrigin(
    source: string,
    sourceId: string,
    metadata?: Record<string, any>,
  ): DataOrigin {
    return {
      source,
      sourceId,
      timestamp: new Date(),
      metadata,
    };
  }

  /**
   * Create a data transformation
   */
  createTransformation(
    type: TransformationType,
    algorithm: string,
    version: string,
    parameters?: Record<string, any>,
    duration?: number,
  ): DataTransformation {
    return {
      type,
      algorithm,
      version,
      parameters,
      timestamp: new Date(),
      duration,
    };
  }

  /**
   * Create a data confidence
   */
  createConfidence(
    score: number,
    algorithm: string,
    factors?: Record<string, number>,
  ): DataConfidence {
    return {
      score,
      algorithm,
      factors,
      timestamp: new Date(),
    };
  }

  /**
   * Clear all lineage data (useful for testing)
   */
  async clearAll(): Promise<void> {
    await this.repository.clearAll();
  }
}
