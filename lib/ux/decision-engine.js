/**
 * Moteur de décision pour supprimer la fatigue décisionnelle.
 * Retourne UNE SEULE priorité et UNE SEULE action recommandée.
 */
export function calculateNextStep(userStats) {
    // Logic: Focus on the lowest score pillar
    const pillars = [
        {
            id: "CLARITY",
            score: userStats.clarity || 0,
            label: "votre clarté narrative",
        },
        {
            id: "CONCISENESS",
            score: 100 - (userStats.verbosity || 0),
            label: "votre esprit de synthèse",
        },
        {
            id: "CONFIDENCE",
            score: userStats.confidence || 0,
            label: "votre assurance vocale",
        },
        {
            id: "SPECIFICITY",
            score: userStats.specificity || 0,
            label: "votre précision chiffrée",
        },
    ];
    const worstPillar = pillars.sort((a, b) => a.score - b.score)[0];
    const actions = {
        CLARITY: {
            id: "drill_star",
            title: "Focus : Structure STAR",
            description: "Apprenez à structurer vos réponses pour ne plus perdre le fil.",
            duration: "6 min",
            type: "practice",
        },
        CONCISENESS: {
            id: "drill_short",
            title: "Focus : Réponses Concises",
            description: "Apprenez à couper le superflu pour maximiser votre impact.",
            duration: "4 min",
            type: "practice",
        },
        CONFIDENCE: {
            id: "drill_tone",
            title: "Focus : Ton & Assurance",
            description: "Exercices pour stabiliser votre voix sous la pression de Victor.",
            duration: "5 min",
            type: "practice",
        },
        SPECIFICITY: {
            id: "drill_metrics",
            title: "Focus : Preuves Chiffrées",
            description: "Transformez vos généralités en résultats mesurables.",
            duration: "7 min",
            type: "practice",
        },
    };
    return {
        priority: worstPillar.label,
        action: actions[worstPillar.id],
    };
}
//# sourceMappingURL=decision-engine.js.map