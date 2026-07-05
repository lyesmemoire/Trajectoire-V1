import { ok, fail, Result } from "@/lib/core/result";
import { UseCase } from "@/lib/core/application/UseCase";
import { ParsedCV } from "@/types/cv";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { InfrastructureError } from "@/lib/core/result/errors";
import { CvRepositoryPort } from "../../../ports/repositories/cv-repository.port";
import { DomainEventPublisher } from "@/lib/core/runtime/event-publisher/DomainEventPublisher";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";

export interface ExportCvDocxInput {
  cvId?: string;
  cvData: ParsedCV;
}

export class ExportCvDocxUseCase extends UseCase<ExportCvDocxInput, Buffer> {
  constructor(
    private readonly repository: CvRepositoryPort,
    private readonly publisher: DomainEventPublisher
  ) {
    super();
  }

  protected async run(input: ExportCvDocxInput): Promise<Result<Buffer, any>> {
    try {
      const cv = input.cvData;

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({ text: cv.personalInfo.fullName, heading: HeadingLevel.HEADING_1 }),
              new Paragraph({
                children: [
                  new TextRun(cv.personalInfo.email || ""),
                  new TextRun({ text: " | ", bold: true }),
                  new TextRun(cv.personalInfo.phone || ""),
                  new TextRun({ text: " | ", bold: true }),
                  new TextRun(cv.personalInfo.location || ""),
                ],
              }),
              ...(cv.summary
                ? [
                    new Paragraph({ text: "Profile", heading: HeadingLevel.HEADING_2 }),
                    new Paragraph({ text: cv.summary }),
                  ]
                : []),
              new Paragraph({ text: "Experience", heading: HeadingLevel.HEADING_2 }),
              ...cv.experiences.flatMap((exp) => [
                new Paragraph({
                  children: [
                    new TextRun({ text: exp.position, bold: true }),
                    new TextRun({ text: ` at ${exp.company}` }),
                  ],
                }),
                new Paragraph({ text: `${exp.startDate || ""} - ${exp.current ? "Present" : exp.endDate || ""}` }),
                ...(exp.description ? [new Paragraph({ text: exp.description })] : []),
                ...exp.bullets.map((b) => new Paragraph({ text: `• ${b}`, bullet: { level: 0 } })),
                new Paragraph({ text: "" }),
              ]),
              new Paragraph({ text: "Education", heading: HeadingLevel.HEADING_2 }),
              ...cv.education.flatMap((edu) => [
                new Paragraph({
                  children: [
                    new TextRun({ text: edu.degree, bold: true }),
                    new TextRun({ text: ` - ${edu.institution}` }),
                  ],
                }),
                new Paragraph({ text: `${edu.startDate || ""} - ${edu.current ? "Present" : edu.endDate || ""}` }),
                new Paragraph({ text: "" }),
              ]),
              new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_2 }),
              ...cv.skills.map((skill) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: skill.category ? `${skill.category}: ` : "", bold: true }),
                    new TextRun(skill.items.join(", ")),
                  ],
                })
              ),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);

      // If cvId is provided, we can track the export event on the Aggregate
      if (input.cvId && input.cvId !== "unknown") {
        const userId = RequestContext.userId();
        if (userId) {
          const cvResult = await this.repository.findById(input.cvId);
          if (cvResult.isSuccess()) {
            const cvAgg = cvResult.unwrap();
            cvAgg.export("docx");
            await this.publisher.publishEventsFrom(cvAgg);
          }
        }
      }

      return ok(buffer as any);
    } catch (error: any) {
      return fail(new InfrastructureError("Failed to generate DOCX: " + error.message));
    }
  }
}
