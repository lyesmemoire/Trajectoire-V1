/**
 * Dashboard Controller
 *
 * Exposes dashboard data aggregation endpoints.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  BadRequestException,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';

import { DashboardService } from './dashboard.service';
import { Graph } from '../runtime/kg/graph-types';

import {
  RateLimitApi,
} from '../resilience/rate-limiting.decorator';

import {
  JwtAuthGuard,
} from '../auth/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  private getUserId(req: any): string {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException(
        'Authenticated user not found',
      );
    }

    return userId;
  }

  @Get()
  @RateLimitApi()
  async getDashboardData(
    @Req() req: any,
  ) {
    try {
      const userId =
        this.getUserId(req);

      const data =
        await this.dashboardService.getDashboardData(
          userId,
        );

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new BadRequestException(
        (error as Error).message,
      );
    }
  }

  @Post('match-score')
  @RateLimitApi()
  async getRealTimeMatchScore(
    @Body()
    body: {
      candidateGraph: Graph;
      jobGraph: Graph;
    },
  ) {
    try {
      const result =
        await this.dashboardService.getRealTimeMatchScore(
          body.candidateGraph,
          body.jobGraph,
        );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(
        (error as Error).message,
      );
    }
  }

  @Post('match-explanation')
  @RateLimitApi()
  async getMatchExplanation(
    @Body()
    body: {
      candidateGraph: Graph;
      jobGraph: Graph;
    },
  ) {
    try {
      const result =
        await this.dashboardService.getMatchExplanation(
          body.candidateGraph,
          body.jobGraph,
        );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(
        (error as Error).message,
      );
    }
  }
}
