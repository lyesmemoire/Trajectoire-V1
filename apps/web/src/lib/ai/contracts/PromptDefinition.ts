import { z } from "zod";

// ===================================================================
// PROMPT DEFINITION — Prompt Definition Contract
// ===================================================================

export interface PromptVariable {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description: string;
}

export interface PromptDefinition {
  key: string;
  system: string;
  template: string;
  variables: Record<string, PromptVariable>;
  version: string;
}

// Zod Schemas
export const PromptVariableSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  required: z.boolean(),
  defaultValue: z.any().optional(),
  description: z.string().min(1),
});

export const PromptDefinitionSchema = z.object({
  key: z.string().min(1),
  system: z.string().min(1),
  template: z.string().min(1),
  variables: z.record(z.string(), PromptVariableSchema),
  version: z.string().min(1),
});
