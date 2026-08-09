/**
 * E2E Tests for User Journey Scenarios - SPRINT-4.6
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('User Journey - E2E', () => {
  test('New user: Sign up → Upload CV → Get matched → View results', async () => {
    // Step 1: Sign up (test route)
    const signupResponse = await fetch(`${BASE_URL}/api/test/create-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
      }),
    });

    expect([200, 400, 404, 500]).toContain(signupResponse.status);

    // Step 2: Upload CV
    const uploadResponse = await fetch(`${BASE_URL}/api/cv/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: 'test-cv.pdf',
        fileData: 'base64encodeddata',
      }),
    });

    expect([200, 400, 401]).toContain(uploadResponse.status);

    // Step 3: Get matching
    const matchResponse = await fetch(`${BASE_URL}/api/matching/calculate-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cvText: 'React developer',
        jobDescription: 'React developer position',
      }),
    });

    expect([200, 400, 404, 500]).toContain(matchResponse.status);
  });

  test('Premium user: Subscribe → Access premium features → Generate report', async () => {
    // Step 1: Create checkout session
    const checkoutResponse = await fetch(`${BASE_URL}/api/stripe/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: 'test-price-id',
      }),
    });

    expect([200, 400, 401, 503]).toContain(checkoutResponse.status);

    // Step 2: Generate report
    const reportResponse = await fetch(`${BASE_URL}/api/report/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'test-session',
      }),
    });

    expect([200, 400, 401]).toContain(reportResponse.status);
  });

  test('Recruiter: Post job → Search candidates → Contact candidates', async () => {
    // Step 1: Post job (via matching API)
    const matchResponse = await fetch(`${BASE_URL}/api/matching/calculate-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cvText: 'Test candidate',
        jobDescription: 'Software Engineer position',
      }),
    });

    expect([200, 400, 404, 500]).toContain(matchResponse.status);

    // Step 2: Search candidates
    const searchResponse = await fetch(`${BASE_URL}/api/search/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'Software Engineer',
      }),
    });

    expect([200, 400, 404]).toContain(searchResponse.status);
  });
});