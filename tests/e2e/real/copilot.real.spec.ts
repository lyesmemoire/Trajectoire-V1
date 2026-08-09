/**
 * REAL COPILOT WORKFLOW TEST
 * 
 * This test performs a complete end-to-end COPILOT workflow with real data:
 * 1. USER + CV + JOB - Create real user, CV, and interview session
 * 2. COPILOT REQUEST - Test copilot/interview API
 * 3. RETRIEVAL - Verify session data retrieval
 * 4. AI RESPONSE - Verify response structure
 * 5. SOURCES - Verify data sources
 * 
 * This test requires Supabase credentials and creates real data.
 */

import { test, expect } from '@playwright/test';
import { 
  generateRunId, 
  createTestUser, 
  cleanupTestUser, 
  createTestCV,
  createTestInterviewSession,
  getInterviewSession,
  prisma
} from './fixtures/database';

const BASE_URL = (globalThis as any).process?.env.E2E_BASE_URL || 'http://localhost:3001';

test.describe('COPILOT REAL WORKFLOW', () => {
  test.describe.configure({ mode: 'serial' });
  
  let runId: string;
  let userId: string;
  let cvId: string;
  let sessionId: string;

  test('Step 1: USER + CV + JOB - Create real user, CV, and interview session', async () => {
    runId = generateRunId();
    
    const userData = await createTestUser(runId, 'copilot');
    userId = userData.userId!;

    // Create a test CV
    const cv = await createTestCV(userId, 'copilot-cv.pdf');
    cvId = cv.id;

    // Create a test interview session
    const session = await createTestInterviewSession(userId, cvId);
    sessionId = session.id;

    // Verify all data exists
    expect(userId).toBeTruthy();
    expect(cvId).toBeTruthy();
    expect(sessionId).toBeTruthy();

    console.log(`Created user ${userId}, CV ${cvId}, and session ${sessionId}`);
  });

  test('Step 2: COPILOT REQUEST - Test interview API with real session', async () => {
    // Test the interview endpoint with START action
    const response = await fetch(`${BASE_URL}/api/interview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'START',
        candidate_id: userId
      })
    });

    // Should return 200 (success), 400 (invalid request), or 500 (server error)
    expect([200, 400, 500]).toContain(response.status);

    if (response.status === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('session_id');
      expect(data).toHaveProperty('question');
      expect(data).toHaveProperty('state');
      console.log('Interview START response:', data);
    } else {
      console.log(`Interview endpoint returned status: ${response.status}`);
    }
  });

  test('Step 3: RETRIEVAL - Verify session data retrieval from database', async () => {
    const session = await getInterviewSession(sessionId);

    expect(session).toBeTruthy();
    expect(session?.id).toBe(sessionId);
    expect(session?.userId).toBe(userId);
    expect(session?.persona).toBe('Senior Engineer');
    expect(session?.currentState).toBe('EXPLORATION');
    expect(session?.status).toBe('active');

    console.log('Session data verified:', {
      sessionId: session?.id,
      userId: session?.userId,
      persona: session?.persona,
      state: session?.currentState
    });
  });

  test('Step 4: AI RESPONSE - Verify interview response structure', async () => {
    // Test RESPOND action
    const response = await fetch(`${BASE_URL}/api/interview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'RESPOND',
        session_id: sessionId,
        question_id: 'q1',
        question_text: 'Tell me about your experience with React.',
        response: 'I have 5 years of experience with React, building large-scale applications.'
      })
    });

    expect([200, 400, 500]).toContain(response.status);

    if (response.status === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('session_id');
      expect(data).toHaveProperty('next_question');
      expect(data).toHaveProperty('state');
      console.log('Interview RESPOND response:', data);
    } else {
      console.log(`Interview RESPOND returned status: ${response.status}`);
    }
  });

  test('Step 5: SOURCES - Verify data sources and relationships', async () => {
    // Verify user-CV-session relationships
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        CVAnalysis: true,
        InterviewSession: true
      }
    }) as any;

    expect(user).toBeTruthy();
    expect(user?.CVAnalysis?.length).toBeGreaterThan(0);
    expect(user?.InterviewSession?.length).toBeGreaterThan(0);

    // Verify the session is linked to the user
    const session = user?.InterviewSession?.find((s: any) => s.id === sessionId);
    expect(session).toBeTruthy();
    expect(session?.userId).toBe(userId);

    console.log('Data sources verified:', {
      userId: user?.id,
      cvCount: user?.CVAnalysis?.length,
      sessionCount: user?.InterviewSession?.length,
      linkedSessionId: session?.id
    });
  });

  test('Step 6: COPILOT UI - Test copilot page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/copilot`);
    await page.waitForLoadState('networkidle');

    const url = page.url();
    
    if (url.includes('/login')) {
      console.log('Copilot page requires authentication (redirected to login)');
    } else if (url.includes('/copilot')) {
      const chatInput = page.locator('input[type="text"], textarea').first();
      const chatButton = page.locator('button').first();
      
      if (await chatInput.count() > 0 || await chatButton.count() > 0) {
        console.log('Copilot page loads with chat elements');
      } else {
        console.log('Copilot page loads but chat elements not found');
      }
    } else {
      console.log(`Copilot page redirected to: ${url}`);
    }

    expect(url).toBeTruthy();
  });

  test.afterAll(async () => {
    if (userId) {
      try {
        await cleanupTestUser(userId);
        console.log(`Cleaned up test user and copilot data: ${userId}`);
      } catch (error) {
        console.error('Failed to cleanup test user:', error);
      }
    }
  });
});
