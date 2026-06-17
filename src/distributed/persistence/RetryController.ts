export class RetryController {
  private attempts: Map<string, number> = new Map();

  /**
   * Determine if a task can be retried based on max attempts (3).
   */
  shouldRetry(taskId: string): boolean {
    const count = this.attempts.get(taskId) ?? 0;
    return count < 3;
  }

  /** Register an attempt for a task. */
  registerAttempt(taskId: string) {
    const count = this.attempts.get(taskId) ?? 0;
    this.attempts.set(taskId, count + 1);
  }

  /**
   * Compute exponential backoff (ms) based on attempt count.
   * Caps at 8000ms.
   */
  backoff(taskId: string): number {
    const count = this.attempts.get(taskId) ?? 1;
    return Math.min(1000 * Math.pow(2, count), 8000);
  }
}
