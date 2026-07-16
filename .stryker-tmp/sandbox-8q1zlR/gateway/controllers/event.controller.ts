// @ts-nocheck
import { Request, Response, Router } from "express";
import { SILPublicAPI } from "../../sil/contracts/public-api";
import { EventSigner } from "../services/event-signer";
import { IncomingSILEvent } from "../../sil/contracts/sil-events";
import * as crypto from "crypto";

export function createEventController(silClient: SILPublicAPI, signer: EventSigner): Router {
  const router = Router({ mergeParams: true });

  router.post("/", async (req: Request, res: Response) => {
    try {
      const sessionId = req.params.id;
      const tenantId = req.tenantId || req.headers["x-tenant-id"] as string || "default-tenant";
      const payload = req.body.payload;
      const type = req.body.type || "USER_MESSAGE";

      if (!payload) {
        return res.status(400).json({ error: "Missing payload" });
      }

      const eventId = `evt_${crypto.randomUUID()}`;
      const timestamp = Date.now();

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

      // SIL publish doesn't return accepted/rejected synchronously because it's async in production
      // But for testing purposes, we assume accepted if it didn't throw
      res.status(202).json({ accepted: true, eventId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
