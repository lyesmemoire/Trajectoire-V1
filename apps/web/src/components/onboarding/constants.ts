import {
  ONBOARDING_INTERVIEW_TYPES,
  ONBOARDING_LEVELS,
  ONBOARDING_SECTORS,
} from "@/validation/CompleteOnboardingSchema"

// Les valeurs reprennent les enums Zod : une seule source de vérité (client + serveur).
export const SECTORS = ONBOARDING_SECTORS
export const LEVELS = ONBOARDING_LEVELS
export const INTERVIEW_TYPES = ONBOARDING_INTERVIEW_TYPES

export type Sector = (typeof SECTORS)[number]
export type Level = (typeof LEVELS)[number]
export type InterviewType = (typeof INTERVIEW_TYPES)[number]

export const INTERVIEW_TYPE_OPTIONS: Record<
  InterviewType,
  { label: string; description: string }
> = {
  RH: {
    label: "Entretien RH",
    description: "Motivation, parcours et savoir-être.",
  },
  Technique: {
    label: "Entretien technique",
    description: "Compétences métier et mises en situation.",
  },
  Manager: {
    label: "Entretien manager",
    description: "Leadership, prise de décision et gestion d'équipe.",
  },
}

export const STEP_COUNT = 3

export const STEP_TITLES = [
  "Poste visé",
  "Votre profil",
  "Premier objectif",
] as const

// ── CV (upload seul, sans analyse : voir /api/cv/upload) ─────────────────────
export const CV_MAX_BYTES = 8 * 1024 * 1024
export const CV_ALLOWED_EXTENSIONS = ["pdf", "docx"] as const
export const CV_ACCEPT =
  ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"

// Formulation validée : pas de promesse de stockage.
export const CV_NOTICE =
  "Votre CV est lu pour personnaliser votre expérience. Vous pourrez lancer l'analyse complète depuis votre tableau de bord."

export type CvStatus = "idle" | "uploading" | "ready" | "error"

// ── État du formulaire ───────────────────────────────────────────────────────
export interface OnboardingFormData {
  title: string
  sector: Sector | ""
  level: Level | ""
  name: string
  cvStatus: CvStatus
  cvFileName: string
  cvError: string
  interviewType: InterviewType | ""
}

export const INITIAL_FORM_DATA: OnboardingFormData = {
  title: "",
  sector: "",
  level: "",
  name: "",
  cvStatus: "idle",
  cvFileName: "",
  cvError: "",
  interviewType: "",
}

// ── Classes partagées (zinc-950 / indigo-500) ────────────────────────────────
// Les éléments interactifs vivent dans une carte zinc-900 : l'offset du focus l'imite.
export const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"

export const BUTTON_PRIMARY = `inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`

export const BUTTON_GHOST = `inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`

// Carte d'option d'un groupe de radios natives (le <input> est en sr-only + peer).
export const OPTION_CARD =
  "flex min-h-11 items-center justify-center rounded-lg border border-white/[0.1] bg-zinc-950 px-3 py-2 text-center text-sm font-medium text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/80 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 peer-checked:text-indigo-300 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-zinc-900"
