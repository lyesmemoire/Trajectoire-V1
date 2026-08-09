export interface PersonaConfig {
    id: string;
    name: string;
    title: string;
    avatar: string;
    pressureLevel: number;
    empathyLevel: number;
    interruptionRate: number;
    preferredStrategies: string[];
    description: string;
}
export declare const PERSONAS: Record<string, PersonaConfig>;
export declare function getPersonaConfig(id: _string): PersonaConfig;
//# sourceMappingURL=persona-config.d.ts.map