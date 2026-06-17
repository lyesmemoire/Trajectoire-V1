export interface GlobalIndexEntry {
  eventId: string;
  tenantId: string;
  sessionId: string;
  sequence: number;
}

export class GlobalEventIndex {
  private sequenceMap = new Map<string, number>();

  assign(event: { sessionId: string }): number {
    const key = event.sessionId;
    const next = (this.sequenceMap.get(key) ?? 0) + 1;
    this.sequenceMap.set(key, next);
    return next;
  }
}
