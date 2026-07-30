import { AuditPack, ReplayInstruction, ReportInput } from "../report-contract.js";

import * as crypto from "crypto";

export function buildAuditPack(input: ReportInput): AuditPack {
  // Mock deterministic hashes for architecture purposes
  const traceIntegrityHash = crypto.createHash("sha256")
    .update(JSON.stringify(input.tracePointers))
    .digest("hex");

  const evaluationGraphHash = crypto.createHash("sha256")
    .update(JSON.stringify(input.explanation.aggregated))
    .digest("hex");

  // Replay instructions are a list of deterministic steps to reconstruct the evaluation
  const replayPlan: ReplayInstruction[] = [
    { step: 1, action: "LOAD_TRACE", payload: { sessionId: input.tracePointers.sessionId } },
    { step: 2, action: "RE_EVALUATE_P7_2", payload: {} },
    { step: 3, action: "RE_RANK_P7_3", payload: {} },
    { step: 4, action: "REBUILD_DAG_P7_4", payload: {} },
    { step: 5, action: "ASSERT_EQUAL", payload: { expectedHash: evaluationGraphHash } }
  ];

  return {
    dependencySnapshot: "v1.0.0", // Represents fixed versions of dependencies
    traceIntegrityHash,
    evaluationGraphHash,
    scoringReproducibilityProof: true, // Assertion that it is a pure function
    replaySeed: "seed_42", // Deterministic seed for any randomized fallbacks (if any existed, though none do here)
    replayPlan,
  };
}
