import { Logger } from '@nestjs/common';

export interface MemoryConfig {
  maxHeapSize: number;
  maxRSS: number;
  gcInterval: number;
  warningThreshold: number;
  criticalThreshold: number;
}

export const DEFAULT_MEMORY_CONFIG: MemoryConfig = {
  maxHeapSize: 512 * 1024 * 1024, // 512 MB
  maxRSS: 1024 * 1024 * 1024, // 1 GB
  gcInterval: 60000, // 1 minute
  warningThreshold: 0.7, // 70%
  criticalThreshold: 0.9, // 90%
};

export class MemoryMonitorService {
  private readonly logger = new Logger(MemoryMonitorService.name);
  private config: MemoryConfig = DEFAULT_MEMORY_CONFIG;
  private intervalId?: ReturnType<typeof setInterval>;

  constructor(config?: Partial<MemoryConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  startMonitoring(): void {
    if (this.intervalId) {
      return;
    }

    this.intervalId = setInterval(() => {
      this.checkMemoryUsage();
    }, this.config.gcInterval);

    this.logger.log('Memory monitoring started');
  }

  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null as any;
      this.logger.log('Memory monitoring stopped');
    }
  }

  private checkMemoryUsage(): void {
    const memoryUsage = process.memoryUsage();
    const heapUsed = memoryUsage.heapUsed;
    const heapTotal = memoryUsage.heapTotal;
    const rss = memoryUsage.rss;

    const heapUsageRatio = heapUsed / this.config.maxHeapSize;
    const rssUsageRatio = rss / this.config.maxRSS;

    if (heapUsageRatio > this.config.criticalThreshold) {
      this.logger.error(
        `CRITICAL: Heap memory usage ${(heapUsageRatio * 100).toFixed(2)}% (${(heapUsed / 1024 / 1024).toFixed(2)}MB / ${(this.config.maxHeapSize / 1024 / 1024).toFixed(2)}MB)`,
      );
      this.triggerGarbageCollection();
    } else if (heapUsageRatio > this.config.warningThreshold) {
      this.logger.warn(
        `WARNING: Heap memory usage ${(heapUsageRatio * 100).toFixed(2)}% (${(heapUsed / 1024 / 1024).toFixed(2)}MB / ${(this.config.maxHeapSize / 1024 / 1024).toFixed(2)}MB)`,
      );
    }

    if (rssUsageRatio > this.config.criticalThreshold) {
      this.logger.error(
        `CRITICAL: RSS memory usage ${(rssUsageRatio * 100).toFixed(2)}% (${(rss / 1024 / 1024).toFixed(2)}MB / ${(this.config.maxRSS / 1024 / 1024).toFixed(2)}MB)`,
      );
    } else if (rssUsageRatio > this.config.warningThreshold) {
      this.logger.warn(
        `WARNING: RSS memory usage ${(rssUsageRatio * 100).toFixed(2)}% (${(rss / 1024 / 1024).toFixed(2)}MB / ${(this.config.maxRSS / 1024 / 1024).toFixed(2)}MB)`,
      );
    }
  }

  private triggerGarbageCollection(): void {
    if (global.gc) {
      this.logger.log('Triggering garbage collection');
      global.gc();
    } else {
      this.logger.warn(
        'Garbage collection not available. Run with --expose-gc flag.',
      );
    }
  }

  getMemoryUsage(): NodeJS.MemoryUsage {
    return process.memoryUsage();
  }

  getMemoryStats(): {
    heapUsed: number;
    heapTotal: number;
    heapUsageRatio: number;
    rss: number;
    rssUsageRatio: number;
    external: number;
  } {
    const memoryUsage = process.memoryUsage();
    return {
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      heapUsageRatio: memoryUsage.heapUsed / this.config.maxHeapSize,
      rss: memoryUsage.rss,
      rssUsageRatio: memoryUsage.rss / this.config.maxRSS,
      external: memoryUsage.external,
    };
  }
}
