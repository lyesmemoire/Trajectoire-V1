/**
 * Moteur de simplification radicale du Replay (v1.0).
 * Transforme un rapport complexe en une récompense psychologique de 20 secondes.
 */
export function generateSimplifiedReplay(session) {
    const analysis = session.analysis || {};
    // 1. Headline de progression
    const headline = session.score > 70 ? "Vous progressez." : "Une base solide se construit.";
    // 2. Carte 1 : Le sentiment du recruteur (Stricte)
    const recruiterCard = {
        title: "Le recruteur a ressenti ça",
        content: {
            positive: (analysis.strengths && analysis.strengths[0]) ||
                "Votre calme est apprécié.",
            doubt: (analysis.improvements && analysis.improvements[0]) ||
                "Vos réponses manquent parfois de relief.",
            correction: (analysis.tips && analysis.tips[0]) ||
                "Ajoutez un résultat concret à chaque exemple.",
        },
    };
    // 3. Carte 2 : L'action unique
    const nextStep = {
        title: "Relancer une session courte",
        goal: "Répondre plus vite avec des exemples précis.",
        duration: 5,
    };
    return {
        headline,
        recruiterCard,
        nextStep,
    };
}
//# sourceMappingURL=generate-replay-story.js.map