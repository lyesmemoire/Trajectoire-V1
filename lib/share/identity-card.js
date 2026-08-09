import { ARCHETYPES_META, } from "../archetypes/career-archetypes";
/**
 * Prepares data for the Identity Distribution Engine.
 */
export function generateIdentityCardData(archetype, percentile, sessionData, previousArchetype) {
    const meta = ARCHETYPES_META[archetype];
    // Custom viral titles based on archetype
    const viralTitles = {
        strategic_leader: "Bâti pour diriger sous haute tension",
        analytical_operator: "La précision au service de la performance",
        confident_performer: "Maîtrise totale du discours en public",
        concise_executor: "L'efficacité brute en entretien",
        adaptable_communicator: "L'agilité comportementale poussée à l'extrême",
        stress_reactive: "En pleine mutation vers la résilience",
        overexplainer: "L'expertise qui apprend la synthèse",
        hesitant_expert: "Le talent qui s'affirme enfin",
    };
    return {
        archetype,
        label: meta.label,
        icon: meta.icon,
        percentile,
        topStrengths: meta.strengths,
        evolution: previousArchetype
            ? { from: previousArchetype, to: archetype }
            : undefined,
        stats: {
            interruptionsHandled: sessionData.interruptionCount || 0,
            clarityScore: sessionData.clarityScore || 0,
            stressResilience: sessionData.stressScore || 0,
        },
        viralTitle: viralTitles[archetype],
    };
}
//# sourceMappingURL=identity-card.js.map