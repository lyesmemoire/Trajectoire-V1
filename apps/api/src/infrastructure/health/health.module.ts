import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { MemoryHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';
import * as si from 'systeminformation';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [
    MemoryHealthIndicator,
    DiskHealthIndicator,
    {
      provide: 'TERMINUS:CHECK_DISK_SPACE_LIB',
      useValue: si,
    },
  ],
})
export class HealthModule {}
