/**
 * Knowledge Graph RH Runtime v2
 * Graph Repository Service
 *
 * Handles persistence of graphs with:
 * - tenant/user isolation
 * - versioning
 * - soft delete
 * - transactions
 * - snapshots
 * - user-scoped caching
 */

import { Graph, Node, Edge } from './graph-types';
import {
  PrismaClient,
  Graph as PrismaGraph,
  GraphNode as PrismaGraphNode,
  GraphEdge as PrismaGraphEdge,
  GraphVersion as PrismaGraphVersion,
  GraphSnapshot as PrismaGraphSnapshot,
} from '@prisma/client';
import { CacheService } from '../../cache/cache.decorator';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { RollbackService } from '../../resilience/rollback.service';
import { PrismaService } from './prisma.service';

export interface GraphCreateInput {
  name?: string;
  description?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface GraphUpdateInput {
  name?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface GraphFilter {
  isActive?: boolean;
  source?: string;
  includeDeleted?: boolean;
}

export interface NodeFilter {
  type?: string;
  normalizedLabel?: string;
  minConfidence?: number;
  maxConfidence?: number;
  includeDeleted?: boolean;
}

export interface EdgeFilter {
  type?: string;
  sourceNodeId?: string;
  targetNodeId?: string;
  minWeight?: number;
  maxWeight?: number;
  minConfidence?: number;
  maxConfidence?: number;
  includeDeleted?: boolean;
}

export interface VersionCreateInput {
  description?: string;
  changeLog?: Record<string, unknown>;
  createdBy?: string;
}

export interface SnapshotCreateInput {
  name: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class GraphRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
    private readonly rollbackService: RollbackService,
  ) {}

  // ==========================================================================
  // GRAPH OWNERSHIP
  // ==========================================================================

  /**
   * Returns a graph only when it belongs to the authenticated user.
   *
   * Security invariant:
   * Every graph-scoped operation must pass through this method before
   * accessing child resources.
   */
  private async requireGraphOwnership(
    graphId: string,
    userId: string,
  ): Promise<{ id: string; userId: string }> {
    const graph = await this.prisma.graph.findFirst({
      where: {
        id: graphId,
        userId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!graph) {
      // Deliberately use 404 rather than revealing whether another user's
      // graph exists.
      throw new NotFoundException(`Graph ${graphId} not found`);
    }

    return graph;
  }

  /**
   * Verify ownership through a node.
   */
  private async requireNodeOwnership(
    nodeId: string,
    userId: string,
  ): Promise<{ id: string; graphId: string }> {
    const node = await this.prisma.graphNode.findUnique({
      where: { id: nodeId },
      select: {
        id: true,
        graphId: true,
      },
    });

    if (!node) {
      throw new NotFoundException(`Node ${nodeId} not found`);
    }

    await this.requireGraphOwnership(node.graphId, userId);

    return node;
  }

  /**
   * Verify ownership through an edge.
   */
  private async requireEdgeOwnership(
    edgeId: string,
    userId: string,
  ): Promise<{ id: string; graphId: string }> {
    const edge = await this.prisma.graphEdge.findUnique({
      where: { id: edgeId },
      select: {
        id: true,
        graphId: true,
      },
    });

    if (!edge) {
      throw new NotFoundException(`Edge ${edgeId} not found`);
    }

    await this.requireGraphOwnership(edge.graphId, userId);

    return edge;
  }

  /**
   * Verify ownership through a snapshot.
   */
  private async requireSnapshotOwnership(
    snapshotId: string,
    userId: string,
  ): Promise<{ id: string; graphId: string }> {
    const snapshot = await this.prisma.graphSnapshot.findUnique({
      where: { id: snapshotId },
      select: {
        id: true,
        graphId: true,
      },
    });

    if (!snapshot) {
      throw new NotFoundException(
        `Snapshot ${snapshotId} not found`,
      );
    }

    await this.requireGraphOwnership(snapshot.graphId, userId);

    return snapshot;
  }

  // ==========================================================================
  // GRAPH CRUD
  // ==========================================================================

  async createGraph(
    input: GraphCreateInput,
    userId: string,
  ): Promise<Graph> {
    const data = {
      name: input.name || 'Unnamed Graph',
      description: input.description || null,
      source: input.source || 'UNKNOWN',
      metadata: input.metadata as any,
      userId,
    };

    const prismaGraph = await this.prisma.graph.create({
      data,
    });

    const graph = this.mapPrismaGraphToGraph(prismaGraph);

    const cacheKey = this.graphCacheKey(graph.id, userId);

    await this.cacheService.set(
      cacheKey,
      graph,
      3600,
    );

    return graph;
  }

  async getGraphById(
    id: string,
    filter: GraphFilter,
    userId: string,
  ): Promise<Graph | null> {
    const cacheKey = this.graphCacheKey(id, userId);

    const cached = await this.cacheService.get<Graph>(cacheKey);

    if (cached) {
      return cached;
    }

    const prismaGraph = await this.prisma.graph.findFirst({
      where: {
        id,
        userId,
        ...this.buildGraphWhere(filter),
      },
      include: {
        nodes: {
          where: this.buildNodeWhere({
            includeDeleted: filter.includeDeleted,
          }),
        },
        edges: {
          where: this.buildEdgeWhere({
            includeDeleted: filter.includeDeleted,
          }),
        },
      },
    });

    if (!prismaGraph) {
      return null;
    }

    const graph = this.mapPrismaGraphToGraph(prismaGraph);

    await this.cacheService.set(
      cacheKey,
      graph,
      3600,
    );

    return graph;
  }

  async updateGraph(
    id: string,
    input: GraphUpdateInput,
    userId: string,
  ): Promise<Graph> {
    await this.requireGraphOwnership(id, userId);

    return this.rollbackService.executeWithRollback(
      async () => {
        const updateData: Record<string, unknown> = {};

        if (input.name !== undefined) {
          updateData.name = input.name;
        }

        if (input.description !== undefined) {
          updateData.description = input.description;
        }

        if (input.metadata !== undefined) {
          updateData.metadata = input.metadata as any;
        }

        const prismaGraph = await this.prisma.graph.update({
          where: { id },
          data: updateData,
        });

        const graph = this.mapPrismaGraphToGraph(prismaGraph);

        await this.invalidateGraphCache(id, userId);

        return graph;
      },
      async () => {
        await this.invalidateGraphCache(id, userId);
      },
      `update-graph-${id}`,
    );
  }

  async softDeleteGraph(
    id: string,
    userId: string,
  ): Promise<Graph> {
    await this.requireGraphOwnership(id, userId);

    const prismaGraph = await this.prisma.graph.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    await this.invalidateGraphCache(id, userId);

    return this.mapPrismaGraphToGraph(prismaGraph);
  }

  async hardDeleteGraph(
    id: string,
    userId: string,
  ): Promise<void> {
    await this.requireGraphOwnership(id, userId);

    await this.prisma.graph.delete({
      where: { id },
    });

    await this.invalidateGraphCache(id, userId);
  }

  async restoreGraph(
    id: string,
    userId: string,
  ): Promise<Graph> {
    await this.requireGraphOwnership(id, userId);

    const prismaGraph = await this.prisma.graph.update({
      where: { id },
      data: {
        deletedAt: null,
        isActive: true,
      },
    });

    await this.invalidateGraphCache(id, userId);

    return this.mapPrismaGraphToGraph(prismaGraph);
  }

  async listGraphs(
    filter: GraphFilter,
    userId: string,
    skip = 0,
    take = 50,
  ): Promise<Graph[]> {
    const where = {
      ...this.buildGraphWhere(filter),
      userId,
    };

    const prismaGraphs = await this.prisma.graph.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return prismaGraphs.map((graph) =>
      this.mapPrismaGraphToGraph(graph),
    );
  }

  // ==========================================================================
  // NODE CRUD
  // ==========================================================================

  async createNodes(
    graphId: string,
    nodes: Node[],
    userId: string,
  ): Promise<Node[]> {
    await this.requireGraphOwnership(graphId, userId);

    await this.prisma.graphNode.createMany({
      data: nodes.map((node) => ({
        graphId,
        nodeId: node.id,
        type: node.type,
        label: node.label,
        normalizedLabel: node.normalizedLabel,
        confidence: node.confidence,
        source: node.source,
        metadata: node.metadata as any,
      })),
      skipDuplicates: true,
    });

    await this.invalidateGraphCache(graphId, userId);

    return this.getNodesByGraphId(
      graphId,
      {},
      userId,
    );
  }

  async getNodesByGraphId(
    graphId: string,
    filter: NodeFilter = {},
    userId: string,
  ): Promise<Node[]> {
    await this.requireGraphOwnership(graphId, userId);

    const prismaNodes =
      await this.prisma.graphNode.findMany({
        where: {
          graphId,
          ...this.buildNodeWhere(filter),
        },
      });

    return prismaNodes.map((node) =>
      this.mapPrismaNodeToNode(node),
    );
  }

  async updateNode(
    id: string,
    updates: Partial<Node>,
    userId: string,
  ): Promise<Node> {
    const node = await this.requireNodeOwnership(
      id,
      userId,
    );

    const updateData: Record<string, unknown> = {};

    if (updates.label !== undefined) {
      updateData.label = updates.label;
    }

    if (updates.normalizedLabel !== undefined) {
      updateData.normalizedLabel =
        updates.normalizedLabel;
    }

    if (updates.confidence !== undefined) {
      updateData.confidence = updates.confidence;
    }

    if (updates.metadata !== undefined) {
      updateData.metadata =
        updates.metadata as any;
    }

    const prismaNode =
      await this.prisma.graphNode.update({
        where: { id },
        data: updateData,
      });

    await this.invalidateGraphCache(
      node.graphId,
      userId,
    );

    return this.mapPrismaNodeToNode(prismaNode);
  }

  async softDeleteNode(
    id: string,
    userId: string,
  ): Promise<Node> {
    const node = await this.requireNodeOwnership(
      id,
      userId,
    );

    const prismaNode =
      await this.prisma.graphNode.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

    await this.invalidateGraphCache(
      node.graphId,
      userId,
    );

    return this.mapPrismaNodeToNode(prismaNode);
  }

  async deleteNodesByGraphId(
    graphId: string,
    userId: string,
  ): Promise<void> {
    await this.requireGraphOwnership(
      graphId,
      userId,
    );

    await this.prisma.graphNode.deleteMany({
      where: { graphId },
    });

    await this.invalidateGraphCache(
      graphId,
      userId,
    );
  }

  // ==========================================================================
  // EDGE CRUD
  // ==========================================================================

  async createEdges(
    graphId: string,
    edges: Edge[],
    userId: string,
  ): Promise<Edge[]> {
    await this.requireGraphOwnership(
      graphId,
      userId,
    );

    await this.prisma.graphEdge.createMany({
      data: edges.map((edge) => ({
        graphId,
        edgeId: edge.id,
        type: edge.type,
        sourceNodeId: edge.sourceNode,
        targetNodeId: edge.targetNode,
        weight: edge.weight,
        confidence: edge.confidence,
        reason: edge.reason || null,
        metadata: edge.metadata as any,
      })),
      skipDuplicates: true,
    });

    await this.invalidateGraphCache(
      graphId,
      userId,
    );

    return this.getEdgesByGraphId(
      graphId,
      {},
      userId,
    );
  }

  async getEdgesByGraphId(
    graphId: string,
    filter: EdgeFilter = {},
    userId: string,
  ): Promise<Edge[]> {
    await this.requireGraphOwnership(
      graphId,
      userId,
    );

    const prismaEdges =
      await this.prisma.graphEdge.findMany({
        where: {
          graphId,
          ...this.buildEdgeWhere(filter),
        },
      });

    return prismaEdges.map((edge) =>
      this.mapPrismaEdgeToEdge(edge),
    );
  }

  async updateEdge(
    id: string,
    updates: Partial<Edge>,
    userId: string,
  ): Promise<Edge> {
    const edge = await this.requireEdgeOwnership(
      id,
      userId,
    );

    const updateData: Record<string, unknown> = {};

    if (updates.weight !== undefined) {
      updateData.weight = updates.weight;
    }

    if (updates.confidence !== undefined) {
      updateData.confidence =
        updates.confidence;
    }

    if (updates.reason !== undefined) {
      updateData.reason = updates.reason;
    }

    if (updates.metadata !== undefined) {
      updateData.metadata =
        updates.metadata as any;
    }

    const prismaEdge =
      await this.prisma.graphEdge.update({
        where: { id },
        data: updateData,
      });

    await this.invalidateGraphCache(
      edge.graphId,
      userId,
    );

    return this.mapPrismaEdgeToEdge(prismaEdge);
  }

  async softDeleteEdge(
    id: string,
    userId: string,
  ): Promise<Edge> {
    const edge = await this.requireEdgeOwnership(
      id,
      userId,
    );

    const prismaEdge =
      await this.prisma.graphEdge.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

    await this.invalidateGraphCache(
      edge.graphId,
      userId,
    );

    return this.mapPrismaEdgeToEdge(prismaEdge);
  }

  async deleteEdgesByGraphId(
    graphId: string,
    userId: string,
  ): Promise<void> {
    await this.requireGraphOwnership(
      graphId,
      userId,
    );

    await this.prisma.graphEdge.deleteMany({
      where: { graphId },
    });

    await this.invalidateGraphCache(
      graphId,
      userId,
    );
  }

  // ==========================================================================
  // VERSIONING
  // ==========================================================================

  async createVersion(
    graphId: string,
    input: VersionCreateInput,
    userId: string,
  ): Promise<PrismaGraphVersion> {
    await this.requireGraphOwnership(
      graphId,
      userId,
    );

    const graph =
      await this.prisma.graph.findFirst({
        where: {
          id: graphId,
          userId,
        },
        include: {
          nodes: {
            where: { deletedAt: null },
          },
          edges: {
            where: { deletedAt: null },
          },
        },
      });

    if (!graph) {
      throw new NotFoundException(
        `Graph ${graphId} not found`,
      );
    }

    const newVersion =
      await this.prisma.$transaction(async (tx) => {
        const updatedGraph =
          await tx.graph.update({
            where: { id: graphId },
            data: {
              version: {
                increment: 1,
              },
            },
            select: {
              version: true,
            },
          });

        return tx.graphVersion.create({
          data: {
            graphId,
            version: updatedGraph.version,
            description:
              input.description || null,
            changeLog:
              input.changeLog as any,
            nodeCount: graph.nodes.length,
            edgeCount: graph.edges.length,
            createdBy:
              input.createdBy || userId,
          },
        });
      });

    await this.invalidateGraphCache(
      graphId,
      userId,
    );

    return newVersion;
  }

  async getVersionsByGraphId(
    graphId: string,
    userId: string,
  ): Promise<PrismaGraphVersion[]> {
    await this.requireGraphOwnership(
      graphId,
      userId,
    );

    return this.prisma.graphVersion.findMany({
      where: { graphId },
      orderBy: {
        version: 'desc',
      },
    });
  }

  async getVersion(
    graphId: string,
    version: number,
    userId: string,
  ): Promise<PrismaGraphVersion | null> {
    await this.requireGraphOwnership(
      graphId,
      userId,
    );

    return this.prisma.graphVersion.findUnique({
      where: {
        graphId_version: {
          graphId,
          version,
        },
      },
    });
  }

  async rollbackToVersion(
    graphId: string,
    version: number,
    userId: string,
  ): Promise<Graph> {
    await this.requireGraphOwnership(
      graphId,
      userId,
    );

    const graph =
      await this.prisma.graph.findFirst({
        where: {
          id: graphId,
          userId,
        },
      });

    if (!graph) {
      throw new NotFoundException(
        `Graph ${graphId} not found`,
      );
    }

    const result =
      await this.prisma.$transaction(
        async (tx) => {
          const versionRecord =
            await tx.graphVersion.findUnique({
              where: {
                graphId_version: {
                  graphId,
                  version,
                },
              },
            });

          if (!versionRecord) {
            throw new NotFoundException(
              `Version ${version} not found for graph ${graphId}`,
            );
          }

          await tx.graphNode.deleteMany({
            where: { graphId },
          });

          await tx.graphEdge.deleteMany({
            where: { graphId },
          });

          await tx.graph.update({
            where: { id: graphId },
            data: { version },
          });

          return tx.graph.findUnique({
            where: { id: graphId },
            include: {
              nodes: true,
              edges: true,
            },
          });
        },
      );

    if (!result) {
      throw new NotFoundException(
        `Graph ${graphId} not found`,
      );
    }

    await this.invalidateGraphCache(
      graphId,
      userId,
    );

    return this.mapPrismaGraphToGraph(result);
  }

  // ==========================================================================
  // SNAPSHOTS
  // ==========================================================================

  async createSnapshot(
    graphId: string,
    input: SnapshotCreateInput,
    userId: string,
  ): Promise<PrismaGraphSnapshot> {
    await this.requireGraphOwnership(
      graphId,
      userId,
    );

    const graph =
      await this.prisma.graph.findFirst({
        where: {
          id: graphId,
          userId,
        },
        include: {
          nodes: {
            where: { deletedAt: null },
          },
          edges: {
            where: { deletedAt: null },
          },
        },
      });

    if (!graph) {
      throw new NotFoundException(
        `Graph ${graphId} not found`,
      );
    }

    return this.prisma.graphSnapshot.create({
      data: {
        graphId,
        version: graph.version,
        name: input.name,
        description:
          input.description || null,
        nodeData: graph.nodes as any,
        edgeData: graph.edges as any,
        metadata: input.metadata as any,
      },
    });
  }

  async getSnapshotsByGraphId(
    graphId: string,
    userId: string,
  ): Promise<PrismaGraphSnapshot[]> {
    await this.requireGraphOwnership(
      graphId,
      userId,
    );

    return this.prisma.graphSnapshot.findMany({
      where: { graphId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getSnapshot(
    snapshotId: string,
    userId: string,
  ): Promise<PrismaGraphSnapshot | null> {
    await this.requireSnapshotOwnership(
      snapshotId,
      userId,
    );

    return this.prisma.graphSnapshot.findUnique({
      where: { id: snapshotId },
    });
  }

  async restoreFromSnapshot(
    snapshotId: string,
    userId: string,
  ): Promise<Graph> {
    const snapshot =
      await this.requireSnapshotOwnership(
        snapshotId,
        userId,
      );

    const result =
      await this.prisma.$transaction(
        async (tx) => {
          const snapshotRecord =
            await tx.graphSnapshot.findUnique({
              where: {
                id: snapshotId,
              },
            });

          if (!snapshotRecord) {
            throw new NotFoundException(
              `Snapshot ${snapshotId} not found`,
            );
          }

          const graph =
            await tx.graph.findFirst({
              where: {
                id: snapshotRecord.graphId,
                userId,
              },
            });

          if (!graph) {
            throw new NotFoundException(
              `Graph ${snapshotRecord.graphId} not found`,
            );
          }

          await tx.graphNode.deleteMany({
            where: {
              graphId:
                snapshotRecord.graphId,
            },
          });

          await tx.graphEdge.deleteMany({
            where: {
              graphId:
                snapshotRecord.graphId,
            },
          });

          const nodeData =
            snapshotRecord.nodeData as any[];

          const edgeData =
            snapshotRecord.edgeData as any[];

          if (nodeData.length > 0) {
            await tx.graphNode.createMany({
              data: nodeData.map((node) => ({
                graphId:
                  snapshotRecord.graphId,
                nodeId: node.nodeId,
                type: node.type,
                label: node.label,
                normalizedLabel:
                  node.normalizedLabel,
                confidence: node.confidence,
                source: node.source,
                metadata: node.metadata,
              })),
            });
          }

          if (edgeData.length > 0) {
            await tx.graphEdge.createMany({
              data: edgeData.map((edge) => ({
                graphId:
                  snapshotRecord.graphId,
                edgeId: edge.edgeId,
                type: edge.type,
                sourceNodeId:
                  edge.sourceNodeId,
                targetNodeId:
                  edge.targetNodeId,
                weight: edge.weight,
                confidence:
                  edge.confidence,
                reason: edge.reason,
                metadata: edge.metadata,
              })),
            });
          }

          await tx.graph.update({
            where: {
              id: snapshotRecord.graphId,
            },
            data: {
              version:
                snapshotRecord.version,
            },
          });

          return tx.graph.findUnique({
            where: {
              id: snapshotRecord.graphId,
            },
            include: {
              nodes: true,
              edges: true,
            },
          });
        },
      );

    if (!result) {
      throw new NotFoundException(
        `Graph ${snapshot.graphId} not found`,
      );
    }

    await this.invalidateGraphCache(
      snapshot.graphId,
      userId,
    );

    return this.mapPrismaGraphToGraph(result);
  }

  // ============================================================================
  // TRANSACTION SUPPORT
  // ============================================================================

  /**
   * Execute operations in a transaction
   */
  async transaction<T>(
    callback: (
      tx: Omit<
        PrismaClient,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
      >,
    ) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(callback);
  }

  // ==========================================================================
  // CACHE
  // ==========================================================================

  private graphCacheKey(
    graphId: string,
    userId: string,
  ): string {
    return this.cacheService.generateKey(
      'graph',
      `${userId}:${graphId}`,
    );
  }

  private async invalidateGraphCache(
    graphId: string,
    userId: string,
  ): Promise<void> {
    await this.cacheService.del(
      this.graphCacheKey(graphId, userId),
    );
  }

  // ==========================================================================
  // QUERY BUILDERS
  // ==========================================================================

  private buildGraphWhere(filter: GraphFilter) {
    const where: any = {};

    if (filter.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    if (filter.source) {
      where.source = filter.source;
    }

    if (!filter.includeDeleted) {
      where.deletedAt = null;
    }

    return where;
  }

  private buildNodeWhere(filter: NodeFilter) {
    const where: any = {};

    if (filter.type) {
      where.type = filter.type;
    }

    if (filter.normalizedLabel) {
      where.normalizedLabel = filter.normalizedLabel;
    }

    if (filter.minConfidence !== undefined) {
      where.confidence = { gte: filter.minConfidence };
    }

    if (filter.maxConfidence !== undefined) {
      where.confidence = { ...where.confidence, lte: filter.maxConfidence };
    }

    if (!filter.includeDeleted) {
      where.deletedAt = null;
    }

    return where;
  }

  private buildEdgeWhere(filter: EdgeFilter) {
    const where: any = {};

    if (filter.type) {
      where.type = filter.type;
    }

    if (filter.sourceNodeId) {
      where.sourceNodeId = filter.sourceNodeId;
    }

    if (filter.targetNodeId) {
      where.targetNodeId = filter.targetNodeId;
    }

    if (filter.minWeight !== undefined) {
      where.weight = { gte: filter.minWeight };
    }

    if (filter.maxWeight !== undefined) {
      where.weight = { ...where.weight, lte: filter.maxWeight };
    }

    if (filter.minConfidence !== undefined) {
      where.confidence = { gte: filter.minConfidence };
    }

    if (filter.maxConfidence !== undefined) {
      where.confidence = { ...where.confidence, lte: filter.maxConfidence };
    }

    if (!filter.includeDeleted) {
      where.deletedAt = null;
    }

    return where;
  }

  private mapPrismaGraphToGraph(
    prismaGraph: PrismaGraph & {
      nodes?: PrismaGraphNode[];
      edges?: PrismaGraphEdge[];
    },
  ): Graph {
    const nodes =
      prismaGraph.nodes?.map((n) => this.mapPrismaNodeToNode(n)) || [];
    const edges =
      prismaGraph.edges?.map((e) => this.mapPrismaEdgeToEdge(e)) || [];

    return {
      id: prismaGraph.id,
      nodes: new Map(nodes.map((n) => [n.id, n])),
      edges: new Map(edges.map((e) => [e.id, e])),
      metadata: prismaGraph.metadata as any,
    };
  }

  private mapPrismaNodeToNode(prismaNode: PrismaGraphNode): Node {
    return {
      id: prismaNode.nodeId,
      type: prismaNode.type as any,
      label: prismaNode.label,
      normalizedLabel: prismaNode.normalizedLabel,
      confidence: prismaNode.confidence,
      source: prismaNode.source,
      metadata: prismaNode.metadata as any,
      timestamps: {
        createdAt: prismaNode.createdAt,
        updatedAt: prismaNode.updatedAt,
        deletedAt: prismaNode.deletedAt || undefined,
      },
      provenance: {
        createdBy: 'system',
        algorithmVersion: '1.0.0',
        sourceDocument:
          (prismaNode.metadata as any)?.sourceDocument || undefined,
        sourceSection: (prismaNode.metadata as any)?.sourceSection || undefined,
        sourceSentence:
          (prismaNode.metadata as any)?.sourceSentence || undefined,
        hash: (prismaNode.metadata as any)?.hash || undefined,
      },
    };
  }

  private mapPrismaEdgeToEdge(prismaEdge: PrismaGraphEdge): Edge {
    return {
      id: prismaEdge.edgeId,
      type: prismaEdge.type as any,
      sourceNode: prismaEdge.sourceNodeId,
      targetNode: prismaEdge.targetNodeId,
      weight: prismaEdge.weight,
      confidence: prismaEdge.confidence,
      reason: prismaEdge.reason || undefined,
      metadata: prismaEdge.metadata as any,
      timestamps: {
        createdAt: prismaEdge.createdAt,
        updatedAt: prismaEdge.updatedAt,
      },
      provenance: {
        createdBy: 'system',
        algorithmVersion: '1.0.0',
        sourceDocument:
          (prismaEdge.metadata as any)?.sourceDocument || undefined,
        sourceSection: (prismaEdge.metadata as any)?.sourceSection || undefined,
        sourceSentence:
          (prismaEdge.metadata as any)?.sourceSentence || undefined,
        hash: (prismaEdge.metadata as any)?.hash || undefined,
      },
    };
  }
}
