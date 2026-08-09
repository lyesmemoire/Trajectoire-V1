import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CopilotService } from './copilot.service';
import { RecruiterCopilotService } from './recruiter-copilot.service';
import { Graph } from '../runtime/kg/graph-types';
import {
  RateLimitCopilot,
  RateLimitApi,
} from '../resilience/rate-limiting.decorator';
import { CopilotContextService, CopilotRequestContext } from './copilot-context.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('copilot')
@UseGuards(JwtAuthGuard)
export class CopilotController {
  constructor(
    private readonly copilotService: CopilotService,
    private readonly recruiterCopilotService: RecruiterCopilotService,
    private readonly contextService: CopilotContextService,
  ) {}

  @Post('message')
  @RateLimitCopilot()
  async processMessage(@Req() req, @Body() body: { sessionId: string; message: string; cvId?: string; jobId?: string }) {
    try {
      // Use authenticated user ID from JWT, not client-provided userId
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedException('User not authenticated');
      }

      const context: any = {};
      if (body.cvId) context.cvId = body.cvId;
      if (body.jobId) context.jobId = body.jobId;

      const response = await this.copilotService.processMessage(
        body.sessionId,
        body.message,
        userId,
        context,
      );
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException((error as Error).message);
    }
  }

  @Get('history/:sessionId')
  @RateLimitApi()
  async getConversationHistory(@Req() req, @Param('sessionId') sessionId: string) {
    try {
      // Use authenticated user ID from JWT, not client-provided userId
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedException('User not authenticated');
      }

      const history = await this.copilotService.getConversationHistory(sessionId, userId);
      return {
        success: true,
        data: history,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException((error as Error).message);
    }
  }

  @Delete('conversation/:sessionId')
  @RateLimitApi()
  async clearConversation(@Req() req, @Param('sessionId') sessionId: string) {
    try {
      // Use authenticated user ID from JWT, not client-provided userId
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedException('User not authenticated');
      }

      await this.copilotService.clearConversation(sessionId, userId);
      return {
        success: true,
        message: 'Conversation cleared',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('sessions')
  @RateLimitApi()
  async getAllSessions(@Req() req) {
    try {
      // Use authenticated user ID from JWT, not client-provided userId
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedException('User not authenticated');
      }

      const sessions = await this.copilotService.getAllSessions(userId);
      return {
        success: true,
        data: sessions,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException((error as Error).message);
    }
  }

  // ============================================================================
  // RECRUITER COPILOT ENDPOINTS
  // ============================================================================

  @Post('compare-candidates')
  @RateLimitCopilot()
  async compareCandidates(
    @Body() body: { candidate1: Graph; candidate2: Graph },
  ) {
    try {
      const comparison = await this.recruiterCopilotService.compareCandidates(
        body.candidate1,
        body.candidate2,
      );
      return {
        success: true,
        data: comparison,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('explain-matching')
  @RateLimitCopilot()
  async explainMatching(
    @Body() body: { candidateGraph: Graph; jobGraph: Graph },
  ) {
    try {
      const explanation = await this.recruiterCopilotService.explainMatching(
        body.candidateGraph,
        body.jobGraph,
      );
      return {
        success: true,
        data: explanation,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('find-profiles')
  @RateLimitCopilot()
  async findProfiles(
    @Body() body: { criteria: any; candidateGraphs: Graph[] },
  ) {
    try {
      const profiles = await this.recruiterCopilotService.findProfiles(
        body.criteria,
        body.candidateGraphs,
      );
      return {
        success: true,
        data: profiles,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('create-shortlist')
  @RateLimitCopilot()
  async createShortlist(
    @Body() body: { jobGraph: Graph; candidateGraphs: Graph[]; limit?: number },
  ) {
    try {
      const shortlist = await this.recruiterCopilotService.createShortlist(
        body.jobGraph,
        body.candidateGraphs,
        body.limit || 10,
      );
      return {
        success: true,
        data: shortlist,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('analyze-job')
  @RateLimitCopilot()
  async analyzeJob(@Body() body: { jobGraph: Graph }) {
    try {
      const analysis = await this.recruiterCopilotService.analyzeJobPosting(
        body.jobGraph,
      );
      return {
        success: true,
        data: analysis,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('reason')
  @RateLimitCopilot()
  async reasonAboutQuestion(
    @Body() body: { question: string; contextGraph: Graph },
  ) {
    try {
      const reasoning = await this.recruiterCopilotService.reasonAboutQuestion(
        body.question,
        body.contextGraph,
      );
      return {
        success: true,
        data: reasoning,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
