// @ts-nocheck
export type InterviewState =
  | "intro"
  | "warmup"
  | "deep_dive"
  | "pressure"
  | "recovery"
  | "closing";

export function transitionState(
  currentState: InterviewState,
  questionIndex: number,
  totalQuestions: number,
): InterviewState {
  if (questionIndex === 0) return "intro";
  if (questionIndex === 1) return "warmup";

  if (questionIndex === totalQuestions - 1) return "closing";
  if (questionIndex === totalQuestions - 2) return "recovery";

  // Milieu d'entretien : alternance deep_dive et pressure
  if (questionIndex % 2 === 0) return "deep_dive";
  return "pressure";
}

export function shouldIncreasePressure(
  state: InterviewState,
  analysis: any,
): boolean {
  return state === "pressure" && analysis.confidence < 70;
}
