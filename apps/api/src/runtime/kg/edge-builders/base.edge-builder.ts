/**
 * Knowledge Graph RH Runtime v2
 * Base Edge Builder Interface
 * Defines the contract for all specialized edge builders
 */

import {
  Edge,
  EdgeType,
  EdgeMetadata,
  NodeTimestamps,
  EdgeProvenance,
} from '../graph-types';

export interface EdgeBuildOptions {
  weight?: number;
  confidence?: number;
  reason?: string;
  metadata?: EdgeMetadata;
  provenance?: EdgeProvenance;
}

export interface EdgeData {
  sourceNodeId: string;
  targetNodeId: string;
}

export interface IEdgeBuilder {
  /**
   * Build an edge from source and target node IDs
   */
  build(data: EdgeData, options?: EdgeBuildOptions): Edge;

  /**
   * Build multiple edges from data array
   */
  buildBatch(data: EdgeData[], options?: EdgeBuildOptions): Edge[];

  /**
   * Calculate edge weight based on node attributes
   */
  calculateWeight(
    data: EdgeData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): number;

  /**
   * Calculate edge confidence based on data quality
   */
  calculateConfidence(
    data: EdgeData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): number;

  /**
   * Generate a reason for the edge existence
   */
  generateReason(
    data: EdgeData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): string;

  /**
   * Get the edge type for this builder
   */
  getEdgeType(): EdgeType;
}

export abstract class BaseEdgeBuilder implements IEdgeBuilder {
  constructor(protected readonly edgeType: EdgeType) {}

  abstract calculateWeight(
    data: EdgeData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): number;
  abstract calculateConfidence(
    data: EdgeData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): number;
  abstract generateReason(
    data: EdgeData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): string;

  getEdgeType(): EdgeType {
    return this.edgeType;
  }

  build(data: EdgeData, options: EdgeBuildOptions = {}): Edge {
    const now = new Date();
    const weight = options.weight ?? 0.5;
    const confidence = options.confidence ?? 0.5;
    const reason = options.reason ?? this.generateReason(data);

    return {
      id: this.generateId(data.sourceNodeId, data.targetNodeId),
      type: this.edgeType,
      sourceNode: data.sourceNodeId,
      targetNode: data.targetNodeId,
      weight,
      confidence,
      reason,
      metadata: options.metadata ?? {},
      timestamps: {
        createdAt: now,
        updatedAt: now,
      },
      provenance: options.provenance ?? {
        createdBy: 'system',
        algorithmVersion: '1.0.0',
      },
    };
  }

  buildBatch(data: EdgeData[], options: EdgeBuildOptions = {}): Edge[] {
    return data.map((item) => this.build(item, options));
  }

  protected generateId(sourceNodeId: string, targetNodeId: string): string {
    return `${this.edgeType.toLowerCase()}-${sourceNodeId}-${targetNodeId}`;
  }

  protected createTimestamps(): NodeTimestamps {
    const now = new Date();
    return {
      createdAt: now,
      updatedAt: now,
    };
  }

  protected extractNumber(
    data: unknown,
    field: string,
    defaultValue = 0,
  ): number {
    if (typeof data === 'object' && data !== null) {
      const value = (data as Record<string, unknown>)[field];
      return typeof value === 'number' ? value : defaultValue;
    }
    return defaultValue;
  }

  protected extractString(
    data: unknown,
    field: string,
    defaultValue = '',
  ): string {
    if (typeof data === 'object' && data !== null) {
      const value = (data as Record<string, unknown>)[field];
      return typeof value === 'string' ? value : defaultValue;
    }
    return defaultValue;
  }

  protected extractBoolean(data: unknown, field: string): boolean | undefined {
    if (typeof data === 'object' && data !== null) {
      const value = (data as Record<string, unknown>)[field];
      return typeof value === 'boolean' ? value : undefined;
    }
    return undefined;
  }
}
