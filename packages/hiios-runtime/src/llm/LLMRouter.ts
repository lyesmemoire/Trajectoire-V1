/**
 * HIIOS v4 Enterprise — LLM Router
 *
 * Sélectionne le provider optimal selon le contexte.
 * Gère le fallback, le load balancing et le cost tracking.
 */

import type { LLMProvider, LLMRequest, LLMResponse, LLMProviderConfig } from "./LLMProvider";
import { LLMError } from "./LLMProvider";
import { OpenAIProvider }    from "./OpenAIProvider";
import { AnthropicProvider } from "./AnthropicProvider";
import { MockProvider, type MockResponseStrategy } from "./MockProvider";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface RoutingConfig {
  primary:   LLMProviderConfig;
  fallback?: LLMProviderConfig;
  routing:   RoutingStrategy;
}

export type RoutingStrategy =
  | "PRIMARY_ONLY"      // Toujours le primary
  | "FALLBACK_ON_ERROR" // Primary, fallback si erreur
  | "COST_OPTIMIZED"    // Choisit selon le coût estimé
  | "LATENCY_OPTIMIZED"; // Choisit selon la latence

export interface LLMCallRecord {
  id:           string;
  sessionId:    string;
  provider:     string;
  model:        string;
  promptTokens: number;
  outputTokens: number;
  cost:         number;
  latencyMs:    number;
  success:      boolean;
  error?:       string;
  timestamp:    Date;
}

// ─────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────

export class LLMRouter {

  private primary:  LLMProvider;
  private fallback: LLMProvider | null;
  private config:   RoutingConfig;
  private callLog:  LLMCallRecord[] = [];

  constructor(config: RoutingConfig) {
    this.config   = config;
    this.primary  = this.buildProvider(config.primary);
    this.fallback = config.fallback ? this.buildProvider(config.fallback) : null;
  }

  // ── Factory ────────────────────────────────

  static forTesting(strategy?: MockResponseStrategy): LLMRouter {
    return new LLMRouter({
      primary:  { provider: "mock", model: "mock-v1" },
      routing:  "PRIMARY_ONLY",
    });
  }

  static forProduction(config: {
    openaiKey:    string;
    anthropicKey: string;
    primaryModel: string;
  }): LLMRouter {
    return new LLMRouter({
      primary: {
        provider:   "openai",
        model:      config.primaryModel,
        apiKey:     config.openaiKey,
        maxRetries: 3,
      },
      fallback: {
        provider:   "anthropic",
        model:      "claude-3-5-haiku-20241022",
        apiKey:     config.anthropicKey,
        maxRetries: 2,
      },
      routing: "FALLBACK_ON_ERROR",
    });
  }

  // ── Generate ───────────────────────────────

  async generate(
    request:   LLMRequest,
    sessionId: string
  ): Promise<LLMResponse> {
    const provider = await this.selectProvider(request);

    try {
      const response = await provider.generate(request);
      this.recordCall(sessionId, provider, response, true);
      return response;

    } catch (error) {
      this.recordCall(sessionId, provider, null, false, String(error));

      // Fallback
      if (
        this.fallback &&
        this.config.routing === "FALLBACK_ON_ERROR" &&
        error instanceof LLMError &&
        error.retryable
      ) {
        try {
          const fallbackResponse = await this.fallback.generate(request);
          this.recordCall(sessionId, this.fallback, fallbackResponse, true);
          return fallbackResponse;
        } catch (fallbackError) {
          this.recordCall(sessionId, this.fallback, null, false, String(fallbackError));
        }
      }

      throw error;
    }
  }

  // ── Stream ─────────────────────────────────

  async stream(
    request:   LLMRequest,
    sessionId: string,
    onChunk:   (chunk: import("./LLMProvider").LLMStreamChunk) => void
  ): Promise<LLMResponse> {
    const provider = await this.selectProvider(request);
    const response = await provider.stream(request, onChunk);
    this.recordCall(sessionId, provider, response, true);
    return response;
  }

  // ── Sélection du provider ──────────────────

  private async selectProvider(request: LLMRequest): Promise<LLMProvider> {
    switch (this.config.routing) {
      case "PRIMARY_ONLY":
        return this.primary;

      case "FALLBACK_ON_ERROR":
        return this.primary;

      case "COST_OPTIMIZED": {
        const estimatedTokens = this.estimateTokens(request);
        if (estimatedTokens > 50000 && this.fallback) {
          // Les modèles Anthropic sont souvent moins chers sur de gros contextes
          return this.fallback;
        }
        return this.primary;
      }

      default:
        return this.primary;
    }
  }

  // ── Cost tracking ──────────────────────────

  getCostReport(sessionId?: string): {
    totalCost:    number;
    totalTokens:  number;
    callCount:    number;
    byProvider:   Record<string, number>;
    averageLatency: number;
  } {
    const calls = sessionId
      ? this.callLog.filter(c => c.sessionId === sessionId)
      : this.callLog;

    const totalCost    = calls.reduce((s, c) => s + c.cost, 0);
    const totalTokens  = calls.reduce((s, c) => s + c.promptTokens + c.outputTokens, 0);
    const avgLatency   = calls.length > 0
      ? calls.reduce((s, c) => s + c.latencyMs, 0) / calls.length
      : 0;

    const byProvider: Record<string, number> = {};
    for (const call of calls) {
      byProvider[call.provider] = (byProvider[call.provider] ?? 0) + call.cost;
    }

    return {
      totalCost,
      totalTokens,
      callCount:      calls.length,
      byProvider,
      averageLatency: avgLatency,
    };
  }

  // ── Helpers ────────────────────────────────

  private buildProvider(config: LLMProviderConfig): LLMProvider {
    switch (config.provider) {
      case "openai":    return new OpenAIProvider(config);
      case "anthropic": return new AnthropicProvider(config);
      case "mock":      return new MockProvider();
      default:
        throw new Error(`Unknown provider: ${config.provider}`);
    }
  }

  private recordCall(
    sessionId: string,
    provider:  LLMProvider,
    response:  LLMResponse | null,
    success:   boolean,
    error?:    string
  ): void {
    const modelInfo = provider.models.find(m =>
      response ? m.id === response.model : true
    );

    const cost = response
      ? (response.usage.promptTokens / 1000) * (modelInfo?.costPer1kInput ?? 0) +
        (response.usage.completionTokens / 1000) * (modelInfo?.costPer1kOutput ?? 0)
      : 0;

    this.callLog.push({
      id:           `call_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      sessionId,
      provider:     provider.name,
      model:        response?.model ?? "unknown",
      promptTokens: response?.usage.promptTokens ?? 0,
      outputTokens: response?.usage.completionTokens ?? 0,
      cost,
      latencyMs:    response?.latencyMs ?? 0,
      success,
      error,
      timestamp:    new Date(),
    });
  }

  private estimateTokens(request: LLMRequest): number {
    return request.messages.reduce(
      (sum, m) => sum + Math.ceil(m.content.length / 4),
      0
    );
  }
}
