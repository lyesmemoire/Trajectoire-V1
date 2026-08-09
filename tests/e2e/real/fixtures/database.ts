/**
 * Database fixtures and utilities for REAL E2E tests
 * Provides direct database access for verification and cleanup
 */

import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

// Lazy initialization of Supabase client
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const supabaseUrl = (globalThis as any).process?.env.NEXT_PUBLIC_SUPABASE_URL || (globalThis as any).process?.env.SUPABASE_URL;
    const supabaseServiceKey = (globalThis as any).process?.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for E2E tests');
    }

    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return supabaseAdmin;
}

/**
 * Generate a unique test run ID
 */
export function generateRunId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `e2e-${timestamp}-${random}`;
}

/**
 * Generate test email with run ID
 */
export function generateTestEmail(runId: string, suffix: string = 'user'): string {
  return `test-${runId}-${suffix}@e2e.trajectoire.test`;
}

/**
 * Generate test password
 */
export function generateTestPassword(): string {
  return 'TestPassword123!E2E';
}

/**
 * Create a test user via Supabase Auth
 */
export async function createTestUser(runId: string, suffix: string = 'user') {
  const email = generateTestEmail(runId, suffix);
  const password = generateTestPassword();

  const admin = getSupabaseAdmin();
  const { data, error } = await admin.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${(globalThis as any).process?.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`,
      data: { skip_email_confirmation: true }
    }
  });

  if (error) {
    // If user already exists, try to sign in
    if (error.message.includes('already registered')) {
      const { data: signInData, error: signInError } = await admin.auth.signInWithPassword({
        email,
        password
      });
      if (signInError) {
        throw new Error(`Failed to sign in existing test user: ${signInError.message}`);
      }
      return {
        email,
        password,
        userId: signInData.user?.id,
        session: signInData.session
      };
    }
    throw new Error(`Failed to create test user: ${error.message}`);
  }

  return {
    email,
    password,
    userId: data.user?.id,
    session: data.session
  };
}

/**
 * Create a test session for a user
 */
export async function createTestSession(userId: string) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.auth.signInWithPassword({
    email: (await prisma.user.findUnique({ where: { id: userId }, select: { email: true } }))?.email || '',
    password: generateTestPassword()
  });

  if (error) {
    throw new Error(`Failed to create test session: ${error.message}`);
  }

  return data.session;
}

/**
 * Create a test CV record
 */
export async function createTestCV(userId: string, fileName: string = 'test-cv.pdf') {
  const cv = await prisma.cVAnalysis.create({
    data: {
      userId,
      fileName,
      originalText: 'Test CV content for E2E testing. This is a minimal valid CV text.',
      optimizedText: 'Optimized test CV content for E2E testing.',
      cvData: {
        skills: ['JavaScript', 'TypeScript', 'React'],
        experience: '5 years',
        education: 'Computer Science'
      },
      atsScoreBefore: 50,
      atsScoreAfter: 75
    }
  });

  return cv;
}

/**
 * Create a test interview session
 */
export async function createTestInterviewSession(userId: string, cvId?: string) {
  const session = await prisma.interviewSession.create({
    data: {
      userId,
      persona: 'Senior Engineer',
      currentState: 'EXPLORATION',
      clarityScore: 0.7,
      confidenceScore: 0.8,
      ownershipScore: 0.75,
      jobTitle: 'Software Engineer',
      company: 'Test Company',
      score: 85,
      status: 'active',
      questions: [
        { id: 'q1', text: 'Tell me about your experience with React.' },
        { id: 'q2', text: 'How do you handle state management?' }
      ],
      answers: []
    }
  });

  return session;
}

/**
 * Create a test subscription
 */
export async function createTestSubscription(userId: string, plan: 'FREE' | 'PRO' | 'EXPERT' = 'PRO') {
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      stripeCustomerId: `cus_test_${userId}`,
      stripeSubId: `sub_test_${userId}`,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      plan
    }
  });

  return subscription;
}

/**
 * Delete a test user and all associated data
 */
export async function cleanupTestUser(userId: string) {
  try {
    // Delete from Prisma-managed tables (cascade should handle most)
    await prisma.user.delete({
      where: { id: userId }
    });

    // Delete from Supabase Auth
    const admin = getSupabaseAdmin();
    await admin.auth.admin.deleteUser(userId);
  } catch (error) {
    console.error(`Failed to cleanup user ${userId}:`, error);
    throw error;
  }
}

/**
 * Delete users by email pattern (for cleanup of test runs)
 */
export async function cleanupUsersByPattern(pattern: string) {
  try {
    // Find users with matching email
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: pattern
        }
      },
      select: { id: true, email: true }
    });

    for (const user of users) {
      await cleanupTestUser(user.id);
    }

    return users.length;
  } catch (error) {
    console.error(`Failed to cleanup users with pattern ${pattern}:`, error);
    throw error;
  }
}

/**
 * Verify user exists in database
 */
export async function verifyUserExists(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  return !!user;
}

/**
 * Get user from database
 */
export async function getUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      role: true,
      createdAt: true
    }
  });
}

/**
 * Verify CV exists in database
 */
export async function verifyCVExists(cvId: string): Promise<boolean> {
  const cv = await prisma.cVAnalysis.findUnique({
    where: { id: cvId }
  });
  return !!cv;
}

/**
 * Get CV from database
 */
export async function getCV(cvId: string) {
  return prisma.cVAnalysis.findUnique({
    where: { id: cvId }
  });
}

/**
 * Verify interview session exists
 */
export async function verifyInterviewSessionExists(sessionId: string): Promise<boolean> {
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId }
  });
  return !!session;
}

/**
 * Get interview session from database
 */
export async function getInterviewSession(sessionId: string) {
  return prisma.interviewSession.findUnique({
    where: { id: sessionId }
  });
}

/**
 * Verify subscription exists
 */
export async function verifySubscriptionExists(userId: string): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  });
  return !!subscription;
}

/**
 * Get subscription from database
 */
export async function getSubscription(userId: string) {
  return prisma.subscription.findUnique({
    where: { userId }
  });
}

/**
 * Poll for condition with timeout
 */
export async function poll<T>(
  condition: () => Promise<T>,
  options: {
    timeout?: number;
    interval?: number;
    errorMessage?: string;
  } = {}
): Promise<T> {
  const { timeout = 30000, interval = 500, errorMessage = 'Polling timeout' } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const result = await condition();
    if (result) return result;
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error(errorMessage);
}

export { prisma, supabaseAdmin };
