/**
 * Cost Calculator
 * Calculates real costs based on token usage and model pricing
 */

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface CostBreakdown {
  promptCost: number;
  completionCost: number;
  totalCost: number;
  currency: string;
}

export interface ModelPricing {
  inputPrice: number; // per 1M tokens
  outputPrice: number; // per 1M tokens
  cachedInputPrice?: number; // per 1M tokens (for cached prompts)
}

/**
 * Model pricing configuration (USD per 1M tokens)
 * Prices as of 2024
 */
const MODEL_PRICING: Record<string, ModelPricing> = {
  "gpt-4o": {
    inputPrice: 5.0,
    outputPrice: 15.0,
  },
  "gpt-4o-mini": {
    inputPrice: 0.15,
    outputPrice: 0.60,
  },
  "gpt-4o-audio-transcribe": {
    inputPrice: 0.0, // Audio transcription is priced differently
    outputPrice: 0.0,
  },
  "gpt-4o-audio-tts": {
    inputPrice: 0.0, // TTS is priced per character
    outputPrice: 0.0,
  },
};

/**
 * Audio pricing (USD per character)
 */
const AUDIO_PRICING = {
  tts: 0.000015, // $0.015 per 1K characters
  transcribe: 0.006, // $0.006 per minute
};

export class CostCalculator {
  /**
   * Calculate cost based on token usage
   * @param model - Model name
   * @param usage - Token usage
   * @returns Cost breakdown
   */
  public static calculateCost(model: string, usage: TokenUsage): CostBreakdown {
    const pricing = MODEL_PRICING[model] || MODEL_PRICING["gpt-4o"];

    const promptCost = (usage.promptTokens / 1_000_000) * pricing.inputPrice;
    const completionCost = (usage.completionTokens / 1_000_000) * pricing.outputPrice;
    const totalCost = promptCost + completionCost;

    return {
      promptCost,
      completionCost,
      totalCost,
      currency: "USD",
    };
  }

  /**
   * Calculate audio transcription cost
   * @param durationSeconds - Duration in seconds
   * @returns Cost in USD
   */
  public static calculateTranscriptionCost(durationSeconds: number): number {
    const durationMinutes = durationSeconds / 60;
    return durationMinutes * AUDIO_PRICING.transcribe;
  }

  /**
   * Calculate text-to-speech cost
   * @param characterCount - Number of characters
   * @returns Cost in USD
   */
  public static calculateTTSCost(characterCount: number): number {
    return (characterCount / 1000) * AUDIO_PRICING.tts;
  }

  /**
   * Get pricing for a model
   * @param model - Model name
   * @returns Model pricing
   */
  public static getModelPricing(model: string): ModelPricing {
    return MODEL_PRICING[model] || MODEL_PRICING["gpt-4o"];
  }

  /**
   * Format cost for display
   * @param cost - Cost in USD
   * @returns Formatted cost string
   */
  public static formatCost(cost: number): string {
    return `$${cost.toFixed(4)}`;
  }
}
