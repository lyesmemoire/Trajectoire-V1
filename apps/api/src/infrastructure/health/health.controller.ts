import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { Public } from '../../auth/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 500 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024),
    ]);
  }

  @Get('redis')
  @Public()
  @HealthCheck()
  async checkRedis() {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    const host =
      this.configService.get<string>('REDIS_HOST') ||
      (isProduction ? undefined : 'localhost');

    const portValue =
      this.configService.get<string | number>('REDIS_PORT') ??
      (isProduction ? undefined : 6379);

    if (!host || portValue === undefined) {
      throw new Error(
        'REDIS_HOST and REDIS_PORT are required in production',
      );
    }

    const port = Number(portValue);

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error('REDIS_PORT must be a valid TCP port');
    }

    const redis = new Redis({
      host,
      port,
      password: this.configService.get('REDIS_PASSWORD'),
      db: this.configService.get('REDIS_DB', 0),
    });

    try {
      const result = await redis.ping();
      await redis.quit();

      return {
        status: 'up',
        redis: {
          status: 'up',
          ping: result,
        },
      };
    } catch (error) {
      await redis.quit();
      return {
        status: 'down',
        redis: {
          status: 'down',
          error: (error as Error).message,
        },
      };
    }
  }

  @Get('readiness')
  @Public()
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }

  @Get('liveness')
  @Public()
  @HealthCheck()
  liveness() {
    return this.health.check([
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }
}
