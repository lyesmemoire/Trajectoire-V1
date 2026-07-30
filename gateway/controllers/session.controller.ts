import { Request, Response, Router } from "express";
import { EventSigner } from "../services/event-signer";
import { IncomingSILEvent } from "../../sil/contracts/sil-events";
import * as crypto from "crypto";

export function createSessionController(silClient: _SILPublicAPI, signer: EventSigner): Router {
  const router = Router();

  router.post("/", async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId || req.headers["x-tenant-id"] as string || "default-tenant";
      const metadata = req.body.metadata;
      
      const sessionId = `sess_${crypto.randomUUID()}`;
      const eventId = `evt_${crypto.randomUUID()}`;
      const timestamp = Date.now();
      const type = "SESSION_CREATED";
      const payload = { metadata };

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

      res.status(201).json({ sessionId, state: "STARTING" });
    } catch (err: unknown) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/:id/start", async (req: Request, res: Response) => {
    try {
      const sessionId = req.params.id;
      const tenantId = req.tenantId || req.headers["x-tenant-id"] as string || "default-tenant";
      
      const eventId = `evt_${crypto.randomUUID()}`;
      const timestamp = Date.now();
      const type = "SESSION_STARTED";
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

      res.status(200).json({ sessionId, state: "RUNNING" });
    } catch (err: unknown) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
