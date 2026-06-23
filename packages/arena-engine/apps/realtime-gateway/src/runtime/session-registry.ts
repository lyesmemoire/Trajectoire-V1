export class SessionRegistry {
  private sessions = new Set<string>();

  add(sessionId: string): void {
    this.sessions.add(sessionId);
  }

  has(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }

  remove(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}
