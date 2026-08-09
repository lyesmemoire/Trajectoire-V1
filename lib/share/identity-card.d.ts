import { CareerArchetype } from "../archetypes/career-archetypes";
export interface IdentityCardData {
    archetype: CareerArchetype;
    label: string;
    icon: string;
    percentile: number;
    topStrengths: string[];
    evolution?: {
        from: CareerArchetype;
        to: CareerArchetype;
    };
    stats: {
        interruptionsHandled: number;
        clarityScore: number;
        stressResilience: number;
    };
    viralTitle: string;
}
/**
 * Prepares data for the Identity Distribution Engine.
 */
export declare function generateIdentityCardData(archetype: CareerArchetype, percentile: number, sessionData: unknown, previousArchetype?: CareerArchetype): IdentityCardData;
//# sourceMappingURL=identity-card.d.ts.map