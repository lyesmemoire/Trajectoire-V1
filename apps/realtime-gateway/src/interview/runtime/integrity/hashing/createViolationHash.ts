import { hashObjectStable } from "../../utils/hash";
import { IntegrityViolation } from "../types/IntegrityViolation";

/**
 * Creates a deterministic hash for a given integrity violation.
 * The hash is based on the stable JSON representation of the
 * violation fields that uniquely identify the problem.
 */
export function createViolationHash(
  violation: Omit<IntegrityViolation, "violationHash">,
): string {
  return hashObjectStable({
    invariantId: violation.invariantId,
    severity: violation.severity,
    category: violation.category,
    message: violation.message,
    logicalTime: violation.logicalTime,
    frameId: violation.frameId,
    snapshotHash: violation.snapshotHash,
  });
}
