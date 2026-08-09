import prisma from "@/lib/prisma";
/**
 * Moteur de Graphe Comportemental (Core Moat).
 * Transforme chaque interaction en un point de donnée lié dans un graphe de session.
 */
export async function emitBehaviorEvent(event) {
    // 1. Calcul de l'intensité et de l'entropie (Logique simplifiée pour le MVP)
    const intensityScore = computeIntensity(event);
    const entropyScore = computeEntropy(event);
    // 2. Recherche du dernier événement pour le lien du graphe
    const lastEvent = await prisma.behaviorEvent.findFirst({
        where: { sessionId: event.sessionId },
        orderBy: { timestamp: "desc" },
    });
    // 3. Persistance de l'événement
    const createdEvent = await prisma.behaviorEvent.create({
        data: {
            User: { connect: { id: event.userId } },
            InterviewSession: { connect: { id: event.sessionId } },
            type: event.type,
            payload: event.payload ?? {},
            latencyMs: event.metadata?.latencyMs ?? null,
            intensityScore,
            entropyScore,
            previousEventId: lastEvent?.id,
        },
    });
    // 4. Mise à jour du lien "Next" sur l'événement précédent
    if (lastEvent) {
        await prisma.behaviorEvent.update({
            where: { id: lastEvent.id },
            data: { nextEventId: createdEvent.id },
        });
    }
    return createdEvent;
}
function computeIntensity(event) {
    const intensityMap = {
        VICTOR_INTERRUPT: 0.9,
        FREEZE_DETECTED: 0.8,
        INTERVIEW_START: 0.6,
        CLARA_RECOVERY: 0.3,
    };
    return intensityMap[event.type] ?? 0.5;
}
function computeEntropy(event) {
    // L'entropie mesure le "désordre" ou l'hésitation
    if (event.type === "FREEZE_DETECTED")
        return 0.9;
    if (event.metadata?.latencyMs && event.metadata.latencyMs > 5000)
        return 0.7;
    return 0.2;
}
//# sourceMappingURL=behavior-graph.js.map