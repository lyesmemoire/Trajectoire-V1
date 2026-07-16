// @ts-nocheck
import type { CommandContext } from "../../application/types.js";

let correlationCounter = 0;

export function createCorrelationId(): string {
  correlationCounter += 1;
  const timestamp = Date.now().toString(36);
  const counter = correlationCounter.toString(36);
  return `corr-${timestamp}-${counter}`;
}

export function buildCommandContext(
  correlationId: string,
  userId?: string
): CommandContext {
  return {
    correlationId,
    userId,
    timestamp: new Date()
  };
}
