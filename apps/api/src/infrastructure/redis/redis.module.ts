import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const redisEnabled = configService.get('REDIS_ENABLED') !== 'false';
        
        if (!redisEnabled) {
          console.log('Redis is disabled via REDIS_ENABLED=false');
          return null;
        }

        const isProduction =
          configService.get<string>('NODE_ENV') === 'production';

        const host =
          configService.get<string>('REDIS_HOST') ||
          (isProduction ? undefined : 'localhost');

        const portValue =
          configService.get<string | number>('REDIS_PORT') ??
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
          password: configService.get('REDIS_PASSWORD'),
          db: configService.get('REDIS_DB') || 0,
          retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
          maxRetriesPerRequest: 3,
          enableReadyCheck: true,
          lazyConnect: true,
        });

        redis.on('error', (err) => {
          console.error('Redis connection error:', err.message);
        });

        return redis;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
