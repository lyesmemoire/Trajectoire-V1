import { z } from "zod"

/**
 * Document de CV à exporter (DOCX / PDF).
 *
 * Le document est celui que l'UTILISATEUR relit et corrige dans l'éditeur (`/cv/[id]/export`) : l'extraction
 * automatique du CV est lossy, donc rien n'est reconstruit en silence. Aucune IA ici : mise en forme
 * déterministe des seules données fournies, donc aucune information inventée.
 */

const text = (max: number) => z.string().trim().max(max)

export const CvDocumentSchema = z
  .object({
    personal: z
      .object({
        name: text(120),
        email: text(160),
        phone: text(40),
        location: text(120),
        linkedin: text(200),
      })
      .strict(),
    headline: text(160),
    summary: text(2000),
    experiences: z
      .array(
        z
          .object({
            title: text(160),
            company: text(160),
            startDate: text(40),
            endDate: text(40),
            current: z.boolean(),
            bullets: z.array(text(400)).max(15),
          })
          .strict(),
      )
      .max(20),
    education: z
      .array(
        z
          .object({
            degree: text(200),
            institution: text(200),
            year: text(10),
          })
          .strict(),
      )
      .max(10),
    skills: z
      .object({
        technical: z.array(text(60)).max(60),
        languages: z.array(text(60)).max(20),
        soft: z.array(text(60)).max(30),
      })
      .strict(),
  })
  .strict()

export type CvDocument = z.infer<typeof CvDocumentSchema>

export const EMPTY_CV_DOCUMENT: CvDocument = {
  personal: { name: "", email: "", phone: "", location: "", linkedin: "" },
  headline: "",
  summary: "",
  experiences: [],
  education: [],
  skills: { technical: [], languages: [], soft: [] },
}

const compact = (items: string[]) => Array.from(new Set(items.map(s => s.trim()).filter(Boolean)))

/** Retire les entrées vides et les doublons ; ne change aucun contenu. */
export function normalizeCvDocument(doc: CvDocument): CvDocument {
  return {
    ...doc,
    experiences: doc.experiences
      .map(e => ({ ...e, bullets: e.bullets.map(b => b.trim()).filter(Boolean) }))
      .filter(e => e.title || e.company || e.bullets.length > 0),
    education: doc.education.filter(e => e.degree || e.institution),
    skills: {
      technical: compact(doc.skills.technical),
      languages: compact(doc.skills.languages),
      soft: compact(doc.skills.soft),
    },
  }
}

// ── Pré-remplissage depuis l'extraction automatique (`CVAnalysis.cvData`) ───────────────────────

const str = (v: unknown, max: number): string => (typeof v === "string" ? v.trim().slice(0, max) : "")
const strList = (v: unknown, max: number, count: number): string[] =>
  Array.isArray(v) ? compact(v.filter((x): x is string => typeof x === "string").map(x => x.slice(0, max))).slice(0, count) : []
const record = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {})

/**
 * Brouillon tiré de `cvData` (forme : voir `CvAnalysisSchema` de `api/cv/analyze`). Tolérant : tout champ
 * absent ou de mauvais type devient vide. `careerDNA` (forces, points d'alerte) est de l'analyse, pas du
 * contenu de CV : jamais exporté.
 */
export function draftFromCvData(cvData: unknown, summary = ""): CvDocument {
  const data = record(cvData)
  const personal = record(data.personal)
  const current = record(data.currentPosition)
  const skills = record(data.skills)

  const experiences = (Array.isArray(data.experiences) ? data.experiences : []).slice(0, 20).map(raw => {
    const e = record(raw)
    return {
      title: str(e.title, 160),
      company: str(e.company, 160),
      startDate: str(e.startDate, 40),
      endDate: str(e.endDate, 40),
      current: e.current === true,
      bullets: strList(e.highlights, 400, 15),
    }
  })

  const education = (Array.isArray(data.education) ? data.education : []).slice(0, 10).map(raw => {
    const e = record(raw)
    const degree = [str(e.degree, 120), str(e.field, 80)].filter(Boolean).join(", ")
    return {
      degree: degree.slice(0, 200),
      institution: str(e.institution, 200),
      year: typeof e.year === "number" && Number.isFinite(e.year) ? String(Math.trunc(e.year)) : str(e.year, 10),
    }
  })

  return normalizeCvDocument({
    personal: {
      name: str(personal.name, 120),
      email: str(personal.email, 160),
      phone: str(personal.phone, 40),
      location: str(personal.location, 120),
      linkedin: str(personal.linkedin, 200),
    },
    headline: str(current.title, 160),
    summary: summary.trim().slice(0, 2000),
    experiences,
    education,
    skills: {
      technical: strList(skills.technical, 60, 60),
      languages: strList(skills.languages, 60, 20),
      soft: strList(skills.soft, 60, 30),
    },
  })
}

// ── Blocs de mise en page, communs au DOCX et au PDF ───────────────────────────────────────────

export type CvBlock =
  | { kind: "name"; text: string }
  | { kind: "headline"; text: string }
  | { kind: "contact"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "entry"; title: string; dates: string }
  | { kind: "entrySub"; text: string }
  | { kind: "bullet"; text: string }
  | { kind: "skills"; label: string; text: string }

export const CV_HEADINGS = {
  summary: "Profil",
  experience: "Expérience professionnelle",
  education: "Formation",
  skills: "Compétences",
} as const

function dateRange(start: string, end: string, current: boolean): string {
  const to = current ? "Présent" : end
  if (start && to) return `${start} – ${to}`
  return start || to || ""
}

/**
 * Structure ATS : une seule colonne, titres de section standards, pas de tableau ni d'image,
 * coordonnées en texte brut.
 */
export function toCvBlocks(input: CvDocument): CvBlock[] {
  const doc = normalizeCvDocument(input)
  const blocks: CvBlock[] = []

  blocks.push({ kind: "name", text: doc.personal.name })
  if (doc.headline) blocks.push({ kind: "headline", text: doc.headline })
  const contact = [doc.personal.email, doc.personal.phone, doc.personal.location, doc.personal.linkedin].filter(Boolean)
  if (contact.length) blocks.push({ kind: "contact", text: contact.join("  |  ") })

  if (doc.summary) {
    blocks.push({ kind: "heading", text: CV_HEADINGS.summary }, { kind: "paragraph", text: doc.summary })
  }

  if (doc.experiences.length) {
    blocks.push({ kind: "heading", text: CV_HEADINGS.experience })
    for (const e of doc.experiences) {
      blocks.push({ kind: "entry", title: [e.title, e.company].filter(Boolean).join(" – "), dates: dateRange(e.startDate, e.endDate, e.current) })
      for (const b of e.bullets) blocks.push({ kind: "bullet", text: b })
    }
  }

  if (doc.education.length) {
    blocks.push({ kind: "heading", text: CV_HEADINGS.education })
    for (const e of doc.education) {
      blocks.push({ kind: "entry", title: e.degree || e.institution, dates: e.year })
      if (e.degree && e.institution) blocks.push({ kind: "entrySub", text: e.institution })
    }
  }

  const { technical, languages, soft } = doc.skills
  if (technical.length || languages.length || soft.length) {
    blocks.push({ kind: "heading", text: CV_HEADINGS.skills })
    if (technical.length) blocks.push({ kind: "skills", label: "Techniques", text: technical.join(", ") })
    if (languages.length) blocks.push({ kind: "skills", label: "Langues", text: languages.join(", ") })
    if (soft.length) blocks.push({ kind: "skills", label: "Savoir-être", text: soft.join(", ") })
  }

  return blocks
}

/** Nom de fichier sûr : « CV-Prenom-Nom » (lettres, chiffres, tirets), sinon « CV ». */
export function cvFileBaseName(doc: CvDocument): string {
  const slug = doc.personal.name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
  return slug ? `CV-${slug}` : "CV"
}
