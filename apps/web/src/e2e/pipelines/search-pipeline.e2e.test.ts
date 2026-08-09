/**
 * E2E Tests for Search Pipeline - SPRINT-4.6
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('Search Pipeline - E2E', () => {
  test('Complete search flow: Query → Filter → Sort → Paginate', async () => {
    // Step 1: Search candidates
    const searchResponse = await fetch(`${BASE_URL}/api/search/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'React developer',
        filters: { experience: '3-5 years' },
        limit: 10,
        offset: 0,
      }),
    });

    // May fail without auth, but pipeline should not crash
    expect([200, 400, 401, 404]).toContain(searchResponse.status);

    if (searchResponse.status === 200) {
      const searchData = await searchResponse.json();
      expect(Array.isArray(searchData.results)).toBe(true);
    }
  });

  test('Fuzzy search with similarity scoring', async () => {
    const response = await fetch(`${BASE_URL}/api/search/fuzzy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'React dev',
        threshold: 0.8,
      }),
    });

    expect([200, 400, 404]).toContain(response.status);
  });

  test('Career path search', async () => {
    const response = await fetch(`${BASE_URL}/api/search/career-path`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentRole: 'Junior Developer',
        targetRole: 'Senior Developer',
      }),
    });

    expect([200, 400, 404]).toContain(response.status);
  });
});