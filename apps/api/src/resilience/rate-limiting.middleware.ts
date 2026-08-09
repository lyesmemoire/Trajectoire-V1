import {
  Injectable,
  NestMiddleware,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Reflector } from '@nestjs/core';
import { RateLimitingService, RateLimitScope } from './rate-limiting.service';

export const RATE_LIMIT_KEY = 'rateLimit';
export const RATE_LIMIT_ROUTE_TYPE = 'rateLimitRouteType';
export const RATE_LIMIT_SCOPES = 'rateLimitScopes';

export interface RateLimitOptions {
  routeType: string;
  scopes?: RateLimitScope[];
}

@Injectable()
export class RateLimitingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RateLimitingMiddleware.name);

  constructor(
    private readonly rateLimitingService: RateLimitingService,
    private readonly reflector: Reflector,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Get rate limit options from handler metadata
      const routeType =
        this.reflector.get<string>(RATE_LIMIT_ROUTE_TYPE, req.route?.handler) ||
        'api';

      const scopes = this.reflector.get<RateLimitScope[]>(
        RATE_LIMIT_SCOPES,
        req.route?.handler,
      ) || [RateLimitScope.IP];

      // Extract identifiers for different scopes
      const identifiers = this.extractIdentifiers(req);

      // Check rate limit for each scope
      for (const scope of scopes) {
        const identifier = identifiers[scope];
        if (!identifier) continue;

        const result = await this.rateLimitingService.checkRateLimit(
          scope,
          identifier,
          routeType,
        );

        if (!result.allowed) {
          // Set rate limit headers
          this.setRateLimitHeaders(res, result, routeType);

          this.logger.warn(
            `Rate limit exceeded for ${scope}:${identifier} on ${req.path} (${routeType})`,
          );

          throw new ForbiddenException({
            statusCode: 429,
            message: 'Too many requests',
            error: 'RATE_LIMIT_EXCEEDED',
            retryAfter: result.retryAfter,
          });
        }

        // Set rate limit headers for successful requests
        this.setRateLimitHeaders(res, result, routeType);
      }

      next();
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(
        `Rate limiting middleware error: ${(error as Error).message}`,
      );
      next();
    }
  }

  /**
   * Extract identifiers from request for different scopes
   */
  private extractIdentifiers(
    req: Request,
  ): Record<RateLimitScope, string | null> {
    const ip = this.extractIp(req);
    const userId = this.extractUserId(req);
    const sessionId = this.extractSessionId(req);
    const organisationId = this.extractOrganisationId(req);

    return {
      [RateLimitScope.IP]: ip,
      [RateLimitScope.USER]: userId,
      [RateLimitScope.SESSION]: sessionId,
      [RateLimitScope.ORGANISATION]: organisationId,
    };
  }

  /**
   * Extract IP address from request
   */
  private extractIp(req: Request): string {
    const trustProxy = process.env.TRUST_PROXY === 'true';

    if (trustProxy) {
      // When behind a trusted proxy, use X-Forwarded-For
      const forwarded = req.headers['x-forwarded-for'] as string;
      const realIp = req.headers['x-real-ip'] as string;
      return (
        forwarded?.split(',')[0]?.trim() ||
        realIp ||
        req.socket.remoteAddress ||
        'unknown'
      );
    } else {
      // When not behind a proxy, use only the direct connection IP
      return req.socket.remoteAddress || 'unknown';
    }
  }

  /**
   * Extract user ID from request
   */
  private extractUserId(req: Request): string | null {
    const user = (req as any).user;
    return user?.id || user?.userId || null;
  }

  /**
   * Extract session ID from request
   */
  private extractSessionId(req: Request): string | null {
    return (
      (req as any).sessionId || (req.headers['x-session-id'] as string) || null
    );
  }

  /**
   * Extract organisation ID from request
   */
  private extractOrganisationId(req: Request): string | null {
    const user = (req as any).user;
    return user?.organisationId || user?.organizationId || null;
  }

  /**
   * Set rate limit headers on response
   */
  private setRateLimitHeaders(
    res: Response,
    result: {
      allowed: boolean;
      remaining: number;
      resetTime: Date;
      retryAfter?: number;
    },
    routeType: string,
  ): void {
    res.setHeader('X-RateLimit-Limit', this.getLimitForRoute(routeType));
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader(
      'X-RateLimit-Reset',
      Math.floor(result.resetTime.getTime() / 1000),
    );

    if (result.retryAfter) {
      res.setHeader('Retry-After', result.retryAfter);
    }
  }

  /**
   * Get limit for route type
   */
  private getLimitForRoute(routeType: string): number {
    const limits: Record<string, number> = {
      api: 100,
      auth: 10,
      upload: 20,
      graph: 50,
      copilot: 30,
      search: 100,
      matching: 50,
      simulation: 20,
      dashboard: 200,
      stripe: 10,
    };
    return limits[routeType] || 100;
  }
}
