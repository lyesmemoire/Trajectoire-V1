import { ok, fail, Result } from "@/lib/core/result";
import { UseCase } from "@/lib/core/application/UseCase";
import { CvRepositoryPort } from "../../../ports/repositories/cv-repository.port";
import { AtsAnalysisGateway } from "../../../ports/gateways/ats-analysis.gateway";
import { DomainEventPublisher } from "@/lib/core/runtime/event-publisher/DomainEventPublisher";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { UnauthorizedError, InfrastructureError } from "@/lib/core/result/errors";

export interface AnalyzeCvInput {
  cvId: string;
  jobDescription?: string;
}

export class AnalyzeCvUseCase extends UseCase<AnalyzeCvInput, void> {
  constructor(
    private readonly atsAnalyzer: AtsAnalysisGateway,
    private readonly cvRepository: CvRepositoryPort,
    private readonly publisher: DomainEventPublisher
  ) {
    super();
  }

  protected async run(input: AnalyzeCvInput): Promise<Result<void, any>> {
    const userId = RequestContext.userId();
    if (!userId) return fail(new UnauthorizedError("User not authenticated"));

    // 1. Fetch CV Aggregate
    const cvResult = await this.cvRepository.findById(input.cvId);
    if (cvResult.isFailure()) return fail(cvResult.unwrapError());
    const cv = cvResult.unwrap();

    // Verify ownership
    if (cv.userId !== userId) return fail(new UnauthorizedError("Not authorized to analyze this CV"));

    const textToAnalyze = cv.optimizedText || cv.originalText;
    if (!textToAnalyze) {
      cv.failAnalysis("No text found in CV to analyze.");
      await this.publisher.publishEventsFrom(cv);
      return fail(new InfrastructureError("No text found in CV to analyze."));
    }

    // 2. Perform Analysis
    const analysisResult = await this.atsAnalyzer.analyzeCv(textToAnalyze, input.jobDescription);
    if (analysisResult.isFailure()) {
      cv.failAnalysis(analysisResult.unwrapError().message);
      await this.publisher.publishEventsFrom(cv);
      return fail(analysisResult.unwrapError());
    }
    
    const analysisData = analysisResult.unwrap();

    // 3. Update Aggregate
    cv.attachAnalysis(analysisData.score, {
      matchedKeywords: analysisData.matchedKeywords,
      missingKeywords: analysisData.missingKeywords,
      strengths: analysisData.strengths,
      weaknesses: analysisData.weaknesses,
      recommendations: analysisData.recommendations,
      jobDescription: input.jobDescription
    });

    // 4. Save Aggregate (This should save both the Supabase CV and Prisma CVAnalysis underneath)
    const saveResult = await this.cvRepository.save(cv);
    if (saveResult.isFailure()) return fail(saveResult.unwrapError());

    // 5. Publish Events
    await this.publisher.publishEventsFrom(cv);

    return ok(undefined);
  }
}
