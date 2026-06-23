import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { ParsedCVSchema, ParsedCV } from "@/types/cv";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await req.json();
    const parsed = ParsedCVSchema.safeParse(body.cv);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid CV data", details: parsed.error },
        { status: 400 },
      );
    }

    const cv: ParsedCV = parsed.data;

    // Build the DOCX document (ATS-friendly, simple, clean)
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Personal Info
            new Paragraph({
              text: cv.personalInfo.fullName,
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [
                new TextRun(cv.personalInfo.email || ""),
                new TextRun({ text: " | ", bold: true }),
                new TextRun(cv.personalInfo.phone || ""),
                new TextRun({ text: " | ", bold: true }),
                new TextRun(cv.personalInfo.location || ""),
              ],
            }),
            // Summary
            ...(cv.summary
              ? [
                  new Paragraph({
                    text: "Profile",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  new Paragraph({ text: cv.summary }),
                ]
              : []),
            // Experiences
            new Paragraph({
              text: "Experience",
              heading: HeadingLevel.HEADING_2,
            }),
            ...cv.experiences.flatMap((exp) => [
              new Paragraph({
                children: [
                  new TextRun({ text: exp.position, bold: true }),
                  new TextRun({ text: ` at ${exp.company}` }),
                ],
              }),
              new Paragraph({
                text: `${exp.startDate || ""} - ${exp.current ? "Present" : exp.endDate || ""}`,
              }),
              ...(exp.description
                ? [new Paragraph({ text: exp.description })]
                : []),
              ...exp.bullets.map(
                (b) => new Paragraph({ text: `• ${b}`, bullet: { level: 0 } }),
              ),
              new Paragraph({ text: "" }), // spacer
            ]),
            // Education
            new Paragraph({
              text: "Education",
              heading: HeadingLevel.HEADING_2,
            }),
            ...cv.education.flatMap((edu) => [
              new Paragraph({
                children: [
                  new TextRun({ text: edu.degree, bold: true }),
                  new TextRun({ text: ` - ${edu.institution}` }),
                ],
              }),
              new Paragraph({
                text: `${edu.startDate || ""} - ${edu.current ? "Present" : edu.endDate || ""}`,
              }),
              new Paragraph({ text: "" }),
            ]),
            // Skills
            new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_2 }),
            ...cv.skills.map(
              (skill) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: skill.category ? `${skill.category}: ` : "",
                      bold: true,
                    }),
                    new TextRun(skill.items.join(", ")),
                  ],
                }),
            ),
          ],
        },
      ],
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);

    // Stream response
    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${cv.personalInfo.fullName.replace(/\s+/g, "_")}_CV.docx"`,
      },
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[DOCX_EXPORT_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
