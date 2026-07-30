import { z } from "zod";
import { BaseEvent } from "../../contracts/Event";
import { EngineInput } from "../../contracts/Engine";
import {
  EvidenceLevelSchema,
  EvidenceDimensionsSchema,
  AnalyzedEvidenceSchema,
  EvidenceOutputSchema,
} from "./EvidenceSchema";
import { PerceptionEvent } from "../perception/PerceptionTypes";

// ===================================================================
// EVIDENCE TYPES
// ===================================================================

export type EvidenceLevel = z.infer<typeof EvidenceLevelSchema>;
export type EvidenceDimensions = z.infer<typeof EvidenceDimensionsSchema>;

// Evidence payload for internal domain usage (adds engine metadata fields)
export type AnalyzedEvidence = z.infer<typeof AnalyzedEvidenceSchema> & {
  id: string; // Enforced at runtime by the Engine
};

export type EvidenceOutput = z.infer<typeof EvidenceOutputSchema>;

// The Event emitted by the Engine
export interface EvidenceEvent extends BaseEvent<AnalyzedEvidence> {
  eventType: "EVIDENCE_EVALUATED";
}

// Input for the Engine
export interface EvidenceContext {
  // Can include things like the current phase or known competencies, 
  // but strictly avoiding full global state as per constraints.
}

export interface EvidencePayload {
  observations: PerceptionEvent[];
  // Potential other context like related observations could be passed here
}

export type EvidenceEngineInput = EngineInput<EvidenceContext, EvidencePayload>;
