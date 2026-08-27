import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class TransactionService {
  private readonly redis: Redis;

  constructor(private readonly configService: ConfigService) {
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

    this.redis = new Redis({
      host,
      port,
      password: this.configService.get('REDIS_PASSWORD'),
      db: this.configService.get('REDIS_DB', 0),
    });
  }

  async executeInTransaction<T>(
    operations: () => Promise<T>,
    transactionId: string,
  ): Promise<T> {
    const lockKey = `transaction:${transactionId}`;

    try {
      const acquired = await this.redis.set(lockKey, '1', 'EX', 30, 'NX');

      if (!acquired) {
        throw new Error(`Transaction ${transactionId} is already in progress`);
      }

      const result = await operations();

      await this.redis.del(lockKey);

      return result;
    } catch (error) {
      await this.redis.del(lockKey);
      throw error;
    }
  }

  async acquireLock(lockKey: string, ttl: number = 30): Promise<boolean> {
    const acquired = await this.redis.set(lockKey, '1', 'EX', ttl, 'NX');
    return acquired === 'OK';
  }

  async releaseLock(lockKey: string): Promise<void> {
    await this.redis.del(lockKey);
  }

  async extendLock(lockKey: string, ttl: number = 30): Promise<boolean> {
    const result = await this.redis.expire(lockKey, ttl);
    return result === 1;
  }
}
