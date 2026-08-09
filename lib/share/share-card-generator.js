import { ARCHETYPES_META, } from "../archetypes/career-archetypes";
/**
 * Generates data for a social media sharing card (LinkedIn/Twitter).
 */
export function generateShareData(name, archetype, percentile) {
    const meta = ARCHETYPES_META[archetype];
    return {
        name,
        archetype: meta.label,
        icon: meta.icon,
        percentile,
        topSkill: meta.strengths[0],
    };
}
//# sourceMappingURL=share-card-generator.js.map