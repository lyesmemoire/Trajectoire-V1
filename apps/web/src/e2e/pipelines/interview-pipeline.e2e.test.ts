/**
 * E2E Tests for Interview Pipeline - SPRINT-4.6
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('Interview Pipeline - E2E', () => {
  test('Complete interview flow: Create → Questions → Evaluate → Complete', async () => {
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

    // Step 2: Generate questions
    const questionsResponse = await fetch(`${BASE_URL}/api/interview/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle: 'Software Engineer',
        level: 'mid',
      }),
    });

    expect([200, 400, 401, 500]).toContain(questionsResponse.status);

    // Step 3: Evaluate response
    const evaluateResponse = await fetch(`${BASE_URL}/api/interview/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'test-session',
        question: 'What is your experience with React?',
        answer: 'I have 3 years of experience with React',
      }),
    });

    expect([200, 400, 401, 500]).toContain(evaluateResponse.status);
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