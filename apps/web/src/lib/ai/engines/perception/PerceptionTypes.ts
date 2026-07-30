import { z } from "zod";
import { BaseEvent } from "../../contracts/Event";
import { EngineInput } from "../../contracts/Engine";
import {
  ObservationSchema,
  ObservationTypeSchema,
  PerceptionOutputSchema,
} from "./PerceptionSchema";

// ===================================================================
// PERCEPTION TYPES
// ===================================================================

export type ObservationType = z.infer<typeof ObservationTypeSchema>;

// Observation Type for internal domain usage (adds engine metadata fields)
export type Observation = z.infer<typeof ObservationSchema> & {
  id: string; // Enforced at runtime by the Engine
  messageIndex: number;
  timestamp: string;
  sourceQuestion: string | null;
};

export type PerceptionOutput = z.infer<typeof PerceptionOutputSchema>;

// The Event emitted by the Engine
export interface PerceptionEvent extends BaseEvent<Observation> {
  eventType: "OBSERVATION_EXTRACTED";
}

// Input for the Engine
export interface PerceptionContext {
  currentQuestion: string | null;
  messageIndex: number;
}

export interface PerceptionPayload {
  candidateAnswer: string;
}

export type PerceptionEngineInput = EngineInput<PerceptionContext, PerceptionPayload>;
