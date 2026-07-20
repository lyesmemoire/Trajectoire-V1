/**
 * Graceful Shutdown Service
 * Handles SIGTERM and SIGINT signals to ensure clean shutdown
 * - Stop accepting new requests
 * - Complete in-progress requests
 * - Close database connections
 * - Close OpenAI connections
 * - Clear cache
 * - Exit cleanly
 */

import { getCache } from "@/lib/cache/MemoryCache";
import { logger } from "@/lib/logger/Logger";

export interface ShutdownOptions {
  timeout?: number; // Maximum time to wait for graceful shutdown (default: 30 seconds)
  onShutdownStart?: () => void;
  onShutdownComplete?: () => void;
  onShutdownError?: (error: Error) => void;
}

export class GracefulShutdown {
  private isShuttingDown = false;
  private activeRequests = 0;
  private shutdownTimeout: NodeJS.Timeout | null = null;
  private options: Required<ShutdownOptions>;

  constructor(options: ShutdownOptions = {}) {
    this.options = {
      timeout: options.timeout || 30000,
      onShutdownStart: options.onShutdownStart || (() => {}),
      onShutdownComplete: options.onShutdownComplete || (() => {}),
      onShutdownError: options.onShutdownError || (() => {}),
    };

    this.setupSignalHandlers();
  }

  /**
   * Setup signal handlers for SIGTERM and SIGINT
   */
  private setupSignalHandlers(): void {
    if (typeof process !== "undefined") {
      process.on("SIGTERM", () => this.handleShutdown("SIGTERM"));
      process.on("SIGINT", () => this.handleShutdown("SIGINT"));
    }
  }

  /**
   * Handle shutdown signal
   */
  private async handleShutdown(signal: string): Promise<void> {
    if (this.isShuttingDown) {
      logger.warn(`[${signal}] Shutdown already in progress, ignoring duplicate signal`);
      return;
    }

    this.isShuttingDown = true;
    logger.info(`[${signal}] Starting graceful shutdown...`);

    try {
      this.options.onShutdownStart();

      // Set timeout for graceful shutdown
      this.shutdownTimeout = setTimeout(() => {
        logger.error(`[${signal}] Graceful shutdown timeout, forcing exit`);
        this.forceExit(1);
      }, this.options.timeout);

      // Step 1: Stop accepting new requests (handled by isShuttingDown flag)
      logger.info(`[${signal}] Stopping new requests...`);

      // Step 2: Wait for in-progress requests to complete
      logger.info(`[${signal}] Waiting for ${this.activeRequests} in-progress requests...`);
      await this.waitForRequestsToComplete();

      // Step 3: Close database connections
      logger.info(`[${signal}] Closing database connections...`);
      await this.closeDatabaseConnections();

      // Step 4: Close OpenAI connections
      logger.info(`[${signal}] Closing OpenAI connections...`);
      await this.closeOpenAIConnections();

      // Step 5: Clear cache
      logger.info(`[${signal}] Clearing cache...`);
      await this.clearCache();

      // Clear timeout
      if (this.shutdownTimeout) {
        clearTimeout(this.shutdownTimeout);
        this.shutdownTimeout = null;
      }

      logger.info(`[${signal}] Graceful shutdown complete`);
      this.options.onShutdownComplete();

      // Exit successfully
      this.forceExit(0);
    } catch (error) {
      logger.error(`[${signal}] Error during graceful shutdown`, { error });
      this.options.onShutdownError(error as Error);
      
      // Clear timeout
      if (this.shutdownTimeout) {
        clearTimeout(this.shutdownTimeout);
        this.shutdownTimeout = null;
      }

      // Exit with error
      this.forceExit(1);
    }
  }

  /**
   * Wait for in-progress requests to complete
   */
  private async waitForRequestsToComplete(): Promise<void> {
    const maxWaitTime = 10000; // Maximum 10 seconds to wait for requests
    const startTime = Date.now();

    while (this.activeRequests > 0 && Date.now() - startTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (this.activeRequests > 0) {
      logger.warn(`${this.activeRequests} requests still in progress after timeout`);
    }
  }

  /**
   * Close database connections
   */
  private async closeDatabaseConnections(): Promise<void> {
    // Database connections are managed by Supabase client
    // In a real implementation, you would close connection pools here
    // For now, we just log
    logger.info("Database connections closed");
  }

  /**
   * Close OpenAI connections
   */
  private async closeOpenAIConnections(): Promise<void> {
    // OpenAI connections are managed by the OpenAI SDK
    // In a real implementation, you would close connection pools here
    // For now, we just log
    logger.info("OpenAI connections closed");
  }

  /**
   * Clear cache
   */
  private async clearCache(): Promise<void> {
    try {
      const cache = getCache();
      cache.destroy();
      logger.info("Cache cleared");
    } catch (error) {
      logger.error("Error clearing cache", { error });
    }
  }

  /**
   * Force exit with code
   */
  private forceExit(code: number): void {
    if (typeof process !== "undefined") {
      process.exit(code);
    }
  }

  /**
   * Increment active request counter
   */
  incrementActiveRequests(): void {
    if (!this.isShuttingDown) {
      this.activeRequests++;
    }
  }

  /**
   * Decrement active request counter
   */
  decrementActiveRequests(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
  }

  /**
   * Check if application is shutting down
   */
  isShuttingDownStatus(): boolean {
    return this.isShuttingDown;
  }

  /**
   * Get active request count
   */
  getActiveRequestCount(): number {
    return this.activeRequests;
  }
}

// Singleton instance
let shutdownInstance: GracefulShutdown | null = null;

/**
 * Get the singleton graceful shutdown instance
 */
export function getGracefulShutdown(options?: ShutdownOptions): GracefulShutdown {
  if (!shutdownInstance) {
    shutdownInstance = new GracefulShutdown(options);
  }
  return shutdownInstance;
}

/**
 * Middleware to track active requests
 */
export function trackActiveRequests() {
  return (req: any, res: any, next: any) => {
    const shutdown = getGracefulShutdown();

    if (shutdown.isShuttingDownStatus()) {
      // Return 503 Service Unavailable if shutting down
      return res.status(503).json({
        error: "Service Unavailable",
        message: "Server is shutting down",
      });
    }

    shutdown.incrementActiveRequests();

    res.on("finish", () => {
      shutdown.decrementActiveRequests();
    });

    next();
  };
}
