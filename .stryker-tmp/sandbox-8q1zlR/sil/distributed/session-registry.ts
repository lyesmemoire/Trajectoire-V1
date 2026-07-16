// @ts-nocheck
export class GlobalSessionRegistry {
  private map = new Map<string, string>(); // sessionId → nodeId

  register(sessionId: string, nodeId: string) {
    this.map.set(sessionId, nodeId);
  }

  getNode(sessionId: string): string | undefined {
    return this.map.get(sessionId);
  }
}
