import 'dotenv/config';
import { envServer } from "../../../lib/env.server.js";
import { createHttpServer } from "./server/http.js";
import { registerSignaling } from "./server/signaling.js";
import { registerVoiceWs } from "./server/ws.voice.js";
import { registerInterviewRoutes } from "./server/routes/interviews.js";
import { registerBillingRoutes } from "./server/routes/billing.js";
import { registerEngineRoutes } from "./server/routes/engine.js";
import { logger } from "./telemetry/logger.js";
import "./ai/orchestrator.js";

async function bootstrap() {
  // Production safety guard: prevent DEV bypasses from being active in production
  if (process.env.NODE_ENV === "production" && process.env.DEV_BYPASS === "true") {
    throw new Error("SECURITY: DEV_BYPASS is active in production environment. This is not allowed.");
  }

  const app = await createHttpServer();
  await registerSignaling(app);
  await registerVoiceWs(app);
  await registerInterviewRoutes(app);
  await registerBillingRoutes(app);
  await registerEngineRoutes(app);

  const port = Number(envServer.PORT || 3000);
  await app.listen({ host: "0.0.0.0", port });
  logger.info({ port, env: process.env.NODE_ENV }, "Realtime gateway started");
}

bootstrap().catch((err) => {
  logger.error(err);
  process.exit(1);
});
