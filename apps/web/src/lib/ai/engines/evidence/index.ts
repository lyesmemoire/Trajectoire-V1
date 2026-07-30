// ===================================================================
// EVIDENCE ENGINE — Barrel Export
// ===================================================================

export { EvidenceEngine } from "./EvidenceEngine";
export { EVIDENCE_SYSTEM_PROMPT } from "./EvidencePrompt";
export { EvidencePolicyRegistry } from "./policies/EvidencePolicyRegistry";
export {
  EvidenceLevelSchema,
  EvidenceDimensionsSchema,
  AnalyzedEvidenceSchema,
  EvidenceOutputSchema,
} from "./EvidenceSchema";
export type {
  EvidenceLevel,
  EvidenceDimensions,
  AnalyzedEvidence,
  EvidenceOutput,
  EvidenceEvent,
  EvidenceContext,
  EvidencePayload,
  EvidenceEngineInput,
} from "./EvidenceTypes";
