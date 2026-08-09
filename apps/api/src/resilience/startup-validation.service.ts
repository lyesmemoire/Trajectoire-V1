import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';

export interface ValidationCheck {
  name: string;
  check: () => Promise<boolean>;
  critical: boolean;
}

@Injectable()
export class StartupValidationService implements OnModuleInit {
  private readonly logger = new Logger(StartupValidationService.name);
  private validationChecks: ValidationCheck[] = [];

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async onModuleInit() {
    await this.validateStartup();
  }

  addValidationCheck(check: ValidationCheck): void {
    this.validationChecks.push(check);
  }

  async validateStartup(): Promise<void> {
    this.logger.log('Starting startup validation...');

    const results = await Promise.allSettled(
      this.validationChecks.map(async (check) => {
        const passed = await check.check();
        return {
          name: check.name,
          passed,
          critical: check.critical,
        };
      }),
    );

    const failures = results.filter(
      (result) =>
        result.status === 'fulfilled' && !result.value.passed && result.value.critical,
    );

    if (failures.length > 0) {
      const failureNames = failures
        .filter((f): f is PromiseFulfilledResult<any> => f.status === 'fulfilled')
        .map((f) => f.value.name)
        .join(', ');
      
      throw new Error(
        `Critical startup validation checks failed: ${failureNames}`,
      );
    }

    this.logger.log('Startup validation completed successfully');
  }

  async validateRedis(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch (error) {
      this.logger.error(`Redis validation failed: ${error}`);
      return false;
    }
  }

  async validateDatabase(): Promise<boolean> {
    // This would be implemented with TypeORM or your database client
    // For now, return true as a placeholder
    return true;
  }

  async validateExternalServices(): Promise<boolean> {
    // Validate OpenAI, Graph, Search, Matching, Copilot services
    // For now, return true as a placeholder
    return true;
  }

  async validateEnvironment(): Promise<boolean> {
    const requiredEnvVars = [
      'DATABASE_URL',
      'REDIS_HOST',
      'REDIS_PORT',
      'OPENAI_API_KEY',
    ];

    const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

    if (missing.length > 0) {
      this.logger.error(`Missing required environment variables: ${missing.join(', ')}`);
      return false;
    }

    return true;
  }

  async validateDiskSpace(): Promise<boolean> {
    // This would check available disk space
    // For now, return true as a placeholder
    return true;
  }

  async validateMemory(): Promise<boolean> {
    const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    const totalMemory = process.memoryUsage().heapTotal / 1024 / 1024;
    const usagePercent = (usedMemory / totalMemory) * 100;

    if (usagePercent > 90) {
      this.logger.error(`Memory usage too high: ${usagePercent.toFixed(2)}%`);
      return false;
    }

    return true;
  }
}
