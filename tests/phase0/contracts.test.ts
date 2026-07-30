import { describe, it, expect } from "vitest";
import { z } from "zod";

// Import all contracts using relative paths
import { BaseEvent } from "../../apps/web/src/lib/ai/contracts/Event";
import { Fact, FactSchema, FactType, FactTypeSchema } from "../../apps/web/src/domain/cognitive/Fact";
import { Snapshot, SnapshotSchema } from "../../apps/web/src/domain/cognitive/Snapshot";
import { InvestigationContext, InvestigationContextSchema } from "../../apps/web/src/domain/cognitive/InvestigationContext";
import { RuntimeContext, RuntimeContextSchema } from "../../apps/web/src/lib/ai/contracts/RuntimeContext";
import { EngineCapability, EngineCapabilityMetadataSchema } from "../../apps/web/src/lib/ai/contracts/EngineCapability";
import { EventMetadata, EventMetadataSchema } from "../../apps/web/src/lib/ai/contracts/EventMetadata";
import { SnapshotMetadata, SnapshotMetadataSchema } from "../../apps/web/src/domain/cognitive/SnapshotMetadata";
import { PromptDefinition, PromptDefinitionSchema } from "../../apps/web/src/lib/ai/contracts/PromptDefinition";
import {
  StructuredLLMProvider,
  GenerateObjectParams,
  GenerateObjectResult,
  GenerateTextParams,
  GenerateTextResult,
  TextChunk,
} from "../../apps/web/src/lib/ai/contracts/LLMProvider";
import {
  CognitiveQuery,
  CognitiveQuerySchema,
  QueryResult,
  QueryResultSchema,
  QueryType,
  QueryTypeSchema,
  QueryFilter,
  QueryFilterSchema,
  QuerySort,
  QuerySortSchema,
  QueryMetadata,
  QueryMetadataSchema,
} from "../../apps/web/src/domain/cognitive/QueryInterfaces";

describe("Phase 0 - Contracts Validation", () => {
  describe("Event Contract", () => {
    it("should define BaseEvent interface", () => {
      const event: BaseEvent = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        sessionId: "session-123",
        sequence: 1,
        engine: "TestEngine",
        eventType: "TEST_EVENT",
        engineVersion: "1.0.0",
        payload: { test: "data" },
        createdAt: new Date(),
      };
      expect(event).toBeDefined();
      expect(event.id).toBe("123e4567-e89b-12d3-a456-426614174000");
    });
  });

  describe("Fact Contract", () => {
    it("should define Fact interface", () => {
      const fact: Fact = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        type: FactType.OBSERVATION,
        content: "Test fact content",
        confidence: 0.8,
        source: "test-source",
        timestamp: new Date(),
      };
      expect(fact).toBeDefined();
      expect(fact.type).toBe(FactType.OBSERVATION);
    });

    it("should validate Fact with Zod schema", () => {
      const fact = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        type: FactType.OBSERVATION,
        content: "Test fact content",
        confidence: 0.8,
        source: "test-source",
        timestamp: new Date(),
      };
      const result = FactSchema.safeParse(fact);
      expect(result.success).toBe(true);
    });

    it("should reject invalid Fact with Zod schema", () => {
      const fact = {
        id: "invalid-uuid",
        type: "INVALID_TYPE",
        content: "",
        confidence: 1.5, // Invalid: > 1
        source: "",
        timestamp: "invalid-date",
      };
      const result = FactSchema.safeParse(fact);
      expect(result.success).toBe(false);
    });
  });

  describe("Snapshot Contract", () => {
    it("should define Snapshot interface", () => {
      const snapshot: Snapshot = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        sessionId: "session-123",
        timestamp: new Date(),
        sequence: 1,
        cognitiveState: {} as any,
        decisionGraph: {} as any,
        metadata: {} as any,
      };
      expect(snapshot).toBeDefined();
      expect(snapshot.sequence).toBe(1);
    });

    it("should validate Snapshot with Zod schema", () => {
      const snapshot = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        sessionId: "session-123",
        timestamp: new Date(),
        sequence: 1,
        cognitiveState: {},
        decisionGraph: {
          nodes: {},
          edges: {},
          root: null,
        },
        metadata: {
          snapshotId: "123e4567-e89b-12d3-a456-426614174000",
          sessionId: "session-123",
          sequence: 1,
          timestamp: new Date(),
          eventCount: 10,
          checksum: "abc123",
        },
      };
      const result = SnapshotSchema.safeParse(snapshot);
      expect(result.success).toBe(true);
    });
  });

  describe("InvestigationContext Contract", () => {
    it("should define InvestigationContext interface", () => {
      const context: InvestigationContext = {
        sessionId: "session-123",
        candidateId: "candidate-456",
        interviewId: "interview-789",
        startTime: new Date(),
        metadata: {},
        constraints: {
          maxTurns: 10,
          maxDuration: 60,
          maxTokens: 10000,
          allowedTopics: ["leadership", "technical"],
          forbiddenTopics: ["salary"],
        },
        goals: [],
      };
      expect(context).toBeDefined();
      expect(context.constraints.maxTurns).toBe(10);
    });

    it("should validate InvestigationContext with Zod schema", () => {
      const context = {
        sessionId: "session-123",
        candidateId: "candidate-456",
        interviewId: "interview-789",
        startTime: new Date(),
        metadata: {},
        constraints: {
          maxTurns: 10,
          maxDuration: 60,
          maxTokens: 10000,
          allowedTopics: ["leadership"],
          forbiddenTopics: [],
        },
        goals: [],
      };
      const result = InvestigationContextSchema.safeParse(context);
      expect(result.success).toBe(true);
    });
  });

  describe("RuntimeContext Contract", () => {
    it("should define RuntimeContext interface", () => {
      const context: RuntimeContext = {
        sessionId: "session-123",
        startTime: new Date(),
        configuration: {
          maxConcurrentEngines: 5,
          timeoutMs: 30000,
          retryAttempts: 3,
          enableTelemetry: true,
          enableFeatureFlags: true,
        },
        capabilities: [],
      };
      expect(context).toBeDefined();
      expect(context.configuration.maxConcurrentEngines).toBe(5);
    });

    it("should validate RuntimeContext with Zod schema", () => {
      const context = {
        sessionId: "session-123",
        startTime: new Date(),
        configuration: {
          maxConcurrentEngines: 5,
          timeoutMs: 30000,
          retryAttempts: 3,
          enableTelemetry: true,
          enableFeatureFlags: true,
        },
        capabilities: [],
      };
      const result = RuntimeContextSchema.safeParse(context);
      expect(result.success).toBe(true);
    });
  });

  describe("EngineCapability Contract", () => {
    it("should define EngineCapability interface", () => {
      const testSchema = z.object({});
      const capability: EngineCapability = {
        engineName: "TestEngine",
        version: "1.0.0",
        inputSchema: testSchema,
        outputSchema: testSchema,
        requiredContext: [],
        providedEvents: [],
        maxConcurrency: 1,
        estimatedTokens: 100,
      };
      expect(capability).toBeDefined();
      expect(capability.engineName).toBe("TestEngine");
    });

    it("should validate EngineCapability metadata with Zod schema", () => {
      const capability = {
        engineName: "TestEngine",
        version: "1.0.0",
        requiredContext: [],
        providedEvents: [],
        maxConcurrency: 1,
        estimatedTokens: 100,
      };
      const result = EngineCapabilityMetadataSchema.safeParse(capability);
      expect(result.success).toBe(true);
    });
  });

  describe("EventMetadata Contract", () => {
    it("should define EventMetadata interface", () => {
      const metadata: EventMetadata = {
        eventId: "123e4567-e89b-12d3-a456-426614174000",
        sessionId: "session-123",
        sequence: 1,
        timestamp: new Date(),
        source: "TestEngine",
        causalityId: "123e4567-e89b-12d3-a456-426614174001",
        correlationId: "123e4567-e89b-12d3-a456-426614174002",
        tags: ["test", "metadata"],
      };
      expect(metadata).toBeDefined();
      expect(metadata.sequence).toBe(1);
    });

    it("should validate EventMetadata with Zod schema", () => {
      const metadata = {
        eventId: "123e4567-e89b-12d3-a456-426614174000",
        sessionId: "session-123",
        sequence: 1,
        timestamp: new Date(),
        source: "TestEngine",
        tags: [],
      };
      const result = EventMetadataSchema.safeParse(metadata);
      expect(result.success).toBe(true);
    });
  });

  describe("SnapshotMetadata Contract", () => {
    it("should define SnapshotMetadata interface", () => {
      const metadata: SnapshotMetadata = {
        snapshotId: "123e4567-e89b-12d3-a456-426614174000",
        sessionId: "session-123",
        sequence: 1,
        timestamp: new Date(),
        eventCount: 10,
        checksum: "abc123",
      };
      expect(metadata).toBeDefined();
      expect(metadata.eventCount).toBe(10);
    });

    it("should validate SnapshotMetadata with Zod schema", () => {
      const metadata = {
        snapshotId: "123e4567-e89b-12d3-a456-426614174000",
        sessionId: "session-123",
        sequence: 1,
        timestamp: new Date(),
        eventCount: 10,
        checksum: "abc123",
      };
      const result = SnapshotMetadataSchema.safeParse(metadata);
      expect(result.success).toBe(true);
    });
  });

  describe("PromptDefinition Contract", () => {
    it("should define PromptDefinition interface", () => {
      const definition: PromptDefinition = {
        key: "test-prompt",
        system: "You are a helpful assistant",
        template: "Hello {name}",
        variables: {
          name: {
            name: "name",
            type: "string",
            required: true,
            description: "User name",
          },
        },
        version: "1.0.0",
      };
      expect(definition).toBeDefined();
      expect(definition.key).toBe("test-prompt");
    });

    it("should validate PromptDefinition with Zod schema", () => {
      const definition = {
        key: "test-prompt",
        system: "You are a helpful assistant",
        template: "Hello {name}",
        variables: {
          name: {
            name: "name",
            type: "string",
            required: true,
            description: "User name",
          },
        },
        version: "1.0.0",
      };
      const result = PromptDefinitionSchema.safeParse(definition);
      expect(result.success).toBe(true);
    });
  });

  describe("LLMProvider Contract", () => {
    it("should define TextChunk interface", () => {
      const chunk: TextChunk = {
        content: "Hello",
        isComplete: false,
      };
      expect(chunk).toBeDefined();
      expect(chunk.isComplete).toBe(false);
    });

    it("should define GenerateObjectParams interface", () => {
      const testSchema = z.object({});
      const params: GenerateObjectParams<any> = {
        system: "You are a helpful assistant",
        prompt: "Extract information",
        schema: testSchema as any,
        schemaName: "TestSchema",
        schemaDescription: "Test schema",
      };
      expect(params).toBeDefined();
      expect(params.system).toBe("You are a helpful assistant");
    });

    it("should define GenerateObjectResult interface", () => {
      const result: GenerateObjectResult<any> = {
        object: {},
        usage: {
          promptTokens: 10,
          completionTokens: 20,
          totalTokens: 30,
        },
      };
      expect(result).toBeDefined();
      expect(result.usage.totalTokens).toBe(30);
    });

    it("should define GenerateTextParams interface", () => {
      const params: GenerateTextParams = {
        system: "You are a helpful assistant",
        prompt: "Generate text",
        maxTokens: 100,
        temperature: 0.7,
      };
      expect(params).toBeDefined();
      expect(params.maxTokens).toBe(100);
    });

    it("should define GenerateTextResult interface", () => {
      const result: GenerateTextResult = {
        text: "Generated text",
        usage: {
          promptTokens: 10,
          completionTokens: 20,
          totalTokens: 30,
        },
      };
      expect(result).toBeDefined();
      expect(result.text).toBe("Generated text");
    });

    it("should define StructuredLLMProvider interface", () => {
      const provider: StructuredLLMProvider = {
        generateObject: async () => ({
          object: {} as any,
          usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
        }),
        generateText: async () => ({
          text: "Generated text",
          usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
        }),
        streamText: async function* () {
          yield { content: "Chunk", isComplete: false };
        },
      };
      expect(provider).toBeDefined();
      expect(typeof provider.generateObject).toBe("function");
    });
  });

  describe("QueryInterfaces Contract", () => {
    it("should define QueryType enum", () => {
      expect(QueryType.STATE).toBe("STATE");
      expect(QueryType.HISTORY).toBe("HISTORY");
      expect(QueryType.DECISION).toBe("DECISION");
      expect(QueryType.EVIDENCE).toBe("EVIDENCE");
      expect(QueryType.HYPOTHESIS).toBe("HYPOTHESIS");
    });

    it("should validate QueryType with Zod schema", () => {
      const result = QueryTypeSchema.safeParse(QueryType.STATE);
      expect(result.success).toBe(true);
    });

    it("should define QueryFilter interface", () => {
      const filter: QueryFilter = {
        field: "confidence",
        operator: "gt",
        value: 0.5,
      };
      expect(filter).toBeDefined();
      expect(filter.operator).toBe("gt");
    });

    it("should validate QueryFilter with Zod schema", () => {
      const filter = {
        field: "confidence",
        operator: "gt",
        value: 0.5,
      };
      const result = QueryFilterSchema.safeParse(filter);
      expect(result.success).toBe(true);
    });

    it("should define QuerySort interface", () => {
      const sort: QuerySort = {
        field: "timestamp",
        direction: "desc",
      };
      expect(sort).toBeDefined();
      expect(sort.direction).toBe("desc");
    });

    it("should validate QuerySort with Zod schema", () => {
      const sort = {
        field: "timestamp",
        direction: "desc",
      };
      const result = QuerySortSchema.safeParse(sort);
      expect(result.success).toBe(true);
    });

    it("should define CognitiveQuery interface", () => {
      const query: CognitiveQuery = {
        type: QueryType.STATE,
        filters: [],
        sort: { field: "timestamp", direction: "desc" },
        limit: 10,
        offset: 0,
      };
      expect(query).toBeDefined();
      expect(query.type).toBe(QueryType.STATE);
    });

    it("should validate CognitiveQuery with Zod schema", () => {
      const query = {
        type: QueryType.STATE,
        filters: [],
        sort: { field: "timestamp", direction: "desc" },
        limit: 10,
        offset: 0,
      };
      const result = CognitiveQuerySchema.safeParse(query);
      expect(result.success).toBe(true);
    });

    it("should define QueryMetadata interface", () => {
      const metadata: QueryMetadata = {
        total: 100,
        hasMore: true,
        executionTimeMs: 50,
      };
      expect(metadata).toBeDefined();
      expect(metadata.total).toBe(100);
    });

    it("should validate QueryMetadata with Zod schema", () => {
      const metadata = {
        total: 100,
        hasMore: true,
        executionTimeMs: 50,
      };
      const result = QueryMetadataSchema.safeParse(metadata);
      expect(result.success).toBe(true);
    });

    it("should define QueryResult interface", () => {
      const result: QueryResult<any> = {
        data: [],
        total: 0,
        metadata: {
          total: 0,
          hasMore: false,
          executionTimeMs: 0,
        },
      };
      expect(result).toBeDefined();
      expect(result.total).toBe(0);
    });

    it("should validate QueryResult with Zod schema", () => {
      const result = {
        data: [],
        total: 0,
        metadata: {
          total: 0,
          hasMore: false,
          executionTimeMs: 0,
        },
      };
      const parsedResult = QueryResultSchema.safeParse(result);
      expect(parsedResult.success).toBe(true);
    });
  });
});
