import OpenAI from "openai";
/**
 * Retourne le client OpenAI, instancié à la première utilisation.
 * Ne crash pas le build Next.js (pas d'exécution au module-level).
 */
export declare function getOpenAIClient(): OpenAI;
export interface AIResponse<T = string> {
    data: T;
    tokensUsed: {
        prompt: number;
        completion: number;
        total: number;
    };
    estimatedCostEur: number;
}
export declare function generateText(prompt: string, maxTokens?: number): Promise<AIResponse<string>>;
export declare function generateJSON<T>(prompt: string, maxTokens?: number): Promise<AIResponse<T>>;
//# sourceMappingURL=openai.d.ts.map