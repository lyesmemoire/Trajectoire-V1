export interface VoiceInput {
    text: string;
    delayMs: number;
    speechRate: number;
    interruptionChance: number;
    silenceProbability: number;
}
export interface VoiceExecutionPlan {
    version: 1;
    utterance: string;
    delayMs: number;
    speechRate: number;
    shouldInterrupt: boolean;
    shouldPause: boolean;
}
export interface VoicePlanValidationResult {
    valid: boolean;
    errors: readonly string[];
}
//# sourceMappingURL=voice-contract.d.ts.map