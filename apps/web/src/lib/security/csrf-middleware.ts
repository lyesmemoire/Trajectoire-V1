// lib/security/csrf-middleware.ts
//
// CSRF MIDDLEWARE FOR NEXT.JS API ROUTES
// Implements Double Submit Cookie pattern with token rotation
//
// USAGE:
// Wrap API route handlers with csrfProtect() to enforce CSRF protection
//
// EXAMPLE:
// import { csrfProtect } from '@/lib/security/csrf-middleware';
// export const POST = csrfProtect(async (req) => {
//   // Your handler logic
// });

import { NextRequest, NextResponse } from 'next/server';
import { generateCsrfToken, isValidCsrfToken, extractCsrfToken, validateOrigin, getAllowedOrigins } from './csrf';
import { logger } from '@/lib/logger';

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_TOKEN_AGE = 3600; // 1 hour in seconds

/**
 * CSRF protection wrapper for API routes
 * Validates CSRF tokens for state-changing requests
 */
export function csrfProtect<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (req: NextRequest, ...args: any[]) => {
    // Only protect state-changing methods
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const validationResult = await validateCsrfRequest(req);
      
      if (!validationResult.valid) {
        logger.warn({
          method: req.method,
          path: req.nextUrl.pathname,
          reason: validationResult.reason,
        }, 'CSRF validation failed');
        
        return NextResponse.json(
          { error: 'CSRF validation failed', reason: validationResult.reason },
          { status: 403 }
        );
      }
    }

    // Execute the handler
    const response = await handler(req, ...args);

    // Rotate CSRF token after successful state change
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && response.ok) {
      const newToken = generateCsrfToken();
      response.cookies.set(CSRF_COOKIE_NAME, newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: CSRF_TOKEN_AGE,
        path: '/',
      });
      response.headers.set('x-csrf-token', newToken);
    }

    return response;
  }) as T;
}

/**
 * Validate CSRF request
 */
async function validateCsrfRequest(req: NextRequest): Promise<{ valid: boolean; reason?: string }> {
  // 1. Validate Origin header
  const origin = req.headers.get('origin');
  const allowedOrigins = getAllowedOrigins();
  
  if (!validateOrigin(origin, allowedOrigins)) {
    return { valid: false, reason: 'Invalid origin' };
  }

  // 2. Get CSRF token from cookie
  const cookieToken = req.cookies.get(CSRF_COOKIE_NAME)?.value;
  if (!cookieToken || !isValidCsrfToken(cookieToken)) {
    return { valid: false, reason: 'Missing or invalid CSRF cookie' };
  }

  // 3. Get CSRF token from request
  const body = await tryParseBody(req);
  const requestToken = extractCsrfToken(req.headers, body);
  
  if (!requestToken) {
    return { valid: false, reason: 'Missing CSRF token in request' };
  }

  // 4. Compare tokens
  if (cookieToken !== requestToken) {
    return { valid: false, reason: 'CSRF token mismatch' };
  }

  return { valid: true };
}

/**
 * Try to parse request body (non-destructive)
 */
async function tryParseBody(req: NextRequest): Promise<any> {
  try {
    const contentType = req.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return await req.json();
    }
    
    if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      return Object.fromEntries(formData);
    }
    
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      return Object.fromEntries(formData);
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Initialize CSRF token (for GET requests)
 * Called on initial page load to set the CSRF cookie
 */
export function initializeCsrfToken(response: NextResponse): NextResponse {
  const token = generateCsrfToken();
  
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: CSRF_TOKEN_AGE,
    path: '/',
  });
  
  response.headers.set('x-csrf-token', token);
  
  return response;
}

/**
 * Get current CSRF token from request
 */
export function getCsrfToken(req: NextRequest): string | null {
  return req.cookies.get(CSRF_COOKIE_NAME)?.value || null;
}
