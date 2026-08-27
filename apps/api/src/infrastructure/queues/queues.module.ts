import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
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
          redis: {
            host,
            port,
            password: configService.get('REDIS_PASSWORD'),
            db: configService.get('REDIS_DB') || 0,
          },
          defaultJobOptions: {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 2000,
            },
            removeOnComplete: 10,
            removeOnFail: 50,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [BullModule],
})
export class QueuesModule {}
