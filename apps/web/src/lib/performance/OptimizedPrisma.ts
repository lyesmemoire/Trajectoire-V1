/**
 * Optimized Prisma Client - SPRINT-4.5
 * 
 * Performance monitoring and automatic optimization for Prisma queries
 */

import { performanceMonitor, measurePerformance } from './PerformanceMonitor';

export class OptimizedPrisma {
  private queryCache = new Map<string, { data: any; timestamp: number }>();
  private cacheTTL = 60000; // 1 minute

  // Cache key generator
  private generateCacheKey(query: string, params: any): string {
    return `${query}:${JSON.stringify(params)}`;
  }

  // Get from cache
  private getFromCache(key: string): any | null {
    const cached = this.queryCache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.cacheTTL) {
      this.queryCache.delete(key);
      return null;
    }

    return cached.data;
  }

  // Set cache
  private setCache(key: string, data: any): void {
    this.queryCache.set(key, { data, timestamp: Date.now() });
  }

  // Optimized select with caching
  @measurePerformance('prisma.select')
  async select<T>(prisma: any, model: string, params: any): Promise<T[]> {
    const cacheKey = this.generateCacheKey(`${model}.select`, params);
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    const data = await prisma[model].findMany(params);
    this.setCache(cacheKey, data);
    return data;
  }

  // Optimized findUnique
  @measurePerformance('prisma.findUnique')
  async findUnique<T>(prisma: any, model: string, params: any): Promise<T | null> {
    const cacheKey = this.generateCacheKey(`${model}.findUnique`, params);
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    const data = await prisma[model].findUnique(params);
    this.setCache(cacheKey, data);
    return data;
  }

  // Optimized create
  @measurePerformance('prisma.create')
  async create<T>(prisma: any, model: string, params: any): Promise<T> {
    // Invalidate cache for this model
    this.invalidateModelCache(model);
    return prisma[model].create(params);
  }

  // Optimized update
  @measurePerformance('prisma.update')
  async update<T>(prisma: any, model: string, params: any): Promise<T> {
    this.invalidateModelCache(model);
    return prisma[model].update(params);
  }

  // Optimized delete
  @measurePerformance('prisma.delete')
  async delete<T>(prisma: any, model: string, params: any): Promise<T> {
    this.invalidateModelCache(model);
    return prisma[model].delete(params);
  }

  // Optimized transaction
  @measurePerformance('prisma.transaction')
  async transaction<T>(prisma: any, callback: (tx: any) => Promise<T>): Promise<T> {
    return prisma.$transaction(callback);
  }

  // Batch operations for performance
  @measurePerformance('prisma.batch')
  async batch<T>(prisma: any, operations: any[]): Promise<T[]> {
    // Invalidate all affected models
    operations.forEach((op) => {
      const model = Object.keys(op)[0];
      this.invalidateModelCache(model);
    });
    return prisma.$transaction(operations);
  }

  // Invalidate cache for a model
  private invalidateModelCache(model: string): void {
    const keysToDelete: string[] = [];
    this.queryCache.forEach((_, key) => {
      if (key.startsWith(`${model}.`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.queryCache.delete(key));
  }

  // Clear all cache
  clearCache(): void {
    this.queryCache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.queryCache.size,
      keys: Array.from(this.queryCache.keys()),
    };
  }
}

export const optimizedPrisma = new OptimizedPrisma();