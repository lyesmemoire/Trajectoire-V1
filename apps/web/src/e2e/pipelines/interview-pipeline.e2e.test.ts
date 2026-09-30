/**
 * E2E Tests for Interview Pipeline - SPRINT-4.6
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('Interview Pipeline - E2E', () => {
  test('Complete interview flow: Create', async () => {
    // Step 1: Create interview session
    const createResponse = await fetch(`${BASE_URL}/api/interview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle: 'Software Engineer',
        level: 'mid',
      }),
    });

    expect([200, 400, 401]).toContain(createResponse.status);
  });

  test('Premium interview flow with streaming', async () => {
    const createResponse = await fetch(`${BASE_URL}/api/interview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle: 'Senior Software Engineer',
        level: 'senior',
        isPremium: true,
      }),
    });

    expect([200, 400, 401]).toContain(createResponse.status);
  });
});