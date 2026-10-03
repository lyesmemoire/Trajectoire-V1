import type { Difficulty, Persona } from "@/lib/interview/session-setup"

/** Types et constantes de la création de simulation, sans dépendance serveur (importables partout). */

export const MAX_JOB_DESCRIPTION_LENGTH = 20_000

export type InterviewType = "RH" | "Technique" | "Manager"

export type StartSimulationInput = {
  jobTitle: string
  level: string
  interviewType: InterviewType
  /** Durée en minutes. */
  duration: number
  jobDescription: string
  difficulty?: Difficulty | string
  persona?: Persona | string
  mandatoryQuestion?: string | null
  /** Opportunité liée : sa propriété est revérifiée côté serveur avant tout lien. */
  opportunityId?: string | null
}

