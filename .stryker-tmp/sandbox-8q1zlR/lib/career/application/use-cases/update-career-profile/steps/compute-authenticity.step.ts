// @ts-nocheck
import { CareerPipelineStep, CareerPipelineContext } from "../career-pipeline";
import { AuthenticityEnginePort } from "../../../../ports/authenticity-engine.port";

export class ComputeAuthenticityStep implements CareerPipelineStep {
  constructor(private readonly engine: AuthenticityEnginePort) {}

  async execute(context: CareerPipelineContext): Promise<CareerPipelineContext> {
    const ux = context.dto.uxFingerprint;
    const authScore = await this.engine.computeAuthenticity({
      entropyScore: ux?.entropyScore || 0.8,
      headless: ux?.headless || false,
      unnaturalSpeed: ux?.unnaturalSpeed || false,
      completionRate: context.dto.interviewAnalysis.completionRate || 1.0,
    });

    return {
      ...context,
      authenticity: authScore,
    };
  }
}
