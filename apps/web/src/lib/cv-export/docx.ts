import {
  AlignmentType,
  BorderStyle,
  Document,
  LevelFormat,
  Packer,
  Paragraph,
  TextRun,
} from "docx"
import { toCvBlocks, type CvBlock, type CvDocument } from "./document"

/** Police standard, lisible par tous les ATS ; tailles en demi-points (docx). */
const FONT = "Calibri"
const BODY = 21 // 10,5 pt

function paragraphFor(block: CvBlock): Paragraph {
  switch (block.kind) {
    case "name":
      return new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 40 },
        children: [new TextRun({ text: block.text, bold: true, size: 40, font: FONT })],
      })
    case "headline":
      return new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: block.text, size: 24, color: "444444", font: FONT })],
      })
    case "contact":
      return new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({ text: block.text, size: BODY, color: "444444", font: FONT })],
      })
    case "heading":
      return new Paragraph({
        spacing: { before: 240, after: 100 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "999999", space: 2 } },
        keepNext: true,
        children: [new TextRun({ text: block.text.toUpperCase(), bold: true, size: 23, font: FONT })],
      })
    case "paragraph":
      return new Paragraph({
        spacing: { after: 80, line: 264 },
        children: [new TextRun({ text: block.text, size: BODY, font: FONT })],
      })
    case "entry":
      return new Paragraph({
        spacing: { before: 120, after: 0 },
        keepNext: true,
        children: [
          new TextRun({ text: block.title, bold: true, size: 22, font: FONT }),
          ...(block.dates
            ? [new TextRun({ text: `   ${block.dates}`, italics: true, size: BODY, color: "555555", font: FONT })]
            : []),
        ],
      })
    case "entrySub":
      return new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: block.text, size: BODY, color: "444444", font: FONT })],
      })
    case "bullet":
      return new Paragraph({
        numbering: { reference: "cv-bullets", level: 0 },
        spacing: { after: 30, line: 259 },
        children: [new TextRun({ text: block.text, size: BODY, font: FONT })],
      })
    case "skills":
      return new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: `${block.label} : `, bold: true, size: BODY, font: FONT }),
          new TextRun({ text: block.text, size: BODY, font: FONT }),
        ],
      })
  }
}

/** DOCX d'une seule colonne (titres standards, puces natives, aucun tableau ni image). */
export async function buildCvDocx(doc: CvDocument): Promise<Buffer> {
  const blocks = toCvBlocks(doc)
  const document = new Document({
    creator: "Trajectoire",
    title: doc.personal.name ? `CV ${doc.personal.name}` : "CV",
    styles: { default: { document: { run: { font: FONT, size: BODY } } } },
    numbering: {
      config: [
        {
          reference: "cv-bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 360, hanging: 220 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: { page: { margin: { top: 850, bottom: 850, left: 1000, right: 1000 } } },
        children: blocks.map(paragraphFor),
      },
    ],
  })
  return Packer.toBuffer(document)
}
