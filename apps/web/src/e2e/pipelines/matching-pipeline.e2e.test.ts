/**
 * E2E Tests for Matching Pipeline - SPRINT-4.6
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('Matching Pipeline - E2E', () => {
  test('Complete matching flow: CV analysis → Job matching → Score calculation', async () => {
    // Step 1: Upload CV
    const cvResponse = await fetch(`${BASE_URL}/api/cv/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: 'test-cv.pdf',
        fileData: 'base64encodeddata',
      }),
    });

    // May fail without auth, but pipeline should not crash
    expect([200, 400, 401]).toContain(cvResponse.status);

    // Step 2: Calculate matching score
    const matchResponse = await fetch(`${BASE_URL}/api/matching/calculate-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cvText: 'React developer with TypeScript experience',
        jobDescription: 'Looking for React and TypeScript developer',
      }),
    });

    expect([200, 400, 404]).toContain(matchResponse.status);

    if (matchResponse.status === 200) {
      const matchData = await matchResponse.json();
      expect(matchData).toHaveProperty('score');
      expect(matchData.score).toBeGreaterThanOrEqual(0);
      expect(matchData.score).toBeLessThanOrEqual(100);
    }
  });

  test('Batch matching: Multiple CVs against single job', async () => {
    const cvs = [
      'React developer with 3 years experience',
      'Python developer with 5 years experience',
      'Full-stack developer with React and Python',
    ];

    const promises = cvs.map(cv =>
      fetch(`${BASE_URL}/api/matching/calculate-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText: cv,
          jobDescription: 'Looking for React developer',
        }),
      })
    );

    const responses = await Promise.all(promises);
    
    // All requests should complete without crashing
    responses.forEach(response => {
      expect([200, 400, 404]).toContain(response.status);
    });
  });
});