/**
 * Optimized Matching Engine - SPRINT-4.5
 * 
 * Performance monitoring and automatic optimization for matching operations
 */

import { performanceMonitor, measurePerformance } from './PerformanceMonitor';

export interface MatchingInput {
  cvId: string;
  jobId: string;
  features: any;
}

export interface MatchingResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  duration: number;
  timestamp?: number;
}

export class OptimizedMatching {
  private matchCache = new Map<string, MatchingResult>();
  private cacheTTL = 600000; // 10 minutes

  // Generate cache key
  private generateCacheKey(cvId: string, jobId: string): string {
    return `${cvId}:${jobId}`;
  }

  // Get from cache
  private getFromCache(key: string): MatchingResult | null {
    const cached = this.matchCache.get(key);
    if (!cached) return null;

    if (cached.timestamp && Date.now() - cached.timestamp > this.cacheTTL) {
      this.matchCache.delete(key);
      return null;
    }

    return cached;
  }

  // Set cache
  private setCache(key: string, result: MatchingResult): void {
    this.matchCache.set(key, { ...result, timestamp: Date.now() });
  }

  // Optimized keyword extraction with caching
  @measurePerformance('matching.extractKeywords')
  extractKeywords(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = new Set(['le', 'la', 'les', 'de', 'du', 'des', 'et', 'ou', 'en', 'à', 'un', 'une', 'pour', 'avec', 'sur', 'dans']);
    
    return words
      .filter(word => word.length > 3 && !stopWords.has(word))
      .filter((word, index, self) => self.indexOf(word) === index);
  }

  // Optimized matching with vector similarity
  @measurePerformance('matching.calculateScore')
  calculateScore(cvKeywords: string[], jobKeywords: string[]): number {
    const intersection = cvKeywords.filter(k => jobKeywords.includes(k));
    const union = new Set([...cvKeywords, ...jobKeywords]);
    
    // Jaccard similarity
    const jaccard = intersection.length / union.size;
    
    // Weight by keyword importance
    const weightedScore = intersection.reduce((sum, keyword) => {
      const weight = this.getKeywordWeight(keyword);
      return sum + weight;
    }, 0);

    return Math.min(100, (jaccard * 50) + (weightedScore * 50));
  }

  // Keyword weight based on rarity
  private getKeywordWeight(keyword: string): number {
    const rareKeywords = ['typescript', 'react', 'next.js', 'prisma', 'postgresql', 'redis'];
    const commonKeywords = ['javascript', 'html', 'css', 'git'];
    
    if (rareKeywords.includes(keyword.toLowerCase())) return 1.5;
    if (commonKeywords.includes(keyword.toLowerCase())) return 1.0;
    return 1.2;
  }

  // Optimized matching with caching
  @measurePerformance('matching.match')
  async match(input: MatchingInput): Promise<MatchingResult> {
    const cacheKey = this.generateCacheKey(input.cvId, input.jobId);
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    const start = Date.now();

    // Extract keywords
    const cvKeywords = this.extractKeywords(input.features.cvText || '');
    const jobKeywords = this.extractKeywords(input.features.jobText || '');

    // Calculate score
    const score = this.calculateScore(cvKeywords, jobKeywords);

    // Find matched and missing keywords
    const matchedKeywords = cvKeywords.filter(k => jobKeywords.includes(k));
    const missingKeywords = jobKeywords.filter(k => !cvKeywords.includes(k));

    const result: MatchingResult = {
      score,
      matchedKeywords,
      missingKeywords,
      duration: Date.now() - start,
    };

    this.setCache(cacheKey, result);
    return result;
  }

  // Batch matching for performance
  @measurePerformance('matching.batchMatch')
  async batchMatch(inputs: MatchingInput[]): Promise<MatchingResult[]> {
    const results: MatchingResult[] = [];

    // Process in parallel
    const promises = inputs.map(input => this.match(input));
    const settled = await Promise.allSettled(promises);

    settled.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({
          score: 0,
          matchedKeywords: [],
          missingKeywords: [],
          duration: 0,
        });
      }
    });

    return results;
  }

  // Clear cache
  clearCache(): void {
    this.matchCache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.matchCache.size,
      keys: Array.from(this.matchCache.keys()),
    };
  }
}

export const optimizedMatching = new OptimizedMatching();