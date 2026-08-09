// lib/security/csp-nonce.ts
//
// CSP NONCE UTILITY FOR NEXT.JS
// Reads nonces from middleware headers and provides them to components
//
// USAGE:
// Use in layout.tsx to access nonces for inline scripts/styles

import { headers } from 'next/headers';

/**
 * Get the script nonce from middleware headers
 * @returns The script nonce or empty string if not available
 */
export async function getScriptNonce(): Promise<string> {
  try {
    const headersList = await headers();
    return headersList.get('x-script-nonce') || '';
  } catch (error) {
    // Headers might not be available in all contexts
    return '';
  }
}

/**
 * Get the style nonce from middleware headers
 * @returns The style nonce or empty string if not available
 */
export async function getStyleNonce(): Promise<string> {
  try {
    const headersList = await headers();
    return headersList.get('x-style-nonce') || '';
  } catch (error) {
    // Headers might not be available in all contexts
    return '';
  }
}
