export type CareerArchetype = "stress_reactive" | "analytical_operator" | "confident_performer" | "strategic_leader" | "overexplainer" | "concise_executor" | "hesitant_expert" | "adaptable_communicator";
export interface ArchetypeMetadata {
    id: CareerArchetype;
    label: string;
    description: string;
    strengths: string[];
    risks: string[];
    coachingAdvice: string;
    icon: string;
}
export declare const ARCHETYPES_META: Record<CareerArchetype, ArchetypeMetadata>;
//# sourceMappingURL=career-archetypes.d.ts.map