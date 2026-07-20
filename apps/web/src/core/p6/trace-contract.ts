export interface RuntimeTrace {
  sessionId: string;
  turns: TurnTrace[];
}

export interface TurnTrace {
  index: number;
  input: {
    message: string;
    timestamp: number;
  };
  output: {
    utterance: string;
    timestamp: number;
  } | null;
  p5: {
    snapshotHash: string;
    journalPointer: string;
  } | null;
  events: {
    type: string;
    timestamp: number;
    payload?: unknown;
  }[];
  derived: {
    latencyMs: number;
    turnDurationMs: number;
  };
}
