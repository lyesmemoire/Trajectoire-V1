// @ts-nocheck
export class ResultStore {
  private store = new Map<string, any>();

  /**
   * Store the result of a task. If the taskId already exists the result is ignored to enforce immutability.
   */
  put(taskId: string, result: any) {
    if (this.store.has(taskId)) return; // immutability guarantee
    // freeze to prevent later mutations
    this.store.set(taskId, Object.freeze(result));
  }

  /** Retrieve the stored result for a given taskId */
  get(taskId: string) {
    return this.store.get(taskId);
  }

  /** Check existence of a result */
  has(taskId: string) {
    return this.store.has(taskId);
  }
}
