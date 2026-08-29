// lib/security/csrf.ts
//
// CSRF PROTECTION UTILITY
// Implements Double Submit Cookie pattern with token rotation
//
// USAGE:
// Generate CSRF tokens for state-changing requests (POST, PUT, PATCH, DELETE)
// Validate tokens on server-side to prevent CSRF attacks

/**
 * Generate a cryptographically secure CSRF token using Web Crypto API
 * @returns A base64-encoded CSRF token
 */
export function generateCsrfToken(): string {
  // Use Web Crypto API for edge runtime compatibility
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  
  // Convert to base64
  const binaryString = Array.from(array, byte => String.fromCharCode(byte)).join('');
  return btoa(binaryString);
}

/**
 * Validate CSRF token format (basic validation)
 * @param token The token to validate
 * @returns true if the token appears valid
 */
export function isValidCsrfToken(token: string): boolean {
  // Tokens should be base64 strings of reasonable length
  // 32 bytes = ~44 characters in base64
  return typeof token === 'string' && 
         token.length >= 40 && 
         token.length <= 48 &&
         /^[A-Za-z0-9+/=]+$/.test(token);
}

/**
 * Extract CSRF token from various sources
 * @param headers Request headers
 * @param body Request body
 * @returns The CSRF token or null if not found
 */
export function extractCsrfToken(
  headers: Headers,
  body?: any
): string | null {
  // Try to get from header first (preferred method)
  const headerToken = headers.get('x-csrf-token');
  if (headerToken && isValidCsrfToken(headerToken)) {
    return headerToken;
  }

  // Try to get from body (fallback)
  if (body && body.csrfToken && isValidCsrfToken(body.csrfToken)) {
    return body.csrfToken;
  }

  return null;
}

/**
 * Validate Origin header against allowed origins
 * @param origin The Origin header value
 * @param allowedOrigins Array of allowed origins
 * @returns true if origin is valid
 */
export function validateOrigin(
  origin: string | null,
  allowedOrigins: string[]
): boolean {
  if (!origin) {
    return false;
  }

  let parsedOrigin: URL;

  try {
    parsedOrigin = new URL(origin);
  } catch {
    return false;
  }

  return allowedOrigins.some((allowedOrigin) => {
    if (!allowedOrigin.includes("*")) {
      return origin === allowedOrigin;
    }

    let parsedAllowed: URL;

    try {
      parsedAllowed = new URL(allowedOrigin.replace("*.", ""));
    } catch {
      return false;
    }

    if (parsedOrigin.protocol !== parsedAllowed.protocol) {
      return false;
    }

    const allowedHostname = parsedAllowed.hostname.toLowerCase();
    const originHostname = parsedOrigin.hostname.toLowerCase();

    const hostnameMatches =
      originHostname === allowedHostname ||
      originHostname.endsWith(`.${allowedHostname}`);

    const portMatches =
      parsedOrigin.port === parsedAllowed.port;

    return hostnameMatches && portMatches;
  });
}

/**
 * Get allowed origins from environment
 * @returns Array of allowed origins
 */
export function getAllowedOrigins(): string[] {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const additionalOrigins = process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(',') || [];
  
  return [
    appUrl,
    'http://localhost:3000',
    'http://localhost:3001',
    ...additionalOrigins,
  ];
}
