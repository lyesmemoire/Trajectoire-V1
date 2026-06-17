export type P0Event =
  | { type: "session.created"; sessionId: string; tenantId: string }
  | { type: "runtime.command"; sessionId: string; msg: any }
  | { type: "evaluation.job"; sessionId: string };

// Temporary mock for event publishing (will be wired to Redis/Kafka in P0.3)
export async function publishEvent(type: P0Event["type"], payload: any): Promise<void> {
  console.log(`[EventBus MOCK] ${type}`, payload);
}

// Temporary mock for session storage (will be wired to PostgreSQL in P0.4)
export async function saveSessionRecord(record: { sessionId: string; tenantId: string; status: "ACTIVE" | "CLOSED"; createdAt: number }): Promise<void> {
  console.log(`[Storage MOCK] Saving session`, record);
}

export async function getSession(sessionId: string): Promise<any> {
  return { sessionId, status: "ACTIVE" };
}
