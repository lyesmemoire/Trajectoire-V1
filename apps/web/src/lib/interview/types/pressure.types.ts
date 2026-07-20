export interface InterruptionSignals {
  verbosity: number; // Longueur de la réponse (0-100)
  specificity: number; // Densité de faits/chiffres (0-100)
  fillerDensity: number; // Fréquence des "euh", "donc", etc. (0-100)
  relevanceScore: number; // Adéquation avec la question (0-100)
  ramblingScore: number; // Tendance à s'éparpiller (0-100)
}

export type InterruptionType =
  | "clarify" // "Pouvez-vous être plus précis ?"
  | "pressure" // "Allez droit au but."
  | "redirect" // "On s'éloigne du sujet initial."
  | "skeptical" // "Cela semble un peu générique."
  | "speed_up"; // "On manque de temps, abrégez."

export interface InterruptionDecision {
  shouldInterrupt: boolean;
  type: InterruptionType | null;
  reason: string | null;
}
