// @ts-nocheck
import { QuestionGeneratorPort } from "../../ports/question-generator.port";
import { InterviewSessionAggregate } from "../../domain/aggregates/interview-session.aggregate";
import { InterviewQuestion } from "../../domain/value-objects/interview-question.vo";
import { Result, ok } from "@/lib/core/result";
import { Clock } from "@/lib/core/time/Clock";

export class OpenAiQuestionGeneratorAdapter implements QuestionGeneratorPort {
  async generateNextQuestion(
    session: InterviewSessionAggregate,
    strategy: string
  ): Promise<Result<InterviewQuestion>> {
    // Dans une implémentation réelle, on appellerait OpenAI ici
    // en passant le persona, l'historique et la stratégie.

    const mockQuestion = InterviewQuestion.create({
      content: "Pouvez-vous me parler d'une situation où vous avez géré un conflit ?",
      expectedSkills: ["communication", "problem-solving"],
      intent: strategy,
      generatedAt: Clock.now(),
    });

    return ok(mockQuestion);
  }
}
