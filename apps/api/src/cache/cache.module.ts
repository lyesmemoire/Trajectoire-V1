import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cache.decorator';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
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

        return {
          store: redisStore,
          host,
          port,
          password: configService.get('REDIS_PASSWORD'),
          db: configService.get('REDIS_DB', 0),
          ttl: configService.get('CACHE_TTL', 3600), // 1 hour default
          max: configService.get('CACHE_MAX', 1000), // Max items in cache
          isCacheableValue: (val: any) => val !== undefined && val !== null,
        };
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheModule, CacheService],
})
export class RedisCacheModule {}
