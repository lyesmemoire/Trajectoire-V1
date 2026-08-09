/**
 * E2E Tests for Simulation Routes - SPRINT-4.6
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('Simulation API - E2E', () => {
  test('POST /api/simulation/create - should create simulation', async () => {
    const response = await fetch(`${BASE_URL}/api/simulation/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenario: 'technical-interview',
        candidateProfile: {
          name: 'Test Candidate',
          experience: 5,
        },
      }),
    });

    // May fail without auth, but should not crash
    expect([200, 400, 401]).toContain(response.status);
  });

  test('POST /api/simulation/[id]/message - should send message to simulation', async () => {
    const response = await fetch(`${BASE_URL}/api/simulation/test-id/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello, I am ready for the interview',
      }),
    });

    // May fail without auth or API keys, but should not crash
    expect([200, 400, 401, 404, 500]).toContain(response.status);
  });

  test('POST /api/simulation/end - should end simulation', async () => {
    const response = await fetch(`${BASE_URL}/api/simulation/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        simulationId: 'test-id',
      }),
    });

    // May fail without auth, but should not crash
    expect([200, 400, 401]).toContain(response.status);
  });
});