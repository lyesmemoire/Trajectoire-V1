import { ok, fail, Result } from "@/lib/core/result";
import { UseCase } from "@/lib/core/application/UseCase";
import { CVData, ExportOptions } from "@/lib/pdf/types";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { ModernTemplate } from "@/lib/pdf/templates/modern";
import { InfrastructureError } from "@/lib/core/result/errors";
import { CvRepositoryPort } from "../../../ports/repositories/cv-repository.port";
import { DomainEventPublisher } from "@/lib/core/runtime/event-publisher/DomainEventPublisher";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";

export interface ExportCvPdfInput {
  cvId?: string;
  cvData: CVData;
  options: ExportOptions;
}

export class ExportCvPdfUseCase extends UseCase<ExportCvPdfInput, Buffer> {
  constructor(
    private readonly repository: CvRepositoryPort,
    private readonly publisher: DomainEventPublisher
  ) {
    super();
  }

  protected async run(input: ExportCvPdfInput): Promise<Result<Buffer, any>> {
    try {
      const TEMPLATES = { modern: ModernTemplate };
      const TemplateComponent = TEMPLATES[input.options.template as keyof typeof TEMPLATES] || ModernTemplate;

      const element = createElement(TemplateComponent as any, {
        data: input.cvData,
        options: input.options,
      });

      const pdfBuffer = await renderToBuffer(element as any);

      // If cvId is provided, we can track the export event on the Aggregate
      if (input.cvId && input.cvId !== "unknown") {
        const userId = RequestContext.userId();
        if (userId) {
          const cvResult = await this.repository.findById(input.cvId);
          if (cvResult.isSuccess()) {
            const cv = cvResult.unwrap();
            cv.export("pdf");
            await this.publisher.publishEventsFrom(cv);
          }
        }
      }

      return ok(pdfBuffer as any);
    } catch (error: any) {
      return fail(new InfrastructureError("Failed to generate PDF: " + error.message));
    }
  }
}
