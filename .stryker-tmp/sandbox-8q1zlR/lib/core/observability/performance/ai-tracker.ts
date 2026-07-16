/**
 * AI Call Tracker
 * Wrapper to track AI model call performance (OpenAI, Anthropic, Mistral, Groq)
 */
// @ts-nocheck


import { getPerformanceTracker } from "./performance-tracker";
import { LoggerProvider } from "../logger";

const logger = LoggerProvider.getLogger();
const tracker = getPerformanceTracker();

export interface AICallMetadata {
  model?: string;
  provider?: string;
  tokens?: {
    prompt?: number;
    completion?: number;
    total?: number;
  };
  error?: string;
}

export function trackAICall<T>(
  provider: string,
  model: string,
  callFn: () => Promise<T>
): Promise<T> {
  const timerId = tracker.start(`ai:${provider}:${model}`);

  return callFn()
    .then((result) => {
      tracker.stop(timerId, `ai:${provider}:${model}`, { provider, model });
      return result;
    })
    .catch((error) => {
      tracker.stop(timerId, `ai:${provider}:${model}`, {
        provider,
        model,
        error: "failed",
      });
      logger.error("AI call failed", { provider, model, error });
      throw error;
    });
}

export function trackAICallWithMetadata<T>(
  provider: string,
  model: string,
  callFn: () => Promise<T>,
  metadata: AICallMetadata
): Promise<T> {
  const timerId = tracker.start(`ai:${provider}:${model}`);

  return callFn()
    .then((result) => {
      tracker.stop(timerId, `ai:${provider}:${model}`, {
        provider,
        model,
        ...metadata,
      });
      return result;
    })
    .catch((error) => {
      tracker.stop(timerId, `ai:${provider}:${model}`, {
        provider,
        model,
        error: "failed",
        ...metadata,
      });
      logger.error("AI call failed", { provider, model, error, metadata });
      throw error;
    });
}
