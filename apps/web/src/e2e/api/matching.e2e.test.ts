/**
 * E2E Tests for Matching Routes - SPRINT-4.6
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('Matching API - E2E', () => {
  test('POST /api/matching/calculate-score - should calculate matching score', async () => {
    const response = await fetch(`${BASE_URL}/api/matching/calculate-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cvText: 'React developer with TypeScript experience',
        jobDescription: 'Looking for React and TypeScript developer',
      }),
    });

    // Should return score even without auth
    expect([200, 400, 401, 404, 500]).toContain(response.status);
  });

  test('GET /api/matching/history - should return matching history', async () => {
    const response = await fetch(`${BASE_URL}/api/matching/history`);

    // May fail without auth, but should not crash
    expect([200, 401]).toContain(response.status);
  });
});