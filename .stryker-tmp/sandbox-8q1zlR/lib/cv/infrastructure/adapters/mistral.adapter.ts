// @ts-nocheck
import { LLMRewriterGateway } from "../../ports/gateways/llm-rewriter.gateway";
import { mistralModel } from "@/lib/mistral";
import { generateText } from "ai";
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";

export class MistralAdapter implements LLMRewriterGateway {
  async rewrite(content: string, instructions: string): Promise<Result<string>> {
    try {
      const prompt = `En tant qu'expert RH senior. Ne retourne QUE le texte réécrit, sans introduction, sans guillemets.\n\nInstructions: ${instructions}\n\nTexte original :\n${content}`;
      
      const { text } = await generateText({
        model: mistralModel,
        prompt,
        temperature: 0.3,
      });

      return ok(text.trim());
    } catch (e: any) {
      return fail(new InfrastructureError(`Mistral AI failed: ${e.message}`));
    }
  }
}
