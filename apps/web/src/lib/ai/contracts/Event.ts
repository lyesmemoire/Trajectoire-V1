export interface BaseEvent<T = any> {
  id: string;
  sessionId: string;
  sequence: number;
  engine: string;
  eventType: string;
  engineVersion: string;
  payload: T;
  createdAt: Date;
  // Prompt metadata for replay compatibility
  provider?: string;
  model?: string;
  promptId?: string;
  promptVersion?: string;
  promptChecksum?: string;
  schemaVersion?: string;
}
