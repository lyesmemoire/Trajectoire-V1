import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import pino from 'pino';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'LOGGER',
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        const options: pino.LoggerOptions = {
          level: configService.get('LOG_LEVEL') || 'info',
          serializers: {
            error: pino.stdSerializers.err,
            req: pino.stdSerializers.req,
            res: pino.stdSerializers.res,
          },
          timestamp: pino.stdTimeFunctions.isoTime,
          base: {
            pid: process.pid,
            hostname: require('os').hostname(),
          },
        };

        if (!isProduction) {
          options.transport = {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          };
        }

        return pino(options);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['LOGGER'],
})
export class LoggingModule {}
