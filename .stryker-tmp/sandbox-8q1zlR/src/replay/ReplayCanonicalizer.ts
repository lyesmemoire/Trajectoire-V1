// @ts-nocheck
export class ReplayCanonicalizer {
  /**
   * Return a normalized version of the event suitable for deterministic hashing.
   * It preserves id, type, timestamp and sorts payload keys alphabetically.
   */
  static normalizeEvent(event: any) {
    return {
      id: event.id,
      type: event.type,
      timestamp: event.timestamp,
      payload: this.sortKeys(event.payload),
    };
  }

  private static sortKeys(obj: any): any {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
    const sorted: any = {};
    Object.keys(obj)
      .sort()
      .forEach((key) => {
        sorted[key] = obj[key];
      });
    return sorted;
  }
}
