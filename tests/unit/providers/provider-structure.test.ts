/**
 * Provider Structure Validation Test
 * 
 * Validates that all providers implement IntelligenceProviderPort correctly.
 * Run with: pnpm test tests/unit/providers/provider-structure.test.ts
 */

import { describe, it, expect, vi } from "vitest";
import { AISDKV6Provider } from "../../../lib/intelligence-core/infrastructure/providers/ai-sdk-v6.provider";
import { AnthropicProvider } from "../../../lib/intelligence-core/infrastructure/providers/anthropic.provider";
import { MistralProvider } from "../../../lib/intelligence-core/infrastructure/providers/mistral.provider";

// Mock dependencies
vi.mock("../../../core/ai/OpenAIProvider", () => ({
  OpenAIProvider: class {
    constructor(_apiKey?: string) {}
    isAvailable() { return true; }
    generateChatCompletion() {
      return {
        content: "4",
        latency: 1000,
        usage: {
          promptTokens: 10,
          completionTokens: 5,
          totalTokens: 15,
        },
      };
    }
  },
}));

vi.mock("../../../lib/env.server", () => ({
  validateEnv: () => {},
}));

describe("Provider Structure Validation", () => {
  describe("AISDKV6Provider", () => {
    it("should implement IntelligenceProviderPort interface", () => {
      const provider = new AISDKV6Provider();
      expect(provider).toBeDefined();
      expect(typeof provider.execute).toBe("function");
    });

    it("should have execute method with correct signature", async () => {
      const provider = new AISDKV6Provider();
      const result = await provider.execute(
        "Test prompt",
        { test: "value" },
        {
          provider: "openai",
          model: "gpt-4",
          temperature: 0.7,
          maxTokens: 100,
        }
      );

      expect(result).toBeDefined();
      expect(typeof result.success).toBe("boolean");
      
      if (result.metrics) {
        expect(result.metrics.latency).toBeDefined();
        expect(result.metrics.totalTokens).toBeDefined();
        expect(result.metrics.cost).toBeDefined();
      }
    });

    it("should handle errors correctly", async () => {
      // Test with invalid API key
      const providerWithInvalidKey = new AISDKV6Provider("invalid-key");
      
      const result = await providerWithInvalidKey.execute(
        "Test prompt",
        {},
        {
          provider: "openai",
          model: "gpt-4",
        }
      );

      expect(result).toBeDefined();
      // Should handle error gracefully
    });
  });

  describe("AnthropicProvider", () => {
    it("should implement IntelligenceProviderPort interface", () => {
      if (!process.env.ANTHROPIC_API_KEY) {
        console.log("⚠️  Skipping Anthropic structure test (no ANTHROPIC_API_KEY)");
        return;
      }

      const provider = new AnthropicProvider();
      expect(provider).toBeDefined();
      expect(typeof provider.execute).toBe("function");
    });

    it("should have execute method with correct signature", async () => {
      if (!process.env.ANTHROPIC_API_KEY) {
        console.log("⚠️  Skipping Anthropic signature test (no ANTHROPIC_API_KEY)");
        return;
      }

      const provider = new AnthropicProvider();
      
      // Mock fetch to avoid real API call
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            content: [{ text: "4" }],
            usage: {
              input_tokens: 10,
              output_tokens: 5,
            },
          }),
        })
      ) as unknown;

      const result = await provider.execute(
        "Test prompt",
        { test: "value" },
        {
          provider: "anthropic",
          model: "claude-3-5-sonnet-20241022",
          temperature: 0.7,
          maxTokens: 100,
        }
      );

      expect(result).toBeDefined();
      expect(typeof result.success).toBe("boolean");
      
      if (result.metrics) {
        expect(result.metrics.latency).toBeDefined();
        expect(result.metrics.totalTokens).toBeDefined();
        expect(result.metrics.cost).toBeDefined();
      }
    });

    it("should throw error without API key", () => {
      // Temporarily remove API key
      const originalKey = process.env.ANTHROPIC_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;

      expect(() => new AnthropicProvider()).toThrow("ANTHROPIC_API_KEY is required");

      // Restore API key
      process.env.ANTHROPIC_API_KEY = originalKey;
    });
  });

  describe("MistralProvider", () => {
    it("should implement IntelligenceProviderPort interface", () => {
      if (!process.env.MISTRAL_API_KEY) {
        console.log("⚠️  Skipping Mistral structure test (no MISTRAL_API_KEY)");
        return;
      }

      const provider = new MistralProvider();
      expect(provider).toBeDefined();
      expect(typeof provider.execute).toBe("function");
    });

    it("should have execute method with correct signature", async () => {
      if (!process.env.MISTRAL_API_KEY) {
        console.log("⚠️  Skipping Mistral signature test (no MISTRAL_API_KEY)");
        return;
      }

      const provider = new MistralProvider();
      
      // Mock fetch to avoid real API call
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            choices: [{ message: { content: "4" } }],
            usage: {
              prompt_tokens: 10,
              completion_tokens: 5,
              total_tokens: 15,
            },
          }),
        })
      ) as unknown;

      const result = await provider.execute(
        "Test prompt",
        { test: "value" },
        {
          provider: "mistral",
          model: "mistral-large-latest",
          temperature: 0.7,
          maxTokens: 100,
        }
      );

      expect(result).toBeDefined();
      expect(typeof result.success).toBe("boolean");
      
      if (result.metrics) {
        expect(result.metrics.latency).toBeDefined();
        expect(result.metrics.totalTokens).toBeDefined();
        expect(result.metrics.cost).toBeDefined();
      }
    });
  });
});
