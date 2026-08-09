/**
 * Data Lineage Controller
 * REST API for data lineage tracking and querying
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { DataLineageService } from './data-lineage.service';
import type {
  DataLineageEntry,
  DataLineageQuery,
  DataLineageTrace,
  GraphLineageEntry,
  GraphLineageQuery,
  GraphLineageTrace,
  DataLineageStatistics,
  DataLineageReport,
} from './data-lineage.types';

@Controller('data-lineage')
export class DataLineageController {
  constructor(private readonly dataLineageService: DataLineageService) {}

  // ============================================================================
  // DATA LINEAGE ENDPOINTS
  // ============================================================================

  @Get('trace/:dataId')
  async getTrace(@Param('dataId') dataId: string): Promise<DataLineageTrace> {
    const trace = await this.dataLineageService.getTrace(dataId);
    if (!trace) {
      throw new BadRequestException(`No lineage found for data ID: ${dataId}`);
    }
    return trace;
  }

  @Get('report/:dataId')
  async getReport(@Param('dataId') dataId: string): Promise<DataLineageReport> {
    const report = await this.dataLineageService.generateReport(dataId);
    if (!report) {
      throw new BadRequestException(`No lineage found for data ID: ${dataId}`);
    }
    return report;
  }

  @Post('query')
  async query(@Body() query: DataLineageQuery): Promise<DataLineageEntry[]> {
    return await this.dataLineageService.query(query);
  }

  @Get('statistics')
  async getStatistics(
    @Query() query?: DataLineageQuery,
  ): Promise<DataLineageStatistics> {
    return await this.dataLineageService.getStatistics(query);
  }

  // ============================================================================
  // GRAPH LINEAGE ENDPOINTS
  // ============================================================================

  @Get('graph/trace/:graphId')
  async getGraphTrace(
    @Param('graphId') graphId: string,
  ): Promise<GraphLineageTrace> {
    const trace = await this.dataLineageService.getGraphTrace(graphId);
    if (!trace) {
      throw new BadRequestException(
        `No lineage found for graph ID: ${graphId}`,
      );
    }
    return trace;
  }

  @Post('graph/query')
  async queryGraph(
    @Body() query: GraphLineageQuery,
  ): Promise<GraphLineageEntry[]> {
    return await this.dataLineageService.queryGraph(query);
  }

  // ============================================================================
  // UTILITY ENDPOINTS
  // ============================================================================

  @Post('clear')
  async clearAll(): Promise<{ message: string }> {
    await this.dataLineageService.clearAll();
    return { message: 'All lineage data cleared' };
  }
}
