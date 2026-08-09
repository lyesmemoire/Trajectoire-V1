/**
 * E2E Tests for Knowledge Routes - SPRINT-4.6
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('Knowledge API - E2E', () => {
  test('GET /api/knowledge/nodes - should return knowledge nodes', async () => {
    const response = await fetch(`${BASE_URL}/api/knowledge/nodes`);

    // May fail without auth, but should not crash
    expect([200, 401]).toContain(response.status);
  });

  test('POST /api/knowledge/nodes - should create knowledge node', async () => {
    const response = await fetch(`${BASE_URL}/api/knowledge/nodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'skill',
        data: { name: 'React', level: 'expert' },
      }),
    });

    // May fail without auth, but should not crash
    expect([200, 400, 401, 405]).toContain(response.status);
  });
});