import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { shutdownOpenTelemetry } from './opentelemetry';

@Injectable()
export class OpenTelemetryLifecycleService
  implements OnApplicationShutdown
{
  async onApplicationShutdown(): Promise<void> {
    await shutdownOpenTelemetry();
  }
}
