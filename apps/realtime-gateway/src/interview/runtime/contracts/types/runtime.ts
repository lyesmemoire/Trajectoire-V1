import type { MemoryEntry, RuntimeEvent } from "../../types/prompt";
import type { TopicGraph } from "../../graph/TopicGraph";
export interface RuntimeSignal {
  type: string;
  value: any;
}

export interface RuntimeContext {
  readonly questionMemory: readonly MemoryEntry[];
  readonly topicGraph: TopicGraph;
  readonly weakSignals: readonly RuntimeSignal[];
  readonly recentEvents: readonly RuntimeEvent[];
}
