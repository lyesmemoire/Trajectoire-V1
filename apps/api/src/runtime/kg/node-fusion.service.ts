/**
 * Knowledge Graph RH Runtime v2
 * Node Fusion Service
 * Handles automatic fusion/merging of duplicate nodes
 */

import { Node, NodeType } from './graph-types';
import { INodeBuilder, FusionResult } from './builders/base.builder';

export interface FusionStats {
  totalNodes: number;
  mergedNodes: number;
  duplicateNodes: number;
  fusionRate: number;
}

export interface FusionOptions {
  confidenceThreshold?: number;
  mergeMetadata?: boolean;
  preserveSources?: boolean;
}

export class NodeFusionService {
  private readonly builders: Map<NodeType, INodeBuilder>;

  constructor(builders: Map<NodeType, INodeBuilder>) {
    this.builders = builders;
  }

  /**
   * Fuse a collection of nodes, automatically merging duplicates
   */
  fuseNodes(
    nodes: Node[],
    options: FusionOptions = {},
  ): { nodes: Node[]; stats: FusionStats } {
    const confidenceThreshold = options.confidenceThreshold ?? 0.5;
    const nodesByType = this.groupNodesByType(nodes);
    const fusedNodes: Node[] = [];
    let mergedCount = 0;
    let duplicateCount = 0;

    for (const [nodeType, typeNodes] of nodesByType.entries()) {
      const builder = this.builders.get(nodeType);
      if (!builder) {
        // No builder available, keep nodes as-is
        fusedNodes.push(...typeNodes);
        continue;
      }

      const {
        nodes: fusedTypeNodes,
        merged,
        duplicates,
      } = this.fuseNodesByType(
        typeNodes,
        builder,
        confidenceThreshold,
        options,
      );

      fusedNodes.push(...fusedTypeNodes);
      mergedCount += merged;
      duplicateCount += duplicates;
    }

    const stats: FusionStats = {
      totalNodes: nodes.length,
      mergedNodes: mergedCount,
      duplicateNodes: duplicateCount,
      fusionRate: nodes.length > 0 ? mergedCount / nodes.length : 0,
    };

    return { nodes: fusedNodes, stats };
  }

  /**
   * Fuse nodes of a specific type
   */
  private fuseNodesByType(
    nodes: Node[],
    builder: INodeBuilder,
    confidenceThreshold: number,
    options: FusionOptions,
  ): { nodes: Node[]; merged: number; duplicates: number } {
    const nodeMap = new Map<string, Node>();
    let mergedCount = 0;
    let duplicateCount = 0;

    for (const node of nodes) {
      const key = node.normalizedLabel;
      const existing = nodeMap.get(key);

      if (existing) {
        // Duplicate detected - merge
        const result = builder.merge(existing, node);
        nodeMap.set(key, result.node);
        mergedCount++;
        duplicateCount++;
      } else {
        // New node - add to map
        nodeMap.set(key, node);
      }
    }

    // Filter by confidence threshold
    const filteredNodes = Array.from(nodeMap.values()).filter(
      (node) => node.confidence >= confidenceThreshold,
    );

    return {
      nodes: filteredNodes,
      merged: mergedCount,
      duplicates: duplicateCount,
    };
  }

  /**
   * Group nodes by type
   */
  private groupNodesByType(nodes: Node[]): Map<NodeType, Node[]> {
    const grouped = new Map<NodeType, Node[]>();

    for (const node of nodes) {
      const typeNodes = grouped.get(node.type) || [];
      typeNodes.push(node);
      grouped.set(node.type, typeNodes);
    }

    return grouped;
  }

  /**
   * Manually merge two specific nodes
   */
  mergeNodes(node1: Node, node2: Node): FusionResult | null {
    if (node1.type !== node2.type) {
      return null; // Cannot merge different types
    }

    const builder = this.builders.get(node1.type);
    if (!builder) {
      return null;
    }

    return builder.merge(node1, node2);
  }

  /**
   * Find potential duplicates in a node collection
   */
  findDuplicates(nodes: Node[]): Map<string, Node[]> {
    const duplicates = new Map<string, Node[]>();
    const seen = new Map<string, Node>();

    for (const node of nodes) {
      const key = node.normalizedLabel;
      const existing = seen.get(key);

      if (existing) {
        const dupList = duplicates.get(key) || [];
        dupList.push(node);
        duplicates.set(key, dupList);
      } else {
        seen.set(key, node);
      }
    }

    return duplicates;
  }

  /**
   * Check if two nodes are duplicates based on normalized labels
   */
  areDuplicates(node1: Node, node2: Node): boolean {
    return (
      node1.type === node2.type &&
      node1.normalizedLabel === node2.normalizedLabel
    );
  }

  /**
   * Get fusion statistics for a node collection without actually fusing
   */
  getFusionStats(nodes: Node[]): FusionStats {
    const duplicates = this.findDuplicates(nodes);
    const duplicateCount = Array.from(duplicates.values()).reduce(
      (sum, dupList) => sum + dupList.length,
      0,
    );

    return {
      totalNodes: nodes.length,
      mergedNodes: 0,
      duplicateNodes: duplicateCount,
      fusionRate: nodes.length > 0 ? duplicateCount / nodes.length : 0,
    };
  }
}
