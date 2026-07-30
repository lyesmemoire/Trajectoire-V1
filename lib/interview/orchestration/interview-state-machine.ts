export type InterviewState =
  | "intro"
  | "warmup"
  | "deep_dive"
  | "pressure"
  | "recovery"
  | "closing";

export function transitionState(_currentState: InterviewState, completedQuestions: number, totalExpected: number, ): InterviewState {
  // Début
  if (completedQuestions === 0) return "intro";
  if (completedQuestions === 1) return "warmup";

  // Fin
  if (completedQuestions >= totalExpected - 1) return "closing";
  if (completedQuestions === totalExpected - 2) return "recovery";

  // Cœur de l'entretien (alternance dynamique)
  if (completedQuestions % 2 === 0) return "deep_dive";
  return "pressure";
}
