/**
 * Multi-Agent Collaboration Interfaces
 * Communication between AI agents
 */

import { z } from "zod";

// ============================================================================
// AGENT EVENT TYPE
// ============================================================================

export type AgentEventType = 
  | "emit"
  | "consume"
  | "respond"
  | "propose"
  | "contest"
  | "request_info"
  | "wait_response"
  | "publish_result";

// ============================================================================
// AGENT EVENT
// ============================================================================

export interface AgentEvent {
  id: string;
  sourceAgentId: string;
  targetAgentId: string | null;
  type: AgentEventType;
  payload: Record<string, unknown>;
  timestamp: Date;
  priority: number; // 0-100
  ttl: number; // milliseconds
}

export const AgentEventSchema = z.object({
  id: z.string(),
  sourceAgentId: z.string(),
  targetAgentId: z.string().nullable(),
  type: z.enum(["emit", "consume", "respond", "propose", "contest", "request_info", "wait_response", "publish_result"]),
  payload: z.record(z.string(), z.unknown()),
  timestamp: z.date(),
  priority: z.number(),
  ttl: z.number(),
});

// ============================================================================
// AGENT CAPABILITY
// ============================================================================

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
  cost: number;
  latency: number; // milliseconds
  reliability: number; // 0-1
}

export const AgentCapabilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  inputTypes: z.array(z.string()),
  outputTypes: z.array(z.string()),
  cost: z.number(),
  latency: z.number(),
  reliability: z.number(),
});

// ============================================================================
// AGENT CONTEXT
// ============================================================================

export interface AgentContext {
  agentId: string;
  state: Record<string, unknown>;
  memory: Map<string, unknown>;
  activeTasks: string[];
  pendingEvents: string[];
  lastActivity: Date;
}

export const AgentContextSchema = z.object({
  agentId: z.string(),
  state: z.record(z.string(), z.unknown()),
  memory: z.any(), // Map serialization handled separately
  activeTasks: z.array(z.string()),
  pendingEvents: z.array(z.string()),
  lastActivity: z.date(),
});

// ============================================================================
// AGENT MEMORY
// ============================================================================

export interface AgentMemory {
  agentId: string;
  shortTerm: Map<string, unknown>;
  longTerm: Map<string, unknown>;
  episodic: Map<string, unknown>;
  semantic: Map<string, unknown>;
  lastUpdated: Date;
}

export const AgentMemorySchema = z.object({
  agentId: z.string(),
  shortTerm: z.any(),
  longTerm: z.any(),
  episodic: z.any(),
  semantic: z.any(),
  lastUpdated: z.date(),
});

// ============================================================================
// AGENT CONVERSATION
// ============================================================================

export interface AgentConversation {
  id: string;
  participants: string[];
  events: AgentEvent[];
  startTime: Date;
  endTime: Date | null;
  status: "active" | "completed" | "failed";
  outcome: string | null;
}

export const AgentConversationSchema = z.object({
  id: z.string(),
  participants: z.array(z.string()),
  events: z.array(z.lazy(() => AgentEventSchema)),
  startTime: z.date(),
  endTime: z.date().nullable(),
  status: z.enum(["active", "completed", "failed"]),
  outcome: z.string().nullable(),
});

// ============================================================================
// AGENT PRIORITY
// ============================================================================

export interface AgentPriority {
  agentId: string;
  priority: number; // 0-100
  factors: {
    confidence: number;
    cost: number;
    roi: number;
    urgency: number;
    impact: number;
    history: number;
  };
  lastUpdated: Date;
}

export const AgentPrioritySchema = z.object({
  agentId: z.string(),
  priority: z.number(),
  factors: z.object({
    confidence: z.number(),
    cost: z.number(),
    roi: z.number(),
    urgency: z.number(),
    impact: z.number(),
    history: z.number(),
  }),
  lastUpdated: z.date(),
});

// ============================================================================
// CONFLICT RESOLUTION
// ============================================================================

export interface ConflictResolution {
  id: string;
  conflictId: string;
  conflictingAgents: string[];
  conflictingActions: string[];
  resolutionStrategy: "priority" | "consensus" | "arbitration" | "compromise";
  resolution: string;
  confidence: number; // 0-1
  timestamp: Date;
}

export const ConflictResolutionSchema = z.object({
  id: z.string(),
  conflictId: z.string(),
  conflictingAgents: z.array(z.string()),
  conflictingActions: z.array(z.string()),
  resolutionStrategy: z.enum(["priority", "consensus", "arbitration", "compromise"]),
  resolution: z.string(),
  confidence: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// CONSENSUS RESULT
// ============================================================================

export interface ConsensusResult {
  id: string;
  proposalId: string;
  participants: string[];
  votes: Map<string, number>; // agentId -> vote (0-100)
  weightedVote: number; // 0-100
  factors: {
    confidence: number;
    cost: number;
    roi: number;
    urgency: number;
    impact: number;
    history: number;
  };
  decision: "approve" | "reject" | "defer";
  confidence: number; // 0-1
  timestamp: Date;
}

export const ConsensusResultSchema = z.object({
  id: z.string(),
  proposalId: z.string(),
  participants: z.array(z.string()),
  votes: z.any(), // Map serialization handled separately
  weightedVote: z.number(),
  factors: z.object({
    confidence: z.number(),
    cost: z.number(),
    roi: z.number(),
    urgency: z.number(),
    impact: z.number(),
    history: z.number(),
  }),
  decision: z.enum(["approve", "reject", "defer"]),
  confidence: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// MULTI-AGENT CONFIG
// ============================================================================

export interface MultiAgentConfig {
  maxConcurrentConversations: number;
  eventTTL: number; // milliseconds
  priorityUpdateInterval: number; // milliseconds
  enableConflictResolution: boolean;
  enableConsensus: boolean;
  consensusThreshold: number; // 0-100
  enableEventCaching: boolean;
  cacheDuration: number; // minutes
}

export const MultiAgentConfigSchema = z.object({
  maxConcurrentConversations: z.number(),
  eventTTL: z.number(),
  priorityUpdateInterval: z.number(),
  enableConflictResolution: z.boolean(),
  enableConsensus: z.boolean(),
  consensusThreshold: z.number(),
  enableEventCaching: z.boolean(),
  cacheDuration: z.number(),
});

export const defaultMultiAgentConfig: MultiAgentConfig = {
  maxConcurrentConversations: 10,
  eventTTL: 60000,
  priorityUpdateInterval: 5000,
  enableConflictResolution: true,
  enableConsensus: true,
  consensusThreshold: 70,
  enableEventCaching: true,
  cacheDuration: 30,
};
