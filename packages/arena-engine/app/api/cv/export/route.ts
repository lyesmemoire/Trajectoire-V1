import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { ModernTemplate } from "@/lib/pdf/templates/modern";
import { CVData, ExportOptions } from "@/lib/pdf/types";
import { requireAuth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

const TEMPLATES = {
  modern: ModernTemplate,
};

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { blocked } = await checkRateLimit(user.id, "optimize");
    if (blocked) {
      return NextResponse.json(
        {
          error: "Limite atteinte",
          message: "Trop d'exports. Réessayez plus tard.",
        },
        { status: 429 },
      );
    }

    const body = await req.json();
    const { cvData, options } = body as {
      cvData: CVData;
      options: ExportOptions;
    };

    if (!cvData?.personalInfo?.name) {
      return NextResponse.json(
        { error: "Données CV invalides" },
        { status: 400 },
      );
    }

    const TemplateComponent =
      TEMPLATES[options.template as keyof typeof TEMPLATES] || ModernTemplate;

    // Use createElement to avoid JSX in .ts file
    const element = createElement(TemplateComponent as any, {
      data: cvData,
      options,
    });

    const pdfBuffer = await renderToBuffer(element as any);

    const safeName = cvData.personalInfo.name
      .replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
      .trim()
      .replace(/\s+/g, "_");

    const filename = `CV_${safeName}_${new Date().getFullYear()}.pdf`;

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("[PDF Export Error]:", error);
    const status = error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { error: error.message || "Erreur lors de la génération du PDF" },
      { status },
    );
  }
}
