import { z } from "zod";

// ===================================================================
// ENGINE CAPABILITY — Engine Capability Contract
// ===================================================================

export interface EngineCapability {
  engineName: string;
  version: string;
  inputSchema: z.ZodSchema;
  outputSchema: z.ZodSchema;
  requiredContext: string[];
  providedEvents: string[];
  maxConcurrency: number;
  estimatedTokens: number;
}

// Zod Schema for metadata (excluding the actual schemas)
export const EngineCapabilityMetadataSchema = z.object({
  engineName: z.string().min(1),
  version: z.string().min(1),
  requiredContext: z.array(z.string()),
  providedEvents: z.array(z.string()),
  maxConcurrency: z.number().int().min(1),
  estimatedTokens: z.number().int().min(0),
});
