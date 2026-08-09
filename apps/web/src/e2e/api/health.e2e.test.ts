/**
 * E2E Tests for Health Routes - SPRINT-4.6
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('Health API - E2E', () => {
  test('GET /api/health - should return health status', async () => {
    const response = await fetch(`${BASE_URL}/api/health`);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
    // Accept both 'ok' and 'degraded' as valid health statuses
    expect(['ok', 'degraded']).toContain(data.status);
  });

  test('GET /api/performance/health - should return performance metrics', async () => {
    const response = await fetch(`${BASE_URL}/api/performance/health`);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('metrics');
    expect(data).toHaveProperty('optimizer');
  });
});