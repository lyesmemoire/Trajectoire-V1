import type { CvDocument } from "./document"

/**
 * Modèle de l'éditeur d'export (`components/cv/CvExportEditor.tsx`) : uniquement des chaînes, pour
 * permettre la saisie libre (puces une par ligne, compétences séparées par des virgules) ; converti
 * en `CvDocument` au moment de l'export.
 */

export type ExperienceForm = {
  title: string
  company: string
  startDate: string
  endDate: string
  current: boolean
  bulletsText: string
}

export type EducationForm = { degree: string; institution: string; year: string }

export type CvForm = {
  personal: CvDocument["personal"]
  headline: string
  summary: string
  experiences: ExperienceForm[]
  education: EducationForm[]
  skills: { technical: string; languages: string; soft: string }
}

export function parseList(value: string): string[] {
  return Array.from(new Set(value.split(/[,;\n]/).map(s => s.trim()).filter(Boolean)))
}

/** Une puce par ligne ; retire les marqueurs de puce collés (-, *, •). */
export function parseBullets(value: string): string[] {
  return value
    .split("\n")
    .map(line => line.replace(/^\s*[-*•–]\s*/, "").trim())
    .filter(Boolean)
}

export function formFromDocument(doc: CvDocument): CvForm {
  return {
    personal: { ...doc.personal },
    headline: doc.headline,
    summary: doc.summary,
    experiences: doc.experiences.map(e => ({
      title: e.title,
      company: e.company,
      startDate: e.startDate,
      endDate: e.endDate,
      current: e.current,
      bulletsText: e.bullets.join("\n"),
    })),
    education: doc.education.map(e => ({ ...e })),
    skills: {
      technical: doc.skills.technical.join(", "),
      languages: doc.skills.languages.join(", "),
      soft: doc.skills.soft.join(", "),
    },
  }
}

export function documentFromForm(form: CvForm): CvDocument {
  return {
    personal: { ...form.personal },
    headline: form.headline,
    summary: form.summary,
    experiences: form.experiences.map(e => ({
      title: e.title,
      company: e.company,
      startDate: e.startDate,
      endDate: e.current ? "" : e.endDate,
      current: e.current,
      bullets: parseBullets(e.bulletsText),
    })),
    education: form.education.map(e => ({ ...e })),
    skills: {
      technical: parseList(form.skills.technical),
      languages: parseList(form.skills.languages),
      soft: parseList(form.skills.soft),
    },
  }
}
