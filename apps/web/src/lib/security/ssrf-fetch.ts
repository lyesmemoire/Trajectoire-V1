// lib/security/ssrf-fetch.ts
//
// SSRF-PROTECTED FETCH WRAPPER
// Wraps fetch to validate URLs before making requests
//
// USAGE:
// Use ssrfFetch instead of fetch to automatically validate URLs
//
// EXAMPLE:
// import { ssrfFetch } from '@/lib/security/ssrf-fetch';
// const response = await ssrfFetch('https://api.openai.com/v1/chat/completions', options);

import { validateUrl, sanitizeUrl } from './ssrf';
import { logger } from '@/lib/logger';

/**
 * SSRF-protected fetch wrapper
 * @param url The URL to fetch
 * @param options Fetch options
 * @returns The fetch response
 */
export async function ssrfFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // Validate URL before making request
  if (!validateUrl(url)) {
    logger.error({ url }, 'SSRF validation failed - URL blocked');
    throw new Error('SSRF validation failed: URL is not allowed');
  }

  // Sanitize URL
  const sanitizedUrl = sanitizeUrl(url);
  if (!sanitizedUrl) {
    throw new Error('SSRF validation failed: URL sanitization failed');
  }

  // Make the request with sanitized URL
  return fetch(sanitizedUrl, options);
}

/**
 * SSRF-protected fetch wrapper for multiple URLs
 * @param urls Array of URLs to fetch
 * @param options Fetch options
 * @returns Array of fetch responses
 */
export async function ssrfFetchAll(
  urls: string[],
  options: RequestInit = {}
): Promise<{ url: string; response: Response | null; error?: string }[]> {
  const results = await Promise.allSettled(
    urls.map(url => ssrfFetch(url, options))
  );

  return urls.map((url, index) => {
    const result = results[index];
    if (result.status === 'fulfilled') {
      return { url, response: result.value };
    } else {
      return { url, response: null, error: result.reason?.message || 'Unknown error' };
    }
  });
}

/**
 * Validate URL without making request
 * @param url The URL to validate
 * @returns true if valid, false otherwise
 */
export function checkUrl(url: string): boolean {
  return validateUrl(url);
}

/**
 * Get validation error details
 * @param url The URL to validate
 * @returns Error details or null if valid
 */
export function getUrlValidationError(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return 'Invalid protocol - only HTTP/HTTPS allowed';
    }
    
    if (isLocalhost(parsedUrl.hostname)) {
      return 'Localhost access blocked';
    }
    
    if (isCloudMetadataEndpoint(parsedUrl.hostname)) {
      return 'Cloud metadata endpoint blocked';
    }
    
    if (isPrivateIP(parsedUrl.hostname)) {
      return 'Private IP address blocked';
    }
    
    if (!isAllowedDomain(parsedUrl.hostname)) {
      return 'Domain not in whitelist';
    }
    
    if (isInternalPort(parsedUrl.port)) {
      return 'Internal port blocked';
    }
    
    if (hasRedirection(url)) {
      return 'URL contains redirection patterns';
    }
    
    return null;
  } catch (error) {
    return 'Invalid URL format';
  }
}

// Helper functions (reused from ssrf.ts)
function isLocalhost(hostname: string): boolean {
  const localhostVariants = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '[::1]',
    '::1',
  ];
  return localhostVariants.includes(hostname.toLowerCase());
}

function isCloudMetadataEndpoint(hostname: string): boolean {
  const endpoints = [
    '169.254.169.254',
    '169.254.169.254/latest',
    'metadata.google.internal',
    '169.254.170.2',
  ];
  return endpoints.some(endpoint => hostname === endpoint || hostname.endsWith('.' + endpoint));
}

function isPrivateIP(hostname: string): boolean {
  const ranges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^0\./,
  ];
  return ranges.some(range => range.test(hostname));
}

function isAllowedDomain(hostname: string): boolean {
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  const allowed = [
    'api.openai.com',
    '*.supabase.co',
    'api.stripe.com',
    'cdn.jsdelivr.net',
  ];
  
  for (const domain of allowed) {
    if (domain.startsWith('*.')) {
      const base = domain.slice(2);
      if (hostname === base || hostname.endsWith('.' + base)) {
        return true;
      }
    } else if (hostname === domain) {
      return true;
    }
  }
  
  return false;
}

function isInternalPort(port: string | null): boolean {
  if (!port) return false;
  const portNum = parseInt(port, 10);
  const internalPorts = [22, 3306, 5432, 6379, 27017, 9200, 5672, 11211];
  return internalPorts.includes(portNum) || (portNum >= 49152 && portNum <= 65535);
}

function hasRedirection(url: string): boolean {
  const patterns = ['@', '///', '\\', '%2f', '%5c', '%00', '%0d', '%0a', '\r', '\n'];
  const lower = url.toLowerCase();
  return patterns.some(p => lower.includes(p));
}
