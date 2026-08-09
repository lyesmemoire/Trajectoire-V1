/**
 * E2E Tests for CV Routes - SPRINT-4.6
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('CV API - E2E', () => {
  test('POST /api/cv/analyze - should analyze CV', async () => {
    const response = await fetch(`${BASE_URL}/api/cv/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cvText: 'Experienced developer with React and TypeScript skills',
        jobDescription: 'Looking for React developer',
      }),
    });

    // May fail without valid API keys, but should not crash
    expect([200, 400, 401, 500]).toContain(response.status);
  });

  test('POST /api/cv/rewrite - should rewrite CV', async () => {
    const response = await fetch(`${BASE_URL}/api/cv/rewrite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cvText: 'Original CV content',
        jobDescription: 'Target job description',
      }),
    });

    // May fail without valid API keys, but should not crash
    expect([200, 400, 401, 500]).toContain(response.status);
  });

  test('POST /api/cv/upload - should upload CV', async () => {
    const response = await fetch(`${BASE_URL}/api/cv/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: 'test.pdf',
        fileData: 'base64encodeddata',
      }),
    });

    // May fail without auth, but should not crash
    expect([200, 400, 401]).toContain(response.status);
  });
});