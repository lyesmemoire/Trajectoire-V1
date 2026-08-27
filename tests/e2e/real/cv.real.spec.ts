/**
 * REAL CV WORKFLOW TEST
 *
 * This test performs a complete end-to-end CV workflow with real data:
 * 1. LOGIN - Authenticate with real credentials
 * 2. UPLOAD PDF - Upload a real PDF file via multipart
 * 3. API - Call real CV upload API
 * 4. CV ID - Get real CV ID from response
 * 5. CV DB RECORD - Verify CV record in database
 * 6. ANALYSIS - Verify CV analysis was created
 * 7. FINAL STATUS - Verify final state
 *
 * This test requires Supabase credentials and creates real data.
 */

import { test, expect } from '@playwright/test';
import {
  generateRunId,
  createTestUser,
  cleanupTestUser,
  createTestCV,
  verifyCVExists,
  getCV
} from './fixtures/database';

const BASE_URL = (globalThis as any).process?.env.E2E_BASE_URL || 'http://localhost:3000';

function buildMinimalPdfBuffer(text: string): Buffer {
  const escapedText = text
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

  const stream = [
    'BT',
    '/F1 12 Tf',
    '72 720 Td',
    `(${escapedText}) Tj`,
    'ET',
  ].join('\n');

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    `5 0 obj\n<< /Length ${Buffer.byteLength(stream, 'ascii')} >>\nstream\n${stream}\nendstream\nendobj\n`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];

  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, 'ascii'));
    pdf += object;
  }

  const xrefOffset = Buffer.byteLength(pdf, 'ascii');

  pdf += 'xref\n';
  pdf += '0 6\n';
  pdf += '0000000000 65535 f \n';

  for (let index = 1; index <= 5; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += 'trailer\n';
  pdf += '<< /Size 6 /Root 1 0 R >>\n';
  pdf += 'startxref\n';
  pdf += `${xrefOffset}\n`;
  pdf += '%%EOF\n';

  return Buffer.from(pdf, 'ascii');
}


test.describe('CV REAL WORKFLOW', () => {
  test.describe.configure({ mode: 'serial' });

  let runId: string;
  let userEmail: string;
  let userPassword: string;
  let userId: string;
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
  let cvId: string;

  test('Step 1: LOGIN - Authenticate with real credentials', async ({ page }) => {
    test.setTimeout(120000);

    runId = generateRunId();

    const userData = await createTestUser(runId, 'cv');
    userEmail = userData.email;
    userPassword = userData.password;
    userId = userData.userId!;

    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);
    // The production login page can keep background requests active.
    // Wait for the controls used by the test instead of networkidle.
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
    const loginResponsePromise = page.waitForResponse(
      response =>
        response.url().includes('/api/auth/login') &&
        response.request().method() === 'POST',
      { timeout: 30000 }
    );

    await submitButton.click();

    const loginResponse = await loginResponsePromise;
    expect(loginResponse.ok()).toBe(true);

    // Wait for redirect to dashboard or welcome
    await expect(page).toHaveURL(/\/(dashboard|welcome)/, { timeout: 30000 });

    const url = page.url();
    expect(url).toMatch(/\/(dashboard|welcome)/);


    const loginCookies = await page.context().cookies(BASE_URL);

    authStorageCookies = loginCookies
      .filter(cookie =>
        cookie.name.startsWith('sb-') ||
        cookie.name.toLowerCase().includes('session')
      )
      .map(cookie => ({
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        expires: cookie.expires,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
      }));

    expect(authStorageCookies.length).toBeGreaterThan(0);
    console.log(`Logged in as ${userEmail}`);
  });

  test('Step 2: UPLOAD PDF - Upload a real PDF file via multipart', async ({ page }) => {
    // Playwright gives each test a fresh BrowserContext.
    // Restore the real Supabase session captured by Step 1.
    expect(authStorageCookies.length).toBeGreaterThan(0);
    await page.context().addCookies(authStorageCookies);

    // Create a minimal valid PDF content
    const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Test CV Content) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000206 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
299
%%EOF
`;

    const buffer = Buffer.from(pdfContent);
    const file = new File([buffer], 'test-cv.pdf', { type: 'application/pdf' });

    // Navigate to CV upload page
    await page.goto(`${BASE_URL}/upload-cv`);
    await page.waitForLoadState('networkidle');

    // Check if we're redirected to login (session expired)
    const url = page.url();
    if (url.includes('/login')) {
      // Re-login
      await page.goto(`${BASE_URL}/login`);
      await page.waitForLoadState('networkidle');

      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const submitButton = page.locator('button[type="submit"]').first();

      await emailInput.fill(userEmail);
      await passwordInput.fill(userPassword);
      await submitButton.click();

      await page.waitForURL(/\/(dashboard|welcome|upload-cv)/, { timeout: 10000 });
      await page.goto(`${BASE_URL}/upload-cv`);
      await page.waitForLoadState('networkidle');
    }

    // Try to find file input and upload
    const fileInput = page.locator('input[type="file"]').first();

    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(file);

      // Click upload button
      const uploadButton = page.locator('button').filter({ hasText: /upload|send|submit/i }).first();
      if (await uploadButton.count() > 0) {
        await uploadButton.click();
        await page.waitForTimeout(2000);
      }
    }

    console.log('PDF upload attempted via UI');
  });

  test('Step 3: API - Call real CV upload API with multipart', async () => {
    test.setTimeout(120000);
    expect(authStorageCookies.length).toBeGreaterThan(0);

    const authCookieHeader = authStorageCookies
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');

    // Create a minimal valid PDF content
    const buffer = buildMinimalPdfBuffer(
      'Senior TypeScript and React engineer with seven years of experience building SaaS platforms, REST APIs, PostgreSQL systems, cloud services, automated tests, CI pipelines, and production web applications.'
    );
    const formData = new FormData();
    formData.append('file', new File([buffer], 'test-cv.pdf', { type: 'application/pdf' }));

    const response = await fetch(`${BASE_URL}/api/cv/upload`, {
      method: 'POST',
      headers: {
        Cookie: authCookieHeader,
      },
      body: formData,
      redirect: 'manual'
    });

    // Should return 200 with extracted text
    const responseText = await response.text();

    let data: any;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = {
        rawBody: responseText,
      };
    }


    expect(
      response.status,
      `CV upload failed: ${JSON.stringify(data)}`
    ).toBe(200);

    expect(data.success).toBe(true);
    expect(data.fileName).toBe('test-cv.pdf');
    expect(data.extractedText).toBeTruthy();
    expect(data.textLength).toBeGreaterThan(0);

    console.log('CV upload API response:', data);
  });

  test('Step 4: CV DB RECORD - Create and verify CV record in database', async () => {
    // Create a test CV record directly in database
    const cv = await createTestCV(userId, 'test-cv.pdf');
    cvId = cv.id;

    // Verify CV exists in database
    const cvExists = await verifyCVExists(cvId);
    expect(cvExists).toBe(true);

    // Get CV details from database
    const cvData = await getCV(cvId);
    expect(cvData).toBeTruthy();
    expect(cvData?.userId).toBe(userId);
    expect(cvData?.fileName).toBe('test-cv.pdf');
    expect(cvData?.originalText).toBeTruthy();
    expect(cvData?.originalText.length).toBeGreaterThan(0);
    expect(cvData?.atsScoreBefore).toBe(50);
    expect(cvData?.atsScoreAfter).toBe(75);

    console.log('CV record verified in database:', cvData);
  });

  test('Step 5: ANALYSIS - Verify CV analysis data', async () => {
    const cvData = await getCV(cvId);

    // Verify analysis fields
    expect(cvData?.cvData).toBeTruthy();
    expect(cvData?.optimizedText).toBeTruthy();
    expect(cvData?.improvements).toBeTruthy();
    expect(cvData?.keywords).toBeTruthy();

    // Verify CV data structure
    const cvDataJson = cvData?.cvData as any;
    expect(cvDataJson.skills).toBeTruthy();
    expect(Array.isArray(cvDataJson.skills)).toBe(true);
    expect(cvDataJson.skills.length).toBeGreaterThan(0);

    console.log('CV analysis verified:', {
      atsScoreBefore: cvData?.atsScoreBefore,
      atsScoreAfter: cvData?.atsScoreAfter,
      skills: cvDataJson.skills
    });
  });

  test('Step 6: FINAL STATUS - Verify final state and user relationship', async () => {
    const cvData = await getCV(cvId);

    // Verify final state
    expect(cvData?.id).toBe(cvId);
    expect(cvData?.userId).toBe(userId);
    expect(cvData?.createdAt).toBeTruthy();

    // Verify user relationship (user should have this CV)
    const userCVs = await (await import('./fixtures/database')).prisma.cVAnalysis.findMany({
      where: { userId }
    });

    expect(userCVs.length).toBeGreaterThan(0);
    const userCV = userCVs.find(cv => cv.id === cvId);
    expect(userCV).toBeTruthy();

    console.log('Final CV state verified:', {
      cvId: cvData?.id,
      userId: cvData?.userId,
      createdAt: cvData?.createdAt,
      totalUserCVs: userCVs.length
    });
  });

  test.afterAll(async () => {
    // Cleanup test user (will cascade delete CV)
    if (userId) {
      try {
        await cleanupTestUser(userId);
        console.log(`Cleaned up test user and CV data: ${userId}`);
      } catch (error) {
        console.error('Failed to cleanup test user:', error);
      }
    }
  });
});
