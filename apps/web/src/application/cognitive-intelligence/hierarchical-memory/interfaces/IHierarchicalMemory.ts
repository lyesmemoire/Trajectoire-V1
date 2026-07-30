/**
 * Hierarchical Memory Interfaces
 * Structured memory system
 */

import { z } from "zod";

// ============================================================================
// MEMORY TYPE
// ============================================================================

export type MemoryType = 
  | "short_term"
  | "working"
  | "session"
  | "long_term"
  | "semantic"
  | "procedural"
  | "episodic"
  | "emotional"
  | "behavior"
  | "preference"
  | "career"
  | "interview"
  | "learning"
  | "reflection";

// ============================================================================
// MEMORY ENTRY
// ============================================================================

export interface MemoryEntry {
  id: string;
  type: MemoryType;
  content: any;
  metadata: Record<string, unknown>;
  importance: number; // 0-1
  accessCount: number;
  lastAccessed: Date;
  createdAt: Date;
  expiresAt: Date | null;
  associations: string[]; // IDs of associated memories
}

export const MemoryEntrySchema = z.object({
  id: z.string(),
  type: z.enum(["short_term", "working", "session", "long_term", "semantic", "procedural", "episodic", "emotional", "behavior", "preference", "career", "interview", "learning", "reflection"]),
  content: z.unknown(),
  metadata: z.record(z.string(), z.unknown()),
  importance: z.number(),
  accessCount: z.number(),
  lastAccessed: z.date(),
  createdAt: z.date(),
  expiresAt: z.date().nullable(),
  associations: z.array(z.string()),
});

// ============================================================================
// MEMORY CONSOLIDATION
// ============================================================================

export interface MemoryConsolidation {
  id: string;
  sourceMemoryId: string;
  targetMemoryType: MemoryType;
  consolidationStrategy: "summarize" | "compress" | "extract" | "merge";
  timestamp: Date;
  success: boolean;
  newMemoryId: string | null;
}

export const MemoryConsolidationSchema = z.object({
  id: z.string(),
  sourceMemoryId: z.string(),
  targetMemoryType: z.enum(["short_term", "working", "session", "long_term", "semantic", "procedural", "episodic", "emotional", "behavior", "preference", "career", "interview", "learning", "reflection"]),
  consolidationStrategy: z.enum(["summarize", "compress", "extract", "merge"]),
  timestamp: z.date(),
  success: z.boolean(),
  newMemoryId: z.string().nullable(),
});

// ============================================================================
// MEMORY COMPRESSION
// ============================================================================

export interface MemoryCompression {
  id: string;
  memoryId: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  compressionMethod: "lossless" | "lossy";
  timestamp: Date;
}

export const MemoryCompressionSchema = z.object({
  id: z.string(),
  memoryId: z.string(),
  originalSize: z.number(),
  compressedSize: z.number(),
  compressionRatio: z.number(),
  compressionMethod: z.enum(["lossless", "lossy"]),
  timestamp: z.date(),
});

// ============================================================================
// MEMORY IMPORTANCE
// ============================================================================

export interface MemoryImportance {
  memoryId: string;
  importance: number; // 0-1
  factors: {
    frequency: number;
    recency: number;
    relevance: number;
    emotional: number;
    utility: number;
  };
  lastCalculated: Date;
}

export const MemoryImportanceSchema = z.object({
  memoryId: z.string(),
  importance: z.number(),
  factors: z.object({
    frequency: z.number(),
    recency: z.number(),
    relevance: z.number(),
    emotional: z.number(),
    utility: z.number(),
  }),
  lastCalculated: z.date(),
});

// ============================================================================
// MEMORY AGING
// ============================================================================

export interface MemoryAging {
  memoryId: string;
  age: number; // milliseconds
  decayRate: number; // 0-1
  currentImportance: number;
  lastAged: Date;
}

export const MemoryAgingSchema = z.object({
  memoryId: z.string(),
  age: z.number(),
  decayRate: z.number(),
  currentImportance: z.number(),
  lastAged: z.date(),
});

// ============================================================================
// MEMORY FORGETTING
// ============================================================================

export interface MemoryForgetting {
  memoryId: string;
  forgettingCurve: number; // 0-1
  retentionProbability: number; // 0-1
  timeSinceLastAccess: number; // milliseconds
  estimatedForgetTime: Date;
}

export const MemoryForgettingSchema = z.object({
  memoryId: z.string(),
  forgettingCurve: z.number(),
  retentionProbability: z.number(),
  timeSinceLastAccess: z.number(),
  estimatedForgetTime: z.date(),
});

// ============================================================================
// MEMORY RECALL
// ============================================================================

export interface MemoryRecall {
  memoryId: string;
  recallSuccess: boolean;
  recallTime: number; // milliseconds
  recallAccuracy: number; // 0-1
  context: Record<string, unknown>;
  timestamp: Date;
}

export const MemoryRecallSchema = z.object({
  memoryId: z.string(),
  recallSuccess: z.boolean(),
  recallTime: z.number(),
  recallAccuracy: z.number(),
  context: z.record(z.string(), z.unknown()),
  timestamp: z.date(),
});

// ============================================================================
// MEMORY SEARCH
// ============================================================================

export interface MemorySearch {
  query: string;
  memoryType: MemoryType | null;
  filters: Record<string, unknown>;
  results: MemoryEntry[];
  totalResults: number;
  searchTime: number; // milliseconds
  timestamp: Date;
}

export const MemorySearchSchema = z.object({
  query: z.string(),
  memoryType: z.enum(["short_term", "working", "session", "long_term", "semantic", "procedural", "episodic", "emotional", "behavior", "preference", "career", "interview", "learning", "reflection"]).nullable(),
  filters: z.record(z.string(), z.unknown()),
  results: z.array(z.lazy(() => MemoryEntrySchema)),
  totalResults: z.number(),
  searchTime: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// MEMORY ASSOCIATION
// ============================================================================

export interface MemoryAssociation {
  sourceMemoryId: string;
  targetMemoryId: string;
  associationStrength: number; // 0-1
  associationType: "semantic" | "temporal" | "causal" | "spatial" | "emotional";
  createdAt: Date;
  lastAccessed: Date;
}

export const MemoryAssociationSchema = z.object({
  sourceMemoryId: z.string(),
  targetMemoryId: z.string(),
  associationStrength: z.number(),
  associationType: z.enum(["semantic", "temporal", "causal", "spatial", "emotional"]),
  createdAt: z.date(),
  lastAccessed: z.date(),
});

// ============================================================================
// MEMORY LINK
// ============================================================================

export interface MemoryLink {
  id: string;
  sourceMemoryId: string;
  targetMemoryId: string;
  linkType: string;
  weight: number; // 0-1
  bidirectional: boolean;
  createdAt: Date;
}

export const MemoryLinkSchema = z.object({
  id: z.string(),
  sourceMemoryId: z.string(),
  targetMemoryId: z.string(),
  linkType: z.string(),
  weight: z.number(),
  bidirectional: z.boolean(),
  createdAt: z.date(),
});

// ============================================================================
// HIERARCHICAL MEMORY CONFIG
// ============================================================================

export interface HierarchicalMemoryConfig {
  shortTermCapacity: number;
  workingMemoryCapacity: number;
  longTermCapacity: number;
  consolidationInterval: number; // milliseconds
  agingInterval: number; // milliseconds
  forgettingCurveDecay: number; // 0-1
  importanceThreshold: number; // 0-1
  enableCompression: boolean;
  enableAging: boolean;
  enableForgetting: boolean;
  enableAssociations: boolean;
}

export const HierarchicalMemoryConfigSchema = z.object({
  shortTermCapacity: z.number(),
  workingMemoryCapacity: z.number(),
  longTermCapacity: z.number(),
  consolidationInterval: z.number(),
  agingInterval: z.number(),
  forgettingCurveDecay: z.number(),
  importanceThreshold: z.number(),
  enableCompression: z.boolean(),
  enableAging: z.boolean(),
  enableForgetting: z.boolean(),
  enableAssociations: z.boolean(),
});

export const defaultHierarchicalMemoryConfig: HierarchicalMemoryConfig = {
  shortTermCapacity: 100,
  workingMemoryCapacity: 50,
  longTermCapacity: 10000,
  consolidationInterval: 3600000, // 1 hour
  agingInterval: 86400000, // 24 hours
  forgettingCurveDecay: 0.1,
  importanceThreshold: 0.3,
  enableCompression: true,
  enableAging: true,
  enableForgetting: true,
  enableAssociations: true,
};
