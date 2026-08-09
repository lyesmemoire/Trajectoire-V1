export declare const PROMPT_ENGINE_VERSION = "2.4.0";
export interface PromptAssemblyResult {
    text: string;
    fingerprint: string;
    metadata: {
        version: string;
        fragments: string[];
    };
}
/**
 * Moteur d'assemblage dynamique des prompts avec couche d'intégrité.
 */
export declare function assemblePrompt(config: {
    persona: "stress" | "faang" | "supportive";
    pressure: "low" | "high";
    phase: "intro" | "deep_dive" | "closing";
}): PromptAssemblyResult;
//# sourceMappingURL=engine.d.ts.map