import { createHttpServer } from "./server/http.js";
import { registerSignaling } from "./server/signaling.js";
import { registerVoiceWs } from "./server/ws.voice.js";
import { registerInterviewRoutes } from "./server/routes/interviews.js";
import { registerBillingRoutes } from "./server/routes/billing.js";
import { registerEngineRoutes } from "./server/routes/engine.js";
import { logger } from "./telemetry/logger.js";
import "./ai/orchestrator.js";

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
