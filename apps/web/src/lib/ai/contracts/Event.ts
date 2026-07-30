export interface BaseEvent<T = any> {
  id: string;
  sessionId: string;
  sequence: number;
  engine: string;
  eventType: string;
  engineVersion: string;
  payload: T;
  createdAt: Date;
}
