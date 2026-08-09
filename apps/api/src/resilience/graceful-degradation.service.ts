import { Injectable, Logger } from '@nestjs/common';

export interface DegradationLevel {
  level: 'full' | 'degraded' | 'minimal' | 'offline';
  features: string[];
  reason?: string;
}

export interface FallbackConfig {
  fallbackFn: () => any;
  fallbackValue?: any;
  shouldFallback?: (error: Error) => boolean;
}

@Injectable()
export class GracefulDegradationService {
  private readonly logger = new Logger(GracefulDegradationService.name);
  private currentLevel: DegradationLevel = {
    level: 'full',
    features: [],
  };

  async executeWithFallback<T>(
    fn: () => Promise<T>,
    config: FallbackConfig,
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      const err = error as Error;
      
      const shouldFallback = config.shouldFallback
        ? config.shouldFallback(err)
        : true;

      if (shouldFallback) {
        this.logger.warn(`Executing fallback due to error: ${err.message}`);
        
        if (config.fallbackFn) {
          return await config.fallbackFn();
        }
        
        if (config.fallbackValue !== undefined) {
          return config.fallbackValue as T;
        }
      }
      
      throw error;
    }
  }

  setDegradationLevel(level: DegradationLevel): void {
    this.currentLevel = level;
    this.logger.warn(
      `Degradation level set to ${level.level}. Reason: ${level.reason || 'Not specified'}`,
    );
  }

  getDegradationLevel(): DegradationLevel {
    return this.currentLevel;
  }

  isFeatureAvailable(feature: string): boolean {
    if (this.currentLevel.level === 'full') {
      return true;
    }

    if (this.currentLevel.level === 'offline') {
      return false;
    }

    // Check if feature is in the allowed list for current degradation level
    return this.currentLevel.features.includes(feature);
  }

  async executeIfAvailable<T>(
    feature: string,
    fn: () => Promise<T>,
    fallbackValue?: T,
  ): Promise<T> {
    if (this.isFeatureAvailable(feature)) {
      return await fn();
    }

    this.logger.debug(`Feature ${feature} is not available in current degradation level`);
    
    if (fallbackValue !== undefined) {
      return fallbackValue;
    }
    
    throw new Error(`Feature ${feature} is not available`);
  }

  async executeWithCircuitBreakerFallback<T>(
    feature: string,
    fn: () => Promise<T>,
    fallbackFn: () => Promise<T>,
  ): Promise<T> {
    try {
      if (this.isFeatureAvailable(feature)) {
        return await fn();
      }
    } catch (error) {
      this.logger.warn(`Feature ${feature} failed, using fallback: ${error}`);
    }

    return await fallbackFn();
  }

  getCacheFallback<T>(key: string, cachedValue: T | null): T | null {
    if (cachedValue !== null) {
      this.logger.debug(`Returning cached value for ${key} due to degradation`);
      return cachedValue;
    }
    
    return null;
  }

  async getStaleDataFallback<T>(
    freshFn: () => Promise<T>,
    staleFn: () => Promise<T>,
  ): Promise<T> {
    try {
      return await freshFn();
    } catch (error) {
      this.logger.warn('Fresh data fetch failed, returning stale data');
      return await staleFn();
    }
  }
}
