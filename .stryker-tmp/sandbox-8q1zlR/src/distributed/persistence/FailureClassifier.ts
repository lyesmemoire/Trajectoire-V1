// @ts-nocheck
export type FailureType =
  | "NODE_CRASH"
  | "TIMEOUT"
  | "INVALID_RESULT"
  | "HEARTBEAT_LOSS"
  | "LEDGER_CONFLICT";

export class FailureClassifier {
  /**
   * Classify an error object into a FailureType. The error object can be
   * anything the system throws – we look for known shape properties.
   */
  classify(error: any): FailureType {
    if (error?.code === "TIMEOUT") return "TIMEOUT";
    if (error?.code === "HEARTBEAT") return "HEARTBEAT_LOSS";
    if (error?.code === "INVALID") return "INVALID_RESULT";
    if (error?.type === "LEDGER_CONFLICT") return "LEDGER_CONFLICT";
    // Default to generic node crash for any other unexpected error
    return "NODE_CRASH";
  }
}
