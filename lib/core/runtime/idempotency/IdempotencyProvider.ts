export interface IdempotencyProvider {
  begin(key: string): Promise<void>;
  complete(key: string): Promise<void>;
  isProcessed(key: string): Promise<boolean>;
}

export class MemoryIdempotencyProvider implements IdempotencyProvider {
  private processed = new Set<string>();
  private inProgress = new Set<string>();

  async begin(key: string): Promise<void> {
    if (this.processed.has(key)) throw new Error(`Idempotency key ${key} already processed.`);
    if (this.inProgress.has(key)) throw new Error(`Idempotency key ${key} is currently in progress.`);
    this.inProgress.add(key);
  }

  async complete(key: string): Promise<void> {
    this.inProgress.delete(key);
    this.processed.add(key);
  }

  async isProcessed(key: string): Promise<boolean> {
    return this.processed.has(key);
  }
}

export class NoopIdempotencyProvider implements IdempotencyProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async begin(key: string): Promise<void> {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async complete(key: string): Promise<void> {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async isProcessed(key: string): Promise<boolean> { return false; }
}
