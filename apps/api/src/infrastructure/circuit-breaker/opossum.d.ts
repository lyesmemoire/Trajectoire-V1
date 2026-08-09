declare module 'opossum' {
  interface Options {
    timeout?: number;
    errorThresholdPercentage?: number;
    resetTimeout?: number;
    rollingWindowTimeout?: number;
    rollingWindowBuckets?: number;
    rollingCountTimeout?: number;
    rollingCountBuckets?: number;
    cache?: boolean;
    cacheClose?: boolean;
    fallback?: (...args: any[]) => any;
  }

  interface Stats {
    failures: number;
    fallbacks: number;
    successes: number;
    rejects: number;
    fires: number;
    cacheHits: number;
    cacheMisses: number;
  }

  class CircuitBreaker {
    constructor(action: (...args: any[]) => Promise<any>, options?: Options);

    fire(...args: any[]): Promise<any>;

    on(event: string, listener: (...args: any[]) => void): this;

    opened: boolean;
    closed: boolean;
    halfOpen: boolean;
    stats: Stats;
  }

  export = CircuitBreaker;
}
