import { DomainModule } from "@/lib/core/application/DomainModule";
import { UuidGenerator } from "@/lib/core/id/IdGenerator";
import { Clock } from "@/lib/core/clock/Clock";
import { Container } from "@/lib/core/runtime/container/Container";

import { SupabaseCvRepository } from "./infrastructure/repositories/supabase-cv.repository";
import { MistralAdapter } from "./infrastructure/adapters/mistral.adapter";
import { PdfParserAdapter } from "./infrastructure/adapters/pdf-parser.adapter";
import { BillingCreditsGateway } from "./infrastructure/adapters/billing-credits.gateway";
import { MistralAtsAnalysisAdapter } from "./infrastructure/adapters/mistral-ats-analysis.adapter";
import { SupabaseStorageAdapter } from "./infrastructure/adapters/supabase-storage.adapter";

import { UploadCvUseCase } from "./application/use-cases/upload/upload-cv.use-case";
import { RewriteCvUseCase } from "./application/use-cases/rewrite/rewrite-cv.use-case";
import { AnalyzeCvUseCase } from "./application/use-cases/analyze/analyze-cv.use-case";
import { ExportCvPdfUseCase } from "./application/use-cases/export/export-cv-pdf.use-case";
import { ExportCvDocxUseCase } from "./application/use-cases/export/export-cv-docx.use-case";
import { ListUserCvsQueryHandler } from "./application/queries/list-user-cvs.query";

import { CvPresenter } from "./presentation/cv.presenter";

export class CvModule extends DomainModule {
  protected registerRepositories(container: Container): void {
    container.registerSingleton("CvRepositoryPort", () => new SupabaseCvRepository(
      container.resolve("Clock") as Clock
    ));
  }

  protected registerGateways(container: Container): void {
    container.registerSingleton("LLMRewriterGateway", new MistralAdapter());
    container.registerSingleton("DocumentParserGateway", new PdfParserAdapter());
    container.registerSingleton("CvStorageGateway", new SupabaseStorageAdapter());
    container.registerSingleton("AtsAnalysisGateway", new MistralAtsAnalysisAdapter());

    // CreditsGateway delegates to Billing via CommandBus/QueryBus
    container.registerTransient("CreditsGateway", () => new BillingCreditsGateway(
      container.resolve("CommandBus"),
      container.resolve("QueryBus")
    ));
  }

  protected registerUseCases(container: Container): void {
    container.registerTransient("UploadCvUseCase", () => new UploadCvUseCase(
      container.resolve("CvStorageGateway"),
      container.resolve("DocumentParserGateway"),
      container.resolve("CvRepositoryPort"),
      container.resolve("DomainEventPublisher"),
      new UuidGenerator(),
      container.resolve("Clock") as Clock
    ));

    container.registerTransient("RewriteCvUseCase", () => new RewriteCvUseCase(
      container.resolve("LLMRewriterGateway"),
      container.resolve("CreditsGateway"),
      container.resolve("CvRepositoryPort"),
      container.resolve("DomainEventPublisher")
    ));

    container.registerTransient("AnalyzeCvUseCase", () => new AnalyzeCvUseCase(
      container.resolve("AtsAnalysisGateway"),
      container.resolve("CvRepositoryPort"),
      container.resolve("DomainEventPublisher")
    ));

    container.registerTransient("ExportCvPdfUseCase", () => new ExportCvPdfUseCase(
      container.resolve("CvRepositoryPort"),
      container.resolve("DomainEventPublisher")
    ));

    container.registerTransient("ExportCvDocxUseCase", () => new ExportCvDocxUseCase(
      container.resolve("CvRepositoryPort"),
      container.resolve("DomainEventPublisher")
    ));
  }

  protected registerQueries(container: Container): void {
    container.registerTransient("ListUserCvsQueryHandler", () => new ListUserCvsQueryHandler());
  }

  protected registerPresenters(container: Container): void {
    container.registerSingleton("CvPresenter", new CvPresenter());
  }
}
