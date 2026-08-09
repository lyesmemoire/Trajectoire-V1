// lib/security/__tests__/csp.test.ts
//
// CSP IMPLEMENTATION TESTS
// Tests for nonce generation and CSP configuration

import { generateNonce, isValidNonce } from '../nonce';

describe('Nonce Generation', () => {
  it('should generate a unique nonce each time', () => {
    const nonce1 = generateNonce();
    const nonce2 = generateNonce();
    
    expect(nonce1).not.toBe(nonce2);
    expect(nonce1).toBeTruthy();
    expect(nonce2).toBeTruthy();
  });

  it('should generate a valid nonce format', () => {
    const nonce = generateNonce();
    
    expect(isValidNonce(nonce)).toBe(true);
  });

  it('should generate nonces of reasonable length', () => {
    const nonce = generateNonce();
    
    expect(nonce.length).toBeGreaterThanOrEqual(20);
    expect(nonce.length).toBeLessThanOrEqual(32);
  });

  it('should only contain base64 characters', () => {
    const nonce = generateNonce();
    
    expect(/^[A-Za-z0-9+/=]+$/.test(nonce)).toBe(true);
  });
});

describe('Nonce Validation', () => {
  it('should validate correct nonces', () => {
    const nonce = generateNonce();
    
    expect(isValidNonce(nonce)).toBe(true);
  });

  it('should reject invalid nonces', () => {
    expect(isValidNonce('')).toBe(false);
    expect(isValidNonce('too-short')).toBe(false);
    expect(isValidNonce('a'.repeat(50))).toBe(false);
    expect(isValidNonce('invalid@chars')).toBe(false);
  });
});
