import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class TransactionService {
  private readonly redis: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
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
