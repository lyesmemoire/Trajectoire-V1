export interface TimeoutConfig {
  http: number;
  database: number;
  cache: number;
  queue: number;
  external: number;
  graph: {
    import: number;
    query: number;
    validation: number;
  };
  matching: {
    calculate: number;
    search: number;
  };
}

export const DEFAULT_TIMEOUTS: TimeoutConfig = {
  http: 30000, // 30 seconds
  database: 10000, // 10 seconds
  cache: 2000, // 2 seconds
  queue: 60000, // 60 seconds
  external: 15000, // 15 seconds
  graph: {
    import: 120000, // 2 minutes for graph import
    query: 30000, // 30 seconds for graph query
    validation: 10000, // 10 seconds for validation
  },
  matching: {
    calculate: 60000, // 1 minute for matching calculation
    search: 30000, // 30 seconds for search
  },
};

export class TimeoutService {
  private static timeouts: TimeoutConfig = DEFAULT_TIMEOUTS;

  static setTimeouts(config: Partial<TimeoutConfig>): void {
    this.timeouts = { ...this.timeouts, ...config };
  }

  static getTimeouts(): TimeoutConfig {
    return this.timeouts;
  }

  static getTimeout(path: string): number {
    const keys = path.split('.');
    let value: any = this.timeouts;

    for (const key of keys) {
      value = value?.[key];
    }

    return value || DEFAULT_TIMEOUTS.http;
  }

  static async withTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs: number,
    timeoutMessage?: string,
  ): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<T>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                timeoutMessage || `Operation timed out after ${timeoutMs}ms`,
              ),
            ),
          timeoutMs,
        ),
      ),
    ]);
  }
}
