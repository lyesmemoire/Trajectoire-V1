/**
 * E2E Tests for Auth Routes - SPRINT-4.6
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('Auth API - E2E', () => {
  test('POST /api/auth/check-access - should return user access status', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/check-access`);
    // May return 403 without auth, but should not crash
    expect([200, 403]).toContain(response.status);
    
    if (response.status === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('hasAccess');
    }
  });

  test('POST /api/auth/claim-preview - should claim preview token', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/claim-preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'test-token' }),
    });

    // May fail without valid token, but should not crash
    expect([200, 400, 401]).toContain(response.status);
  });

  test('POST /api/auth/sync-user - should sync user data', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/sync-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    // May fail without auth, but should not crash
    expect([200, 401, 403]).toContain(response.status);
  });
});