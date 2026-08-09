/**
 * Sanitizes user-provided text (CV, job descriptions, transcripts)
 * before injecting them into AI prompts.
 */
export declare function sanitizeForPrompt(text: string): string;
/**
 * Ensures structured output is clean.
 */
export declare function enforceJsonBoundary(payload: unknown): unknown;
//# sourceMappingURL=prompt-sanitizer.d.ts.map