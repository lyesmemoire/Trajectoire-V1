import { ok, fail, Result } from "../../../../../lib/core/result";
import { UseCase } from "../../../../../lib/core/application/UseCase";
import { JobOfferAggregate } from "../../../domain/aggregates/job-offer.aggregate";
import { DomainEventPublisher } from "../../../../../lib/core/runtime/event-publisher/DomainEventPublisher";
import { RequestContext } from "../../../../../lib/core/runtime/context/RequestContext";
import { UnauthorizedError } from "../../../../../lib/core/result/errors";
import { IdGenerator } from "../../../../../lib/core/id/IdGenerator";
import { Clock } from "../../../../../lib/core/clock/Clock";
import { JobOfferExtractorEngine } from "../../../../../core/intelligence/engines/jobOfferExtractor";
import { PrismaJobOfferRepository } from "../../../../../lib/jobs/infrastructure/repositories/prisma-job-offer.repository";

export interface UploadJobOfferInput {
  description: string;
  source?: string;
  sourceType?: "URL_LINKEDIN" | "URL_INDEED" | "URL_WTTJ" | "RAW_TEXT";
}

export class UploadJobOfferUseCase extends UseCase<UploadJobOfferInput, { jobOfferId: string }> {
  constructor(
    private readonly publisher: DomainEventPublisher,
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock,
    private readonly jobOfferRepository: PrismaJobOfferRepository
  ) {
    super();
  }

  protected async run(input: UploadJobOfferInput): Promise<Result<{ jobOfferId: string }, any>> {
    const userId = RequestContext.userId();
    if (!userId) return fail(new UnauthorizedError("User not authenticated"));

    // 1. Create Aggregate
    const jobOfferId = this.idGenerator.generate();
    const jobOffer = JobOfferAggregate.upload(
      userId,
      jobOfferId,
      input.description,
      this.clock,
      input.source,
      input.sourceType
    );

    // 2. Extract enriched job offer data from description
    const offerExtraction = JobOfferExtractorEngine.extract({
      jobOfferText: input.description,
      jobOfferId,
      userId,
    });

    // 3. Attach parsed info to job offer
    jobOffer.attachParsedInfo(offerExtraction.generalInfo.title, offerExtraction.generalInfo.company);

    // 4. Attach extracted analysis to job offer metadata
    jobOffer.attachAnalysis({
      offerExtraction,
    });

    // 5. Persist to database
    const saveResult = await this.jobOfferRepository.save(jobOffer);
    if (saveResult.isFailure()) {
      return fail(saveResult.unwrapError());
    }

    // 6. Publish Domain Events
    await this.publisher.publishEventsFrom(jobOffer);

    return ok({ jobOfferId: jobOffer.id });
  }
}
