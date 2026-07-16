// @ts-nocheck
import { AIProvider, AICompletionRequest, AIChatCompletionRequest, AICompletionResponse } from "./AIProvider";

/**
 * Mock AI Provider
 *
 * Returns mock responses for testing without API keys.
 * Used when AI_MODE is set to "mock".
 */

export class MockProvider implements AIProvider {
  readonly provider = "mock";

  isAvailable(): boolean {
    return true;
  }

  async generateCompletion(_request: AICompletionRequest): Promise<AICompletionResponse> {
    return this.createMockResponse();
  }

  async generateChatCompletion(_request: AIChatCompletionRequest): Promise<AICompletionResponse> {
    return this.createMockResponse();
  }

  private createMockResponse(): AICompletionResponse {
    return {
      content: JSON.stringify({
        mock: true,
        message: "This is a mock response. Set AI_MODE=real to use actual AI providers.",
        timestamp: new Date().toISOString(),
      }),
      model: "mock-model",
      usage: {
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
      },
      latency: 100,
      provider: this.provider,
    };
  }
}
