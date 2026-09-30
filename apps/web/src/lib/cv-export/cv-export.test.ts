import { describe, it, expect, vi } from "vitest"
import { PDFDocument } from "pdf-lib"

vi.mock("@/lib/logger", () => ({ logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() } }))

import { readCvFile } from "@/lib/cv/cv-file"
import {
  CvDocumentSchema,
  EMPTY_CV_DOCUMENT,
  cvFileBaseName,
  draftFromCvData,
  normalizeCvDocument,
  toCvBlocks,
  type CvDocument,
} from "./document"
import { buildCvDocx } from "./docx"
import { buildCvPdf } from "./pdf"

const DOC: CvDocument = {
  personal: {
    name: "Marie Dupont",
    email: "marie.dupont@exemple.test",
    phone: "+33 6 00 00 00 00",
    location: "Lyon",
    linkedin: "linkedin.com/in/mariedupont",
  },
  headline: "Développeuse full stack",
  summary:
    "Développeuse full stack avec six ans d'expérience, spécialisée dans les plateformes web à forte volumétrie et la migration vers le cloud.",
  experiences: [
    {
      title: "Développeuse senior",
      company: "Acme",
      startDate: "2021",
      endDate: "",
      current: true,
      bullets: ["Migration de la plateforme vers le cloud, coûts réduits de 30 %", "Encadrement de trois développeurs juniors"],
    },
    {
      title: "Développeuse",
      company: "Beta SARL",
      startDate: "2018",
      endDate: "2021",
      current: false,
      bullets: ["Refonte du tunnel de paiement (Stripe)"],
    },
  ],
  education: [{ degree: "Master informatique", institution: "Université de Lyon", year: "2018" }],
  skills: { technical: ["TypeScript", "React", "PostgreSQL"], languages: ["Français", "Anglais"], soft: ["Rigueur"] },
}

describe("schéma et normalisation", () => {
  it("accepte un document valide et refuse les champs inconnus ou trop longs", () => {
    expect(CvDocumentSchema.safeParse(DOC).success).toBe(true)
    expect(CvDocumentSchema.safeParse({ ...DOC, extra: 1 }).success).toBe(false)
    expect(CvDocumentSchema.safeParse({ ...DOC, summary: "a".repeat(2001) }).success).toBe(false)
    expect(CvDocumentSchema.safeParse({ ...DOC, experiences: Array(21).fill(DOC.experiences[0]) }).success).toBe(false)
  })

  it("normalise : retire les entrées vides et les doublons de compétences", () => {
    const doc = normalizeCvDocument({
      ...DOC,
      experiences: [...DOC.experiences, { title: "", company: "", startDate: "", endDate: "", current: false, bullets: ["  "] }],
      education: [...DOC.education, { degree: "", institution: "", year: "2020" }],
      skills: { technical: ["React", " react ", "React", ""], languages: [], soft: [] },
    })
    expect(doc.experiences).toHaveLength(2)
    expect(doc.education).toHaveLength(1)
    expect(doc.skills.technical).toEqual(["React", "react"])
  })
})

describe("draftFromCvData (pré-remplissage)", () => {
  it("reprend identité, expériences, formations et compétences ; ignore l'analyse (careerDNA)", () => {
    const draft = draftFromCvData(
      {
        personal: { name: "Marie Dupont", email: "m@exemple.test" },
        currentPosition: { title: "Développeuse", company: "Acme" },
        experiences: [{ company: "Acme", title: "Dev", startDate: "2020", current: true, highlights: ["A", "B", 3] }],
        education: [{ institution: "Univ", degree: "Master", field: "Informatique", year: 2018 }],
        skills: { technical: ["TS"], soft: [], languages: ["Français"] },
        careerDNA: { strengths: ["NE PAS EXPORTER"], redFlags: ["NE PAS EXPORTER"] },
      },
      "Mon résumé",
    )
    expect(draft.personal.name).toBe("Marie Dupont")
    expect(draft.headline).toBe("Développeuse")
    expect(draft.summary).toBe("Mon résumé")
    expect(draft.experiences[0]).toMatchObject({ title: "Dev", company: "Acme", current: true, bullets: ["A", "B"] })
    expect(draft.education[0]).toEqual({ degree: "Master, Informatique", institution: "Univ", year: "2018" })
    expect(JSON.stringify(draft)).not.toContain("NE PAS EXPORTER")
    expect(CvDocumentSchema.safeParse(draft).success).toBe(true)
  })

  it("tolère des données absentes ou de mauvais types (jamais d'exception)", () => {
    for (const bad of [null, undefined, "texte", 42, [], { experiences: "x", education: 5, skills: [] }]) {
      expect(() => draftFromCvData(bad)).not.toThrow()
      expect(CvDocumentSchema.safeParse(draftFromCvData(bad)).success).toBe(true)
    }
    expect(draftFromCvData(null)).toEqual(EMPTY_CV_DOCUMENT)
  })
})

describe("blocs de mise en page", () => {
  it("ordre : nom, titre, coordonnées, puis Profil, Expérience, Formation, Compétences", () => {
    const blocks = toCvBlocks(DOC)
    const headings = blocks.filter(b => b.kind === "heading").map(b => (b as { text: string }).text)
    expect(headings).toEqual(["Profil", "Expérience professionnelle", "Formation", "Compétences"])
    expect(blocks.slice(0, 3).map(b => b.kind)).toEqual(["name", "headline", "contact"])
  })

  it("dates : « début – Présent » pour un poste en cours, « début – fin » sinon", () => {
    const entries = toCvBlocks(DOC).filter(b => b.kind === "entry") as Array<{ title: string; dates: string }>
    expect(entries[0]).toEqual({ kind: "entry", title: "Développeuse senior – Acme", dates: "2021 – Présent" })
    expect(entries[1].dates).toBe("2018 – 2021")
  })

  it("sections vides omises", () => {
    const blocks = toCvBlocks({ ...EMPTY_CV_DOCUMENT, personal: { ...EMPTY_CV_DOCUMENT.personal, name: "A B" } })
    expect(blocks.map(b => b.kind)).toEqual(["name"])
  })

  it("nom de fichier sûr", () => {
    expect(cvFileBaseName(DOC)).toBe("CV-Marie-Dupont")
    expect(cvFileBaseName({ ...DOC, personal: { ...DOC.personal, name: "Éloïse  O'Brien/../x" } })).toBe("CV-Eloise-O-Brien-x")
    expect(cvFileBaseName(EMPTY_CV_DOCUMENT)).toBe("CV")
  })
})

describe("DOCX", () => {
  it("est un fichier Word valide que notre lecteur relit, avec tout le contenu", async () => {
    const buffer = await buildCvDocx(DOC)
    expect(buffer.subarray(0, 2).toString("latin1")).toBe("PK")

    const read = await readCvFile(new File([new Uint8Array(buffer)], "cv.docx"))
    expect(read.ok).toBe(true)
    if (!read.ok) return
    for (const part of [
      "Marie Dupont",
      "marie.dupont@exemple.test",
      "PROFIL",
      "EXPÉRIENCE PROFESSIONNELLE",
      "Développeuse senior – Acme",
      "2021 – Présent",
      "coûts réduits de 30 %",
      "FORMATION",
      "Master informatique",
      "COMPÉTENCES",
      "TypeScript, React, PostgreSQL",
    ]) {
      expect(read.text).toContain(part)
    }
  })
})

describe("PDF", () => {
  it("est un PDF valide, texte extractible, tout le contenu présent", async () => {
    const bytes = await buildCvPdf(DOC)
    expect(Buffer.from(bytes.subarray(0, 4)).toString("latin1")).toBe("%PDF")

    const read = await readCvFile(new File([bytes as BlobPart], "cv.pdf", { type: "application/pdf" }))
    expect(read.ok).toBe(true)
    if (!read.ok) return
    for (const part of ["Marie Dupont", "Développeuse senior", "Acme", "Présent", "Master informatique", "TypeScript"]) {
      expect(read.text).toContain(part)
    }
    // Accents et guillemets typographiques conservés (WinAnsi).
    expect(read.text).toContain("Expérience professionnelle".toUpperCase().slice(0, 4))
  })

  it("plusieurs pages si le contenu est long, sans perdre de texte", async () => {
    const long: CvDocument = {
      ...DOC,
      experiences: Array.from({ length: 12 }, (_, i) => ({
        title: `Poste numéro ${i + 1}`,
        company: `Société ${i + 1}`,
        startDate: "2010",
        endDate: "2012",
        current: false,
        bullets: Array.from({ length: 6 }, (_, j) => `Réalisation ${i + 1}.${j + 1} : ${"résultat mesurable ".repeat(6)}`),
      })),
    }
    const bytes = await buildCvPdf(long)
    expect((await PDFDocument.load(bytes)).getPageCount()).toBeGreaterThan(1)
    const read = await readCvFile(new File([bytes as BlobPart], "cv.pdf", { type: "application/pdf" }))
    expect(read.ok && read.text).toContain("Poste numéro 12")
  })

  it("caractères hors WinAnsi : remplacés, jamais d'exception", async () => {
    const odd: CvDocument = { ...DOC, summary: "Expert 日本語 et émojis 🎯 → résultats ≥ 90 %, prix 12 € – très bien." }
    const bytes = await buildCvPdf(odd)
    const read = await readCvFile(new File([bytes as BlobPart], "cv.pdf", { type: "application/pdf" }))
    expect(read.ok).toBe(true)
    if (!read.ok) return
    expect(read.text).toContain("12 €")
    expect(read.text).toContain("résultats")
  })

  it("mot très long : coupé sans dépasser la page ni planter", async () => {
    const bytes = await buildCvPdf({ ...DOC, summary: "x".repeat(1500) })
    expect(bytes.length).toBeGreaterThan(500)
  })
})
