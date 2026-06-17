import Fastify from "fastify";
import { registerSessionRoutes } from "./routes/session.routes";
import { registerReportRoutes } from "./routes/report.routes";
import { registerEvaluationRoutes } from "./routes/evaluation.routes";
import { attachWebSocketRuntime } from "./ws/runtime.ws";
import { authMiddleware } from "./middleware/auth.middleware";
import { tenantMiddleware } from "./middleware/tenant.middleware";
import { rateLimitMiddleware } from "./middleware/rate-limit.middleware";

export function createGateway() {
  const app = Fastify({
    logger: true,
  });

  return {
    app,

    async start(port: number) {
      // Plugins
      await app.register(import("@fastify/cors"));
      await app.register(import("@fastify/websocket"));

      // Global Middlewares (Pre-Handler)
      app.addHook("preHandler", async (req, reply) => {
        await authMiddleware(req);
        await tenantMiddleware(req);
        await rateLimitMiddleware(req, reply);
      });

      // Routes
      registerSessionRoutes(app);
      registerReportRoutes(app);
      registerEvaluationRoutes(app);

      // WebSocket runtime
      attachWebSocketRuntime(app);

      await app.listen({ port, host: "0.0.0.0" });
    },
  };
}
