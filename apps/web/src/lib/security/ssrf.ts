// lib/security/ssrf.ts
//
// SSRF PROTECTION UTILITY
// Validates URLs to prevent Server-Side Request Forgery attacks
//
// USAGE:
// Validate URLs before making external requests to prevent SSRF attacks
//
// EXAMPLE:
// import { validateUrl } from '@/lib/security/ssrf';
// if (!validateUrl(userInputUrl)) {
//   throw new Error('Invalid URL');
// }

import { URL } from 'url';

/**
 * Cloud metadata endpoints that should be blocked
 */
const CLOUD_METADATA_ENDPOINTS = [
  '169.254.169.254',
  '169.254.169.254/latest',
  'metadata.google.internal',
  '169.254.170.2',
  'metadata',
  'linklocal.amazonaws.com',
];

/**
 * Private IP ranges that should be blocked
 */
const PRIVATE_IP_RANGES = [
  // IPv4 private ranges
  /^10\./,                              // 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,     // 172.16.0.0/12
  /^192\.168\./,                        // 192.168.0.0/16
  /^127\./,                             // 127.0.0.0/8 (localhost)
  /^0\./,                               // 0.0.0.0/8
  /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./, // 100.64.0.0/10 (carrier-grade NAT)
  
  // IPv6 private ranges
  /^::1$/,                              // localhost
  /^fc00:/,                             // fc00::/7 (unique local)
  /^fe80:/,                             // fe80::/10 (link-local)
  /^fd/,                                // fd00::/8 (unique local)
];

/**
 * Allowed domains (whitelist)
 */
const ALLOWED_DOMAINS = [
  'api.openai.com',
  'api.mistral.ai',
  '*.supabase.co',
  'api.stripe.com',
  'cdn.jsdelivr.net',
];

/**
 * Validate a URL for SSRF protection
 * @param url The URL to validate
 * @returns true if the URL is safe, false otherwise
 */
export function validateUrl(url: string): boolean {
  try {
    // Parse URL
    const parsedUrl = new URL(url);
    
    // Only allow HTTP/HTTPS
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }
    
    // Block localhost variants
    if (isLocalhost(parsedUrl.hostname)) {
      return false;
    }
    
    // Block cloud metadata endpoints
    if (isCloudMetadataEndpoint(parsedUrl.hostname)) {
      return false;
    }
    
    // Block private IPs
    if (isPrivateIP(parsedUrl.hostname)) {
      return false;
    }
    
    // Check against whitelist
    if (!isAllowedDomain(parsedUrl.hostname)) {
      return false;
    }
    
    // Block internal ports
    if (isInternalPort(parsedUrl.port)) {
      return false;
    }
    
    // Block URL redirection attempts
    if (hasRedirection(url)) {
      return false;
    }
    
    return true;
  } catch (error) {
    // Invalid URL format
    return false;
  }
}

/**
 * Check if hostname is localhost variant
 */
function isLocalhost(hostname: string): boolean {
  const localhostVariants = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '[::1]',
    '::1',
    '127.1',
    '127.0.0.1',
  ];
  
  return localhostVariants.includes(hostname.toLowerCase());
}

/**
 * Check if hostname is a cloud metadata endpoint
 */
function isCloudMetadataEndpoint(hostname: string): boolean {
  return CLOUD_METADATA_ENDPOINTS.some(endpoint => 
    hostname === endpoint || hostname.endsWith('.' + endpoint)
  );
}

/**
 * Check if hostname is a private IP
 */
function isPrivateIP(hostname: string): boolean {
  // Check against private IP ranges
  for (const range of PRIVATE_IP_RANGES) {
    if (range.test(hostname)) {
      return true;
    }
  }
  
  // Check for IPv6 link-local
  if (hostname.startsWith('fe80:')) {
    return true;
  }
  
  return false;
}

/**
 * Check if domain is in allowed whitelist
 */
function isAllowedDomain(hostname: string): boolean {
  // In development, allow all domains (for testing)
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  for (const allowed of ALLOWED_DOMAINS) {
    if (allowed.startsWith('*.')) {
      // Wildcard domain
      const domain = allowed.slice(2);
      if (hostname === domain || hostname.endsWith('.' + domain)) {
        return true;
      }
    } else {
      // Exact match
      if (hostname === allowed) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Check if port is internal
 */
function isInternalPort(port: string | null): boolean {
  if (!port) return false;
  
  const portNum = parseInt(port, 10);
  
  // Block common internal ports
  const internalPorts = [
    22,    // SSH
    3306,  // MySQL
    5432,  // PostgreSQL
    6379,  // Redis
    27017, // MongoDB
    9200,  // Elasticsearch
    5672,  // RabbitMQ
    11211, // Memcached
    8080,  // HTTP alternative
    8443,  // HTTPS alternative
  9090,  // Various services
  9000,  // Various services
  5000,  // Various services
  3000,  // Development servers
  4000,  // Development servers
  8000,  // Development servers
  50000, // Various services
  49152, // Dynamic/private ports start
  65535, // Dynamic/private ports end
  ];
  
  return internalPorts.includes(portNum) || (portNum >= 49152 && portNum <= 65535);
}

/**
 * Check if URL has redirection attempts
 */
function hasRedirection(url: string): boolean {
  // Check for common redirection patterns
  const redirectionPatterns = [
    '@',           // User info in URL (can be used for redirection)
    '///',         // Triple slash (can bypass filters)
    '\\',          // Backslash (can be used for path traversal)
    '%2f',         // Encoded slash
    '%5c',         // Encoded backslash
    '%00',         // Null byte
    '%0d',         // CR
    '%0a',         // LF
    '\r',          // Carriage return
    '\n',          // Line feed
  ];
  
  const lowerUrl = url.toLowerCase();
  return redirectionPatterns.some(pattern => lowerUrl.includes(pattern));
}

/**
 * Get allowed domains from environment
 */
export function getAllowedDomains(): string[] {
  const customDomains = process.env.SSRF_ALLOWED_DOMAINS?.split(',') || [];
  return [...ALLOWED_DOMAINS, ...customDomains];
}

/**
 * Add custom domain to whitelist
 */
export function addAllowedDomain(domain: string): void {
  ALLOWED_DOMAINS.push(domain);
}

/**
 * Validate multiple URLs
 */
export function validateUrls(urls: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  for (const url of urls) {
    if (validateUrl(url)) {
      valid.push(url);
    } else {
      invalid.push(url);
    }
  }
  
  return { valid, invalid };
}

/**
 * Sanitize URL by removing potentially dangerous parts
 * @param url The URL to sanitize
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string): string | null {
  if (!validateUrl(url)) {
    return null;
  }
  
  try {
    const parsedUrl = new URL(url);
    
    // Remove credentials
    parsedUrl.username = '';
    parsedUrl.password = '';
    
    // Remove fragment
    parsedUrl.hash = '';
    
    return parsedUrl.toString();
  } catch (error) {
    return null;
  }
}
