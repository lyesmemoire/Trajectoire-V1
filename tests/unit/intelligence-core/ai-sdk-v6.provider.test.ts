/**
 * AI SDK v6 Provider Tests
 */

import { describe, it, expect } from "vitest";
import { AISDKV6Provider } from "../../../lib/intelligence-core/infrastructure/providers/ai-sdk-v6.provider";

describe("AISDKV6Provider", () => {
  it("should create an AI SDK v6 provider", () => {
    const provider = new AISDKV6Provider("test-api-key");
    expect(provider).toBeDefined();
  });

  it("should handle missing API key", async () => {
    const provider = new AISDKV6Provider();
    const result = await provider.execute(
      "test prompt",
      { variable: "value" },
      { provider: "openai", model: "gpt-4" }
    );

    // Should fail due to missing API key
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
