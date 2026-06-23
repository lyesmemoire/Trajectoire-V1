import { IRuntimeOrchestrator } from "../../ports/IOrchestrator";
import { IChaosInfra } from "../../ports/IInfra";
import { AttackSuite, AttackType } from "./AttackSuite";
import { FaultTelemetry } from "../../observability/FaultTelemetry";

export class AttackRunner {
  constructor(private orchestrator: IRuntimeOrchestrator, private infra: IChaosInfra) {}

  async run(type: AttackType, eventCount: number, intensity = 0.2) {
    const attack = new AttackSuite({
      type,
      intensity,
      durationEvents: eventCount,
      seed: 1337,
    }, this.infra);

    const telemetry = new FaultTelemetry(`attack-${this.infra.clock.now()}`);

    const results = {
      processed: 0,
      dropped: 0,
      mutated: 0,
    };

    for (let i = 0; i < eventCount; i++) {
      const event = {
        id: `attack-${i}`,
        type: "CHAOS_EVENT",
        timestamp: this.infra.clock.now(),
        payload: { i },
      } as any;

      const mutated = attack.apply(event);

      if (mutated === null) {
        results.dropped++;
        telemetry.emit({
          timestamp: this.infra.clock.now(),
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
            timestamp: this.infra.clock.now(),
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
          timestamp: this.infra.clock.now(),
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
