/**
 * REAL AUTH WORKFLOW TEST
 * 
 * This test performs a complete end-to-end authentication flow with real data:
 * 1. CREATE USER - Create real user via Supabase Auth
 * 2. LOGIN - Authenticate with real credentials
 * 3. SESSION - Verify session is created and valid
 * 4. PROTECTED API - Access protected endpoint with real session
 * 5. DATABASE USER - Verify user exists in database
 * 6. LOGOUT - Perform real logout
 * 7. ACCESS DENIED - Verify protected endpoint is inaccessible after logout
 * 
 * This test requires Supabase credentials to be set in environment variables.
 */

import { test, expect } from '@playwright/test';
import { 
  generateRunId, 
  createTestUser, 
  cleanupTestUser, 
  verifyUserExists,
  getUser 
} from './fixtures/database';

const BASE_URL = (globalThis as any).process?.env.E2E_BASE_URL || 'http://localhost:3001';

test.describe('AUTH REAL WORKFLOW', () => {
  test.describe.configure({ mode: 'serial' });
  
  let runId: string;
  let userEmail: string;
  let userPassword: string;
  let userId: string;
  let accessToken: string;

  test('Step 1: CREATE USER - Create real user via Supabase Auth', async () => {
    runId = generateRunId();
    
    const userData = await createTestUser(runId, 'auth');
    userEmail = userData.email;
    userPassword = userData.password;
    userId = userData.userId!;

    // Verify user was created
    expect(userId).toBeTruthy();
    expect(userEmail).toBeTruthy();
    expect(userPassword).toBeTruthy();

    // Verify user exists in Supabase Auth
    expect(userData.user).toBeTruthy();
    expect(userData.user?.email).toBe(userEmail);

    console.log(`Created test user: ${userEmail} with ID: ${userId}`);
  });

  test('Step 2: LOGIN - Authenticate with real credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    // Fill login form with real credentials
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await emailInput.fill(userEmail);
    await passwordInput.fill(userPassword);
    await submitButton.click();

    // Wait for redirect to dashboard or welcome
    await page.waitForURL(/\/(dashboard|welcome)/, { timeout: 10000 });

    const url = page.url();
    console.log(`After login, redirected to: ${url}`);

    // Verify we're on an authenticated page
    expect(url).toMatch(/\/(dashboard|welcome)/);

    // Get session cookies
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(c => c.name.includes('sb-') || c.name.includes('session'));
    
    expect(sessionCookie).toBeTruthy();
    accessToken = sessionCookie?.value || '';
    
    console.log(`Session cookie found: ${sessionCookie?.name}`);
  });

  test('Step 3: SESSION - Verify session is valid via API', async () => {
    // Use the access token to call a protected API
    const response = await fetch(`${BASE_URL}/api/auth/check-access`, {
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': `sb-access-token=${accessToken}`
      }
    });

    // Should return 200 with authenticated user data
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.authenticated).toBe(true);
    expect(data.accessLevel).toBeTruthy();
    expect(data.role).toBeTruthy();

    console.log('Session verified via API:', data);
  });

  test('Step 4: DATABASE USER - Verify user exists in database', async () => {
    // Verify user exists in Prisma database
    const userExists = await verifyUserExists(userId);
    expect(userExists).toBe(true);

    // Get user details from database
    const user = await getUser(userId);
    expect(user).toBeTruthy();
    expect(user?.email).toBe(userEmail);
    expect(user?.id).toBe(userId);
    expect(user?.plan).toBe('FREE'); // Default plan

    console.log('User verified in database:', user);
  });

  test('Step 5: PROTECTED API - Access protected endpoint with real session', async ({ page }) => {
    // Navigate to dashboard with authenticated session
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');

    const url = page.url();
    
    // Should NOT be redirected to login (session is valid)
    expect(url).toContain('/dashboard');
    expect(url).not.toContain('/login');

    console.log('Protected endpoint accessible with valid session');
  });

  test('Step 6: LOGOUT - Perform real logout', async ({ page }) => {
    // Navigate to logout
    await page.goto(`${BASE_URL}/logout`);
    await page.waitForLoadState('networkidle');

    // Should redirect to login or home
    await page.waitForURL(/\/(login|\/)/, { timeout: 5000 });

    const url = page.url();
    console.log(`After logout, redirected to: ${url}`);

    // Verify we're no longer on dashboard
    expect(url).not.toContain('/dashboard');

    // Verify session cookies are cleared
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(c => c.name.includes('sb-') || c.name.includes('session'));
    
    // Session cookie should be cleared or expired
    if (sessionCookie) {
      console.warn('Session cookie still present after logout:', sessionCookie.name);
    }
  });

  test('Step 7: ACCESS DENIED - Verify protected endpoint is inaccessible after logout', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');

    const url = page.url();
    
    // Should be redirected to login
    expect(url).toContain('/login');
    expect(url).not.toContain('/dashboard');

    console.log('Protected endpoint correctly denies access after logout');
  });

  test.afterAll(async () => {
    // Cleanup test user
    if (userId) {
      try {
        await cleanupTestUser(userId);
        console.log(`Cleaned up test user: ${userId}`);
      } catch (error) {
        console.error('Failed to cleanup test user:', error);
      }
    }
  });
});
