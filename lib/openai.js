// lib/openai.ts
// Lazy-loaded OpenAI client — jamais instancié au build time.
import OpenAI from "openai";
let openaiClient = null;
/**
 * Retourne le client OpenAI, instancié à la première utilisation.
 * Ne crash pas le build Next.js (pas d'exécution au module-level).
 */
export function getOpenAIClient() {
    if (!openaiClient) {
        const apiKey = envServer.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("OPENAI_API_KEY is not defined. Please configure it in your environment variables.");
        }
        openaiClient = new OpenAI({
            apiKey,
            timeout: 30_000,
            maxRetries: 2,
        });
    }
    return openaiClient;
}
// Tarifs gpt-4o-mini (mai 2025)
const COST_PER_1K_INPUT = 0.000_150;
const COST_PER_1K_OUTPUT = 0.000_600;
function calculateCost(prompt, completion) {
    return (((prompt / 1000) * COST_PER_1K_INPUT +
        (completion / 1000) * COST_PER_1K_OUTPUT) *
        0.92);
}
export async function generateText(prompt, maxTokens = 1000) {
    const openai = getOpenAIClient();
    const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.7,
    });
    const content = res.choices[0]?.message?.content ?? "";
    const u = res.usage;
    return {
        data: content,
        tokensUsed: {
            prompt: u.prompt_tokens,
            completion: u.completion_tokens,
            total: u.total_tokens,
        },
        estimatedCostEur: calculateCost(u.prompt_tokens, u.completion_tokens),
    };
}
export async function generateJSON(prompt, maxTokens = 1500) {
    const openai = getOpenAIClient();
    const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant. Always respond with valid JSON only.",
            },
            { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: maxTokens,
        temperature: 0.3,
    });
    const raw = res.choices[0]?.message?.content ?? "{}";
    const u = res.usage;
    let parsed;
    try {
        parsed = JSON.parse(raw);
    }
    catch {
        throw new Error("AI_JSON_PARSE_ERROR: Invalid JSON despite json_object mode");
    }
    return {
        data: parsed,
        tokensUsed: {
            prompt: u.prompt_tokens,
            completion: u.completion_tokens,
            total: u.total_tokens,
        },
        estimatedCostEur: calculateCost(u.prompt_tokens, u.completion_tokens),
    };
}
//# sourceMappingURL=openai.js.map