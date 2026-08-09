// lib/security/jwt-middleware.ts
//
// JWT VALIDATION MIDDLEWARE
// Provides middleware for validating JWT tokens in API routes
//
// USAGE:
// Wrap your API route handlers with jwtAuth to validate JWT tokens

import { NextRequest, NextResponse } from 'next/server';
import { validateToken, TokenType, JWTPayloadExtended } from './jwt';
import { logger } from '@/lib/logger';

/**
 * JWT Authentication Middleware
 * Validates JWT tokens and attaches user context to the request
 */
export function jwtAuth<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (req: NextRequest, ...args: any[]) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Missing or invalid authorization header' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Validate the token
      const validation = await validateToken(token, TokenType.ACCESS);
      
      if (!validation.valid || !validation.payload) {
        logger.warn({
          error: validation.error,
          path: req.nextUrl.pathname,
        }, 'JWT validation failed');
        
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Attach user context to request headers for downstream use
      const response = await handler(req, ...args);
      
      // Add user context to response headers
      response.headers.set('x-user-id', validation.payload.userId);
      response.headers.set('x-user-email', validation.payload.email);
      
      return response;
    } catch (error: any) {
      logger.error({ error, path: req.nextUrl.pathname }, 'JWT middleware error');
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }
  }) as T;
}

/**
 * Optional JWT Authentication Middleware
 * Validates JWT tokens if present but doesn't require them
 */
export function optionalJwtAuth<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (req: NextRequest, ...args: any[]) => {
    try {
      const authHeader = req.headers.get('authorization');
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        
        const validation = await validateToken(token, TokenType.ACCESS);
        
        if (validation.valid && validation.payload) {
          // Attach user context to request
          req.headers.set('x-user-id', validation.payload.userId);
          req.headers.set('x-user-email', validation.payload.email);
        }
      }
      
      return await handler(req, ...args);
    } catch (error: any) {
      logger.error({ error, path: req.nextUrl.pathname }, 'Optional JWT middleware error');
      return await handler(req, ...args);
    }
  }) as T;
}

/**
 * Extract user ID from request headers (set by JWT middleware)
 */
export function getUserIdFromRequest(req: NextRequest): string | null {
  return req.headers.get('x-user-id');
}

/**
 * Extract user email from request headers (set by JWT middleware)
 */
export function getUserEmailFromRequest(req: NextRequest): string | null {
  return req.headers.get('x-user-email');
}

/**
 * Get user context from request
 */
export function getUserContext(req: NextRequest): { userId: string | null; email: string | null } {
  return {
    userId: getUserIdFromRequest(req),
    email: getUserEmailFromRequest(req),
  };
}
