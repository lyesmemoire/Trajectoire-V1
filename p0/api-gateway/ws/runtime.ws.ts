import { FastifyInstance } from "fastify";
import { RuntimeWSMessage } from "../contracts/ws-contract";
import { publishEvent } from "../contracts/api-contract";

export function attachWebSocketRuntime(app: FastifyInstance) {
  app.get("/v1/runtime/:sessionId", { websocket: true }, (conn, req) => {
    const sessionId = (req.params as any).sessionId;

    conn.socket.on("message", async (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as RuntimeWSMessage;

        // ONLY routing — no logic
        await routeToRuntimeBus(sessionId, msg);
      } catch (err) {
        console.error("Invalid WS message format", err);
      }
    });
  });
}

async function routeToRuntimeBus(sessionId: string, msg: RuntimeWSMessage) {
  await publishEvent("runtime.command", {
    sessionId,
    msg,
  });
}
