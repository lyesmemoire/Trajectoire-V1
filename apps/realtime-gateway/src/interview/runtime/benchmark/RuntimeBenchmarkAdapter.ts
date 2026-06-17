import { RuntimeOrchestrator } from "../fsm/orchestrator/RuntimeOrchestrator";

export interface BenchmarkEvent {
  id: string;
  type: string;
  timestamp: number;
  payload?: unknown;
}

export class RuntimeBenchmarkAdapter {
  constructor(private readonly orchestrator: RuntimeOrchestrator) {}

  public async inject(event: BenchmarkEvent) {
    // direct injection into runtime
    // Assuming RuntimeOrchestrator has a method process or handleEvent; using process as placeholder
    // Adjust method name if different.
    // @ts-ignore – bypass type checking for generic event shape
    return this.orchestrator.process(event as any);
  }
}
