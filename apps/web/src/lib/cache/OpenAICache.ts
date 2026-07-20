/**
 * OpenAI Cache Service
 * Caches AI responses based on prompt hash to avoid duplicate API calls
 * Significant cost savings for identical or similar requests
 */

import crypto from "crypto";
import { getCache, TTL } from "./MemoryCache";

export interface CachedAIResponse {
  response: string;
  model: string;
  timestamp: number;
  tokensUsed?: number;
}

export interface CacheKeyParams {
  interviewType: string;
  jobTitle: string;
  level: string;
  conversationHistory: Array<{ role: string; content: string }>;
  systemPrompt?: string;
}

/**
 * Generate a hash for the cache key
 * Uses SHA-256 to create a deterministic hash from the prompt parameters
 */
function generateCacheKey(params: CacheKeyParams): string {
  const hashInput = JSON.stringify({
    interviewType: params.interviewType,
    jobTitle: params.jobTitle,
    level: params.level,
    // Only use last 10 messages for hash to allow some flexibility
    conversationHistory: params.conversationHistory.slice(-10),
    systemPrompt: params.systemPrompt,
  });
  
  return crypto.createHash("sha256").update(hashInput).digest("hex");
}

/**
 * Get cached AI response
 * @param params - Parameters that define the cache key
 * @returns Cached response or null if not found
 */
export function getCachedAIResponse(params: CacheKeyParams): CachedAIResponse | null {
  const cache = getCache();
  const cacheKey = `openai:${generateCacheKey(params)}`;
  
  const cached = cache.get<CachedAIResponse>(cacheKey);
  if (cached) {
    // Check if cache is still valid (24 hours for AI responses)
    const age = Date.now() - cached.timestamp;
    if (age < 24 * 60 * 60 * 1000) {
      return cached;
    }
    // Cache expired, delete it
    cache.delete(cacheKey);
  }
  
  return null;
}

/**
 * Cache AI response
 * @param params - Parameters that define the cache key
 * @param response - AI response to cache
 * @param model - Model used for the response
 * @param tokensUsed - Number of tokens used (optional)
 */
export function setCachedAIResponse(
  params: CacheKeyParams,
  response: string,
  model: string,
  tokensUsed?: number
): void {
  const cache = getCache();
  const cacheKey = `openai:${generateCacheKey(params)}`;
  
  const cachedResponse: CachedAIResponse = {
    response,
    model,
    timestamp: Date.now(),
    tokensUsed,
  };
  
  // Cache for 24 hours (AI responses can be reused for a day)
  cache.set(cacheKey, cachedResponse, 24 * 60 * 60 * 1000);
}

/**
 * Invalidate cache for a specific session or parameters
 * @param params - Parameters to invalidate
 */
export function invalidateAIResponseCache(params: Partial<CacheKeyParams>): void {
  const cache = getCache();
  const stats = cache.getStats();
  
  // Find and delete all OpenAI cache keys matching the pattern
  for (const key of stats.keys) {
    if (key.startsWith("openai:")) {
      if (params.interviewType && key.includes(params.interviewType)) {
        cache.delete(key);
      }
      if (params.jobTitle && key.includes(params.jobTitle)) {
        cache.delete(key);
      }
    }
  }
}

/**
 * Get cache statistics for OpenAI responses
 */
export function getOpenAICacheStats(): {
  size: number;
  keys: string[];
} {
  const cache = getCache();
  const stats = cache.getStats();
  
  return {
    size: stats.keys.filter(k => k.startsWith("openai:")).length,
    keys: stats.keys.filter(k => k.startsWith("openai:")),
  };
}

/**
 * Clear all OpenAI cache entries
 */
export function clearOpenAICache(): void {
  const cache = getCache();
  const stats = cache.getStats();
  
  for (const key of stats.keys) {
    if (key.startsWith("openai:")) {
      cache.delete(key);
    }
  }
}
