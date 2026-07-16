// @ts-nocheck
export type ReplayEventType =
  | "pressure_peak" // Moment de haute tension
  | "interruption" // IA a coupé l'utilisateur
  | "hesitation" // Long silence ou fillers
  | "recovery" // Reprise en main après un moment faible
  | "strong_answer" // Réponse particulièrement efficace
  | "evasion" // L'utilisateur évite la question
  | "milestone"; // Changement de phase (ex: Deep Dive)

export interface ReplayEvent {
  id: string;
  timestamp: number; // Secondes depuis le début
  type: ReplayEventType;
  title: string;
  description: string;
  pressureLevel: number;
  triggerSignal?: string; // Le signal qui a déclenché l'event (ex: "low_specificity")
  coachingAdvice?: string;
  originalText?: string;
  betterVersion?: string;
}

export interface SessionReplay {
  sessionId: string;
  events: ReplayEvent[];
  pressureCurve: { time: number; level: number }[];
  archetype: string; // ex: "Analytical Thinker", "Stress Reactive"
  overallCoaching: string;
}
