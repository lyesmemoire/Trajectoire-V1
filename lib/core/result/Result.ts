import { DomainError } from "./errors/DomainError";

export interface Result<T, E extends DomainError = DomainError> {
  isSuccess(): boolean;
  isFailure(): boolean;
  unwrap(): T;
  unwrapError(): E;
  map<U>(fn: (value: T) => U): Result<U, E>;
  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E>;
  match<U>(pattern: { success: (value: T) => U; failure: (error: E) => U }): U;
}
