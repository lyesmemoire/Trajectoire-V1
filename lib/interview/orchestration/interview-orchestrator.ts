import { analyzeAnswer, AnswerAnalysis } from "../behavior/answer-analysis";
import { chooseStrategy, FollowUpIntent } from "./followup-strategy";
import { InterviewState } from "./interview-state-machine";
import { getPersonaConfig } from "../personas/persona-config";
import { evaluateConfidenceRecovery } from "../../emotional-safety/confidence-recovery";
import { generateRecruiterPrompt } from "../prompts/prompt-builder";
import prisma from "@/lib/prisma";

/**
 * Orchestrateur v2 avec Honeypot de Confiance intégré.
 */
export async function orchestrateInterviewStep(
  sessionId: string,
  userAnswer: string,
  currentQuestion: string,
  metrics: unknown
  // { silenceDuration, _wordCount, _consecutiveHesitations }
): Promise<unknown> {
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) throw new Error("Session not found");

  // 1. Check for Recovery Need (Honeypot)
  const recovery = evaluateConfidenceRecovery(session, metrics);

  let activePersona = getPersonaConfig(session.persona);
  let strategy = "transition";
  let pressure = session.pressureLevel;

  if (recovery.active) {
    activePersona = recovery.persona ?? activePersona;
    pressure = recovery.newPressure ?? pressure;
    strategy = "supportive";
  } else {
    // Standard logic if not in recovery
    const analysis: AnswerAnalysis = await analyzeAnswer(
      userAnswer,
      currentQuestion,
    );
    pressure = Math.min(100, pressure + 5); 
    const followup: FollowUpIntent = chooseStrategy(analysis, pressure);
    strategy = followup.strategy;
  }

  // 2. Generate Next Question with Context
  const nextQuestion = await generateRecruiterPrompt({
    persona: activePersona,
    state: session.currentState as InterviewState,
    analysis: { clarity: 50, specificity: 50, confidence: 50 } as unknown, // Simplified for brevity
    strategy,
    userAnswer,
  });

  // 3. Persist State
  await prisma.interviewSession.update({
    where: { id: sessionId },
    data: {
      persona: activePersona.id,
      pressureLevel: pressure,
      // updated answers log...
    },
  });

  return {
    nextQuestion,
    pressureLevel: pressure,
    isRecovery: recovery.active,
  };
}
