import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './config/validate-environment';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './infrastructure/health/health.module';
import { RedisCacheModule } from './cache/cache.module';
import { ResilienceModule } from './resilience/resilience.module';
import { CvModule } from './cv/cv.module';
import { JobModule } from './job/job.module';
import { MatchingModule } from './matching/matching.module';
import { SearchModule } from './search/search.module';
import { CopilotModule } from './copilot/copilot.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RateLimitingMiddleware } from './resilience/rate-limiting.middleware';
import { OpenTelemetryLifecycleService } from './telemetry/open-telemetry-lifecycle.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
    RedisCacheModule,
    ResilienceModule,
    AuthModule,
    CvModule,
    JobModule,
    MatchingModule,
    SearchModule,
    CopilotModule,
    DashboardModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService, OpenTelemetryLifecycleService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitingMiddleware).forRoutes('*');
  }
}
