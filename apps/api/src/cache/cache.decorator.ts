import { Injectable, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

export interface CacheOptions {
  ttl?: number;
  key?: string;
  unless?: (result: any) => boolean;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  latency: {
    avg: number;
    min: number;
    max: number;
    p95: number;
    p99: number;
  };
  lastReset: Date;
}

export interface CacheStats {
  key: string;
  hits: number;
  misses: number;
  hitRate: number;
  avgLatency: number;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly metrics = new Map<string, CacheMetrics>();
  private readonly latencies = new Map<string, number[]>();

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    const startTime = Date.now();
    try {
      const value = await this.cacheManager.get<T>(key);
      const latency = Date.now() - startTime;

      this.recordMetrics(key, value !== undefined, latency);

      return value;
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}: ${error}`);
      return undefined;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}: ${error}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.metrics.delete(key);
      this.latencies.delete(key);
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}: ${error}`);
    }
  }

  async wrap<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const result = await factory();
    await this.set(key, result, ttl);
    return result;
  }

  generateKey(prefix: string, ...args: any[]): string {
    const argsStr = args
      .map((arg) =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg),
      )
      .join(':');
    return `${prefix}:${argsStr}`;
  }

  private recordMetrics(key: string, hit: boolean, latency: number): void {
    const parts = key.split(':');
    const prefix = parts[0] || 'default';

    if (!this.metrics.has(prefix)) {
      this.metrics.set(prefix, {
        hits: 0,
        misses: 0,
        latency: { avg: 0, min: Infinity, max: 0, p95: 0, p99: 0 },
        lastReset: new Date(),
      });
    }

    if (!this.latencies.has(prefix)) {
      this.latencies.set(prefix, []);
    }

    const metrics = this.metrics.get(prefix);
    if (!metrics) return;

    const latencies = this.latencies.get(prefix);
    if (!latencies) return;

    if (hit) {
      metrics.hits++;
    } else {
      metrics.misses++;
    }

    latencies.push(latency);

    // Keep only last 1000 latencies for percentile calculation
    if (latencies.length > 1000) {
      latencies.shift();
    }

    this.updateLatencyMetrics(prefix, latencies);
  }

  private updateLatencyMetrics(prefix: string, latencies: number[]): void {
    const metrics = this.metrics.get(prefix);
    if (!metrics) return;

    if (latencies.length === 0) return;

    const sorted = [...latencies].sort((a, b) => a - b);
    const sum = latencies.reduce((a, b) => a + b, 0);

    metrics.latency.avg = sum / latencies.length;
    metrics.latency.min = sorted[0] ?? 0;
    metrics.latency.max = sorted[sorted.length - 1] ?? 0;
    metrics.latency.p95 =
      sorted[Math.floor(sorted.length * 0.95)] ??
      sorted[sorted.length - 1] ??
      0;
    metrics.latency.p99 =
      sorted[Math.floor(sorted.length * 0.99)] ??
      sorted[sorted.length - 1] ??
      0;
  }

  getMetrics(prefix?: string): CacheStats[] {
    const stats: CacheStats[] = [];

    const prefixes = prefix ? [prefix] : Array.from(this.metrics.keys());

    for (const p of prefixes) {
      const metrics = this.metrics.get(p);
      if (!metrics) continue;

      const total = metrics.hits + metrics.misses;
      const hitRate = total > 0 ? (metrics.hits / total) * 100 : 0;

      stats.push({
        key: p,
        hits: metrics.hits,
        misses: metrics.misses,
        hitRate,
        avgLatency: metrics.latency.avg,
      });
    }

    return stats;
  }

  resetMetrics(prefix?: string): void {
    if (prefix) {
      this.metrics.delete(prefix);
      this.latencies.delete(prefix);
    } else {
      this.metrics.clear();
      this.latencies.clear();
    }
  }
}
