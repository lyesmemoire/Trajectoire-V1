import { RuntimeWSMessage } from "../contracts/ws-contract";
import { publishEvent } from "../contracts/api-contract";

export function attachWebSocketRuntime(app: _FastifyInstance) {
  app.get("/v1/runtime/:sessionId", { websocket: true }, (conn, req) => {
    const sessionId = (req.params as unknown).sessionId;

    conn.socket.on("message", async (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as RuntimeWSMessage;

        // ONLY routing — no logic
        await routeToRuntimeBus(sessionId, msg);
      } catch (error) {
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
