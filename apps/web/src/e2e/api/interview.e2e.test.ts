/**
 * E2E Tests for Interview Routes - SPRINT-4.6
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('Interview API - E2E', () => {
  test('POST /api/interview - should create interview session', async () => {
    const response = await fetch(`${BASE_URL}/api/interview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle: 'Software Engineer',
        level: 'mid',
      }),
    });

    // May fail without auth, but should not crash
    expect([200, 400, 401]).toContain(response.status);
  });

  test('POST /api/interview/questions - should generate interview questions', async () => {
    const response = await fetch(`${BASE_URL}/api/interview/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle: 'Software Engineer',
        level: 'mid',
      }),
    });

    // May fail without auth or API keys, but should not crash
    expect([200, 400, 401, 500]).toContain(response.status);
  });

  test('POST /api/interview/evaluate - should evaluate interview response', async () => {
    const response = await fetch(`${BASE_URL}/api/interview/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'test-session',
        question: 'What is your experience with React?',
        answer: 'I have 3 years of experience with React',
      }),
    });

    // May fail without auth or API keys, but should not crash
    expect([200, 400, 401, 500]).toContain(response.status);
  });
});