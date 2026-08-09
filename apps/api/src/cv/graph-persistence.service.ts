import { Injectable } from '@nestjs/common';
import { PrismaService } from '../runtime/kg/prisma.service';
import { Node, Edge, NodeType, EdgeType } from '../runtime/kg/graph-types';
import { v4 as uuidv4 } from 'uuid';

export interface PersistedNode {
  id: string;
  type: NodeType;
  label: string;
  normalizedLabel: string;
  confidence: number;
  source: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string;
  algorithmVersion: string;
  sourceDocument?: string | null;
  sourceSection?: string | null;
  sourceSentence?: string | null;
  hash?: string | null;
}

export interface PersistedEdge {
  id: string;
  type: EdgeType;
  sourceNode: string;
  targetNode: string;
  weight: number;
  confidence: number;
  reason?: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  algorithmVersion: string;
  sourceDocument?: string | null;
  sourceSection?: string | null;
  sourceSentence?: string | null;
  hash?: string | null;
  version: number;
}

export interface GraphPersistenceResult {
  nodes: PersistedNode[];
  edges: PersistedEdge[];
  stats: {
    nodesCreated: number;
    nodesUpdated: number;
    edgesCreated: number;
    edgesUpdated: number;
  };
}

@Injectable()
export class GraphPersistenceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Persist a complete graph with nodes and edges in a transaction
   */
  async persistGraph(
    nodes: Node[],
    edges: Edge[],
    options: { sourceDocument?: string; sourceSection?: string } = {},
  ): Promise<GraphPersistenceResult> {
    return this.prisma.$transaction(async (tx) => {
      const persistedNodes = await this.persistNodes(nodes, tx, options);
      const persistedEdges = await this.persistEdges(edges, tx, options);

      return {
        nodes: persistedNodes,
        edges: persistedEdges,
        stats: {
          nodesCreated: persistedNodes.length,
          nodesUpdated: 0,
          edgesCreated: persistedEdges.length,
          edgesUpdated: 0,
        },
      };
    });
  }

  /**
   * Persist nodes to database
   */
  async persistNodes(
    nodes: Node[],
    tx: any,
    options: { sourceDocument?: string; sourceSection?: string } = {},
  ): Promise<PersistedNode[]> {
    const persistedNodes: PersistedNode[] = [];

    for (const node of nodes) {
      const existingNode = await tx.graphNode.findUnique({
        where: { id: node.id },
      });

      if (existingNode) {
        const updated = await tx.graphNode.update({
          where: { id: node.id },
          data: {
            label: node.label,
            normalizedLabel: node.normalizedLabel,
            confidence: node.confidence,
            source: node.source,
            metadata: node.metadata as any,
            updatedAt: new Date(),
          },
        });
        persistedNodes.push(this.mapToPersistedNode(updated));
      } else {
        const created = await tx.graphNode.create({
          data: {
            id: node.id,
            type: node.type,
            label: node.label,
            normalizedLabel: node.normalizedLabel,
            confidence: node.confidence,
            source: node.source,
            metadata: node.metadata as any,
            createdAt: node.timestamps.createdAt,
            updatedAt: node.timestamps.updatedAt,
            deletedAt: node.timestamps.deletedAt,
            createdBy: node.provenance.createdBy,
            algorithmVersion: node.provenance.algorithmVersion,
            sourceDocument:
              options.sourceDocument || node.provenance.sourceDocument,
            sourceSection:
              options.sourceSection || node.provenance.sourceSection,
            sourceSentence: node.provenance.sourceSentence,
            hash: node.provenance.hash,
          },
        });
        persistedNodes.push(this.mapToPersistedNode(created));
      }
    }

    return persistedNodes;
  }

  /**
   * Persist edges to database with versioning
   */
  async persistEdges(
    edges: Edge[],
    tx: any,
    options: { sourceDocument?: string; sourceSection?: string } = {},
  ): Promise<PersistedEdge[]> {
    const persistedEdges: PersistedEdge[] = [];

    for (const edge of edges) {
      const existingEdge = await tx.graphEdge.findUnique({
        where: { id: edge.id },
      });

      if (existingEdge) {
        const currentVersion = existingEdge.version || 1;
        const updated = await tx.graphEdge.update({
          where: { id: edge.id },
          data: {
            weight: edge.weight,
            confidence: edge.confidence,
            reason: edge.reason,
            metadata: edge.metadata as any,
            updatedAt: new Date(),
            version: currentVersion + 1,
          },
        });
        persistedEdges.push(this.mapToPersistedEdge(updated));
      } else {
        const created = await tx.graphEdge.create({
          data: {
            id: edge.id,
            type: edge.type,
            sourceNode: edge.sourceNode,
            targetNode: edge.targetNode,
            weight: edge.weight,
            confidence: edge.confidence,
            reason: edge.reason,
            metadata: edge.metadata as any,
            createdAt: edge.timestamps.createdAt,
            updatedAt: edge.timestamps.updatedAt,
            createdBy: edge.provenance.createdBy,
            algorithmVersion: edge.provenance.algorithmVersion,
            sourceDocument:
              options.sourceDocument || edge.provenance.sourceDocument,
            sourceSection:
              options.sourceSection || edge.provenance.sourceSection,
            sourceSentence: edge.provenance.sourceSentence,
            hash: edge.provenance.hash,
            version: 1,
          },
        });
        persistedEdges.push(this.mapToPersistedEdge(created));
      }
    }

    return persistedEdges;
  }

  /**
   * Get a node by ID with mandatory ownership verification
   */
  async getNode(id: string, userId: string): Promise<PersistedNode | null> {
    const node = await this.prisma.graphNode.findUnique({
      where: { id },
      include: {
        graph: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!node) {
      return null;
    }

    // Verify ownership
    if (node.graph.userId !== userId) {
      throw new Error(`Access denied: Node ${id} belongs to a different user`);
    }

    return this.mapToPersistedNode(node);
  }

  /**
   * Get an edge by ID with mandatory ownership verification
   */
  async getEdge(id: string, userId: string): Promise<PersistedEdge | null> {
    const edge = await this.prisma.graphEdge.findUnique({
      where: { id },
      include: {
        graph: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!edge) {
      return null;
    }

    // Verify ownership
    if (edge.graph.userId !== userId) {
      throw new Error(`Access denied: Edge ${id} belongs to a different user`);
    }

    return this.mapToPersistedEdge(edge);
  }

  /**
   * Get all nodes for a candidate
   */
  async getCandidateNodes(candidateId: string): Promise<PersistedNode[]> {
    const nodes = await this.prisma.graphNode.findMany({
      where: {
        metadata: {
          path: ['candidateId'],
          equals: candidateId,
        },
      },
    });

    return nodes.map((n) => this.mapToPersistedNode(n));
  }

  /**
   * Get all edges for a candidate
   */
  async getCandidateEdges(candidateId: string): Promise<PersistedEdge[]> {
    const nodes = await this.getCandidateNodes(candidateId);
    const nodeIds = nodes.map((n) => n.id);

    if (nodeIds.length === 0) return [];

    const allEdges = await this.prisma.graphEdge.findMany();

    return allEdges
      .filter(
        (e: any) =>
          nodeIds.includes(e.sourceNode) || nodeIds.includes(e.targetNode),
      )
      .map((e: any) => this.mapToPersistedEdge(e));
  }

  /**
   * Delete a node (soft delete) with mandatory ownership verification
   */
  async softDeleteNode(id: string, userId: string): Promise<void> {
    const node = await this.prisma.graphNode.findUnique({
      where: { id },
      include: {
        graph: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!node) {
      throw new Error(`Node not found: ${id}`);
    }

    // Verify ownership
    if (node.graph.userId !== userId) {
      throw new Error(`Access denied: Node ${id} belongs to a different user`);
    }

    await this.prisma.graphNode.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Delete an edge with mandatory ownership verification
   */
  async deleteEdge(id: string, userId: string): Promise<void> {
    const edge = await this.prisma.graphEdge.findUnique({
      where: { id },
      include: {
        graph: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!edge) {
      throw new Error(`Edge not found: ${id}`);
    }

    // Verify ownership
    if (edge.graph.userId !== userId) {
      throw new Error(`Access denied: Edge ${id} belongs to a different user`);
    }

    await this.prisma.graphEdge.delete({
      where: { id },
    });
  }

  /**
   * Get edge history with mandatory ownership verification
   */
  async getEdgeHistory(edgeId: string, userId: string): Promise<PersistedEdge[]> {
    const edge = await this.prisma.graphEdge.findUnique({
      where: { id: edgeId },
      include: {
        graph: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!edge) {
      return [];
    }

    // Verify ownership
    if (edge.graph.userId !== userId) {
      throw new Error(`Access denied: Edge ${edgeId} belongs to a different user`);
    }

    // Return the edge as history (simplified implementation)
    return [this.mapToPersistedEdge(edge)];
  }

  private mapToPersistedNode(node: any): PersistedNode {
    return {
      id: node.id,
      type: node.type as NodeType,
      label: node.label,
      normalizedLabel: node.normalizedLabel,
      confidence: node.confidence,
      source: node.source,
      metadata: node.metadata as Record<string, unknown>,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
      deletedAt: node.deletedAt,
      createdBy: node.createdBy,
      algorithmVersion: node.algorithmVersion,
      sourceDocument: node.sourceDocument,
      sourceSection: node.sourceSection,
      sourceSentence: node.sourceSentence,
      hash: node.hash,
    };
  }

  private mapToPersistedEdge(edge: any): PersistedEdge {
    return {
      id: edge.id,
      type: edge.type as EdgeType,
      sourceNode: edge.sourceNode,
      targetNode: edge.targetNode,
      weight: edge.weight,
      confidence: edge.confidence,
      reason: edge.reason,
      metadata: edge.metadata as Record<string, unknown>,
      createdAt: edge.createdAt,
      updatedAt: edge.updatedAt,
      createdBy: edge.createdBy,
      algorithmVersion: edge.algorithmVersion,
      sourceDocument: edge.sourceDocument,
      sourceSection: edge.sourceSection,
      sourceSentence: edge.sourceSentence,
      hash: edge.hash,
      version: edge.version,
    };
  }
}
