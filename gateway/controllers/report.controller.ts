import { Request, Response, Router } from "express";
import { EventSigner } from "../services/event-signer";
import { IncomingSILEvent } from "../../sil/contracts/sil-events";
import * as crypto from "crypto";

export function createReportController(silClient: _SILPublicAPI, signer: EventSigner): Router {
  const router = Router({ mergeParams: true });

  router.post("/finish", async (req: Request, res: Response) => {
    try {
      const sessionId = req.params.id;
      const tenantId = req.tenantId || req.headers["x-tenant-id"] as string || "default-tenant";

      const eventId = `evt_${crypto.randomUUID()}`;
      const timestamp = Date.now();
      const type = "SESSION_FINISHED";
      const payload = {};

      const signature = signer.sign(tenantId, sessionId, eventId, type, payload, timestamp);

      const event: IncomingSILEvent = {
        eventId,
        sessionId,
        tenantId,
        type,
        payload,
        timestamp,
        signature
      };

      await silClient.publish(event);

      res.status(202).json({ sessionId, status: "FINISHING" });
    } catch (err: unknown) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/report", async (req: Request, res: Response) => {
    try {
      const sessionId = req.params.id;
      const tenantId = req.tenantId || req.headers["x-tenant-id"] as string || "default-tenant";

      // We ONLY query the SIL public API. Gateway does not touch Postgres directly.
      const result = await silClient.getReport({ tenantId, sessionId });

      if (result.status === "NOT_FOUND") {
        return res.status(404).json({ error: "Session not found" });
      }

      if (result.status === "PENDING" || !result.report) {
        return res.status(202).json({ status: "PENDING" });
      }

      res.status(200).json(result.report);
    } catch (err: unknown) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
