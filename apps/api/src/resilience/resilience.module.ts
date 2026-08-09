import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CircuitBreakerService } from './circuit-breaker.service';
import { RetryService } from './retry.service';
import { TimeoutService } from './timeout.service';
import { BulkheadService } from './bulkhead.service';
import { GracefulDegradationService } from './graceful-degradation.service';
import { RollbackService } from './rollback.service';
import { StartupValidationService } from './startup-validation.service';
import { ShutdownValidationService } from './shutdown-validation.service';
import { RateLimitingService } from './rate-limiting.service';
import { RedisModule } from '../infrastructure/redis/redis.module';

@Global()
@Module({
  imports: [ConfigModule, RedisModule],
  providers: [
    CircuitBreakerService,
    RetryService,
    TimeoutService,
    BulkheadService,
    GracefulDegradationService,
    RollbackService,
    StartupValidationService,
    ShutdownValidationService,
    RateLimitingService,
  ],
  exports: [
    CircuitBreakerService,
    RetryService,
    TimeoutService,
    BulkheadService,
    GracefulDegradationService,
    RollbackService,
    StartupValidationService,
    ShutdownValidationService,
    RateLimitingService,
  ],
})
export class ResilienceModule {}
