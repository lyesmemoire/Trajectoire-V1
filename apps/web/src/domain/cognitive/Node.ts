import { z } from "zod";

// ===================================================================
// NODE — The fundamental unit of the Knowledge Graph
// A Node represents any piece of knowledge about the candidate.
// It is domain-agnostic: it does not know "Leadership" or "React".
// It only knows types, attributes, and confidence.
// ===================================================================

export const NodeStatusSchema = z.enum([
  "ACTIVE",
  "ARCHIVED",
  "INVALIDATED",
]);

export type NodeStatus = z.infer<typeof NodeStatusSchema>;

export const NodeTypeSchema = z.enum([
  "COMPETENCY",
  "PROJECT",
  "EXPERIENCE",
  "DECISION",
  "FAILURE",
  "ACHIEVEMENT",
  "TECHNOLOGY",
  "METHODOLOGY",
  "ROLE",
  "ORGANIZATION",
  "CERTIFICATION",
  "VALUE",
  "BEHAVIOR",
  "RISK",
  "UNKNOWN",
]);

export type NodeType = z.infer<typeof NodeTypeSchema>;

export const KnowledgeNodeSchema = z.object({
  id: z.string().uuid(),
  type: NodeTypeSchema,
  label: z.string().min(1),
  attributes: z.record(z.string(), z.unknown()).default({}),
  confidence: z.number().min(0).max(1).default(0),
  sources: z.array(z.string()).default([]),
  status: NodeStatusSchema.default("ACTIVE"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type KnowledgeNode = z.infer<typeof KnowledgeNodeSchema>;
