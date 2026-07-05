export type { Result } from "./Result";
export { Success } from "./Success";
export { Failure } from "./Failure";
export { DomainError } from "./errors/DomainError";
// Do NOT re-export ./errors here — they conflict with lib/core/errors/index.ts
// which also exports ValidationError, NotFoundError, etc.
// Import from @/lib/core/result/errors directly when you need the DomainError variants.

import { Success } from "./Success";
import { Failure } from "./Failure";
import { DomainError } from "./errors/DomainError";

// Standalone helper functions
export function ok<T, E extends DomainError = DomainError>(value: T): Success<T, E> {
  return new Success<T, E>(value);
}

export function fail<T, E extends DomainError = DomainError>(error: E): Failure<T, E> {
  return new Failure<T, E>(error);
}
