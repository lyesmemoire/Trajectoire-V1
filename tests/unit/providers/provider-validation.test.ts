/**
 * Provider Validation Test
 * 
 * Tests OpenAI, Mistral, and Anthropic providers with real API keys.
 * Run with: pnpm test tests/unit/providers/provider-validation.test.ts
 */

import { describe, it, expect, vi } from "vitest";
import { AISDKV6Provider } from "../../../lib/intelligence-core/infrastructure/providers/ai-sdk-v6.provider";
import { AnthropicProvider } from "../../../lib/intelligence-core/infrastructure/providers/anthropic.provider";
import { MistralProvider } from "../../../lib/intelligence-core/infrastructure/providers/mistral.provider";

// Mock env.server.ts to bypass validation
vi.mock("../../../lib/env.server", () => ({
  validateEnv: () => {},
}));

describe("Provider Validation", () => {
  describe("OpenAI Provider", () => {
    it("should execute successfully with valid API key", async () => {
      if (!process.env.OPENAI_API_KEY) {
        console.log("⚠️  Skipping OpenAI test (no OPENAI_API_KEY)");
        return;
      }

      const provider = new AISDKV6Provider();
      const result = await provider.execute(
        "Test prompt: What is 2 + 2? Answer with just the number.",
        {},
        {
          provider: "openai",
          model: "gpt-4",
          temperature: 0.7,
          maxTokens: 100,
        }
      );

      if (result.success) {
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.metrics).toBeDefined();
        console.log("✅ OpenAI Provider: SUCCESS");
        console.log("   Response:", result.data);
        console.log("   Metrics:", result.metrics);
      } else {
        console.log("❌ OpenAI Provider: FAILED");
        console.log("   Error:", result.error?.message);
        throw new Error(result.error?.message || "OpenAI provider failed");
      }
    }, 30000);
  });

  describe("Anthropic Provider", () => {
    it("should execute successfully with valid API key", async () => {
      if (!process.env.ANTHROPIC_API_KEY) {
        console.log("⚠️  Skipping Anthropic test (no ANTHROPIC_API_KEY)");
        return;
      }

      const provider = new AnthropicProvider();
      const result = await provider.execute(
        "Test prompt: What is 2 + 2? Answer with just the number.",
        {},
        {
          provider: "anthropic",
          model: "claude-3-5-sonnet-20241022",
          temperature: 0.7,
          maxTokens: 100,
        }
      );

      if (result.success) {
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.metrics).toBeDefined();
        console.log("✅ Anthropic Provider: SUCCESS");
        console.log("   Response:", result.data);
        console.log("   Metrics:", result.metrics);
      } else {
        console.log("❌ Anthropic Provider: FAILED");
        console.log("   Error:", result.error?.message);
        throw new Error(result.error?.message || "Anthropic provider failed");
      }
    }, 30000);
  });

  describe("Mistral Provider", () => {
    it("should execute successfully with valid API key", async () => {
      if (!process.env.MISTRAL_API_KEY) {
        console.log("⚠️  Skipping Mistral test (no MISTRAL_API_KEY)");
        return;
      }

      const provider = new MistralProvider();
      const result = await provider.execute(
        "Test prompt: What is 2 + 2? Answer with just the number.",
        {},
        {
          provider: "mistral",
          model: "mistral-large-latest",
          temperature: 0.7,
          maxTokens: 100,
        }
      );

      if (result.success) {
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.metrics).toBeDefined();
        console.log("✅ Mistral Provider: SUCCESS");
        console.log("   Response:", result.data);
        console.log("   Metrics:", result.metrics);
      } else {
        console.log("❌ Mistral Provider: FAILED");
        console.log("   Error:", result.error?.message);
        throw new Error(result.error?.message || "Mistral provider failed");
      }
    }, 30000);
  });
});
