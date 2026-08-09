/**
 * Knowledge Graph RH Runtime v2
 * Base Builder Interface
 * Defines the contract for all specialized node builders
 */

import { Node, NodeType, NodeMetadata, NodeProvenance } from '../graph-types';
import { EntityNormalizerService } from '../entity-normalizer.service';

export interface BuildOptions {
  confidence?: number;
  source?: string;
  metadata?: NodeMetadata;
  provenance?: NodeProvenance;
}

export interface FusionResult {
  node: Node;
  merged: boolean;
  confidence: number;
}

export interface INodeBuilder {
  /**
   * Build a node from raw data
   */
  build(data: unknown, options?: BuildOptions): Node;

  /**
   * Build multiple nodes from raw data array
   */
  buildBatch(data: unknown[], options?: BuildOptions): Node[];

  /**
   * Merge two nodes of the same type
   */
  merge(existing: Node, incoming: Node): FusionResult;

  /**
   * Calculate confidence score for the node
   */
  calculateConfidence(data: unknown, source?: string): number;

  /**
   * Normalize the node label
   */
  normalizeLabel(label: string): string;

  /**
   * Get the node type for this builder
   */
  getNodeType(): NodeType;
}

export abstract class BaseNodeBuilder implements INodeBuilder {
  constructor(
    protected readonly entityNormalizer: EntityNormalizerService,
    protected readonly nodeType: NodeType,
  ) {}

  abstract build(data: unknown, options?: BuildOptions): Node;
  abstract buildBatch(data: unknown[], options?: BuildOptions): Node[];
  abstract calculateConfidence(data: unknown, source?: string): number;

  getNodeType(): NodeType {
    return this.nodeType;
  }

  normalizeLabel(label: string): string {
    return this.entityNormalizer.normalizeLabel(label, this.nodeType);
  }

  merge(existing: Node, incoming: Node): FusionResult {
    // If nodes are identical, no merge needed
    if (existing.normalizedLabel === incoming.normalizedLabel) {
      return {
        node: this.updateNodeConfidence(
          existing,
          Math.max(existing.confidence, incoming.confidence),
        ),
        merged: false,
        confidence: existing.confidence,
      };
    }

    // Merge metadata
    const mergedMetadata: NodeMetadata = {
      ...existing.metadata,
      ...incoming.metadata,
      sources: this.mergeSources(existing, incoming),
    };

    // Calculate merged confidence (weighted average based on source reliability)
    const mergedConfidence = this.calculateMergedConfidence(existing, incoming);

    const mergedNode: Node = {
      ...existing,
      metadata: mergedMetadata,
      confidence: mergedConfidence,
      timestamps: {
        ...existing.timestamps,
        updatedAt: new Date(),
      },
    };

    return {
      node: mergedNode,
      merged: true,
      confidence: mergedConfidence,
    };
  }

  protected updateNodeConfidence(node: Node, confidence: number): Node {
    return {
      ...node,
      confidence,
      timestamps: {
        ...node.timestamps,
        updatedAt: new Date(),
      },
    };
  }

  protected mergeSources(existing: Node, incoming: Node): string[] {
    const existingSources = (existing.metadata.sources as string[]) || [
      existing.source,
    ];
    const incomingSources = (incoming.metadata.sources as string[]) || [
      incoming.source,
    ];
    return [...new Set([...existingSources, ...incomingSources])];
  }

  protected calculateMergedConfidence(existing: Node, incoming: Node): number {
    const sourceWeights: Record<string, number> = {
      CV_PARSER: 0.9,
      JOB_EXTRACTOR: 0.85,
      MANUAL: 1.0,
      IMPORT: 0.7,
      UNKNOWN: 0.5,
    };

    const existingWeight = sourceWeights[existing.source] || 0.5;
    const incomingWeight = sourceWeights[incoming.source] || 0.5;

    const weightedSum =
      existing.confidence * existingWeight +
      incoming.confidence * incomingWeight;
    const totalWeight = existingWeight + incomingWeight;

    return Math.min(1.0, weightedSum / totalWeight);
  }

  protected createBaseNode(label: string, options: BuildOptions = {}): Node {
    const now = new Date();
    const normalizedLabel = this.normalizeLabel(label);
    const confidence = options.confidence ?? 1.0;
    const source = options.source ?? 'UNKNOWN';

    return {
      id: this.generateId(label, source),
      type: this.nodeType,
      label,
      normalizedLabel,
      confidence,
      source,
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

  protected generateId(label: string, source: string): string {
    const normalized = label.toLowerCase().replace(/\s+/g, '-');
    return `${this.nodeType.toLowerCase()}-${normalized}-${source.toLowerCase()}`;
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

  protected extractArray<T>(
    data: unknown,
    field: string,
    defaultValue: T[] = [],
  ): T[] {
    if (typeof data === 'object' && data !== null) {
      const value = (data as Record<string, unknown>)[field];
      return Array.isArray(value) ? value : defaultValue;
    }
    return defaultValue;
  }
}
