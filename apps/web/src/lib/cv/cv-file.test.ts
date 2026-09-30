import { describe, it, expect, vi } from "vitest"

vi.mock("@/lib/logger", () => ({ logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() } }))

import {
  readCvFile,
  detectCvFileType,
  cleanCvText,
  CV_MAX_FILE_SIZE,
  CV_MAX_TEXT_LENGTH,
  CV_MIN_TEXT_LENGTH,
} from "./cv-file"

const LONG_TEXT =
  "Marie Dupont, développeuse full stack. Expérience : 6 ans chez Acme, migration d'une plateforme vers le cloud, " +
  "réduction des coûts de 30 %. Compétences : TypeScript, React, Node.js, PostgreSQL. Formation : Master informatique."

const txt = (content: string, name = "cv.txt", type = "text/plain") => new File([content], name, { type })

/** PDF minimal (une page, texte Helvetica) : pdfjs reconstruit la table des références. */
function minimalPdf(text: string): File {
  // Lignes courtes : le texte hors de la page serait rogné par pdfjs.
  const lines = text.match(/.{1,60}(\s|$)/g) ?? [text]
  const ops = lines.map(l => `(${l.trim().replace(/[()\\]/g, "\\$&")}) Tj 0 -14 Td`).join(" ")
  const stream = `BT /F1 10 Tf 40 700 Td ${ops} ET`
  const body =
    "%PDF-1.4\n" +
    "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n" +
    "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n" +
    "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n" +
    `4 0 obj<</Length ${stream.length}>>stream\n${stream}\nendstream endobj\n` +
    "5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n" +
    "trailer<</Root 1 0 R/Size 6>>\n%%EOF\n"
  return new File([body], "cv.pdf", { type: "application/pdf" })
}

describe("detectCvFileType", () => {
  it("reconnaît PDF, DOCX et TXT par type MIME ou extension", () => {
    expect(detectCvFileType({ name: "a.pdf", type: "" })).toBe("PDF")
    expect(detectCvFileType({ name: "a.DOCX", type: "" })).toBe("DOCX")
    expect(detectCvFileType({ name: "a", type: "text/plain" })).toBe("TXT")
  })

  it("refuse les autres formats (dont .doc, que le lecteur ne sait pas ouvrir)", () => {
    for (const name of ["a.doc", "a.png", "a.exe", "a"]) {
      expect(detectCvFileType({ name, type: "" })).toBeNull()
    }
  })
})

describe("readCvFile : refus", () => {
  it("fichier absent ou vide : 400", async () => {
    expect(await readCvFile(null)).toMatchObject({ ok: false, status: 400 })
    expect(await readCvFile(txt(""))).toMatchObject({ ok: false, status: 400 })
  })

  it("fichier trop volumineux : 413", async () => {
    const big = new File([new Uint8Array(CV_MAX_FILE_SIZE + 1)], "cv.pdf", { type: "application/pdf" })
    expect(await readCvFile(big)).toMatchObject({ ok: false, status: 413 })
  })

  it("format non supporté : 415", async () => {
    const png = new File(["x"], "photo.png", { type: "image/png" })
    expect(await readCvFile(png)).toMatchObject({ ok: false, status: 415 })
  })

  it("contenu qui ne correspond pas au type annoncé : 422", async () => {
    expect(await readCvFile(txt(LONG_TEXT, "cv.pdf", "application/pdf"))).toMatchObject({
      ok: false,
      status: 422,
      error: expect.stringContaining("PDF valide"),
    })
    expect(await readCvFile(txt(LONG_TEXT, "cv.docx", ""))).toMatchObject({
      ok: false,
      status: 422,
      error: expect.stringContaining("DOCX valide"),
    })
  })

  it("binaire renommé en .txt : 422", async () => {
    const bin = new File([new Uint8Array([72, 101, 0, 0, 1, 2, 3])], "cv.txt", { type: "text/plain" })
    expect(await readCvFile(bin)).toMatchObject({ ok: false, status: 422 })
  })

  it("texte trop court : 422 avec une aide", async () => {
    const r = await readCvFile(txt("Trop court."))
    expect(r).toMatchObject({ ok: false, status: 422 })
    expect(r.ok === false && r.hint).toBeTruthy()
    expect("Trop court.".length).toBeLessThan(CV_MIN_TEXT_LENGTH)
  })
})

describe("readCvFile : lecture", () => {
  it("TXT : texte nettoyé, nom assaini", async () => {
    const r = await readCvFile(txt("  " + LONG_TEXT.replace(/ /g, "  ") + "\r\n\r\n\r\n\r\nFin", "../mon:cv?.txt"))
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.fileType).toBe("TXT")
    expect(r.text).not.toMatch(/ {2}/)
    expect(r.text).not.toMatch(/\n{3}/)
    expect(r.fileName).not.toMatch(/[:?/\\]|\.\./)
  })

  it("texte trop long : tronqué à la limite", async () => {
    const r = await readCvFile(txt("a".repeat(CV_MAX_TEXT_LENGTH + 500)))
    expect(r.ok && r.text.length).toBe(CV_MAX_TEXT_LENGTH)
  })

  it("PDF : texte extrait", async () => {
    // ASCII : un PDF écrit à la main est en Latin-1, pas en UTF-8.
    const ascii =
      "Marie Dupont, developpeuse full stack. Experience : 6 ans chez Acme, migration d'une plateforme vers le cloud. " +
      "Competences : TypeScript, React, Node.js, PostgreSQL. Formation : Master informatique."
    const r = await readCvFile(minimalPdf(ascii))
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.fileType).toBe("PDF")
    expect(r.text).toContain("developpeuse")
    expect(r.text).toContain("TypeScript")
  })
})

describe("cleanCvText", () => {
  it("retire les octets nuls et normalise les espaces et sauts de ligne", () => {
    expect(cleanCvText("a\u0000b\r\n\r\n\r\n\r\nc   d\te")).toBe("ab\n\nc d e")
  })
})
