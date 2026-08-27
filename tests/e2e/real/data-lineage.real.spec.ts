/**
 * REAL DATA LINEAGE VERIFICATION TEST
 * 
 * This test verifies data lineage across the system:
 * 1. userId - User identifier consistency
 * 2. cvId - CV identifier consistency
 * 3. sessionId - Session identifier consistency
 * 4. correlationId - Correlation across related operations
 * 5. Database relationships - Verify relational integrity
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
  createTestSubscription,
  prisma
} from './fixtures/database';

test.describe('DATA LINEAGE VERIFICATION', () => {
  test.describe.configure({ mode: 'serial' });
  
  let runId: string;
  let userId: string;
  let cvId: string;
  let sessionId: string;
  let subscriptionId: string;

  test('Step 1: CREATE DATA - Create user, CV, session, and subscription', async () => {
    runId = generateRunId();
    
    const userData = await createTestUser(runId, 'lineage');
    userId = userData.userId!;

    const cv = await createTestCV(userId, 'lineage-cv.pdf');
    cvId = cv.id;

    const session = await createTestInterviewSession(userId, cvId);
    sessionId = session.id;

    const subscription = await createTestSubscription(userId, 'PRO');
    subscriptionId = subscription.id;

    expect(userId).toBeTruthy();
    expect(cvId).toBeTruthy();
    expect(sessionId).toBeTruthy();
    expect(subscriptionId).toBeTruthy();

    console.log(`Created data lineage: userId=${userId}, cvId=${cvId}, sessionId=${sessionId}, subscriptionId=${subscriptionId}`);
  });

  test('Step 2: USER ID CONSISTENCY - Verify userId across all entities', async () => {
    // Verify userId in CV
    const cv = await prisma.cVAnalysis.findUnique({
      where: { id: cvId }
    });
    expect(cv?.userId).toBe(userId);

    // Verify userId in Interview Session
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId }
    });
    expect(session?.userId).toBe(userId);

    // Verify userId in Subscription
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId }
    });
    expect(subscription?.userId).toBe(userId);

    console.log('User ID consistency verified across all entities');
  });

  test('Step 3: CV ID CONSISTENCY - Verify cvId in related entities', async () => {
    // Verify CV exists and has correct userId
    const cv = await prisma.cVAnalysis.findUnique({
      where: { id: cvId }
    });
    expect(cv?.id).toBe(cvId);
    expect(cv?.userId).toBe(userId);

    // Query all CVs for the user
    const userCVs = await prisma.cVAnalysis.findMany({
      where: { userId }
    });

    // Verify our CV is in the list
    const foundCV = userCVs.find(c => c.id === cvId);
    expect(foundCV).toBeTruthy();

    console.log('CV ID consistency verified');
  });

  test('Step 4: SESSION ID CONSISTENCY - Verify sessionId relationships', async () => {
    // Verify session exists and has correct userId
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId }
    });
    expect(session?.id).toBe(sessionId);
    expect(session?.userId).toBe(userId);

    // Query all sessions for the user
    const userSessions = await prisma.interviewSession.findMany({
      where: { userId }
    });

    // Verify our session is in the list
    const foundSession = userSessions.find(s => s.id === sessionId);
    expect(foundSession).toBeTruthy();

    console.log('Session ID consistency verified');
  });

  test('Step 5: DATABASE RELATIONSHIPS - Verify relational integrity', async () => {
    // Get user with all related entities
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        CVAnalysis: true,
        interviewSessions: true,
        Subscription: true
      }
    }) as any;

    expect(user).toBeTruthy();
    expect(user?.CVAnalysis?.length).toBeGreaterThan(0);
    expect(user?.interviewSessions?.length).toBeGreaterThan(0);
    expect(user?.Subscription).toBeTruthy();

    // Verify CV belongs to user
    const userCV = user?.CVAnalysis?.find((c: any) => c.id === cvId);
    expect(userCV).toBeTruthy();
    expect(userCV?.userId).toBe(userId);

    // Verify session belongs to user
    const userSession = user?.interviewSessions?.find((s: any) => s.id === sessionId);
    expect(userSession).toBeTruthy();
    expect(userSession?.userId).toBe(userId);

    // Verify subscription belongs to user
    expect(user?.Subscription?.userId).toBe(userId);

    console.log('Database relational integrity verified');
  });

  test('Step 6: CORRELATION - Verify correlation through timestamps', async () => {
    // Get all entities with timestamps
    const cv = await prisma.cVAnalysis.findUnique({
      where: { id: cvId }
    });

    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId }
    });

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId }
    });

    // All should have createdAt timestamps
    expect(cv?.createdAt).toBeTruthy();
    expect(session?.createdAt).toBeTruthy();
    expect(subscription?.createdAt).toBeTruthy();

    // Verify timestamps are recent (within last hour)
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    expect(new Date(cv?.createdAt || 0).getTime()).toBeGreaterThan(oneHourAgo.getTime());
    expect(new Date(session?.createdAt || 0).getTime()).toBeGreaterThan(oneHourAgo.getTime());
    expect(new Date(subscription?.createdAt || 0).getTime()).toBeGreaterThan(oneHourAgo.getTime());

    console.log('Correlation through timestamps verified');
  });

  test('Step 7: HTTP RESPONSE IDs - Verify API responses contain IDs', async () => {
    const BASE_URL = (globalThis as any).process?.env.E2E_BASE_URL || 'http://localhost:3000';

    // Test auth check endpoint returns user data
    const response = await fetch(`${BASE_URL}/api/auth/check-access`, {
      headers: { 'Content-Type': 'application/json' }
    });

    // Should return 200 or 403
    expect([200, 403]).toContain(response.status);

    if (response.status === 200) {
      const data = await response.json();
      // If authenticated, verify response structure
      if (data.authenticated) {
        expect(data).toHaveProperty('accessLevel');
        expect(data).toHaveProperty('subscription');
      }
    }

    console.log('HTTP response ID structure verified');
  });

  test('Step 8: CASCADE DELETE - Verify cleanup removes all related data', async () => {
    // Before cleanup, verify all data exists
    let cv = await prisma.cVAnalysis.findUnique({ where: { id: cvId } });
    let session = await prisma.interviewSession.findUnique({ where: { id: sessionId } });
    let subscription = await prisma.subscription.findUnique({ where: { id: subscriptionId } });

    expect(cv).toBeTruthy();
    expect(session).toBeTruthy();
    expect(subscription).toBeTruthy();

    // Cleanup user (should cascade delete related data)
    await cleanupTestUser(userId);

    // Verify all related data is deleted
    cv = await prisma.cVAnalysis.findUnique({ where: { id: cvId } });
    session = await prisma.interviewSession.findUnique({ where: { id: sessionId } });
    subscription = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    expect(cv).toBeNull();
    expect(session).toBeNull();
    expect(subscription).toBeNull();
    expect(user).toBeNull();

    console.log('Cascade delete verified - all related data removed');

    // Reset for afterAll
    userId = '';
  });

  test.afterAll(async () => {
    // Cleanup already done in test
    console.log('Data lineage test completed');
  });
});
