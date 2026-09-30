import { PERSONAS, PERSONA_VOICES, parsePersona, type Persona } from "./session-setup"

/**
 * Écoute des voix de la recruteuse (page admin). Voix disponibles sur l'API audio d'OpenAI ; l'aperçu passe
 * par la synthèse vocale (`gpt-4o-mini-tts`) : proche de la voix Realtime du même nom, mais pas identique.
 */
export const AUDITION_VOICES = ["marin", "cedar", "coral", "sage", "shimmer", "alloy", "ash", "ballad", "echo", "verse"] as const
export type AuditionVoice = (typeof AUDITION_VOICES)[number]

export const AUDITION_MODEL = "gpt-4o-mini-tts"
export const AUDITION_URL = "https://api.openai.com/v1/audio/speech"

export function parseAuditionVoice(value: unknown, persona: Persona): AuditionVoice {
  return AUDITION_VOICES.includes(value as AuditionVoice) ? (value as AuditionVoice) : (PERSONA_VOICES[persona] as AuditionVoice)
}

/** Phrase d'essai par style : accueil puis relance typique, pour juger le ton comme en entretien. */
export const AUDITION_SAMPLES: Record<Persona, { text: string; tone: string }> = {
  bienveillante: {
    text: "Bonjour, et merci d'être là. Installez-vous tranquillement. Pouvez-vous me donner un exemple concret de ce que vous venez de décrire ?",
    tone: "Voix de recruteuse française, calme, chaleureuse et rassurante, débit posé.",
  },
  directe: {
    text: "Bonjour. Nous avons peu de temps, allons à l'essentiel. Précisez, s'il vous plaît : quel était votre rôle exact dans ce projet ?",
    tone: "Voix de recruteuse française, posée, nette et structurée, phrases brèves, sans chaleur excessive.",
  },
  analytique: {
    text: "Bonjour. Je m'intéresse surtout à votre façon de raisonner. Quel était votre raisonnement exactement, et pourquoi ce choix plutôt qu'un autre ?",
    tone: "Voix de recruteuse française, méthodique et réfléchie, débit mesuré, curiosité intellectuelle.",
  },
  challengeuse: {
    text: "Bonjour. Vous avez de l'expérience, voyons ce que cela donne. Vous pouvez aller plus loin. Précisez : qu'auriez-vous fait différemment ?",
    tone: "Voix de recruteuse française, énergique et dynamique, légère tension constructive, jamais agressive.",
  },
}

export { PERSONAS, parsePersona }
