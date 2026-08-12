import { ReportSummary, PdfArtifact } from "../report-contract";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as crypto from "crypto";

export async function generatePDF(summary: ReportSummary): Promise<PdfArtifact> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  let y = height - 50;

  // Title
  page.drawText("EVALUATION REPORT", {
    x: 50,
    y,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= 40;

  // Verdict
  page.drawText(`Verdict: ${summary.verdict}`, {
    x: 50,
    y,
    size: 14,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= 25;

  // Score
  page.drawText(`Score: ${summary.globalScore}/100`, {
    x: 50,
    y,
    size: 14,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 25;

  // Rank
  page.drawText(`Rank: ${summary.rank} out of ${summary.cohortSize}`, {
    x: 50,
    y,
    size: 14,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 40;

  // Strengths section
  page.drawText("Strengths:", {
    x: 50,
    y,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  summary.strengths.forEach((strength) => {
    page.drawText(`• ${strength}`, {
      x: 60,
      y,
      size: 12,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });
    y -= 18;
  });

  y -= 20;

  // Weaknesses section
  page.drawText("Weaknesses:", {
    x: 50,
    y,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  summary.weaknesses.forEach((weakness) => {
    page.drawText(`• ${weakness}`, {
      x: 60,
      y,
      size: 12,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });
    y -= 18;
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  // Generate hash for verification
  const hash = crypto.createHash("sha256").update(pdfBytes).digest("hex");

  return {
    bytes: pdfBytes,
    hash,
  };
}
