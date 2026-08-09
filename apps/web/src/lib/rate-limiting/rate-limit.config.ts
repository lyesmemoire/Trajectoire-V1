// lib/rate-limiting/rate-limit.config.ts
//
// RATE LIMITING CONFIGURATION
// Centralized configuration for all route types and their rate limits
//
// This file allows easy adjustment of rate limits without modifying the core service

import { RateLimitConfig, RouteType } from "./centralized-rate-limit.service";

// ============================================================
// RATE LIMIT CONFIGURATIONS
// ============================================================

export const RATE_LIMIT_CONFIGS: Record<RouteType, RateLimitConfig> = {
  // ------------------------------------------------------------
  // API - General API endpoints
  // ------------------------------------------------------------
  [RouteType.API]: {
    limit: 100,              // 100 requests per minute
    window: 60,               // 1 minute window
    burstLimit: 150,         // Allow burst up to 150 requests
    burstWindow: 10,          // Within 10 seconds
  },

  // ------------------------------------------------------------
  // AUTH - Authentication endpoints (login, signup, etc.)
  // ------------------------------------------------------------
  [RouteType.AUTH]: {
    limit: 10,               // 10 auth attempts per minute
    window: 60,               // 1 minute window
    burstLimit: 15,           // Allow burst up to 15 attempts
    burstWindow: 30,          // Within 30 seconds
  },

  // ------------------------------------------------------------
  // UPLOAD - File upload endpoints (CV, documents, etc.)
  // ------------------------------------------------------------
  [RouteType.UPLOAD]: {
    limit: 20,               // 20 uploads per hour
    window: 3600,             // 1 hour window
    burstLimit: 25,           // Allow burst up to 25 uploads
    burstWindow: 300,         // Within 5 minutes
  },

  // ------------------------------------------------------------
  // GRAPH - Knowledge graph endpoints
  // ------------------------------------------------------------
  [RouteType.GRAPH]: {
    limit: 50,               // 50 graph queries per minute
    window: 60,               // 1 minute window
    burstLimit: 75,           // Allow burst up to 75 queries
    burstWindow: 15,          // Within 15 seconds
  },

  // ------------------------------------------------------------
  // COPILOT - AI copilot endpoints
  // ------------------------------------------------------------
  [RouteType.COPILOT]: {
    limit: 30,               // 30 copilot requests per minute
    window: 60,               // 1 minute window
    burstLimit: 45,           // Allow burst up to 45 requests
    burstWindow: 20,          // Within 20 seconds
  },

  // ------------------------------------------------------------
  // SEARCH - Search endpoints
  // ------------------------------------------------------------
  [RouteType.SEARCH]: {
    limit: 100,              // 100 searches per minute
    window: 60,               // 1 minute window
    burstLimit: 150,         // Allow burst up to 150 searches
    burstWindow: 10,          // Within 10 seconds
  },

  // ------------------------------------------------------------
  // MATCHING - Job/candidate matching endpoints
  // ------------------------------------------------------------
  [RouteType.MATCHING]: {
    limit: 50,               // 50 matching requests per minute
    window: 60,               // 1 minute window
    burstLimit: 75,           // Allow burst up to 75 requests
    burstWindow: 15,          // Within 15 seconds
  },

  // ------------------------------------------------------------
  // SIMULATION - Interview simulation endpoints
  // ------------------------------------------------------------
  [RouteType.SIMULATION]: {
    limit: 20,               // 20 simulations per hour
    window: 3600,             // 1 hour window
    burstLimit: 25,           // Allow burst up to 25 simulations
    burstWindow: 300,         // Within 5 minutes
  },

  // ------------------------------------------------------------
  // DASHBOARD - Dashboard data endpoints
  // ------------------------------------------------------------
  [RouteType.DASHBOARD]: {
    limit: 200,              // 200 dashboard requests per minute
    window: 60,               // 1 minute window
    burstLimit: 300,          // Allow burst up to 300 requests
    burstWindow: 10,          // Within 10 seconds
  },

  // ------------------------------------------------------------
  // STRIPE - Stripe webhook and payment endpoints
  // ------------------------------------------------------------
  [RouteType.STRIPE]: {
    limit: 10,               // 10 Stripe requests per minute
    window: 60,               // 1 minute window
    burstLimit: 15,           // Allow burst up to 15 requests
    burstWindow: 30,          // Within 30 seconds
  },
};

// ============================================================
// SCOPE CONFIGURATIONS
// ============================================================

/**
 * Default scopes for each route type
 * Can be overridden in middleware options
 */
export const DEFAULT_SCOPES: Record<RouteType, string[]> = {
  [RouteType.API]: ["IP", "USER"],
  [RouteType.AUTH]: ["IP"],           // Auth endpoints use IP only to prevent enumeration
  [RouteType.UPLOAD]: ["USER", "IP"],
  [RouteType.GRAPH]: ["USER", "IP"],
  [RouteType.COPILOT]: ["USER", "IP"],
  [RouteType.SEARCH]: ["USER", "IP"],
  [RouteType.MATCHING]: ["USER", "IP"],
  [RouteType.SIMULATION]: ["USER", "IP"],
  [RouteType.DASHBOARD]: ["USER"],
  [RouteType.STRIPE]: ["IP"],         // Stripe webhooks use IP only
};

// ============================================================
// ENVIRONMENT OVERRIDES
// ============================================================

/**
 * Apply environment-specific overrides
 */
export function applyEnvironmentOverrides(): void {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isTest = process.env.NODE_ENV === "test";

  if (isDevelopment || isTest) {
    // Relax rate limits in development/test
    Object.values(RATE_LIMIT_CONFIGS).forEach(config => {
      config.limit *= 10;      // 10x higher limits
      config.burstLimit = config.burstLimit ? config.burstLimit * 10 : config.limit * 1.5;
    });
  }

  // Custom overrides from environment variables
  const customLimits = process.env.CUSTOM_RATE_LIMITS;
  if (customLimits) {
    try {
      const overrides = JSON.parse(customLimits);
      Object.entries(overrides).forEach(([routeType, override]) => {
        if (RATE_LIMIT_CONFIGS[routeType as RouteType]) {
          Object.assign(RATE_LIMIT_CONFIGS[routeType as RouteType], override);
        }
      });
    } catch (error) {
      console.error("Failed to parse CUSTOM_RATE_LIMITS:", error);
    }
  }
}

// Apply overrides on import
applyEnvironmentOverrides();

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Get configuration for a specific route type
 */
export function getConfig(routeType: RouteType): RateLimitConfig {
  return RATE_LIMIT_CONFIGS[routeType] || RATE_LIMIT_CONFIGS[RouteType.API];
}

/**
 * Get default scopes for a specific route type
 */
export function getDefaultScopes(routeType: RouteType): string[] {
  return DEFAULT_SCOPES[routeType] || DEFAULT_SCOPES[RouteType.API];
}

/**
 * Validate rate limit configuration
 */
export function validateConfig(): boolean {
  let isValid = true;

  Object.entries(RATE_LIMIT_CONFIGS).forEach(([routeType, config]) => {
    if (config.limit <= 0) {
      console.error(`Invalid limit for ${routeType}: ${config.limit}`);
      isValid = false;
    }
    if (config.window <= 0) {
      console.error(`Invalid window for ${routeType}: ${config.window}`);
      isValid = false;
    }
    if (config.burstLimit && config.burstLimit <= config.limit) {
      console.error(`Burst limit must be greater than limit for ${routeType}`);
      isValid = false;
    }
    if (config.burstWindow && config.burstWindow >= config.window) {
      console.error(`Burst window must be smaller than main window for ${routeType}`);
      isValid = false;
    }
  });

  return isValid;
}
