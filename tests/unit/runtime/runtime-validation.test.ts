/**
 * Runtime Validation Test
 * 
 * Validates RuntimeContext, ExecutionPipeline, EventPublisher, BrainContextBuilder, MetricsAdapter.
 * Run with: pnpm test tests/unit/runtime/runtime-validation.test.ts
 */

import { describe, it, expect, vi } from "vitest";
import { RuntimeContext } from "../../../lib/intelligence-runtime/domain/context/RuntimeContext";
import { RuntimeContainer } from "../../../lib/intelligence-runtime/composition/runtime-container";
import { EventPublisher } from "../../../lib/intelligence-runtime/application/EventPublisher";
import { BrainContextBuilder } from "../../../lib/intelligence-core/application/BrainContextBuilder";
import { MetricsAdapter } from "../../../lib/intelligence-runtime/application/MetricsAdapter";

// Mock dependencies
vi.mock("../../../lib/env.server", () => ({
  validateEnv: () => {},
}));

describe("Runtime Validation", () => {
  describe("RuntimeContext", () => {
    it("should create context with data", () => {
      const context = new RuntimeContext();
      context.set("test", "value");
      context.set("number", 123);

      expect(context).toBeDefined();
      expect(context.get("test")).toBe("value");
      expect(context.get("number")).toBe(123);
    });

    it("should set and get context data", () => {
      const context = new RuntimeContext();
      
      context.set("key1", "value1");
      context.set("key2", 123);

      expect(context.get("key1")).toBe("value1");
      expect(context.get("key2")).toBe(123);
    });

    it("should check if key exists", () => {
      const context = new RuntimeContext();
      
      context.set("existing", "value");

      expect(context.has("existing")).toBe(true);
      expect(context.has("nonexistent")).toBe(false);
    });

    it("should clear all context data", () => {
      const context = new RuntimeContext();
      
      context.set("key1", "value1");
      context.set("key2", "value2");

      expect(context.has("key1")).toBe(true);
      expect(context.has("key2")).toBe(true);
      
      context.clear();
      expect(context.has("key1")).toBe(false);
      expect(context.has("key2")).toBe(false);
    });

    it("should create child context", () => {
      const parent = new RuntimeContext();
      parent.set("parentKey", "parentValue");
      
      const child = parent.child();
      expect(child).toBeDefined();
      expect(child.get("parentKey")).toBe("parentValue");
    });

    it("should get context keys", () => {
      const context = new RuntimeContext();
      
      context.set("key1", "value1");
      context.set("key2", "value2");

      const keys = context.keys();
      expect(keys).toContain("key1");
      expect(keys).toContain("key2");
    });

    it("should get context size", () => {
      const context = new RuntimeContext();
      
      context.set("key1", "value1");
      context.set("key2", "value2");

      expect(context.size()).toBe(2);
    });

    it("should check if context is empty", () => {
      const context = new RuntimeContext();
      
      expect(context.isEmpty()).toBe(true);
      
      context.set("key", "value");
      expect(context.isEmpty()).toBe(false);
    });
  });

  describe("RuntimeContainer", () => {
    it("should create RuntimeContainer instance", () => {
      const container = new RuntimeContainer();
      expect(container).toBeDefined();
    });

    it("should provide ContextBuilder", () => {
      const container = new RuntimeContainer();
      const contextBuilder = container.getContextBuilder();
      expect(contextBuilder).toBeDefined();
    });

    it("should provide DependencyManager", () => {
      const container = new RuntimeContainer();
      const dependencyManager = container.getDependencyManager();
      expect(dependencyManager).toBeDefined();
    });

    it("should provide EventPublisher", () => {
      const container = new RuntimeContainer();
      const eventPublisher = container.getEventPublisher();
      expect(eventPublisher).toBeDefined();
    });

    it("should provide ExecutionPipeline", () => {
      const container = new RuntimeContainer();
      const executionPipeline = container.getExecutionPipeline();
      expect(executionPipeline).toBeDefined();
    });
  });

  describe("EventPublisher", () => {
    it("should create EventPublisher instance", () => {
      const publisher = new EventPublisher();
      expect(publisher).toBeDefined();
    });

    it("should publish event", async () => {
      const publisher = new EventPublisher();
      
      const payload = { message: "test" };

      await publisher.publish("test", payload);
      
      // Should not throw
      expect(true).toBe(true);
    });

    it("should subscribe to events", async () => {
      const publisher = new EventPublisher();
      
      const handler = vi.fn();
      publisher.subscribe("test", handler);
      
      const payload = { message: "test" };

      await publisher.publish("test", payload);
      
      expect(handler).toHaveBeenCalled();
    });

    it("should unsubscribe from events", async () => {
      const publisher = new EventPublisher();
      
      const handler = vi.fn();
      const unsubscribe = publisher.subscribe("test", handler);
      
      unsubscribe();
      
      const payload = { message: "test" };

      await publisher.publish("test", payload);
      
      expect(handler).not.toHaveBeenCalled();
    });

    it("should get event history", async () => {
      const publisher = new EventPublisher();
      
      const payload = { message: "test" };

      await publisher.publish("test", payload);
      
      const history = publisher.getHistory();
      expect(history.length).toBeGreaterThan(0);
    });
  });

  describe("BrainContextBuilder", () => {
    it("should create BrainContextBuilder instance", () => {
      const builder = new BrainContextBuilder();
      expect(builder).toBeDefined();
    });

    it("should build context from brain data", () => {
      const brainData = {
        insights: [{ description: "Test insight" }],
        observations: [{ type: "test", source: "engine", data: { test: "value" } }],
        patterns: { patterns: [{ pattern: "test pattern", category: "test" }] },
        goals: [{ status: "in_progress", description: "Test goal" }],
      };

      const context = BrainContextBuilder.buildContext(brainData);
      expect(context).toBeDefined();
      expect(context.candidateProfile).toBeDefined();
      expect(context.historicalObservations).toBeDefined();
      expect(context.currentGoals).toBeDefined();
      expect(context.recentInsights).toBeDefined();
      expect(context.engineContext).toBeDefined();
    });

    it("should handle missing brain data gracefully", () => {
      const brainData = {
        insights: [],
        observations: [],
        patterns: { patterns: [] },
        goals: [],
      };

      const context = BrainContextBuilder.buildContext(brainData);
      expect(context).toBeDefined();
    });

    it("should build engine context with custom variables", () => {
      const brainData = {
        insights: [],
        observations: [],
        patterns: { patterns: [] },
        goals: [],
      };

      const customVariables = { customVar: "custom value" };

      const context = BrainContextBuilder.buildEngineContext(brainData, customVariables);
      expect(context).toBeDefined();
      expect(context.engineContext?.customVar).toBe("custom value");
    });
  });

  describe("MetricsAdapter", () => {
    it("should create MetricsAdapter instance", () => {
      const adapter = new MetricsAdapter();
      expect(adapter).toBeDefined();
    });

    it("should adapt metrics from IntelligenceMetadata", () => {
      const metadata = {
        latency: 1000,
        tokenUsage: {
          promptTokens: 50,
          completionTokens: 50,
          totalTokens: 100,
        },
        cost: 0.01,
      };

      const metrics = MetricsAdapter.adaptMetrics(metadata);
      expect(metrics).toBeDefined();
      expect(metrics.latency).toBe(1000);
      expect(metrics.tokens.prompt).toBe(50);
      expect(metrics.tokens.completion).toBe(50);
      expect(metrics.tokens.total).toBe(100);
      expect(metrics.cost).toBe(0.01);
    });

    it("should handle undefined metadata with defaults", () => {
      const metrics = MetricsAdapter.adaptMetrics(undefined);
      expect(metrics).toBeDefined();
      expect(metrics.latency).toBe(0);
      expect(metrics.tokens.prompt).toBe(0);
      expect(metrics.tokens.completion).toBe(0);
      expect(metrics.tokens.total).toBe(0);
      expect(metrics.cost).toBe(0);
    });

    it("should create history entry", () => {
      const metadata = {
        latency: 1000,
        tokenUsage: {
          promptTokens: 50,
          completionTokens: 50,
          totalTokens: 100,
        },
        cost: 0.01,
      };

      const entry = MetricsAdapter.createHistoryEntry(
        "test-prompt",
        "v1",
        { input: "test" },
        { output: "result" },
        metadata,
        "success"
      );

      expect(entry).toBeDefined();
      expect(entry.promptId).toBe("test-prompt");
      expect(entry.promptVersion).toBe("v1");
      expect(entry.status).toBe("success");
      expect(entry.metrics).toBeDefined();
    });

    it("should create simplified history entry", () => {
      const entry = MetricsAdapter.createSimplifiedHistoryEntry(
        "test-prompt",
        "v1",
        { input: "test" },
        { output: "result" },
        "success"
      );

      expect(entry).toBeDefined();
      expect(entry.promptId).toBe("test-prompt");
      expect(entry.metrics.latency).toBe(0);
      expect(entry.metrics.cost).toBe(0);
    });

    it("should validate metrics", () => {
      const metrics = {
        latency: 1000,
        tokens: {
          prompt: 50,
          completion: 50,
          total: 100,
        },
        cost: 0.01,
        retryCount: 0,
      };

      const isValid = MetricsAdapter.validateMetrics(metrics);
      expect(isValid).toBe(true);
    });

    it("should calculate total cost", () => {
      const metrics = {
        latency: 1000,
        tokens: {
          prompt: 50,
          completion: 50,
          total: 100,
        },
        cost: 0.01,
        retryCount: 0,
      };

      const totalCost = MetricsAdapter.calculateTotalCost(metrics);
      expect(totalCost).toBe(0.01);
    });

    it("should calculate total tokens", () => {
      const metrics = {
        latency: 1000,
        tokens: {
          prompt: 50,
          completion: 50,
          total: 100,
        },
        cost: 0.01,
        retryCount: 0,
      };

      const totalTokens = MetricsAdapter.calculateTotalTokens(metrics);
      expect(totalTokens).toBe(100);
    });

    it("should calculate average latency", () => {
      const metricsArray = [
        {
          latency: 1000,
          tokens: { prompt: 50, completion: 50, total: 100 },
          cost: 0.01,
          retryCount: 0,
        },
        {
          latency: 2000,
          tokens: { prompt: 50, completion: 50, total: 100 },
          cost: 0.02,
          retryCount: 0,
        },
      ];

      const avgLatency = MetricsAdapter.calculateAverageLatency(metricsArray);
      expect(avgLatency).toBe(1500);
    });
  });
});
