import { Injectable, Logger } from '@nestjs/common';

export interface BulkheadOptions {
  maxConcurrent?: number;
  maxQueueSize?: number;
  onQueueFull?: () => void;
}

@Injectable()
export class BulkheadService {
  private readonly logger = new Logger(BulkheadService.name);
  private readonly bulkheads = new Map<string, Bulkhead>();

  getBulkhead(name: string, options: BulkheadOptions = {}): Bulkhead {
    if (!this.bulkheads.has(name)) {
      this.bulkheads.set(name, new Bulkhead(name, options, this.logger));
    }
    return this.bulkheads.get(name)!;
  }

  async execute<T>(
    bulkheadName: string,
    fn: () => Promise<T>,
    options?: BulkheadOptions,
  ): Promise<T> {
    const bulkhead = this.getBulkhead(bulkheadName, options);
    return bulkhead.execute(fn);
  }

  getBulkheadStats(name: string) {
    const bulkhead = this.bulkheads.get(name);
    return bulkhead?.getStats();
  }
}

class Bulkhead {
  private running = 0;
  private queue: Array<() => void> = [];

  constructor(
    private readonly name: string,
    private readonly options: BulkheadOptions,
    private readonly logger: Logger,
  ) {
    this.options = {
      maxConcurrent: options.maxConcurrent || 10,
      maxQueueSize: options.maxQueueSize || 100,
      ...options,
    };
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.running < this.options.maxConcurrent!) {
      return this.runDirectly(fn);
    }

    if (this.queue.length >= this.options.maxQueueSize!) {
      if (this.options.onQueueFull) {
        this.options.onQueueFull();
      }
      throw new BulkheadRejectedError(
        `Bulkhead ${this.name} queue is full. Max queue size: ${this.options.maxQueueSize}`,
      );
    }

    return this.runQueued(fn);
  }

  private async runDirectly<T>(fn: () => Promise<T>): Promise<T> {
    this.running++;
    this.logger.debug(`Bulkhead ${this.name}: Running ${this.running}/${this.options.maxConcurrent}`);

    try {
      return await fn();
    } finally {
      this.running--;
      this.processQueue();
    }
  }

  private async runQueued<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(() => {
        this.runDirectly(fn).then(resolve).catch(reject);
      });
      this.logger.debug(`Bulkhead ${this.name}: Queued ${this.queue.length}`);
    });
  }

  private processQueue(): void {
    if (this.queue.length > 0 && this.running < this.options.maxConcurrent!) {
      const next = this.queue.shift();
      if (next) {
        next();
      }
    }
  }

  getStats() {
    return {
      running: this.running,
      queued: this.queue.length,
      maxConcurrent: this.options.maxConcurrent,
      maxQueueSize: this.options.maxQueueSize,
    };
  }
}

export class BulkheadRejectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BulkheadRejectedError';
  }
}
