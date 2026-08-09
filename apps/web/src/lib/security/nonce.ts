// lib/security/nonce.ts
//
// NONCE GENERATION UTILITY
// Generates cryptographically secure nonces for Content Security Policy
//
// USAGE:
// Generate a unique nonce for each request to allow inline scripts/styles
// while maintaining strict CSP security

/**
 * Generate a cryptographically secure nonce using Web Crypto API
 * @returns A base64-encoded nonce string
 */
export function generateNonce(): string {
  // Use Web Crypto API for edge runtime compatibility
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  
  // Convert to base64
  const binaryString = Array.from(array, byte => String.fromCharCode(byte)).join('');
  return btoa(binaryString);
}

/**
 * Validate a nonce format (basic validation)
 * @param nonce The nonce to validate
 * @returns true if the nonce appears valid
 */
export function isValidNonce(nonce: string): boolean {
  // Nonces should be base64 strings of reasonable length
  // 16 bytes = ~24 characters in base64
  return typeof nonce === 'string' && 
         nonce.length >= 20 && 
         nonce.length <= 32 &&
         /^[A-Za-z0-9+/=]+$/.test(nonce);
}
