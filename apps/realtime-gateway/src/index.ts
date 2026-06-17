import { createHttpServer } from "./server/http";
import { registerSignaling } from "./server/signaling";
import { registerVoiceWs } from "./server/ws.voice";
import { registerInterviewRoutes } from "./server/routes/interviews";
import { registerBillingRoutes } from "./server/routes/billing";
import { registerEngineRoutes } from "./server/routes/engine";
import { logger } from "./telemetry/logger";
import "./ai/orchestrator";

async function bootstrap() {
  const app = await createHttpServer();
  await registerSignaling(app);
  await registerVoiceWs(app);
  await registerInterviewRoutes(app);
  await registerBillingRoutes(app);
  await registerEngineRoutes(app);

  const port = Number(process.env.PORT || 3000);
  await app.listen({ host: "0.0.0.0", port });
  logger.info({ port }, "Realtime gateway started");
}

bootstrap().catch((err) => {
  logger.error(err);
  process.exit(1);
});
