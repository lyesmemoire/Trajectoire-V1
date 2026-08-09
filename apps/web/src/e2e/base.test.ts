/**
 * E2E Test Base - SPRINT-4.6
 * 
 * Base configuration and helpers for E2E tests
 */

import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

export { BASE_URL };

// Helper functions
export async function createTestUser() {
  const timestamp = Date.now();
  const email = `test-${timestamp}@example.com`;
  const password = 'TestPassword123!';

  const response = await fetch(`${BASE_URL}/api/test/create-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Failed to create test user');
  }

  const data = await response.json();
  return { email, password, userId: data.userId };
}

export async function loginTestUser(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Failed to login test user');
  }

  const data = await response.json();
  return data.sessionToken;
}

export async function cleanupTestUser(userId: string) {
  await fetch(`${BASE_URL}/api/account/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
}

// Test fixtures
// eslint-disable-next-line react-hooks/rules-of-hooks
export const testFixtures = {
  authenticatedUser: async (_: any, cb: any) => {
    const user = await createTestUser();
    await cb(user);
    await cleanupTestUser(user.userId);
  },
};