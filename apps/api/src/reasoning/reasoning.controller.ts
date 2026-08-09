import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { GraphReasoningEngine } from '../runtime/kg/graph-reasoning-engine.service';
import { Graph } from '../runtime/kg/graph-types';

@Controller('reasoning')
export class ReasoningController {
  constructor(private readonly graphReasoningEngine: GraphReasoningEngine) {}

  @Post('analyze')
  async analyze(@Body() body: { graph: Graph; query: string }) {
    try {
      const result = this.graphReasoningEngine.answerCandidateQuestion(
        body.graph,
        body.query,
      );
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
