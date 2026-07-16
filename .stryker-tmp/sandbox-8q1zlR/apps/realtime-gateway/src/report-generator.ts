// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import { callLLMStrict } from "./llm-strict.js";
import {
  parseQuestions,
  parseAnswers,
  AnalysisSchema,
  type Analysis,
  type Questions,
  type Answers,
  type Question,
  type Answer,
} from "./db/interview-json-schemas.js";

const prisma = new PrismaClient();

const SYS = `Expert évaluation comportementale/cognitive. Produis un rapport JSON strict. Scores: entiers 0-100. Réponds UNIQUEMENT avec du JSON valide.`;

export async function generateReport(
  sessionId: string,
  signal?: AbortSignal
): Promise<Analysis> {
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      questions: true,
      answers: true,
      analysis: true,
      status: true,
    },
  });

  if (!session) throw new Error(`Session ${sessionId} introuvable`);

  if (session.status === "completed" && session.analysis !== null) {
    // Revalidation de l'analyse existante avant retour
    return AnalysisSchema.parse({
      ...(session.analysis as object),
      schema_version: "1.0",
    });
  }

  let questions: Questions;
  let answers: Answers;

  try {
    questions = parseQuestions(session.questions);
  } catch (e) {
    throw new Error(`questions JSONB invalide [${sessionId}]: ${e}`);
  }

  try {
    answers = parseAnswers(session.answers);
  } catch (e) {
    throw new Error(`answers JSONB invalide [${sessionId}]: ${e}`);
  }

  if (!questions.length) throw new Error(`Aucune question [${sessionId}]`);

  const transcript = questions
    .map((q: Question) => {
      const a: Answer | undefined = answers.find(
        (ans: Answer) => ans.question_id === q.id
      );
      return `[${q.category}] ${q.text}\n→ ${a?.transcript ?? "(vide)"} (${a?.duration_s ?? 0}s)`;
    })
    .join("\n\n");

  const userPrompt = `Analyse cet entretien et génère le JSON suivant :
{
  "global_score":<0-100>,"percentile":<0-100>,"recommendation":"<1 phrase>",
  "executive_summary":"<3-5 phrases>",
  "soft_skills":[{"label":"<nom>","score":<0-100>,"comment":"<phrase>"}],
  "hard_skills":[{"label":"<nom>","score":<0-100>,"comment":"<phrase>"}],
  "integrity_score":<0-100>,"consistency_score":<0-100>,"assessment_text":"<§>",
  "gap_analysis":"<optionnel>",
  "decisions":[{"scenario":"<>","response":"<>","analysis":"<>","score":<0-100>}],
  "overall_decision_score":<0-100>,"decision_style":"<label>"
}
Soft: Leadership, Communication, Stress, Équipe, Adaptabilité.
Hard: Analyse critique, Décision, Résolution, Stratégie, Temps.

=== ENTRETIEN ===
${transcript}`;

  const raw = await callLLMStrict({
    systemPrompt: SYS,
    userPrompt,
    schema: AnalysisSchema,
    signal,
  });

  const analysis: Analysis = AnalysisSchema.parse({
    ...raw,
    schema_version: "1.0",
  });

  await prisma.interviewSession.update({
    where: { id: sessionId },
    data: { analysis, status: "completed" },
  });

  console.log(`[ReportGen] ${sessionId} → score ${analysis.global_score}`);
  return analysis;
}
