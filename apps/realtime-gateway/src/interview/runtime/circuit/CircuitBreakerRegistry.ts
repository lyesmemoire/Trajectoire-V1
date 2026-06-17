import { CircuitBreaker } from "./CircuitBreaker";

export class CircuitBreakerRegistry {
  private breakers = new Map<string, CircuitBreaker>();

  public get(key: string): CircuitBreaker {
    if (!this.breakers.has(key)) {
      this.breakers.set(
        key,
        new CircuitBreaker({
          failureThreshold: 10,
          successThreshold: 3,
          timeoutMs: 5000,
        })
      );
    }
    return this.breakers.get(key)!;
  }
}
