import { RuntimeOrchestrator } from "../../../apps/realtime-gateway/src/voice-interview/runtime/fsm/orchestrator/RuntimeOrchestrator";
import { AttackSuite, AttackType } from "./AttackSuite";
import { FaultTelemetry } from "../../observability/FaultTelemetry";

export class AttackRunner {
  constructor(private orchestrator: RuntimeOrchestrator) {}

  async run(type: AttackType, eventCount: number, intensity = 0.2) {
    const attack = new AttackSuite({
      type,
      intensity,
      durationEvents: eventCount,
      seed: 1337,
    });

    const telemetry = new FaultTelemetry(`attack-${Date.now()}`);

    const results = {
      processed: 0,
      dropped: 0,
      mutated: 0,
    };

    for (let i = 0; i < eventCount; i++) {
      const event = {
        id: `attack-${i}`,
        type: "CHAOS_EVENT",
        timestamp: Date.now(),
        payload: { i },
      } as any;

      const mutated = attack.apply(event);

      if (mutated === null) {
        results.dropped++;
        telemetry.emit({
          timestamp: Date.now(),
          domain: "ATTACK",
          severity: "WARN",
          message: "Event dropped by attack engine",
          mode: type,
        });
        continue;
      }

      if (Array.isArray(mutated)) {
        // duplication case
        for (const m of mutated) {
          await this.orchestrator.process(m);
          results.processed++;
          results.mutated++;
          telemetry.emit({
            timestamp: Date.now(),
            domain: "EVENT_ACCOUNTING",
            severity: "INFO",
            message: "Event processed under attack",
            mode: type,
          });
        }
      } else {
        await this.orchestrator.process(mutated);
        results.processed++;
        telemetry.emit({
          timestamp: Date.now(),
          domain: "EVENT_ACCOUNTING",
          severity: "INFO",
          message: "Event processed under attack",
          mode: type,
        });
      }
    }

    return {
      ...results,
      telemetry: telemetry.snapshot(),
    };
  }
}
