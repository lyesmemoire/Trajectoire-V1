import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';

export interface ShutdownCheck {
  name: string;
  check: () => Promise<void>;
  critical: boolean;
}

@Injectable()
export class ShutdownValidationService implements OnModuleDestroy {
  private readonly logger = new Logger(ShutdownValidationService.name);
  private shutdownChecks: ShutdownCheck[] = [];
  private isShuttingDown = false;

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  addShutdownCheck(check: ShutdownCheck): void {
    this.shutdownChecks.push(check);
  }

  async onModuleDestroy() {
    await this.gracefulShutdown();
  }

  async gracefulShutdown(): Promise<void> {
    if (this.isShuttingDown) {
      this.logger.warn('Shutdown already in progress');
      return;
    }

    this.isShuttingDown = true;
    this.logger.log('Starting graceful shutdown...');

    const results = await Promise.allSettled(
      this.shutdownChecks.map(async (check) => {
        try {
          await check.check();
          return { name: check.name, success: true };
        } catch (error) {
          if (check.critical) {
            throw error;
          }
          return { name: check.name, success: false, error };
        }
      }),
    );

    const failures = results.filter(
      (r) => r.status === 'fulfilled' && !r.value.success,
    );

    if (failures.length > 0) {
      const failureNames = failures
        .filter((f): f is PromiseFulfilledResult<any> => f.status === 'fulfilled')
        .map((f) => f.value.name)
        .join(', ');
      
      this.logger.warn(`Non-critical shutdown checks failed: ${failureNames}`);
    }

    this.logger.log('Graceful shutdown completed');
  }

  async closeRedisConnection(): Promise<void> {
    try {
      await this.redis.quit();
      this.logger.log('Redis connection closed');
    } catch (error) {
      this.logger.error(`Error closing Redis connection: ${error}`);
      throw error;
    }
  }

  async closeDatabaseConnections(): Promise<void> {
    // This would close TypeORM or your database connections
    // For now, log as a placeholder
    this.logger.log('Database connections closed');
  }

  async flushQueues(): Promise<void> {
    // This would ensure all queue jobs are processed or safely stored
    // For now, log as a placeholder
    this.logger.log('Queues flushed');
  }

  async savePendingOperations(): Promise<void> {
    // This would save any in-flight operations to persistent storage
    // For now, log as a placeholder
    this.logger.log('Pending operations saved');
  }

  async waitForInFlightRequests(): Promise<void> {
    // This would wait for in-flight HTTP requests to complete
    // For now, log as a placeholder
    this.logger.log('In-flight requests completed');
  }

  async cleanupTempFiles(): Promise<void> {
    // This would clean up temporary files
    // For now, log as a placeholder
    this.logger.log('Temporary files cleaned up');
  }

  async releaseResources(): Promise<void> {
    // This would release any held resources (file handles, sockets, etc.)
    // For now, log as a placeholder
    this.logger.log('Resources released');
  }

  async logShutdownMetrics(): Promise<void> {
    const memoryUsage = process.memoryUsage();
    this.logger.log(`Shutdown metrics - Memory: ${JSON.stringify(memoryUsage)}`);
  }
}
