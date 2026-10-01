import { z } from "zod"
import { MAX_JOB_DESCRIPTION_LENGTH, type InterviewType, type StartSimulationInput } from "./types"

/**
 * Préremplissage d'une simulation à partir d'une opportunité (offre du radar ou saisie à la main), sans passer
 * par le formulaire /simulation/new. Fonction pure : aucune entrée/sortie.
 *
 * - poste : titre de l'opportunité ;
 * - description : en-tête (entreprise, lieu) puis texte de l'offre, borné ;
 * - niveau et type d'entretien : ceux de l'onboarding s'ils sont valides, sinon les valeurs par défaut du
 *   formulaire ; durée 15 minutes (la recommandée), difficulté standard, style bienveillant ;
 * - le CV n'est pas copié ici : le contexte unifié de l'entretien relit lui-même la dernière analyse de CV de
 *   l'utilisateur (`UnifiedInterviewContextService`).
 */

export const PRESET_LEVELS = ["Junior", "Intermédiaire", "Senior", "Lead", "Manager"] as const
export const DEFAULT_PRESET_LEVEL = "Senior"
export const DEFAULT_PRESET_INTERVIEW_TYPE: InterviewType = "RH"
export const DEFAULT_PRESET_DURATION_MINUTES = 15

const INTERVIEW_TYPES = ["RH", "Technique", "Manager"] as const

/** Forme enregistrée par l'onboarding (`users.onboardingData`) ; tout ce qui ne correspond pas est ignoré. */
const OnboardingPreferencesSchema = z
  .object({
    targetJob: z.object({ level: z.string().optional() }).partial().optional(),
    goal: z.object({ interviewType: z.string().optional() }).partial().optional(),
  })
  .partial()

export type PresetOpportunity = {
  title: string
  company: string | null
  location: string | null
  description: string
}

export function buildInterviewPreset(opportunity: PresetOpportunity, onboardingData: unknown): StartSimulationInput {
  const prefs = OnboardingPreferencesSchema.safeParse(onboardingData)
  const level = prefs.success ? prefs.data.targetJob?.level : undefined
  const type = prefs.success ? prefs.data.goal?.interviewType : undefined

  const header = [opportunity.company ? `Entreprise : ${opportunity.company}` : "", opportunity.location ? `Lieu : ${opportunity.location}` : ""]
    .filter(Boolean)
    .join("\n")
  const jobDescription = [header, opportunity.description.trim()].filter(Boolean).join("\n\n").slice(0, MAX_JOB_DESCRIPTION_LENGTH)

  return {
    jobTitle: opportunity.title.trim().slice(0, 100),
    level: PRESET_LEVELS.find(l => l === level) ?? DEFAULT_PRESET_LEVEL,
    interviewType: INTERVIEW_TYPES.find(t => t === type) ?? DEFAULT_PRESET_INTERVIEW_TYPE,
    duration: DEFAULT_PRESET_DURATION_MINUTES,
    jobDescription,
    difficulty: "standard",
    persona: "bienveillante",
    mandatoryQuestion: null,
  }
}
