import { FastifyInstance } from "fastify";

export function registerEvaluationRoutes(app: FastifyInstance) {
  app.get("/v1/evaluations/:sessionId", async (req) => {
    const sessionId = (req.params as any).sessionId;
    // Mock fetching Evaluation JSON
    return { sessionId, score: 85, status: "COMPLETED" };
  });

  app.get("/v1/rankings", async (req) => {
    const tenantId = (req.query as any).tenantId;
    // Mock fetching cohort rankings
    return { tenantId, rankings: [] };
  });
}
