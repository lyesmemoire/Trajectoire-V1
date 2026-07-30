import crypto from "crypto";
import { saveSessionRecord, publishEvent, getSession } from "../contracts/api-contract";

export function registerSessionRoutes(app: _FastifyInstance) {
  app.post("/v1/sessions", async (req, res) => {
    const tenant = (req as unknown).tenant;

    const sessionId = crypto.randomUUID();

    // Persist only metadata (NO P5/P6 logic)
    await saveSessionRecord({
      sessionId,
      tenantId: tenant.tenantId,
      status: "ACTIVE",
      createdAt: Date.now(),
    });

    // Publish event
    await publishEvent("session.created", {
      sessionId,
      tenantId: tenant.tenantId,
    });

    return { sessionId };
  });

  app.get("/v1/sessions/:id", async (req) => {
    const sessionId = (req.params as unknown).id;
    return getSession(sessionId);
  });

  app.delete("/v1/sessions/:id", async (req) => {
    const sessionId = (req.params as unknown).id;
    // Mock ending session
    await publishEvent("runtime.command", {
      sessionId,
      msg: { type: "control.end", sessionId }
    });
    return { success: true };
  });
}
