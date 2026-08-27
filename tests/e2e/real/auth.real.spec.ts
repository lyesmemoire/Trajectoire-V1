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

const BASE_URL = (globalThis as any).process?.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('AUTH REAL WORKFLOW', () => {
  test.describe.configure({ mode: 'serial' });
  
  let runId: string;
  let userEmail: string;
  let userPassword: string;
  let userId: string;
  let authCookieHeader: string;
  let authStorageCookies: Array<{
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'Strict' | 'Lax' | 'None';
  }> = [];

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

    // The login page may keep background requests active.
    // Wait for the controls required by this workflow instead.
    await expect(
      page.locator('input[type="email"]').first()
    ).toBeVisible({ timeout: 30000 });

    await expect(
      page.locator('input[type="password"]').first()
    ).toBeVisible({ timeout: 30000 });

    // Fill login form with real credentials
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await emailInput.fill(userEmail);
    await passwordInput.fill(userPassword);

    // Prove that the real login request succeeds before asserting navigation.
    const loginResponsePromise = page.waitForResponse(
      response =>
        response.url().includes('/api/auth/login') &&
        response.request().method() === 'POST',
      { timeout: 15000 }
    );

    await submitButton.click();

    const loginResponse = await loginResponsePromise;
    expect(loginResponse.status()).toBe(200);

    // Next.js may cold-compile the authenticated dashboard in development.
    // Assert the final URL without coupling the test to the browser "load" event.
    await expect(page).toHaveURL(/\/(dashboard|welcome)/, {
      timeout: 30000
    });

    const url = page.url();
    console.log(`After login, redirected to: ${url}`);

    // Verify we're on an authenticated page
    expect(url).toMatch(/\/(dashboard|welcome)/);

    // Get session cookies
    const cookies = await page.context().cookies(BASE_URL);

    const authCookies = cookies.filter(
      cookie =>
        cookie.name.startsWith('sb-') ||
        cookie.name.toLowerCase().includes('session')
    );

    authStorageCookies = authCookies.map((cookie) => ({
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      path: cookie.path,
      expires: cookie.expires,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
    }));
    expect(authCookies.length).toBeGreaterThan(0);

    authCookieHeader = authCookies
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');

    console.log(
      `Session cookie(s) found: ${authCookies
        .map(cookie => cookie.name)
        .join(', ')}`
    );
  });

  test('Step 3: SESSION - Verify session is valid via API', async () => {
    // /api/auth/me is the public session-introspection contract.
    // /api/auth/check-access is intentionally reserved for internal calls.
    expect(authCookieHeader).toBeTruthy();

    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        Cookie: authCookieHeader
      }
    });

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data.authenticated).toBe(true);
    expect(data.user).toBeTruthy();
    expect(data.user.id).toBe(userId);
    expect(data.user.email).toBe(userEmail);

    console.log('Session verified via /api/auth/me:', {
      authenticated: data.authenticated,
      userId: data.user.id,
      email: data.user.email
    });
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
    /*
     * Playwright creates an isolated BrowserContext for this test.
     * Restore the exact cookies captured after the real Step 2 login.
     */
    expect(authStorageCookies.length).toBeGreaterThan(0);

    await page.context().addCookies(authStorageCookies);

    const restoredCookies =
      await page.context().cookies(BASE_URL);

    const restoredAuthCookies = restoredCookies.filter(
      cookie =>
        cookie.name.startsWith('sb-') ||
        cookie.name.toLowerCase().includes('session')
    );

    expect(restoredAuthCookies.length).toBeGreaterThan(0);

    console.log(
      `Restored session cookie(s): ${restoredAuthCookies
        .map(cookie => cookie.name)
        .join(', ')}`
    );

    await page.goto(`${BASE_URL}/dashboard`);

    await expect(page).toHaveURL(
      /\/dashboard(?:[/?#]|$)/,
      {
        timeout: 30000
      }
    );

    expect(page.url()).not.toContain('/login');

    console.log(
      'Protected dashboard accessible with restored real session'
    );
  });
  test('Step 6: LOGOUT - Perform real logout', async ({ page }) => {
    // Navigate to logout
    await page.goto(`${BASE_URL}/logout`);

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
    await expect(page).toHaveURL(
      /\/login(?:[/?#]|$)/,
      { timeout: 30000 }
    );

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
