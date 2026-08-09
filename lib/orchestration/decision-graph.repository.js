import prisma from "@/lib/prisma";
export class DecisionGraphRepository {
    async save(graph) {
        return prisma.decisionGraph.create({
            data: {
                traceId: graph.traceId,
                userId: graph.userId,
                sessionId: graph.sessionId,
                graph: JSON.stringify(graph),
                status: graph.finalDecision.status,
                globalScore: graph.finalDecision.globalScore,
            },
        });
    }
    async get(traceId) {
        const row = await prisma.decisionGraph.findUnique({
            where: { traceId },
        });
        if (!row)
            return null;
        return typeof row.graph === "string" ? JSON.parse(row.graph) : row.graph;
    }
}
//# sourceMappingURL=decision-graph.repository.js.map