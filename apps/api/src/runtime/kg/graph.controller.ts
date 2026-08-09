/**
 * Knowledge Graph RH Runtime v2
 * Graph Controller
 *
 * Exposes graph persistence operations via REST API.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';

import type {
  GraphRepository,
  GraphCreateInput,
  GraphUpdateInput,
  GraphFilter,
  NodeFilter,
  EdgeFilter,
  VersionCreateInput,
  SnapshotCreateInput,
} from './graph-repository.service';

import type {
  Graph,
  Node,
  Edge,
} from './graph-types';

import {
  RateLimitGraph,
} from '../../resilience/rate-limiting.decorator';

import {
  JwtAuthGuard,
} from '../../auth/jwt-auth.guard';

@Controller('graphs')
@UseGuards(JwtAuthGuard)
export class GraphController {
  constructor(
    private readonly graphRepository: GraphRepository,
  ) {}

  private getUserId(req: any): string {
    const userId = req.user?.id;

    if (!userId) {
      throw new NotFoundException(
        'Authenticated user not found',
      );
    }

    return userId;
  }

  // ==========================================================================
  // GRAPH CRUD
  // ==========================================================================

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RateLimitGraph()
  async createGraph(
    @Req() req: any,
    @Body() input: GraphCreateInput,
  ): Promise<Graph> {
    return this.graphRepository.createGraph(
      input,
      this.getUserId(req),
    );
  }

  @Get(':id')
  @RateLimitGraph()
  async getGraph(
    @Req() req: any,
    @Param('id') id: string,
    @Query('includeDeleted')
    includeDeleted?: string,
    @Query('source')
    source?: string,
  ): Promise<Graph> {
    const filter: GraphFilter = {
      includeDeleted:
        includeDeleted === 'true',
      source,
    };

    const graph =
      await this.graphRepository.getGraphById(
        id,
        filter,
        this.getUserId(req),
      );

    if (!graph) {
      throw new NotFoundException(
        `Graph ${id} not found`,
      );
    }

    return graph;
  }

  @Put(':id')
  @RateLimitGraph()
  async updateGraph(
    @Req() req: any,
    @Param('id') id: string,
    @Body() input: GraphUpdateInput,
  ): Promise<Graph> {
    return this.graphRepository.updateGraph(
      id,
      input,
      this.getUserId(req),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RateLimitGraph()
  async softDeleteGraph(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<void> {
    await this.graphRepository.softDeleteGraph(
      id,
      this.getUserId(req),
    );
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RateLimitGraph()
  async hardDeleteGraph(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<void> {
    await this.graphRepository.hardDeleteGraph(
      id,
      this.getUserId(req),
    );
  }

  @Post(':id/restore')
  @RateLimitGraph()
  async restoreGraph(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<Graph> {
    return this.graphRepository.restoreGraph(
      id,
      this.getUserId(req),
    );
  }

  @Get()
  @RateLimitGraph()
  async listGraphs(
    @Req() req: any,
    @Query('isActive') isActive?: string,
    @Query('source') source?: string,
    @Query('includeDeleted')
    includeDeleted?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ): Promise<Graph[]> {
    const filter: GraphFilter = {};

    if (isActive === 'true') {
      filter.isActive = true;
    } else if (isActive === 'false') {
      filter.isActive = false;
    }

    if (source) {
      filter.source = source;
    }

    if (includeDeleted === 'true') {
      filter.includeDeleted = true;
    }

    return this.graphRepository.listGraphs(
      filter,
      this.getUserId(req),
      parseInt(skip || '0', 10),
      parseInt(take || '50', 10),
    );
  }

  // ==========================================================================
  // NODE CRUD
  // ==========================================================================

  @Post(':id/nodes')
  @HttpCode(HttpStatus.CREATED)
  @RateLimitGraph()
  async createNodes(
    @Req() req: any,
    @Param('id') graphId: string,
    @Body() nodes: Node[],
  ): Promise<Node[]> {
    return this.graphRepository.createNodes(
      graphId,
      nodes,
      this.getUserId(req),
    );
  }

  @Get(':id/nodes')
  @RateLimitGraph()
  async getNodes(
    @Req() req: any,
    @Param('id') graphId: string,
    @Query('type') type?: string,
    @Query('normalizedLabel')
    normalizedLabel?: string,
    @Query('minConfidence')
    minConfidence?: string,
    @Query('maxConfidence')
    maxConfidence?: string,
    @Query('includeDeleted')
    includeDeleted?: string,
  ): Promise<Node[]> {
    const filter: NodeFilter = {};

    if (type) {
      filter.type = type;
    }

    if (normalizedLabel) {
      filter.normalizedLabel =
        normalizedLabel;
    }

    if (minConfidence) {
      filter.minConfidence =
        parseFloat(minConfidence);
    }

    if (maxConfidence) {
      filter.maxConfidence =
        parseFloat(maxConfidence);
    }

    if (includeDeleted === 'true') {
      filter.includeDeleted = true;
    }

    return this.graphRepository.getNodesByGraphId(
      graphId,
      filter,
      this.getUserId(req),
    );
  }

  @Put('nodes/:nodeId')
  @RateLimitGraph()
  async updateNode(
    @Req() req: any,
    @Param('nodeId') nodeId: string,
    @Body() updates: Partial<Node>,
  ): Promise<Node> {
    return this.graphRepository.updateNode(
      nodeId,
      updates,
      this.getUserId(req),
    );
  }

  @Delete('nodes/:nodeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RateLimitGraph()
  async softDeleteNode(
    @Req() req: any,
    @Param('nodeId') nodeId: string,
  ): Promise<void> {
    await this.graphRepository.softDeleteNode(
      nodeId,
      this.getUserId(req),
    );
  }

  // ==========================================================================
  // EDGE CRUD
  // ==========================================================================

  @Post(':id/edges')
  @HttpCode(HttpStatus.CREATED)
  @RateLimitGraph()
  async createEdges(
    @Req() req: any,
    @Param('id') graphId: string,
    @Body() edges: Edge[],
  ): Promise<Edge[]> {
    return this.graphRepository.createEdges(
      graphId,
      edges,
      this.getUserId(req),
    );
  }

  @Get(':id/edges')
  @RateLimitGraph()
  async getEdges(
    @Req() req: any,
    @Param('id') graphId: string,
    @Query('type') type?: string,
    @Query('sourceNodeId')
    sourceNodeId?: string,
    @Query('targetNodeId')
    targetNodeId?: string,
    @Query('minWeight')
    minWeight?: string,
    @Query('maxWeight')
    maxWeight?: string,
    @Query('minConfidence')
    minConfidence?: string,
    @Query('maxConfidence')
    maxConfidence?: string,
    @Query('includeDeleted')
    includeDeleted?: string,
  ): Promise<Edge[]> {
    const filter: EdgeFilter = {};

    if (type) {
      filter.type = type;
    }

    if (sourceNodeId) {
      filter.sourceNodeId =
        sourceNodeId;
    }

    if (targetNodeId) {
      filter.targetNodeId =
        targetNodeId;
    }

    if (minWeight) {
      filter.minWeight =
        parseFloat(minWeight);
    }

    if (maxWeight) {
      filter.maxWeight =
        parseFloat(maxWeight);
    }

    if (minConfidence) {
      filter.minConfidence =
        parseFloat(minConfidence);
    }

    if (maxConfidence) {
      filter.maxConfidence =
        parseFloat(maxConfidence);
    }

    if (includeDeleted === 'true') {
      filter.includeDeleted = true;
    }

    return this.graphRepository.getEdgesByGraphId(
      graphId,
      filter,
      this.getUserId(req),
    );
  }

  @Put('edges/:edgeId')
  @RateLimitGraph()
  async updateEdge(
    @Req() req: any,
    @Param('edgeId') edgeId: string,
    @Body() updates: Partial<Edge>,
  ): Promise<Edge> {
    return this.graphRepository.updateEdge(
      edgeId,
      updates,
      this.getUserId(req),
    );
  }

  @Delete('edges/:edgeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RateLimitGraph()
  async softDeleteEdge(
    @Req() req: any,
    @Param('edgeId') edgeId: string,
  ): Promise<void> {
    await this.graphRepository.softDeleteEdge(
      edgeId,
      this.getUserId(req),
    );
  }

  // ==========================================================================
  // VERSIONING
  // ==========================================================================

  @Post(':id/versions')
  @HttpCode(HttpStatus.CREATED)
  @RateLimitGraph()
  async createVersion(
    @Req() req: any,
    @Param('id') graphId: string,
    @Body() input: VersionCreateInput,
  ) {
    return this.graphRepository.createVersion(
      graphId,
      input,
      this.getUserId(req),
    );
  }

  @Get(':id/versions')
  @RateLimitGraph()
  async getVersions(
    @Req() req: any,
    @Param('id') graphId: string,
  ) {
    return this.graphRepository.getVersionsByGraphId(
      graphId,
      this.getUserId(req),
    );
  }

  @Get(':id/versions/:version')
  @RateLimitGraph()
  async getVersion(
    @Req() req: any,
    @Param('id') graphId: string,
    @Param('version') version: string,
  ) {
    return this.graphRepository.getVersion(
      graphId,
      parseInt(version, 10),
      this.getUserId(req),
    );
  }

  @Post(':id/versions/:version/rollback')
  @RateLimitGraph()
  async rollbackToVersion(
    @Req() req: any,
    @Param('id') graphId: string,
    @Param('version') version: string,
  ): Promise<Graph> {
    return this.graphRepository.rollbackToVersion(
      graphId,
      parseInt(version, 10),
      this.getUserId(req),
    );
  }

  // ==========================================================================
  // SNAPSHOTS
  // ==========================================================================

  @Post(':id/snapshots')
  @HttpCode(HttpStatus.CREATED)
  @RateLimitGraph()
  async createSnapshot(
    @Req() req: any,
    @Param('id') graphId: string,
    @Body() input: SnapshotCreateInput,
  ) {
    return this.graphRepository.createSnapshot(
      graphId,
      input,
      this.getUserId(req),
    );
  }

  @Get(':id/snapshots')
  @RateLimitGraph()
  async getSnapshots(
    @Req() req: any,
    @Param('id') graphId: string,
  ) {
    return this.graphRepository.getSnapshotsByGraphId(
      graphId,
      this.getUserId(req),
    );
  }

  @Get('snapshots/:snapshotId')
  @RateLimitGraph()
  async getSnapshot(
    @Req() req: any,
    @Param('snapshotId') snapshotId: string,
  ) {
    return this.graphRepository.getSnapshot(
      snapshotId,
      this.getUserId(req),
    );
  }

  @Post('snapshots/:snapshotId/restore')
  @RateLimitGraph()
  async restoreFromSnapshot(
    @Req() req: any,
    @Param('snapshotId') snapshotId: string,
  ): Promise<Graph> {
    return this.graphRepository.restoreFromSnapshot(
      snapshotId,
      this.getUserId(req),
    );
  }
}
