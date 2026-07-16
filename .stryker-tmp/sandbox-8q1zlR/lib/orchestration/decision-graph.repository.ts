// @ts-nocheck
import prisma from "@/lib/prisma";
import { DecisionGraph } from "@/domain/decision-graph.contract";

export class DecisionGraphRepository {
  async save(graph: DecisionGraph) {
    return (prisma as any).decisionGraph.create({
      data: {
        traceId: graph.traceId,
        userId: graph.userId,
        sessionId: graph.sessionId,
        graph: JSON.stringify(graph) as any,
        status: graph.finalDecision.status,
        globalScore: graph.finalDecision.globalScore,
      },
    });
  }

  async get(traceId: string): Promise<DecisionGraph | null> {
    const row = await (prisma as any).decisionGraph.findUnique({
      where: { traceId },
    });

    if (!row) return null;

    return typeof row.graph === "string" ? JSON.parse(row.graph) : row.graph as any;
  }
}
