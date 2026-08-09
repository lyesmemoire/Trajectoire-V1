// lib/security/csrf-client.ts
//
// CSRF CLIENT UTILITY
// Reads CSRF token from cookie and includes it in API requests
//
// USAGE:
// Import getCsrfToken and include it in your fetch headers
//
// EXAMPLE:
// import { getCsrfToken } from '@/lib/security/csrf-client';
// const response = await fetch('/api/endpoint', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'x-csrf-token': getCsrfToken(),
//   },
// });

/**
 * Get CSRF token from cookie
 * @returns The CSRF token or empty string if not found
 */
export function getCsrfToken(): string {
  if (typeof document === 'undefined') return '';
  
  const match = document.cookie.match(new RegExp('(^| )csrf_token=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : '';
}

/**
 * Get CSRF token from response headers (for token rotation)
 * @param response The fetch response
 * @returns The new CSRF token or null
 */
export function getCsrfTokenFromResponse(response: Response): string | null {
  return response.headers.get('x-csrf-token');
}

/**
 * Enhanced fetch wrapper that automatically includes CSRF token
 * @param url The URL to fetch
 * @param options Fetch options
 * @returns The fetch response
 */
export async function csrfFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getCsrfToken();
  
  // Create a new Headers object to handle the headers properly
  const headers = new Headers(options.headers);
  
  // Add CSRF token for state-changing methods
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method?.toUpperCase() || 'GET')) {
    if (token) {
      headers.set('x-csrf-token', token);
    }
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // Update CSRF token if rotated
  const newToken = getCsrfTokenFromResponse(response);
  if (newToken) {
    // Update the cookie (client-side update for token rotation)
    document.cookie = `csrf_token=${encodeURIComponent(newToken)}; path=/; max-age=3600; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
  }
  
  return response;
}

/**
 * Get CSRF token for use in forms
 * @returns The CSRF token
 */
export function getCsrfTokenForForm(): string {
  return getCsrfToken();
}
