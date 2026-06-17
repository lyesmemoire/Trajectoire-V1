// src/interview/runtime/fsm/errors/ReplayIntegrityError.ts

import { deepFreeze } from "../../utils/deepFreeze";

export class ReplayIntegrityError extends Error {
  readonly code: string;
  readonly details: Readonly<Record<string, unknown>>;

  constructor(message: string, code: string, details: Record<string, unknown> = {}) {
    super(message);
    // Ensure instanceof works under CommonJS / transpiled environments
    Object.setPrototypeOf(this, ReplayIntegrityError.prototype);
    this.name = "ReplayIntegrityError";
    this.code = code;
    // Deep‑freeze details to guarantee full immutability
    this.details = deepFreeze({ ...details });
  }
}
