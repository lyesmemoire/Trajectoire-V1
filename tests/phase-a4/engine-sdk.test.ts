import { describe, it, expect, beforeEach } from "vitest";
import { BaseEngine, BaseEngineConfig } from "../../apps/web/src/lib/ai/engines/BaseEngine";
import { PromptRunner, PromptConfig } from "../../apps/web/src/lib/ai/engines/PromptRunner";
import { FactBuilder, Fact } from "../../apps/web/src/lib/ai/engines/FactBuilder";
import { EventFactory } from "../../apps/web/src/lib/ai/engines/EventFactory";
import { BaseEvent } from "../../apps/web/src/lib/ai/contracts/Event";
import { EngineInput } from "../../apps/web/src/lib/ai/contracts/Engine";
import { StructuredLLMProvider } from "../../apps/web/src/lib/ai/contracts/LLMProvider";
import { z } from "zod";

describe("Phase A.4 - Engine SDK Tests", () => {
  // Test BaseEngine
  describe("BaseEngine", () => {
    class TestEngine extends BaseEngine<{ value: string }, { message: string }, BaseEvent<{ result: string }>> {
      constructor() {
        super({
          name: "TestEngine",
          version: "1.0.0",
          schemaVersion: "1.0",
        });
      }

      protected async process(context: { value: string }, payload: { message: string }, sessionId: string): Promise<BaseEvent<{ result: string }>[]> {
        const event = this.createBaseEvent(sessionId, "TEST_EVENT", { result: payload.message });
        return [event];
      }
    }

    it("should create engine with correct metadata", () => {
      const engine = new TestEngine();
      expect(engine.name).toBe("TestEngine");
      expect(engine.version).toBe("1.0.0");
      expect(engine.schemaVersion).toBe("1.0");
    });

    it("should execute and return events", async () => {
      const engine = new TestEngine();
      const input: EngineInput<{ value: string }, { message: string }> = {
        sessionId: "test-session",
        context: { value: "test" },
        payload: { message: "Hello" },
      };

      const result = await engine.execute(input);
      expect(result.engine).toBe("TestEngine");
      expect(result.events.length).toBe(1);
      expect(result.events[0].eventType).toBe("TEST_EVENT");
    });
  });

  // Test FactBuilder
  describe("FactBuilder", () => {
    it("should create metric fact", () => {
      const fact = FactBuilder.metric({
        name: "response_time",
        value: 150,
        unit: "ms",
        source: "test",
        confidence: 0.9,
      });

      expect(fact.type).toBe("METRIC");
      expect(fact.data.name).toBe("response_time");
      expect(fact.data.value).toBe(150);
      expect(fact.data.unit).toBe("ms");
      expect(fact.confidence).toBe(0.9);
    });

    it("should create entity fact", () => {
      const fact = FactBuilder.entity({
        name: "John Doe",
        type: "PERSON",
        attributes: { age: 30, location: "Paris" },
        source: "test",
      });

      expect(fact.type).toBe("ENTITY");
      expect(fact.data.name).toBe("John Doe");
      expect(fact.data.entityType).toBe("PERSON");
      expect(fact.data.attributes.age).toBe(30);
    });

    it("should create claim fact", () => {
      const fact = FactBuilder.claim({
        statement: "Candidate has 5 years of experience",
        evidence: ["resume", "interview"],
        source: "test",
        confidence: 0.8,
      });

      expect(fact.type).toBe("CLAIM");
      expect(fact.data.statement).toBe("Candidate has 5 years of experience");
      expect(fact.data.evidence).toEqual(["resume", "interview"]);
    });

    it("should create timeline fact", () => {
      const timestamp = new Date("2024-01-01");
      const fact = FactBuilder.timeline({
        timestamp,
        event: "Interview started",
        description: "Initial interview session",
        source: "test",
      });

      expect(fact.type).toBe("TIMELINE");
      expect(fact.data.timestamp).toEqual(timestamp);
      expect(fact.data.event).toBe("Interview started");
    });

    it("should create observation fact", () => {
      const fact = FactBuilder.observation({
        content: "Candidate appeared nervous",
        category: "behavior",
        source: "test",
      });

      expect(fact.type).toBe("OBSERVATION");
      expect(fact.data.content).toBe("Candidate appeared nervous");
      expect(fact.data.category).toBe("behavior");
    });
  });

  // Test EventFactory
  describe("EventFactory", () => {
    it("should create observation extracted event", () => {
      const event = EventFactory.createObservationExtractedEvent({
        sessionId: "test-session",
        engine: "TestEngine",
        engineVersion: "1.0.0",
        observations: ["obs1", "obs2"],
      });

      expect(event.eventType).toBe("OBSERVATION_EXTRACTED");
      expect(event.payload.observations).toEqual(["obs1", "obs2"]);
      expect(event.sessionId).toBe("test-session");
    });

    it("should create fact extracted event", () => {
      const facts = [{ type: "METRIC", data: {} }];
      const event = EventFactory.createFactExtractedEvent({
        sessionId: "test-session",
        engine: "TestEngine",
        engineVersion: "1.0.0",
        facts,
      });

      expect(event.eventType).toBe("FACT_EXTRACTED");
      expect(event.payload.facts).toEqual(facts);
    });

    it("should create normalized event", () => {
      const event = EventFactory.createNormalizedEvent({
        sessionId: "test-session",
        engine: "TestEngine",
        engineVersion: "1.0.0",
        normalizedText: "Normalized text",
      });

      expect(event.eventType).toBe("TEXT_NORMALIZED");
      expect(event.payload.normalizedText).toBe("Normalized text");
    });

    it("should create identity extracted event", () => {
      const identity = { name: "John Doe", email: "john@example.com" };
      const event = EventFactory.createIdentityExtractedEvent({
        sessionId: "test-session",
        engine: "TestEngine",
        engineVersion: "1.0.0",
        identity,
      });

      expect(event.eventType).toBe("IDENTITY_EXTRACTED");
      expect(event.payload.identity).toEqual(identity);
    });

    it("should create evidence extracted event", () => {
      const evidences = [{ type: "CLAIM", data: {} }];
      const event = EventFactory.createEvidenceExtractedEvent({
        sessionId: "test-session",
        engine: "TestEngine",
        engineVersion: "1.0.0",
        evidences,
      });

      expect(event.eventType).toBe("EVIDENCE_EXTRACTED");
      expect(event.payload.evidences).toEqual(evidences);
    });
  });

  // Test PromptRunner
  describe("PromptRunner", () => {
    it("should create prompt runner", () => {
      const mockProvider = {
        generateObject: async () => ({ object: {}, usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 } }),
        generateText: async () => ({ text: "", usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 } }),
        streamText: async function* () {},
      } as StructuredLLMProvider;

      const runner = new PromptRunner(mockProvider);
      expect(runner).toBeDefined();
    });

    it("should run prompt successfully", async () => {
      const mockProvider = {
        generateObject: async () => ({ object: { result: "success" }, usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 } }),
        generateText: async () => ({ text: "", usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 } }),
        streamText: async function* () {},
      } as StructuredLLMProvider;

      const runner = new PromptRunner(mockProvider);
      const config: PromptConfig<{ result: string }> = {
        system: "You are a helpful assistant",
        prompt: "Test prompt",
        schema: z.object({ result: z.string() }),
        schemaName: "TestSchema",
        schemaDescription: "Test schema",
      };

      const result = await runner.run(config);
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ result: "success" });
      expect(result.tokens?.total).toBe(30);
    });

    it("should handle retries on failure", async () => {
      let attempts = 0;
      const mockProvider = {
        generateObject: async () => {
          attempts++;
          if (attempts < 2) throw new Error("Temporary failure");
          return { object: { result: "success" }, usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 } };
        },
        generateText: async () => ({ text: "", usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 } }),
        streamText: async function* () {},
      } as StructuredLLMProvider;

      const runner = new PromptRunner(mockProvider);
      const config: PromptConfig<{ result: string }> = {
        system: "You are a helpful assistant",
        prompt: "Test prompt",
        schema: z.object({ result: z.string() }),
        schemaName: "TestSchema",
        schemaDescription: "Test schema",
        maxRetries: 3,
      };

      const result = await runner.run(config);
      expect(result.success).toBe(true);
      expect(result.retries).toBe(1);
    });
  });
});
