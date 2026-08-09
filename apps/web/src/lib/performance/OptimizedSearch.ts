/**
 * Optimized Search Engine - SPRINT-4.5
 * 
 * Performance monitoring and automatic optimization for search operations
 */

import { performanceMonitor, measurePerformance } from './PerformanceMonitor';

export interface SearchQuery {
  query: string;
  filters?: any;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  id: string;
  score: number;
  data: any;
}

export class OptimizedSearch {
  private searchCache = new Map<string, { data: SearchResult[]; timestamp: number }>();
  private indexCache = new Map<string, Map<string, number[]>>();
  private cacheTTL = 300000; // 5 minutes

  // Generate cache key
  private generateCacheKey(query: string, filters: any): string {
    return `${query}:${JSON.stringify(filters)}`;
  }

  // Get from cache
  private getFromCache(key: string): SearchResult[] | null {
    const cached = this.searchCache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.cacheTTL) {
      this.searchCache.delete(key);
      return null;
    }

    return cached.data;
  }

  // Set cache
  private setCache(key: string, results: SearchResult[]): void {
    this.searchCache.set(key, { data: results, timestamp: Date.now() });
  }

  // Build inverted index for fast search
  @measurePerformance('search.buildIndex')
  buildIndex(items: any[], textField: string): void {
    const index = new Map<string, number[]>();

    items.forEach((item, itemIndex) => {
      const text = item[textField]?.toLowerCase() || '';
      const words = text.split(/\s+/);

      words.forEach((word: string) => {
        if (word.length > 2) {
          if (!index.has(word)) {
            index.set(word, []);
          }
          index.get(word)!.push(itemIndex);
        }
      });
    });

    this.indexCache.set(textField, index);
  }

  // Optimized search using inverted index
  @measurePerformance('search.search')
  async search(query: SearchQuery, items: any[], textField: string): Promise<SearchResult[]> {
    const cacheKey = this.generateCacheKey(query.query, query.filters);
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    const start = Date.now();

    // Build index if not exists
    if (!this.indexCache.has(textField)) {
      this.buildIndex(items, textField);
    }

    const index = this.indexCache.get(textField)!;
    const queryWords = query.query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    // Find matching documents
    const matchedIndices = new Set<number>();
    const scores = new Map<number, number>();

    queryWords.forEach(word => {
      const matches = index.get(word) || [];
      matches.forEach(index => {
        matchedIndices.add(index);
        scores.set(index, (scores.get(index) || 0) + 1);
      });
    });

    // Apply filters
    let results: SearchResult[] = [];
    matchedIndices.forEach(index => {
      const item = items[index];
      
      // Apply filters if provided
      if (query.filters) {
        let passesFilter = true;
        for (const [key, value] of Object.entries(query.filters)) {
          if (item[key] !== value) {
            passesFilter = false;
            break;
          }
        }
        if (!passesFilter) return;
      }

      results.push({
        id: item.id,
        score: scores.get(index) || 0,
        data: item,
      });
    });

    // Sort by score
    results.sort((a, b) => b.score - a.score);

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 10;
    results = results.slice(offset, offset + limit);

    this.setCache(cacheKey, results);
    return results;
  }

  // Optimized fuzzy search
  @measurePerformance('search.fuzzySearch')
  async fuzzySearch(query: string, items: any[], textField: string, threshold: number = 0.8): Promise<SearchResult[]> {
    const queryLower = query.toLowerCase();
    const results: SearchResult[] = [];

    items.forEach(item => {
      const text = item[textField]?.toLowerCase() || '';
      const similarity = this.calculateSimilarity(queryLower, text);

      if (similarity >= threshold) {
        results.push({
          id: item.id,
          score: similarity,
          data: item,
        });
      }
    });

    results.sort((a, b) => b.score - a.score);
    return results;
  }

  // Calculate similarity (Levenshtein distance based)
  private calculateSimilarity(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const distance = matrix[len1][len2];
    const maxLen = Math.max(len1, len2);
    return 1 - distance / maxLen;
  }

  // Clear cache
  clearCache(): void {
    this.searchCache.clear();
    this.indexCache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      searchSize: this.searchCache.size,
      indexSize: this.indexCache.size,
    };
  }
}

export const optimizedSearch = new OptimizedSearch();