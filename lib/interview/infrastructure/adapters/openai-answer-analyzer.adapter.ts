import { AnswerAnalyzerPort } from "../../ports/answer-analyzer.port";
import { InterviewAnswer } from "../../domain/value-objects/interview-answer.vo";
import { InterviewQuestion } from "../../domain/value-objects/interview-question.vo";
import { AnswerAnalysis } from "../../domain/value-objects/answer-analysis.vo";
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { MistralInterviewProvider } from "../providers/mistral-interview.provider";

export class OpenAiAnswerAnalyzerAdapter implements AnswerAnalyzerPort {
  constructor(private readonly llmProvider: MistralInterviewProvider) {}

  async analyze(
    answer: InterviewAnswer,
    question: InterviewQuestion
  ): Promise<Result<AnswerAnalysis>> {
    try {
      const systemInstruction = `Tu es un expert en évaluation de réponses d'entretien d'embauche. Ton rôle est d'analyser la qualité d'une réponse du candidat.

Évalue la réponse sur les critères suivants (scores de 0 à 100):
1. Clarté: La réponse est-elle claire et compréhensible?
2. Spécificité: La réponse contient-elle des détails concrets et précis?
3. Confiance: Le candidat semble-t-il confiant dans sa réponse?

Identifie également les faiblesses potentielles de la réponse.

Format de réponse attendu (JSON):
{
  "clarityScore": nombre entre 0 et 100,
  "specificityScore": nombre entre 0 et 100,
  "confidenceScore": nombre entre 0 et 100,
  "feedback": "bref feedback constructif en français",
  "detectedWeaknesses": ["faiblesse1", "faiblesse2"]
}

Retourne UNIQUEMENT le JSON, sans aucun texte avant ou après.`;

      const messages = [
        {
          role: "user" as const,
          content: `Question posée: ${question.content}\n\nRéponse du candidat: ${answer.content}\n\nAnalyse cette réponse et retourne le JSON d'évaluation.`,
        },
      ];

      const result = await this.llmProvider.complete({
        systemInstruction,
        messages,
        temperature: 0.3,
        maximumOutputTokens: 300,
      });

      const analysisText = result.text.trim();
      
      // Extract JSON from response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return fail(new InfrastructureError("Failed to parse analysis response: no JSON found"));
      }

      const analysisData = JSON.parse(jsonMatch[0]);

      // Validate and create AnswerAnalysis
      const analysis = AnswerAnalysis.create({
        clarityScore: this.validateScore(analysisData.clarityScore),
        specificityScore: this.validateScore(analysisData.specificityScore),
        confidenceScore: this.validateScore(analysisData.confidenceScore),
        feedback: analysisData.feedback || "Réponse analysée",
        detectedWeaknesses: Array.isArray(analysisData.detectedWeaknesses) 
          ? analysisData.detectedWeaknesses 
          : [],
      });

      return ok(analysis);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to analyze answer: ${error.message}`));
    }
  }

  private validateScore(score: any): number {
    const num = typeof score === 'number' ? score : parseInt(score, 10);
    if (isNaN(num)) return 50;
    return Math.max(0, Math.min(100, num));
  }
}
