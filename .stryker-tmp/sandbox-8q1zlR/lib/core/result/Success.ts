// @ts-nocheck
import { Result } from "./Result";
import { DomainError } from "./errors/DomainError";

export class Success<T, E extends DomainError = DomainError> implements Result<T, E> {
  constructor(private readonly value: T) {}

  isSuccess(): boolean {
    return true;
  }

  isFailure(): boolean {
    return false;
  }

  unwrap(): T {
    return this.value;
  }

  unwrapError(): E {
    throw new Error("Cannot unwrapError from a Success result");
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    try {
      return new Success<U, E>(fn(this.value));
    } catch (err: any) {
      // Mapping functions shouldn't throw domain errors ideally, 
      // but if we want strictly compliant we might just throw or wrap.
      // Usually map just executes. If it throws, it's an unhandled exception.
      throw err;
    }
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
  }

  match<U>(pattern: { success: (value: T) => U; failure: (error: E) => U }): U {
    return pattern.success(this.value);
  }
}
