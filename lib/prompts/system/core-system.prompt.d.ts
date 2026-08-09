/**
 * Centralized and Versioned Prompt System.
 */
export declare const SYSTEM_PROMPTS: {
    CORE_V1: string;
    PERSONA_TEMPLATE: (name: string, role: string, pressure: number) => string;
    PRESSURE_V1: string;
    COACHING_V1: string;
};
export declare function getSystemPrompt(version?: keyof typeof SYSTEM_PROMPTS): string | ((name: string, role: string, pressure: number) => string);
//# sourceMappingURL=core-system.prompt.d.ts.map