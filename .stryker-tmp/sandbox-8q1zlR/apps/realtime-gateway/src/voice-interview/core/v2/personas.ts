/**
 * core/v2/personas.ts — Profils recruteur (P3.6, Bloc 4). PURE, déterministe.
 */
// @ts-nocheck


export type PersonaName =
  | "supportive"
  | "neutral"
  | "challenging"
  | "technical_lead"
  | "engineering_manager"
  | "hr"
  | "startup_founder";

export interface InterviewerPersona {
  name: PersonaName;
  tone: "warm" | "neutral" | "direct" | "incisive";
  /** 0–5 : intensité de la pression appliquée. */
  pressureLevel: number;
  /** 0–3 : profondeur des relances. */
  followupDepth: number;
  /** 0–5 : poids des questions techniques. */
  technicalFocus: number;
}

export const PERSONAS: Record<PersonaName, InterviewerPersona> = {
  supportive: { name: "supportive", tone: "warm", pressureLevel: 1, followupDepth: 1, technicalFocus: 2 },
  neutral: { name: "neutral", tone: "neutral", pressureLevel: 2, followupDepth: 2, technicalFocus: 3 },
  challenging: { name: "challenging", tone: "direct", pressureLevel: 4, followupDepth: 3, technicalFocus: 4 },
  technical_lead: { name: "technical_lead", tone: "direct", pressureLevel: 3, followupDepth: 3, technicalFocus: 5 },
  engineering_manager: { name: "engineering_manager", tone: "neutral", pressureLevel: 3, followupDepth: 3, technicalFocus: 3 },
  hr: { name: "hr", tone: "warm", pressureLevel: 2, followupDepth: 2, technicalFocus: 1 },
  startup_founder: { name: "startup_founder", tone: "incisive", pressureLevel: 4, followupDepth: 2, technicalFocus: 3 },
};

export function getPersona(name: PersonaName): InterviewerPersona {
  return PERSONAS[name] ?? PERSONAS.neutral;
}

/** Applique le ton du persona à une phrase (sans changer le sens). */
export function applyTone(text: string, persona: InterviewerPersona): string {
  switch (persona.tone) {
    case "warm":
      return `Prends ton temps. ${text}`;
    case "direct":
      return `Soyons précis. ${text}`;
    case "incisive":
      return `Allons droit au but. ${text}`;
    case "neutral":
    default:
      return text;
  }
}
