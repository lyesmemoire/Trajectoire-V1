import { z } from "zod";

// ===================================================================
// QUERY INTERFACES — Query Interfaces Contract
// ===================================================================

export enum QueryType {
  STATE = "STATE",
  HISTORY = "HISTORY",
  DECISION = "DECISION",
  EVIDENCE = "EVIDENCE",
  HYPOTHESIS = "HYPOTHESIS",
}

export interface QueryFilter {
  field: string;
  operator: "eq" | "ne" | "gt" | "lt" | "gte" | "lte" | "in" | "contains";
  value: any;
}

export interface QuerySort {
  field: string;
  direction: "asc" | "desc";
}

export interface CognitiveQuery {
  type: QueryType;
  filters: QueryFilter[];
  sort?: QuerySort;
  limit?: number;
  offset?: number;
}

export interface QueryMetadata {
  total: number;
  hasMore: boolean;
  executionTimeMs: number;
}

export interface QueryResult<T> {
  data: T[];
  total: number;
  metadata: QueryMetadata;
}

export interface HistoryQuery extends CognitiveQuery {
  type: QueryType.HISTORY;
  fromTimestamp?: Date;
  toTimestamp?: Date;
}

export interface HistoryResult {
  events: any[];
  count: number;
  metadata: QueryMetadata;
}

export interface DecisionQuery extends CognitiveQuery {
  type: QueryType.DECISION;
  decisionType?: string;
  minConfidence?: number;
}

export interface DecisionResult {
  decisions: any[];
  count: number;
  metadata: QueryMetadata;
}

// Zod Schemas
export const QueryTypeSchema = z.enum([
  QueryType.STATE,
  QueryType.HISTORY,
  QueryType.DECISION,
  QueryType.EVIDENCE,
  QueryType.HYPOTHESIS,
]);

export const QueryFilterSchema = z.object({
  field: z.string().min(1),
  operator: z.enum(["eq", "ne", "gt", "lt", "gte", "lte", "in", "contains"]),
  value: z.any(),
});

export const QuerySortSchema = z.object({
  field: z.string().min(1),
  direction: z.enum(["asc", "desc"]),
});

export const CognitiveQuerySchema = z.object({
  type: QueryTypeSchema,
  filters: z.array(QueryFilterSchema),
  sort: QuerySortSchema.optional(),
  limit: z.number().int().min(1).optional(),
  offset: z.number().int().min(0).optional(),
});

export const QueryMetadataSchema = z.object({
  total: z.number().int().min(0),
  hasMore: z.boolean(),
  executionTimeMs: z.number().int().min(0),
});

export const QueryResultSchema = z.object({
  data: z.array(z.any()),
  total: z.number().int().min(0),
  metadata: QueryMetadataSchema,
});
