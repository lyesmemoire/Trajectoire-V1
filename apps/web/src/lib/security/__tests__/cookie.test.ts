// lib/security/__tests__/cookie.test.ts
//
// COOKIE SECURITY TESTS
// Tests for cookie security utilities and configuration

import { 
  setSecureCookie,
  setSecureCookieWithPrefix,
  deleteCookie,
  deleteCookieWithPrefix,
  getCookieOptions,
  validateCookieName,
  sanitizeCookieValue,
  isCookieSecure,
  getCookieRotationTimestamp,
  generateCookieRotationSuffix,
  addRotationSuffix,
  removeRotationSuffix,
  needsRotation,
  getCookieExpiration,
  isCookieExpired,
  createCookieIsolationKey,
  validateCookieIsolation,
  getSupabaseCookieOptions,
  setSupabaseCookie,
  deleteSupabaseCookie,
  CookieType 
} from '../cookie';
import { NextResponse } from 'next/server';

describe('Cookie Security Configuration', () => {
  it('should have secure configuration for session cookies', () => {
    const options = getCookieOptions(CookieType.SESSION);
    
    expect(options.httpOnly).toBe(true);
    expect(options.secure).toBe(process.env.NODE_ENV === 'production');
    expect(options.sameSite).toBe('strict');
    expect(options.path).toBe('/');
    expect(options.maxAge).toBe(3600);
  });

  it('should have secure configuration for CSRF cookies', () => {
    const options = getCookieOptions(CookieType.CSRF);
    
    expect(options.httpOnly).toBe(true);
    expect(options.secure).toBe(process.env.NODE_ENV === 'production');
    expect(options.sameSite).toBe('strict');
    expect(options.path).toBe('/');
    expect(options.maxAge).toBe(3600);
  });

  it('should have lax configuration for preference cookies', () => {
    const options = getCookieOptions(CookieType.PREFERENCE);
    
    expect(options.httpOnly).toBe(false);
    expect(options.secure).toBe(process.env.NODE_ENV === 'production');
    expect(options.sameSite).toBe('lax');
    expect(options.path).toBe('/');
    expect(options.maxAge).toBe(30 * 24 * 3600);
  });

  it('should have lax configuration for analytics cookies', () => {
    const options = getCookieOptions(CookieType.ANALYTICS);
    
    expect(options.httpOnly).toBe(false);
    expect(options.secure).toBe(process.env.NODE_ENV === 'production');
    expect(options.sameSite).toBe('lax');
    expect(options.path).toBe('/');
    expect(options.maxAge).toBe(365 * 24 * 3600);
  });
});

describe('Cookie Name Validation', () => {
  it('should validate valid cookie names', () => {
    expect(validateCookieName('session')).toBe(true);
    expect(validateCookieName('csrf_token')).toBe(true);
    expect(validateCookieName('user_preferences')).toBe(true);
  });

  it('should validate secure cookie prefixes', () => {
    expect(validateCookieName('__Secure-session')).toBe(true);
    expect(validateCookieName('__Host-session')).toBe(true);
  });

  it('should reject invalid cookie names', () => {
    expect(validateCookieName('session;')).toBe(false);
    expect(validateCookieName('session=')).toBe(false);
    expect(validateCookieName('session ')).toBe(false);
  });
});

describe('Cookie Value Sanitization', () => {
  it('should sanitize cookie values', () => {
    const sanitized = sanitizeCookieValue('value;with=special');
    
    expect(sanitized).toBe('valuewithspecial');
  });

  it('should remove whitespace', () => {
    const sanitized = sanitizeCookieValue('value with spaces');
    
    expect(sanitized).toBe('valuewithspaces');
  });

  it('should truncate long values', () => {
    const longValue = 'a'.repeat(5000);
    const sanitized = sanitizeCookieValue(longValue);
    
    expect(sanitized.length).toBe(4096);
  });
});

describe('Cookie Security Detection', () => {
  it('should detect secure cookies with __Secure- prefix', () => {
    expect(isCookieSecure('__Secure-session')).toBe(true);
  });

  it('should detect secure cookies with __Host- prefix', () => {
    expect(isCookieSecure('__Host-session')).toBe(true);
  });

  it('should not detect regular cookies as secure', () => {
    expect(isCookieSecure('session')).toBe(false);
  });
});

describe('Cookie Rotation', () => {
  it('should generate rotation timestamp', () => {
    const timestamp = getCookieRotationTimestamp();
    
    expect(typeof timestamp).toBe('number');
    expect(timestamp).toBeGreaterThan(0);
  });

  it('should generate rotation suffix', () => {
    const suffix = generateCookieRotationSuffix();
    
    expect(typeof suffix).toBe('string');
    expect(suffix.startsWith('_')).toBe(true);
  });

  it('should add rotation suffix to cookie name', () => {
    const rotatedName = addRotationSuffix('session');
    
    expect(rotatedName.startsWith('session_')).toBe(true);
  });

  it('should remove rotation suffix from cookie name', () => {
    const originalName = removeRotationSuffix('session_1234567890');
    
    expect(originalName).toBe('session');
  });

  it('should detect when rotation is needed', () => {
    const oldRotation = getCookieRotationTimestamp() - 1;
    const needs = needsRotation(oldRotation);
    
    expect(needs).toBe(true);
  });

  it('should not need rotation for current timestamp', () => {
    const currentRotation = getCookieRotationTimestamp();
    const needs = needsRotation(currentRotation);
    
    expect(needs).toBe(false);
  });
});

describe('Cookie Expiration', () => {
  it('should get cookie expiration date', () => {
    const expiration = getCookieExpiration(3600);
    
    expect(expiration).toBeInstanceOf(Date);
    expect(expiration.getTime()).toBeGreaterThan(Date.now());
  });

  it('should check if cookie is expired', () => {
    const pastDate = new Date(Date.now() - 1000);
    const expired = isCookieExpired(pastDate);
    
    expect(expired).toBe(true);
  });

  it('should check if cookie is not expired', () => {
    const futureDate = new Date(Date.now() + 1000);
    const expired = isCookieExpired(futureDate);
    
    expect(expired).toBe(false);
  });
});

describe('Cookie Isolation', () => {
  it('should create isolation key', () => {
    const key = createCookieIsolationKey('user-123', 'session-456');
    
    expect(key).toBe('user-123:session-456');
  });

  it('should validate correct isolation key', () => {
    const key = createCookieIsolationKey('user-123', 'session-456');
    const valid = validateCookieIsolation(key, 'user-123', 'session-456');
    
    expect(valid).toBe(true);
  });

  it('should reject incorrect isolation key', () => {
    const key = createCookieIsolationKey('user-123', 'session-456');
    const valid = validateCookieIsolation(key, 'user-456', 'session-123');
    
    expect(valid).toBe(false);
  });
});

describe('Supabase Cookie Configuration', () => {
  it('should have secure Supabase cookie options', () => {
    const { name, options } = getSupabaseCookieOptions();
    
    expect(name).toBe('sb-session-token');
    expect(options.httpOnly).toBe(true);
    expect(options.secure).toBe(process.env.NODE_ENV === 'production');
    expect(options.sameSite).toBe('strict');
    expect(options.path).toBe('/');
    expect(options.maxAge).toBe(3600);
  });
});

describe('Cookie Operations', () => {
  it('should set secure cookie', () => {
    const response = NextResponse.next();
    setSecureCookie(response, 'test', 'value', CookieType.SESSION);
    
    const cookie = response.cookies.get('test');
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBe('value');
  });

  it('should set secure cookie with prefix', () => {
    const response = NextResponse.next();
    setSecureCookieWithPrefix(response, 'session', 'value', CookieType.SESSION);
    
    const cookie = response.cookies.get('__Secure-session');
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBe('value');
  });

  it('should delete cookie', () => {
    const response = NextResponse.next();
    response.cookies.set('test', 'value');
    deleteCookie(response, 'test');
    
    const cookie = response.cookies.get('test');
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBe('');
    expect(new Date(cookie!.expires!).getTime()).toBe(0);
  });

  it('should delete cookie with prefix', () => {
    const response = NextResponse.next();
    response.cookies.set('__Secure-session', 'value');
    deleteCookieWithPrefix(response, 'session');
    
    const cookie = response.cookies.get('__Secure-session');
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBe('');
    expect(new Date(cookie!.expires!).getTime()).toBe(0);
  });

  it('should set Supabase cookie', () => {
    const response = NextResponse.next();
    setSupabaseCookie(response, 'test-token');
    
    const cookie = response.cookies.get('sb-session-token');
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBe('test-token');
  });

  it('should delete Supabase cookie', () => {
    const response = NextResponse.next();
    response.cookies.set('sb-session-token', 'value');
    deleteSupabaseCookie(response);
    
    const cookie = response.cookies.get('sb-session-token');
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBe('');
    expect(new Date(cookie!.expires!).getTime()).toBe(0);
  });
});
