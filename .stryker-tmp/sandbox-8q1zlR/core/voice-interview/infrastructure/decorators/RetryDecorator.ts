// @ts-nocheck
export class RetryDecorator {
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 2,
    baseDelayMs: number = 100
  ): Promise<T> {
    let attempts = 0;
    while (true) {
      try {
        return await operation();
      } catch (error) {
        attempts++;
        if (attempts > maxRetries) {
          throw error;
        }
        const delay = baseDelayMs * Math.pow(2, attempts - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}
