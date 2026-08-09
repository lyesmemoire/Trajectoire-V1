import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GraphSearchService } from '../runtime/kg/graph-search.service';
import { RecruiterSearchService } from './recruiter-search.service';
import { Graph } from '../runtime/kg/graph-types';
import {
  RateLimitSearch,
} from '../resilience/rate-limiting.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(
    private readonly graphSearchService: GraphSearchService,
    private readonly recruiterSearchService: RecruiterSearchService,
  ) {}

  @Post('candidates')
  @RateLimitSearch()
  async searchCandidates(
    @Body() body: { jobGraph: Graph; candidateGraphs: Graph[] },
  ) {
    try {
      if (!body.jobGraph || !Array.isArray(body.candidateGraphs)) {
        throw new BadRequestException(
          'jobGraph and candidateGraphs are required',
        );
      }

      const results =
        await this.graphSearchService.searchCandidatesByNeighborhood(
          body.jobGraph,
          body.candidateGraphs,
        );

      const formattedResults = results.map((r) => ({
        id: r.id,
        score: r.score,
        explanation: r.matchReason.join('; '),
      }));

      return {
        success: true,
        data: formattedResults,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('jobs')
  @RateLimitSearch()
  async searchJobs(
    @Body() body: { candidateGraph: Graph; jobGraphs: Graph[] },
  ) {
    try {
      if (!body.candidateGraph || !Array.isArray(body.jobGraphs)) {
        throw new BadRequestException(
          'candidateGraph and jobGraphs are required',
        );
      }

      const results = await this.graphSearchService.searchJobsByNeighborhood(
        body.candidateGraph,
        body.jobGraphs,
      );

      const formattedResults = results.map((r) => ({
        id: r.id,
        score: r.score,
        explanation: r.matchReason.join('; '),
      }));

      return {
        success: true,
        data: formattedResults,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('similar-candidates')
  @RateLimitSearch()
  async findSimilarCandidates(
    @Body() body: { targetGraph: Graph; candidateGraphs: Graph[] },
  ) {
    try {
      if (!body.targetGraph || !Array.isArray(body.candidateGraphs)) {
        throw new BadRequestException(
          'targetGraph and candidateGraphs are required',
        );
      }

      const results = await this.graphSearchService.findSimilarCandidates(
        body.targetGraph,
        body.candidateGraphs,
      );

      const formattedResults = results.map((r) => ({
        candidateId: r.id,
        score: r.score,
        explanation: r.matchReason.join('; '),
      }));

      return {
        success: true,
        data: formattedResults,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('similar-jobs')
  @RateLimitSearch()
  async findSimilarJobs(
    @Body() body: { targetGraph: Graph; jobGraphs: Graph[] },
  ) {
    try {
      if (!body.targetGraph || !Array.isArray(body.jobGraphs)) {
        throw new BadRequestException('targetGraph and jobGraphs are required');
      }

      const results = await this.graphSearchService.findSimilarJobs(
        body.targetGraph,
        body.jobGraphs,
      );

      const formattedResults = results.map((r) => ({
        jobId: r.id,
        score: r.score,
        explanation: r.matchReason.join('; '),
      }));

      return {
        success: true,
        data: formattedResults,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('career-path')
  @RateLimitSearch()
  async buildCareerPath(
    @Body() body: { candidateGraph: Graph; jobGraphs: Graph[] },
  ) {
    try {
      if (!body.candidateGraph || !Array.isArray(body.jobGraphs)) {
        throw new BadRequestException(
          'candidateGraph and jobGraphs are required',
        );
      }

      const results = await this.graphSearchService.searchCandidatesByCommunity(
        body.candidateGraph,
        body.jobGraphs,
      );

      const formattedResults = {
        path: results.map((r) => ({
          jobId: r.id,
          score: r.score,
          community: r.communityId,
        })),
      };

      return {
        success: true,
        data: formattedResults,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('recruiter')
  @RateLimitSearch()
  async recruiterSearch(
    @Req() req,
    @Body()
    body: {
      query: string;
      graphs: Graph[];
      filters?: any;
      facets?: any;
      pagination?: any;
      ranking?: any;
    },
  ) {
    try {
      if (!body.query || !Array.isArray(body.graphs)) {
        throw new BadRequestException('query and graphs are required');
      }

      const searchQuery = {
        query: body.query,
        filters: body.filters,
        facets: body.facets,
        pagination: body.pagination,
        ranking: body.ranking,
      };

      // Use authenticated user ID from JWT for search history tracking
      const userId = req.user?.id;

      const results = await this.recruiterSearchService.search(
        searchQuery,
        body.graphs,
        userId,
      );

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
