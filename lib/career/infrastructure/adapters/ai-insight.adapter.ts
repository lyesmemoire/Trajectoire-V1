import { InsightGeneratorPort } from "../../ports/insight-generator.port";
import { CareerProfileAggregate } from "../../domain/aggregates/career-profile.aggregate";
import { generateCareerInsights } from "@/lib/ai/generate-insights";

export class AiInsightAdapter implements InsightGeneratorPort {
  async generateInsights(profile: CareerProfileAggregate): Promise<void> {
    // We delegate to the external AI capability
    await generateCareerInsights(profile.userId);
  }
}
