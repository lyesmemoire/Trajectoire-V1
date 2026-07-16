import { QuestionGeneratorPort } from "../../ports/question-generator.port";
import { InterviewSessionAggregate } from "../../domain/aggregates/interview-session.aggregate";
import { InterviewQuestion } from "../../domain/value-objects/interview-question.vo";
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { MistralInterviewProvider } from "../providers/mistral-interview.provider";
import { Clock } from "@/lib/core/clock/Clock";

export class OpenAiQuestionGeneratorAdapter implements QuestionGeneratorPort {
  constructor(
    private readonly llmProvider: MistralInterviewProvider,
    private readonly clock: Clock
  ) {}

  async generateNextQuestion(
    session: InterviewSessionAggregate,
    strategy: string
  ): Promise<Result<InterviewQuestion>> {
    try {
      const questions = session.questions;
      const answers = session.answers;
      const jobDescription = session.props.jobDescription || "";
      const candidateSummary = session.props.candidateSummary || "";

      const questionHistory = questions.map(q => q.content).join("\n");
      const answerHistory = answers.map(a => a.answer.content).join("\n");

      const systemInstruction = `Tu es un recruteur professionnel expert en entretiens d'embauche. Ton rôle est de poser des questions pertinentes et adaptées au candidat et au poste.

Contexte du poste:
${jobDescription}

Profil du candidat:
${candidateSummary}

Stratégie d'entretien: ${strategy}

Instructions:
- Génère une question unique et pertinente basée sur le contexte
- Évite de répéter les questions déjà posées
- Adapte la difficulté en fonction du niveau du candidat
- Formule la question de manière claire et professionnelle
- La question doit être en français`;

      const messages = [
        {
          role: "user" as const,
          content: `Historique des questions déjà posées:\n${questionHistory}\n\nHistorique des réponses du candidat:\n${answerHistory}\n\nGénère la prochaine question d'entretien. Retourne UNIQUEMENT la question, sans introduction ni explication.`,
        },
      ];

      const result = await this.llmProvider.complete({
        systemInstruction,
        messages,
        temperature: 0.7,
        maximumOutputTokens: 200,
      });

      const questionContent = result.text.trim();
      if (!questionContent) {
        return fail(new InfrastructureError("Failed to generate question: empty response"));
      }

      const question = InterviewQuestion.create({
        content: questionContent,
        expectedSkills: this.extractExpectedSkills(questionContent),
        intent: strategy,
        generatedAt: this.clock.now(),
      });

      return ok(question);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to generate question: ${error.message}`));
    }
  }

  private extractExpectedSkills(question: string): string[] {
    const skills: string[] = [];
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes("conflit") || lowerQuestion.includes("équipe")) {
      skills.push("communication", "teamwork");
    }
    if (lowerQuestion.includes("problème") || lowerQuestion.includes("difficulté")) {
      skills.push("problem-solving");
    }
    if (lowerQuestion.includes("projet") || lowerQuestion.includes("réussi")) {
      skills.push("project-management");
    }
    if (lowerQuestion.includes("leadership") || lowerQuestion.includes("diriger")) {
      skills.push("leadership");
    }
    if (lowerQuestion.includes("apprendre") || lowerQuestion.includes("nouveau")) {
      skills.push("adaptability");
    }

    return skills.length > 0 ? skills : ["communication"];
  }
}
