// @ts-nocheck
import { AtsAnalysisGateway, AtsAnalysisResult } from "../../ports/gateways/ats-analysis.gateway";
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { mistralModel } from "@/lib/mistral";
import { generateText } from "ai";

export class MistralAtsAnalysisAdapter implements AtsAnalysisGateway {
  async analyzeCv(text: string, jobDescription?: string): Promise<Result<AtsAnalysisResult>> {
    try {
      const basePrompt = `Tu es un expert RH et recruteur. Analyse le CV suivant pour déterminer son score ATS (sur 100).
Identifie les mots-clés présents, manquants (par rapport au poste visé), les forces, faiblesses et recommandations.
Réponds UNIQUEMENT avec un JSON valide respectant ce schéma:
{
  "score": number,
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "strengths": string[],
  "weaknesses": string[],
  "recommendations": string[]
}
`;
      const prompt = jobDescription 
        ? `${basePrompt}\nDescription du poste:\n${jobDescription}\n\nTexte du CV:\n${text}`
        : `${basePrompt}\nTexte du CV:\n${text}`;

      const { text: responseText } = await generateText({
        model: mistralModel,
        prompt,
        temperature: 0.1,
      });

      const cleanText = responseText.trim().replace(/^```json/, "").replace(/```$/, "");
      const parsed = JSON.parse(cleanText);

      return ok(parsed as AtsAnalysisResult);
    } catch (e: any) {
      return fail(new InfrastructureError(`ATS Analysis failed: ${e.message}`));
    }
  }
}
