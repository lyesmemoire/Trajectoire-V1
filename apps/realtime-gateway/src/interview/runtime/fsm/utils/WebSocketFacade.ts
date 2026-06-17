import { stableSerialize } from "../../utils/stableSerialize";
import { RuntimeOrchestrator } from "../orchestrator/RuntimeOrchestrator";

export class WebSocketFacade {
  constructor(
    private readonly orchestrator: RuntimeOrchestrator,
  ) {}

  public async onMessage(message: string): Promise<string> {
    try {
      // Parse incoming raw message
      const raw = JSON.parse(message);

      // Route and process through the deterministic orchestrator
      const result = await this.orchestrator.process(raw);

      // Return a stable, deterministic serialization of the ACK
      return stableSerialize({
        ok: true,
        payload: result
      });
    } catch (error) {
      // Return deterministic NACK on any failure (parse, validation, router)
      const errorMessage = error instanceof Error ? error.message : "UNKNOWN_ERROR";
      return stableSerialize({
        ok: false,
        error: errorMessage
      });
    }
  }
}
