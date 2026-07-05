import { Result } from "./Result";
import { DomainError } from "./errors/DomainError";

export class Failure<T, E extends DomainError = DomainError> implements Result<T, E> {
  constructor(private readonly error: E) {}

  isSuccess(): boolean {
    return false;
  }

  isFailure(): boolean {
    return true;
  }

  unwrap(): T {
    throw this.error;
  }

  unwrapError(): E {
    return this.error;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return new Failure<U, E>(this.error);
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return new Failure<U, E>(this.error);
  }

  match<U>(pattern: { success: (value: T) => U; failure: (error: E) => U }): U {
    return pattern.failure(this.error);
  }
}
