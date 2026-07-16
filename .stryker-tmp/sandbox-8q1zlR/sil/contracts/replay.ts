// @ts-nocheck
export interface ReplayOptions {
  fromCheckpoint?: string;
  untilEvent?: string;
  debug?: boolean;
}

export interface ReplayResult {
  sessionId: string;
  eventCount: number;
  originalHash: string | null;
  replayHash: string;
  deterministic: boolean;
}
