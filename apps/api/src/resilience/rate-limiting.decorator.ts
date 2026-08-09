import { SetMetadata } from '@nestjs/common';
import {
  RATE_LIMIT_ROUTE_TYPE,
  RATE_LIMIT_SCOPES,
} from './rate-limiting.middleware';

/**
 * Decorator to apply rate limiting to a route
 * @param routeType - The type of route (api, auth, upload, graph, copilot, search, matching, simulation, dashboard, stripe)
 * @param scopes - The scopes to apply rate limiting to (default: ['IP'])
 */
export const RateLimit = (routeType: string, scopes: string[] = ['IP']) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(RATE_LIMIT_ROUTE_TYPE, routeType)(
      target,
      propertyKey,
      descriptor,
    );
    SetMetadata(RATE_LIMIT_SCOPES, scopes)(target, propertyKey, descriptor);
    return descriptor;
  };
};

/**
 * Decorator for API routes (100 req/min)
 */
export const RateLimitApi = (scopes?: string[]) => RateLimit('api', scopes);

/**
 * Decorator for Auth routes (10 req/min)
 */
export const RateLimitAuth = (scopes?: string[]) => RateLimit('auth', scopes);

/**
 * Decorator for Upload routes (20 req/min)
 */
export const RateLimitUpload = (scopes?: string[]) =>
  RateLimit('upload', scopes);

/**
 * Decorator for Graph routes (50 req/min)
 */
export const RateLimitGraph = (scopes?: string[]) => RateLimit('graph', scopes);

/**
 * Decorator for Copilot routes (30 req/min)
 */
export const RateLimitCopilot = (scopes?: string[]) =>
  RateLimit('copilot', scopes);

/**
 * Decorator for Search routes (100 req/min)
 */
export const RateLimitSearch = (scopes?: string[]) =>
  RateLimit('search', scopes);

/**
 * Decorator for Matching routes (50 req/min)
 */
export const RateLimitMatching = (scopes?: string[]) =>
  RateLimit('matching', scopes);

/**
 * Decorator for Simulation routes (20 req/min)
 */
export const RateLimitSimulation = (scopes?: string[]) =>
  RateLimit('simulation', scopes);

/**
 * Decorator for Dashboard routes (200 req/min)
 */
export const RateLimitDashboard = (scopes?: string[]) =>
  RateLimit('dashboard', scopes);

/**
 * Decorator for Stripe routes (10 req/min)
 */
export const RateLimitStripe = (scopes?: string[]) =>
  RateLimit('stripe', scopes);
