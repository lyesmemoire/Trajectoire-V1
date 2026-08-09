// lib/security/__tests__/csrf.test.ts
//
// CSRF PROTECTION TESTS
// Tests for CSRF token generation, validation, and middleware

import { generateCsrfToken, isValidCsrfToken, extractCsrfToken, validateOrigin, getAllowedOrigins } from '../csrf';

describe('CSRF Token Generation', () => {
  it('should generate a unique token each time', () => {
    const token1 = generateCsrfToken();
    const token2 = generateCsrfToken();
    
    expect(token1).not.toBe(token2);
    expect(token1).toBeTruthy();
    expect(token2).toBeTruthy();
  });

  it('should generate a valid token format', () => {
    const token = generateCsrfToken();
    
    expect(isValidCsrfToken(token)).toBe(true);
  });

  it('should generate tokens of reasonable length', () => {
    const token = generateCsrfToken();
    
    expect(token.length).toBeGreaterThanOrEqual(40);
    expect(token.length).toBeLessThanOrEqual(48);
  });

  it('should only contain base64 characters', () => {
    const token = generateCsrfToken();
    
    expect(/^[A-Za-z0-9+/=]+$/.test(token)).toBe(true);
  });
});

describe('CSRF Token Validation', () => {
  it('should validate correct tokens', () => {
    const token = generateCsrfToken();
    
    expect(isValidCsrfToken(token)).toBe(true);
  });

  it('should reject invalid tokens', () => {
    expect(isValidCsrfToken('')).toBe(false);
    expect(isValidCsrfToken('too-short')).toBe(false);
    expect(isValidCsrfToken('a'.repeat(50))).toBe(false);
    expect(isValidCsrfToken('invalid@chars')).toBe(false);
  });
});

describe('CSRF Token Extraction', () => {
  it('should extract token from header', () => {
    const headers = new Headers();
    const token = generateCsrfToken();
    headers.set('x-csrf-token', token);
    
    const extracted = extractCsrfToken(headers);
    
    expect(extracted).toBe(token);
  });

  it('should extract token from body', () => {
    const headers = new Headers();
    const token = generateCsrfToken();
    const body = { csrfToken: token };
    
    const extracted = extractCsrfToken(headers, body);
    
    expect(extracted).toBe(token);
  });

  it('should prefer header over body', () => {
    const headers = new Headers();
    const headerToken = generateCsrfToken();
    const bodyToken = generateCsrfToken();
    headers.set('x-csrf-token', headerToken);
    const body = { csrfToken: bodyToken };
    
    const extracted = extractCsrfToken(headers, body);
    
    expect(extracted).toBe(headerToken);
  });

  it('should return null when no token found', () => {
    const headers = new Headers();
    
    const extracted = extractCsrfToken(headers);
    
    expect(extracted).toBeNull();
  });
});

describe('Origin Validation', () => {
  it('should validate exact origin match', () => {
    const allowed = ['https://example.com'];
    
    expect(validateOrigin('https://example.com', allowed)).toBe(true);
    expect(validateOrigin('https://evil.com', allowed)).toBe(false);
  });

  it('should validate subdomain wildcard', () => {
    const allowed = ['https://*.example.com'];
    
    expect(validateOrigin('https://sub.example.com', allowed)).toBe(true);
    expect(validateOrigin('https://example.com', allowed)).toBe(true);
    expect(validateOrigin('https://evil.com', allowed)).toBe(false);
  });

  it('should reject null origin', () => {
    const allowed = ['https://example.com'];
    
    expect(validateOrigin(null, allowed)).toBe(false);
  });

  it('should handle multiple allowed origins', () => {
    const allowed = ['https://example.com', 'https://test.com'];
    
    expect(validateOrigin('https://example.com', allowed)).toBe(true);
    expect(validateOrigin('https://test.com', allowed)).toBe(true);
    expect(validateOrigin('https://evil.com', allowed)).toBe(false);
  });
});

describe('Allowed Origins', () => {
  it('should return default origins when no env vars', () => {
    const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    const originalAllowedOrigins = process.env.NEXT_PUBLIC_ALLOWED_ORIGINS;
    
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.NEXT_PUBLIC_ALLOWED_ORIGINS;
    
    const origins = getAllowedOrigins();
    
    expect(origins).toContain('http://localhost:3000');
    expect(origins).toContain('http://localhost:3001');
    
    process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
    process.env.NEXT_PUBLIC_ALLOWED_ORIGINS = originalAllowedOrigins;
  });

  it('should include custom app URL', () => {
    const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    
    process.env.NEXT_PUBLIC_APP_URL = 'https://custom.com';
    
    const origins = getAllowedOrigins();
    
    expect(origins).toContain('https://custom.com');
    
    process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  });

  it('should parse additional origins from env', () => {
    const originalAllowedOrigins = process.env.NEXT_PUBLIC_ALLOWED_ORIGINS;
    
    process.env.NEXT_PUBLIC_ALLOWED_ORIGINS = 'https://extra1.com,https://extra2.com';
    
    const origins = getAllowedOrigins();
    
    expect(origins).toContain('https://extra1.com');
    expect(origins).toContain('https://extra2.com');
    
    process.env.NEXT_PUBLIC_ALLOWED_ORIGINS = originalAllowedOrigins;
  });
});
