import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"
import { toCvBlocks, type CvBlock, type CvDocument } from "./document"

/**
 * PDF d'une seule colonne en Helvetica (police standard, texte sélectionnable : lisible par les ATS).
 * Limite assumée : l'encodage WinAnsi couvre le français et les langues d'Europe occidentale ; les
 * caractères hors de ce jeu (alphabets non latins, émojis) sont remplacés par « ? » (le DOCX n'a pas
 * cette limite).
 */

const PAGE_W = 595.28 // A4
const PAGE_H = 841.89
const MARGIN_X = 54
const MARGIN_TOP = 56
const MARGIN_BOTTOM = 56
const CONTENT_W = PAGE_W - MARGIN_X * 2
const BODY = 10.5
const GREY = rgb(0.27, 0.27, 0.27)
const BLACK = rgb(0.05, 0.05, 0.05)

const REPLACEMENTS: Record<string, string> = {
  " ": " ",
  " ": " ",
  "→": "->",
  "←": "<-",
  "≥": ">=",
  "≤": "<=",
  "−": "-",
  "­": "",
  "​": "",
  "‌": "",
  "‍": "",
  "﻿": "",
}

/** Garde les caractères que la police peut encoder ; remplace les autres par « ? ». */
function encodable(font: PDFFont, value: string): string {
  const supported = new Set(font.getCharacterSet())
  let out = ""
  for (const ch of value.normalize("NFC")) {
    const mapped = REPLACEMENTS[ch] ?? ch
    for (const c of mapped) {
      if (c === "\n" || c === "\t") out += " "
      else out += supported.has(c.codePointAt(0)!) ? c : "?"
    }
  }
  return out
}

/** Découpe un texte en lignes qui tiennent dans `width` (mots, puis césure brute d'un mot trop long). */
function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const lines: string[] = []
  let line = ""
  const push = () => {
    if (line) lines.push(line)
    line = ""
  }
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(candidate, size) <= width) {
      line = candidate
      continue
    }
    push()
    if (font.widthOfTextAtSize(word, size) <= width) {
      line = word
      continue
    }
    let chunk = ""
    for (const ch of word) {
      if (font.widthOfTextAtSize(chunk + ch, size) > width) {
        lines.push(chunk)
        chunk = ch
      } else chunk += ch
    }
    line = chunk
  }
  push()
  return lines
}

export async function buildCvPdf(doc: CvDocument): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  pdf.setTitle(doc.personal.name ? `CV ${doc.personal.name}` : "CV")
  pdf.setCreator("Trajectoire")
  pdf.setProducer("Trajectoire")
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique)

  let page: PDFPage = pdf.addPage([PAGE_W, PAGE_H])
  let y = PAGE_H - MARGIN_TOP

  const ensure = (needed: number) => {
    if (y - needed < MARGIN_BOTTOM) {
      page = pdf.addPage([PAGE_W, PAGE_H])
      y = PAGE_H - MARGIN_TOP
    }
  }

  const drawLines = (
    text: string,
    font: PDFFont,
    size: number,
    opts: { x?: number; width?: number; color?: ReturnType<typeof rgb>; leading?: number; after?: number } = {},
  ) => {
    const x = opts.x ?? MARGIN_X
    const width = opts.width ?? CONTENT_W
    const leading = opts.leading ?? size * 1.32
    for (const line of wrap(encodable(font, text), font, size, width)) {
      ensure(leading)
      y -= size
      page.drawText(line, { x, y, size, font, color: opts.color ?? BLACK })
      y -= leading - size
    }
    y -= opts.after ?? 0
  }

  const render = (block: CvBlock) => {
    switch (block.kind) {
      case "name":
        drawLines(block.text, bold, 20, { after: 2 })
        break
      case "headline":
        drawLines(block.text, regular, 12, { color: GREY, after: 2 })
        break
      case "contact":
        drawLines(block.text, regular, BODY, { color: GREY, after: 8 })
        break
      case "heading": {
        ensure(40)
        y -= 10
        drawLines(block.text.toUpperCase(), bold, 11.5, { after: 1 })
        page.drawLine({
          start: { x: MARGIN_X, y: y + 2 },
          end: { x: PAGE_W - MARGIN_X, y: y + 2 },
          thickness: 0.6,
          color: rgb(0.6, 0.6, 0.6),
        })
        y -= 6
        break
      }
      case "paragraph":
        drawLines(block.text, regular, BODY, { after: 3 })
        break
      case "entry": {
        ensure(34)
        y -= 4
        const title = encodable(bold, block.title)
        const dates = block.dates ? encodable(italic, block.dates) : ""
        const datesW = dates ? italic.widthOfTextAtSize(dates, BODY) : 0
        // Titre à gauche, dates à droite sur la même ligne si la place le permet, sinon ligne suivante.
        if (dates && bold.widthOfTextAtSize(title, 11) + datesW + 16 <= CONTENT_W) {
          ensure(14)
          y -= 11
          page.drawText(title, { x: MARGIN_X, y, size: 11, font: bold, color: BLACK })
          page.drawText(dates, { x: PAGE_W - MARGIN_X - datesW, y, size: BODY, font: italic, color: GREY })
          y -= 3
        } else {
          drawLines(block.title, bold, 11, {})
          if (dates) drawLines(block.dates, italic, BODY, { color: GREY })
        }
        break
      }
      case "entrySub":
        drawLines(block.text, regular, BODY, { color: GREY, after: 1 })
        break
      case "bullet": {
        const indent = 14
        const lines = wrap(encodable(regular, block.text), regular, BODY, CONTENT_W - indent)
        lines.forEach((line, i) => {
          ensure(BODY * 1.3)
          y -= BODY
          if (i === 0) page.drawText("•", { x: MARGIN_X + 3, y, size: BODY, font: regular, color: BLACK })
          page.drawText(line, { x: MARGIN_X + indent, y, size: BODY, font: regular, color: BLACK })
          y -= BODY * 0.3
        })
        y -= 1.5
        break
      }
      case "skills": {
        const label = `${encodable(bold, block.label)} : `
        const labelW = bold.widthOfTextAtSize(label, BODY)
        const lines = wrap(encodable(regular, block.text), regular, BODY, CONTENT_W - labelW)
        lines.forEach((line, i) => {
          ensure(BODY * 1.3)
          y -= BODY
          if (i === 0) page.drawText(label, { x: MARGIN_X, y, size: BODY, font: bold, color: BLACK })
          page.drawText(line, { x: MARGIN_X + labelW, y, size: BODY, font: regular, color: BLACK })
          y -= BODY * 0.3
        })
        y -= 2
        break
      }
    }
  }

  for (const block of toCvBlocks(doc)) render(block)

  return pdf.save()
}
