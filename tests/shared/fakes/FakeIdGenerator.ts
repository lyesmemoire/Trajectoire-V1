/**
 * Fake IdGenerator for testing
 * Allows deterministic ID generation in tests
 */

import { IdGenerator } from "../../../lib/core/id/IdGenerator";

export class FakeIdGenerator implements IdGenerator {
  private counter: number = 0;
  private prefix: string = "test-";

  constructor(prefix: string = "test-") {
    this.prefix = prefix;
  }

  generate(): string {
    const id = `${this.prefix}${this.counter}`;
    this.counter++;
    return id;
  }

  reset(): void {
    this.counter = 0;
  }

  setCounter(value: number): void {
    this.counter = value;
  }
}
