export interface RuntimeValidationResult {
  ok: boolean;
  errors: RuntimeValidationError[];
  meta: {
    validatedAt: number;
    durationMs: number;
  };
}

export interface RuntimeValidationError {
  type: "FSM" | "REPLAY" | "GUARD" | "SNAPSHOT";
  code: string;
  message: string;
  payload?: unknown;
}
