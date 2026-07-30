import { z } from "zod";
import { EngineCapability } from "./EngineCapability";

// ===================================================================
// RUNTIME CONTEXT — Runtime Context Contract
// ===================================================================

export interface RuntimeConfiguration {
  maxConcurrentEngines: number;
  timeoutMs: number;
  retryAttempts: number;
  enableTelemetry: boolean;
  enableFeatureFlags: boolean;
}

export interface RuntimeContext {
  sessionId: string;
  startTime: Date;
  configuration: RuntimeConfiguration;
  capabilities: EngineCapability[];
}

// Zod Schemas
export const RuntimeConfigurationSchema = z.object({
  maxConcurrentEngines: z.number().int().min(1),
  timeoutMs: z.number().int().min(1),
  retryAttempts: z.number().int().min(0),
  enableTelemetry: z.boolean(),
  enableFeatureFlags: z.boolean(),
});

export const RuntimeContextSchema = z.object({
  sessionId: z.string().min(1),
  startTime: z.date(),
  configuration: RuntimeConfigurationSchema,
  capabilities: z.array(z.any()), // Will be replaced with EngineCapabilitySchema
});
