// services/interview.ts
// Logique métier entretien — séparation claire entre service et API route
import type {
  InterviewQuestion,
  InterviewAnswer,
  InterviewFeedback,
} from "@/types/database";

/**
 * Valide que les questions retournées par l'IA respectent
 * le contrat de type attendu.
 * Évite les crashs silencieux si l'IA retourne une structure partielle.
 */
export function validateQuestions(raw: unknown): InterviewQuestion[] {
  if (!Array.isArray(raw)) {
    throw new Error("INVALID_QUESTIONS: Expected array");
  }

  const VALID_TYPES = new Set(["hr", "technical", "behavioral"]);
  const VALID_DIFFICULTIES = new Set(["easy", "medium", "hard"]);

  return raw
    .filter((q): q is Record<string, unknown> => {
      return (
        typeof q === "object" &&
        q !== null &&
        typeof q["id"] === "number" &&
        typeof q["question"] === "string" &&
        q["question"].length > 5 &&
        VALID_TYPES.has(q["type"] as string) &&
        VALID_DIFFICULTIES.has(q["difficulty"] as string)
      );
    })
    .slice(0, 10) // Hard limit — jamais plus de 10
    .map((q, index) => ({
      id: index + 1, // Renuméroter proprement
      type: q["type"] as InterviewQuestion["type"],
      question: (q["question"] as string).trim(),
      difficulty: q["difficulty"] as InterviewQuestion["difficulty"],
    }));
}

/**
 * Valide le feedback retourné par l'IA.
 */
export function validateFeedback(raw: unknown): InterviewFeedback {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("INVALID_FEEDBACK: Expected object");
  }

  const f = raw as Record<string, unknown>;

  const score =
    typeof f["score"] === "number"
      ? Math.min(100, Math.max(0, Math.round(f["score"])))
      : 50; // Fallback neutre si score invalide

  const toStringArray = (val: unknown, fallback: string[]): string[] => {
    if (!Array.isArray(val)) return fallback;
    return val
      .filter((item) => typeof item === "string" && item.length > 0)
      .slice(0, 5); // Limiter les tableaux pour éviter des pavés IA
  };

  return {
    score,
    strengths: toStringArray(f["strengths"], [
      "Présence assurée lors de l'entretien",
    ]),
    weaknesses: toStringArray(f["weaknesses"], [
      "Des axes d'amélioration sont à explorer",
    ]),
    improvements: toStringArray(f["improvements"], [
      "Continuez à pratiquer",
    ]).slice(0, 3),
    exampleAnswer:
      typeof f["exampleAnswer"] === "string" && f["exampleAnswer"].length > 10
        ? f["exampleAnswer"]
        : "Structurez vos réponses avec la méthode STAR (Situation, Tâche, Action, Résultat).",
    summary:
      typeof f["summary"] === "string" && f["summary"].length > 10
        ? f["summary"]
        : `Score obtenu : ${score}/100. Continuez à vous entraîner.`,
  };
}

/**
 * Calcule les statistiques d'un ensemble de réponses.
 * Utilisé côté UI pour le feedback de progression.
 */
export function computeAnswerStats(questions: InterviewQuestion[], answers: InterviewAnswer[], ): {
  totalQuestions: number;
  answeredCount: number;
  skippedCount: number;
  averageLength: number;
  byType: Record<string, { answered: number; total: number }>;
} {
  const answeredIds = new Set(
    answers.filter((a) => a.answer.trim().length > 0).map((a) => a.questionId),
  );

  const byType: Record<string, { answered: number; total: number }> = {};

  for (const q of questions) {
    if (!byType[q.type]) {
      byType[q.type] = { answered: 0, total: 0 };
    }
    byType[q.type]!.total++;
    if (answeredIds.has(q.id)) {
      byType[q.type]!.answered++;
    }
  }

  const answeredAnswers = answers.filter((a) => a.answer.trim().length > 0);
  const totalLength = answeredAnswers.reduce(
    (sum, a) => sum + a.answer.length,
    0,
  );

  return {
    totalQuestions: questions.length,
    answeredCount: answeredIds.size,
    skippedCount: questions.length - answeredIds.size,
    averageLength:
      answeredAnswers.length > 0
        ? Math.round(totalLength / answeredAnswers.length)
        : 0,
    byType,
  };
}
