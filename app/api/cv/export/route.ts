import { z } from "zod";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { ExportCvPdfUseCase } from "@/lib/cv/application/use-cases/export/export-cv-pdf.use-case";
import { checkRateLimit } from "@/lib/rate-limit";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { logger } from "@/lib/core/logger";

export const dynamic = "force-dynamic";

const RequestSchema = z.object({
  cvId: z.string().optional(),
  cvData: z.object({
    personalInfo: z.object({
      name: z.string().min(1, "Le nom est requis"),
    }).passthrough(),
  }).passthrough(),
  options: z.object({
    template: z.string().default("modern"),
  }).passthrough().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return RequestContext.run(
      { userId: user.id, correlationId: crypto.randomUUID(), requestId: crypto.randomUUID() },
      async () => {
        const { blocked } = await checkRateLimit(user.id, "optimize");
        if (blocked) {
          return NextResponse.json({ error: "Limite atteinte" }, { status: 429 });
        }

        const body = await req.json();
        const parsed = RequestSchema.safeParse(body);
        if (!parsed.success) {
          return NextResponse.json({ error: "Validation failed" }, { status: 400 });
        }
        const input = parsed.data;

        const useCase = appContainer.resolve<ExportCvPdfUseCase>("ExportCvPdfUseCase");
        
        const result = await useCase.execute({
          cvId: input.cvId,
          cvData: input.cvData as any,
          options: input.options as any,
        });

        if (result.isFailure()) {
          return NextResponse.json({ error: result.unwrapError().message }, { status: 400 });
        }

        const pdfBuffer = result.unwrap();
        const safeName = (input.cvData as any).personalInfo.name.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").trim().replace(/\s+/g, "_");
        const filename = `CV_${safeName}_${new Date().getFullYear()}.pdf`;

        return new NextResponse(pdfBuffer as any, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Length": pdfBuffer.length.toString(),
          },
        });
      }
    );
  } catch (error: any) {
    logger.error("PDF Export error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
