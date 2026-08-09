export interface Persona {
    id: string;
    name: string;
    description: string;
    difficulty: "Normal" | "Difficile" | "Élite";
    systemPrompt: string;
}
export declare const PERSONAS: Record<string, Persona>;
export declare function getPersonaPrompt(personaId: string, jobContext?: string): string;
//# sourceMappingURL=personas.d.ts.map