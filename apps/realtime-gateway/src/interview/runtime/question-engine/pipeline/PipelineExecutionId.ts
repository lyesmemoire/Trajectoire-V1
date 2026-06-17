// runtime/question-engine/pipeline/PipelineExecutionId.ts
import { Brand } from "../../types/brand";

/**
 * Unique identifier for a full execution of the selector pipeline.
 * Ensures that metrics and traces from different pipeline runs never mix.
 */
export type PipelineExecutionId = Brand<string, "PipelineExecutionId">;
