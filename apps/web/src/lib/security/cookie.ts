// lib/security/cookie.ts
//
// COOKIE SECURITY UTILITIES
// Provides secure cookie configuration and management
//
// USAGE:
// Use these utilities to set secure cookies with proper flags

import { NextResponse } from 'next/server';

/**
 * Cookie Security Configuration
 */
const COOKIE_CONFIG = {
  // Secure flag (HTTPS only)
  SECURE: process.env.NODE_ENV === 'production',
  
  // HttpOnly flag (prevents JavaScript access)
  HTTPONLY: true,
  
  // SameSite attribute (CSRF protection)
  SAMESITE: 'strict' as const,
  
  // Path (cookie scope)
  PATH: '/',
  
  // Domain (cookie scope - null for current domain)
  DOMAIN: process.env.COOKIE_DOMAIN || null,
  
  // Default max age (1 hour for session cookies)
  MAX_AGE: 3600,
  
  // Cookie prefix for security
  PREFIX: '__Secure-',
} as const;

/**
 * Cookie Types
 */
export enum CookieType {
  SESSION = 'session',
  CSRF = 'csrf',
  PREFERENCE = 'preference',
  ANALYTICS = 'analytics',
}

/**
 * Cookie Configuration by Type
 */
const COOKIE_TYPE_CONFIG = {
  [CookieType.SESSION]: {
    maxAge: 3600, // 1 hour
    httpOnly: true,
    secure: COOKIE_CONFIG.SECURE,
    sameSite: 'strict' as const,
    path: '/',
  },
  [CookieType.CSRF]: {
    maxAge: 3600, // 1 hour
    httpOnly: true,
    secure: COOKIE_CONFIG.SECURE,
    sameSite: 'strict' as const,
    path: '/',
  },
  [CookieType.PREFERENCE]: {
    maxAge: 30 * 24 * 3600, // 30 days
    httpOnly: false, // Preferences can be accessed by JS
    secure: COOKIE_CONFIG.SECURE,
    sameSite: 'lax' as const, // Lax for better UX
    path: '/',
  },
  [CookieType.ANALYTICS]: {
    maxAge: 365 * 24 * 3600, // 1 year
    httpOnly: false, // Analytics can be accessed by JS
    secure: COOKIE_CONFIG.SECURE,
    sameSite: 'lax' as const,
    path: '/',
  },
};

/**
 * Set a secure cookie
 */
export function setSecureCookie(
  response: NextResponse,
  name: string,
  value: string,
  type: CookieType = CookieType.SESSION,
  options?: Partial<{
    maxAge: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    path: string;
    domain: string | null;
  }>
): void {
  const config = COOKIE_TYPE_CONFIG[type];
  const cookieOptions = {
    httpOnly: options?.httpOnly ?? config.httpOnly,
    secure: options?.secure ?? config.secure,
    sameSite: options?.sameSite ?? config.sameSite,
    path: options?.path ?? config.path,
    maxAge: options?.maxAge ?? config.maxAge,
    domain: options?.domain ?? COOKIE_CONFIG.DOMAIN,
  };

  response.cookies.set(name, value, {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
    maxAge: cookieOptions.maxAge,
    domain: cookieOptions.domain || undefined,
  });
}

/**
 * Set a secure cookie with prefix
 */
export function setSecureCookieWithPrefix(
  response: NextResponse,
  name: string,
  value: string,
  type: CookieType = CookieType.SESSION
): void {
  const prefixedName = `${COOKIE_CONFIG.PREFIX}${name}`;
  setSecureCookie(response, prefixedName, value, type);
}

/**
 * Delete a cookie
 */
export function deleteCookie(response: NextResponse, name: string): void {
  response.cookies.delete(name);
}

/**
 * Delete a cookie with prefix
 */
export function deleteCookieWithPrefix(response: NextResponse, name: string): void {
  const prefixedName = `${COOKIE_CONFIG.PREFIX}${name}`;
  deleteCookie(response, prefixedName);
}

/**
 * Get secure cookie options for a given type
 */
export function getCookieOptions(type: CookieType) {
  return {
    ...COOKIE_TYPE_CONFIG[type],
    domain: COOKIE_CONFIG.DOMAIN,
  };
}

/**
 * Validate cookie name
 */
export function validateCookieName(name: string): boolean {
  // Cookie names must not contain special characters
  const validName = /^[a-zA-Z0-9_\-]+$/.test(name);
  
  // Cookie names should not start with __Secure- unless it's a secure cookie
  if (name.startsWith('__Secure-')) {
    return true;
  }
  
  // Cookie names should not start with __Host- unless it's a host cookie
  if (name.startsWith('__Host-')) {
    return true;
  }
  
  return validName;
}

/**
 * Sanitize cookie value
 */
export function sanitizeCookieValue(value: string): string {
  // Remove potentially dangerous characters
  return value
    .replace(/[;=]/g, '')
    .replace(/\s+/g, '')
    .substring(0, 4096); // Max cookie size
}

/**
 * Check if cookie is secure
 */
export function isCookieSecure(name: string): boolean {
  return name.startsWith('__Secure-') || name.startsWith('__Host-');
}

/**
 * Get cookie rotation timestamp
 */
export function getCookieRotationTimestamp(): number {
  return Math.floor(Date.now() / (15 * 60 * 1000)); // 15-minute intervals
}

/**
 * Generate cookie rotation suffix
 */
export function generateCookieRotationSuffix(): string {
  const timestamp = getCookieRotationTimestamp();
  return `_${timestamp}`;
}

/**
 * Add rotation suffix to cookie name
 */
export function addRotationSuffix(name: string): string {
  return `${name}${generateCookieRotationSuffix()}`;
}

/**
 * Remove rotation suffix from cookie name
 */
export function removeRotationSuffix(name: string): string {
  return name.replace(/_\d+$/, '');
}

/**
 * Check if cookie needs rotation
 */
export function needsRotation(lastRotation: number): boolean {
  const currentRotation = getCookieRotationTimestamp();
  return currentRotation > lastRotation;
}

/**
 * Get cookie expiration date
 */
export function getCookieExpiration(maxAge: number): Date {
  return new Date(Date.now() + maxAge * 1000);
}

/**
 * Check if cookie is expired
 */
export function isCookieExpired(expiresAt: Date): boolean {
  return expiresAt < new Date();
}

/**
 * Create cookie isolation key
 */
export function createCookieIsolationKey(userId: string, sessionId: string): string {
  return `${userId}:${sessionId}`;
}

/**
 * Validate cookie isolation
 */
export function validateCookieIsolation(
  cookieKey: string,
  expectedUserId: string,
  expectedSessionId: string
): boolean {
  const expectedKey = createCookieIsolationKey(expectedUserId, expectedSessionId);
  return cookieKey === expectedKey;
}

/**
 * Get Supabase cookie options
 */
export function getSupabaseCookieOptions() {
  return {
    name: 'sb-session-token',
    options: {
      httpOnly: true,
      secure: COOKIE_CONFIG.SECURE,
      sameSite: 'strict' as const,
      path: '/',
      maxAge: 3600, // 1 hour
      domain: COOKIE_CONFIG.DOMAIN,
    },
  };
}

/**
 * Set Supabase session cookie
 */
export function setSupabaseCookie(
  response: NextResponse,
  token: string
): void {
  const { name, options } = getSupabaseCookieOptions();
  response.cookies.set(name, token, {
    httpOnly: options.httpOnly,
    secure: options.secure,
    sameSite: options.sameSite,
    path: options.path,
    maxAge: options.maxAge,
    domain: options.domain || undefined,
  });
}

/**
 * Delete Supabase session cookie
 */
export function deleteSupabaseCookie(response: NextResponse): void {
  const { name } = getSupabaseCookieOptions();
  deleteCookie(response, name);
}
