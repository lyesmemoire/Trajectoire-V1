import { z } from "zod";

// ===================================================================
// EDGE — A directed relationship between two Nodes
// Edges carry semantic meaning (SUPPORTS, CONTRADICTS, etc.)
// They are weighted and have their own confidence score.
// ===================================================================

export const EdgeRelationSchema = z.enum([
  "SUPPORTS",
  "CONTRADICTS",
  "USES",
  "LEADS",
  "CREATED",
  "SOLVED",
  "MENTORED",
  "IMPACTS",
  "DEPENDS_ON",
  "PRECEDED_BY",
  "FOLLOWED_BY",
  "REQUIRES",
  "DEMONSTRATED_BY",
  "WEAKENED_BY",
]);

export type EdgeRelation = z.infer<typeof EdgeRelationSchema>;

export const KnowledgeEdgeSchema = z.object({
  id: z.string().uuid(),
  source: z.string().uuid(),
  target: z.string().uuid(),
  relation: EdgeRelationSchema,
  weight: z.number().min(0).max(1).default(0.5),
  confidence: z.number().min(0).max(1).default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.date(),
});

export type KnowledgeEdge = z.infer<typeof KnowledgeEdgeSchema>;
