import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { GraphMatchingService } from '../runtime/kg/graph-matching.service';
import { Graph } from '../runtime/kg/graph-types';
import {
  RateLimitMatching,
} from '../resilience/rate-limiting.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('matching')
@UseGuards(JwtAuthGuard)
export class MatchingController {
  constructor(private readonly graphMatchingService: GraphMatchingService) {}

  @Post('calculate-score')
  @RateLimitMatching()
  async calculateScore(
    @Body() body: { candidateGraph: Graph; jobGraph: Graph },
  ) {
    try {
      const graphResult = await this.graphMatchingService.match(
        body.candidateGraph,
        body.jobGraph,
      );

      return {
        success: true,
        data: {
          candidateId: body.candidateGraph.id,
          jobId: body.jobGraph.id,
          score: graphResult.score,
        },
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('explain')
  @RateLimitMatching()
  async explainMatch(@Body() body: { candidateGraph: Graph; jobGraph: Graph }) {
    try {
      const graphResult = await this.graphMatchingService.match(
        body.candidateGraph,
        body.jobGraph,
      );

      return {
        success: true,
        data: {
          candidateId: body.candidateGraph.id,
          jobId: body.jobGraph.id,
          explanation: {
            summary: `Overall score: ${graphResult.score.overall.value.toFixed(0)}%`,
            strengths: graphResult.strengths,
            weaknesses: graphResult.weaknesses,
            recommendations: graphResult.recommendations,
          },
        },
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('report')
  @RateLimitMatching()
  async generateReport(
    @Body() body: { candidateGraph: Graph; jobGraph: Graph },
  ) {
    try {
      const graphResult = await this.graphMatchingService.match(
        body.candidateGraph,
        body.jobGraph,
      );

      const report = {
        summary: `Overall score: ${graphResult.score.overall.value.toFixed(0)}%`,
        candidate: {
          id: body.candidateGraph.id,
        },
        job: {
          id: body.jobGraph.id,
        },
        scores: {
          global: graphResult.score.overall.value,
          dimensions: [
            {
              name: 'Hard Skills',
              score: graphResult.score.hardSkills.value,
              weight: 0.25,
            },
            {
              name: 'Soft Skills',
              score: graphResult.score.softSkills.value,
              weight: 0.1,
            },
            {
              name: 'Experience',
              score: graphResult.score.experience.value,
              weight: 0.2,
            },
            {
              name: 'Education',
              score: graphResult.score.education.value,
              weight: 0.1,
            },
            {
              name: 'Languages',
              score: graphResult.score.languages.value,
              weight: 0.05,
            },
            {
              name: 'Career Path',
              score: graphResult.score.careerPath.value,
              weight: 0.05,
            },
            {
              name: 'Transferable Skills',
              score: graphResult.score.transferableSkills.value,
              weight: 0.1,
            },
            {
              name: 'Graph Similarity',
              score: graphResult.score.graphSimilarity.value,
              weight: 0.08,
            },
            {
              name: 'Semantic Similarity',
              score: graphResult.score.semanticSimilarity.value,
              weight: 0.02,
            },
            {
              name: 'Confidence',
              score: graphResult.score.confidence.value,
              weight: 0.05,
            },
          ],
        },
        strengths: graphResult.strengths,
        weaknesses: graphResult.weaknesses,
        missingSkills: graphResult.missingSkills.map((s: any) => s.label),
        transferableSkills: graphResult.transferableSkills.map((t: any) => ({
          skill: t.skill.label,
          transferability: t.transferability,
        })),
        recommendations: graphResult.recommendations,
        generatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: report,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
