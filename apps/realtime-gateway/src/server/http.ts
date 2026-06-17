import Fastify from "fastify";
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";
import { registry } from "../interview/runtime/fsm/metrics/RuntimeMetrics";
import { RuntimeHealthService } from "../interview/runtime/health/RuntimeHealthService";
import { RuntimeInspector } from "../interview/runtime/debug/RuntimeInspector";

export const createHttpServer = async () => {
  const app = Fastify({ logger: false });
const healthService = new RuntimeHealthService();

  await app.register(websocket);
  await app.register(cors, {
    origin: ["http://localhost:3000"],
    credentials: true,
  });

  app.get("/healthz", async () => ({
    status: "ok",
    ts: Date.now(),
  }));

app.get("/health/details", async () => {
  return await healthService.getHealth();
});

app.get("/debug/snapshot", async () => {
  return await RuntimeInspector.getSnapshot();
});

  /**
   * Prometheus metrics endpoint
   * Exposes all runtime metrics from prom-client registry
   */
  app.get("/metrics", async (_request, reply) => {
    reply.header("Content-Type", registry.contentType);

    const metrics = await registry.metrics();
    return reply.send(metrics);
  });

  return app;
};
