import { ok, fail, Result } from "@/lib/core/result";
import { UseCase } from "@/lib/core/application/UseCase";
import { CvStorageGateway } from "../../../ports/gateways/cv-storage.gateway";
import { DocumentParserGateway } from "../../../ports/gateways/document-parser.gateway";
import { CvRepositoryPort } from "../../../ports/repositories/cv-repository.port";
import { CVAggregate } from "../../../domain/aggregates/cv.aggregate";
import { DomainEventPublisher } from "@/lib/core/runtime/event-publisher/DomainEventPublisher";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { UnauthorizedError } from "@/lib/core/result/errors";
import { IdGenerator } from "@/lib/core/id/IdGenerator";
import { Clock } from "@/lib/core/clock/Clock";

export interface UploadCvInput {
  file: Buffer;
  filename: string;
  mimeType: string;
}

export class UploadCvUseCase extends UseCase<UploadCvInput, { cvId: string; url: string }> {
  constructor(
    private readonly storage: CvStorageGateway,
    private readonly parser: DocumentParserGateway,
    private readonly repository: CvRepositoryPort,
    private readonly publisher: DomainEventPublisher,
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock
  ) {
    super();
  }

  protected async run(input: UploadCvInput): Promise<Result<{ cvId: string; url: string }, any>> {
    const userId = RequestContext.userId();
    if (!userId) return fail(new UnauthorizedError("User not authenticated"));

    // 1. Upload to Storage
    const storageResult = await this.storage.uploadFile(userId, input.file, input.filename);
    if (storageResult.isFailure()) return fail(storageResult.unwrapError());
    const fileUrl = storageResult.unwrap();

    // 2. Create Aggregate
    const cvId = this.idGenerator.generate();
    const cv = CVAggregate.upload(userId, cvId, fileUrl, this.clock);

    // 3. Parse text from file
    const parseResult = await this.parser.extractText(input.file, input.mimeType);
    if (parseResult.isSuccess()) {
      cv.attachParsedText(parseResult.unwrap());
    }

    // 4. Persist CV
    const repoResult = await this.repository.save(cv);
    if (repoResult.isFailure()) return fail(repoResult.unwrapError());

    // 5. Publish Domain Events
    await this.publisher.publishEventsFrom(cv);

    return ok({ cvId: cv.id, url: fileUrl });
  }
}
