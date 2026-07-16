// @ts-nocheck
import { z } from "zod";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { ExportCvDocxUseCase } from "@/lib/cv/application/use-cases/export/export-cv-docx.use-case";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { logger } from "@/lib/core/logger";
import { ParsedCVSchema } from "@/types/cv";

export const dynamic = "force-dynamic";

const RequestSchema = z.object({
  cvId: z.string().optional(),
  cv: ParsedCVSchema,
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
        const body = await req.json();
        const parsed = RequestSchema.safeParse(body);
        if (!parsed.success) {
          return NextResponse.json({ error: "Validation failed" }, { status: 400 });
        }
        const input = parsed.data;

        const useCase = appContainer.resolve<ExportCvDocxUseCase>("ExportCvDocxUseCase");
        
        const result = await useCase.execute({
          cvId: input.cvId,
          cvData: input.cv,
        });

        if (result.isFailure()) {
          return NextResponse.json({ error: result.unwrapError().message }, { status: 400 });
        }

        const buffer = result.unwrap();
        const safeName = input.cv.personalInfo.fullName.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").trim().replace(/\s+/g, "_");
        const filename = `${safeName}_CV.docx`;

        return new NextResponse(buffer as any, {
          status: 200,
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition": `attachment; filename="${filename}"`,
          },
        });
      }
    );
  } catch (error: any) {
    logger.error("DOCX Export error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
