/**
 * Traduit les métriques d'IA en coaching humain protecteur.
 * Interdiction stricte de montrer des scores ou des index.
 */
export function humanizeBehavioralSignals(signals) {
    // 1. Détection de la priorité (Longueurs vs Structure vs Doute)
    if (signals.verbosity > 70) {
        return {
            insight: "Vos réponses ont tendance à devenir trop détaillées, ce qui dilue l'impact de vos réussites.",
            reassurance: "Votre fond est solide, une structure plus brève rendra votre discours irrésistible.",
        };
    }
    if (signals.clarity < 50) {
        return {
            insight: "Vous perdez parfois le fil de votre démonstration lorsque le recruteur vous interrompt.",
            reassurance: "C'est une réaction normale. Pratiquons le retour au calme pour stabiliser votre message.",
        };
    }
    if (signals.hesitation > 60) {
        return {
            insight: "On sent une légère hésitation dans votre ton lors des questions techniques.",
            reassurance: "Votre expertise est réelle. Affirmons vos verbes d'action pour refléter votre compétence.",
        };
    }
    return {
        insight: "Vous gardez une structure stable et un ton assuré, même sous haute tension.",
        reassurance: "C'est un signal de leadership fort. Votre progression est remarquable.",
    };
}
//# sourceMappingURL=humanize-insights.js.map