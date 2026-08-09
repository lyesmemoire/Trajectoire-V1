import { Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class GracefulShutdownService implements OnModuleDestroy {
  private shutdownHandlers: Array<() => Promise<void>> = [];

  registerShutdownHandler(handler: () => Promise<void>) {
    this.shutdownHandlers.push(handler);
  }

  async onModuleDestroy() {
    for (const handler of this.shutdownHandlers) {
      try {
        await handler();
      } catch (error) {
        console.error('Error during graceful shutdown:', error);
      }
    }
  }
}
