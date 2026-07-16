import prisma from "@/lib/prisma";
import { DecisionGraph } from "@/domain/decision-graph.contract";

// DecisionGraph model does not exist in Prisma schema - this is dead code
// Kept for reference but should be removed if not used

export class DecisionGraphRepository {
  async save(graph: DecisionGraph) {
    console.warn("DecisionGraphRepository.save called but DecisionGraph model does not exist in Prisma schema");
    return null;
  }

  async get(traceId: string): Promise<DecisionGraph | null> {
    console.warn("DecisionGraphRepository.get called but DecisionGraph model does not exist in Prisma schema");
    return null;
  }
}
