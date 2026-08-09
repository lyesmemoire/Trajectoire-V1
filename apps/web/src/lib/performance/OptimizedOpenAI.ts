/**
 * Optimized OpenAI Client - SPRINT-4.5
 * 
 * Performance monitoring and automatic optimization for OpenAI operations
 */

import OpenAI from 'openai';
import { performanceMonitor, measurePerformance } from './PerformanceMonitor';

export class OptimizedOpenAI {
  private responseCache = new Map<string, { data: any; timestamp: number }>();
  private cacheTTL = 300000; // 5 minutes for AI responses
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'dummy' });
  }

  // Generate cache key
  private generateCacheKey(model: string, messages: any[], temperature: number): string {
    return `${model}:${JSON.stringify(messages)}:${temperature}`;
  }

  // Get from cache
  private getFromCache(key: string): any | null {
    const cached = this.responseCache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.cacheTTL) {
      this.responseCache.delete(key);
      return null;
    }

    return cached.data;
  }

  // Set cache
  private setCache(key: string, data: any): void {
    this.responseCache.set(key, { data, timestamp: Date.now() });
  }

  // Optimized chat completion with caching
  @measurePerformance('openai.chat.completions')
  async chatCompletion(params: {
    model: string;
    messages: any[];
    temperature?: number;
    max_tokens?: number;
  }) {
    const cacheKey = this.generateCacheKey(
      params.model,
      params.messages,
      params.temperature || 0.7
    );

    // Check cache for read-only operations
    if (params.temperature === 0) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const response = await this.client.chat.completions.create(params);

    // Cache deterministic responses
    if (params.temperature === 0) {
      this.setCache(cacheKey, response);
    }

    return response;
  }

  // Optimized embeddings with caching
  @measurePerformance('openai.embeddings')
  async embeddings(params: { model: string; input: string | string[] }) {
    const input = Array.isArray(params.input) ? params.input : [params.input];
    const cacheKey = `${params.model}:${JSON.stringify(input)}`;

    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await this.client.embeddings.create(params);
    this.setCache(cacheKey, response);
    return response;
  }

  // Batch embeddings for performance
  @measurePerformance('openai.embeddings.batch')
  async batchEmbeddings(inputs: string[], model: string = 'text-embedding-3-small') {
    // Process in batches of 100
    const batchSize = 100;
    const results: any[] = [];

    for (let i = 0; i < inputs.length; i += batchSize) {
      const batch = inputs.slice(i, i + batchSize);
      const response = await this.embeddings({ model, input: batch });
      results.push(...response.data);
    }

    return results;
  }

  // Clear cache
  clearCache(): void {
    this.responseCache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.responseCache.size,
      keys: Array.from(this.responseCache.keys()),
    };
  }
}

export const optimizedOpenAI = new OptimizedOpenAI();