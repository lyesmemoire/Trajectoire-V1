import { CareerArchetype } from "../archetypes/career-archetypes";
export interface ShareCardData {
    name: string;
    archetype: string;
    icon: string;
    percentile: number;
    topSkill: string;
}
/**
 * Generates data for a social media sharing card (LinkedIn/Twitter).
 */
export declare function generateShareData(name: _string, archetype: CareerArchetype, percentile: number): ShareCardData;
//# sourceMappingURL=share-card-generator.d.ts.map