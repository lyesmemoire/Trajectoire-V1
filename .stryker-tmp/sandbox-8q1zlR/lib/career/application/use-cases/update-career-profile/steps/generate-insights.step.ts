// @ts-nocheck
import { CareerPipelineStep, CareerPipelineContext } from "../career-pipeline";
import { InsightGeneratorPort } from "../../../../ports/insight-generator.port";

export class GenerateInsightsStep implements CareerPipelineStep {
  constructor(private readonly generator: InsightGeneratorPort) {}

  async execute(context: CareerPipelineContext): Promise<CareerPipelineContext> {
    if (!context.profile) {
      throw new Error("Profile must be loaded before generating insights");
    }

    // Call external service to get insight updates
    await this.generator.generateInsights(context.profile);

    // Call domain method to record the business event
    context.profile.generateInsights();

    return context;
  }
}
