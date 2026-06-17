// src/interview/runtime/errors/DeterministicRuntimeError.ts
import { RuntimeErrorCode } from "../types/RuntimeErrorCode";

/**
 * Base class for all deterministic runtime errors.
 * Guarantees a stable prototype chain, immutable metadata and optional logical timestamp.
 */
export abstract class DeterministicRuntimeError extends Error {
  public readonly code: RuntimeErrorCode;
  public readonly metadata?: Readonly<Record<string, unknown>> | undefined;
  public readonly timestampLogical?: number | undefined;

  protected constructor(
    code: RuntimeErrorCode,
    message: string,
    metadata?: Readonly<Record<string, unknown>>,
    logicalTimestamp?: number,
  ) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.metadata = metadata;
    this.timestampLogical = logicalTimestamp;
    // Ensure instanceof works across transpiled output
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
