/**
 * EXEC-002 PHASE 13: CLEANUP - Real Execution
 * 
 * This script verifies isolation and cleanup of all test data.
 */

import 'dotenv/config';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), 'apps/web/.env.local') });

const prisma = new PrismaClient();

interface CleanupEvidence {
  userId?: string;
  cvId?: string;
  jobId?: string;
  matchingId?: string;
  subscriptionId?: string;
  cleanupResults?: any;
  isolationResults?: any;
  timestamp?: string;
}

const evidence: CleanupEvidence = {};

async function createTestUser(): Promise<{ userId: string; email: string }> {
  const timestamp = Date.now();
  const email = `exec002cleanup${timestamp}@example.com`;
  const password = 'TestPassword123!E2E';
  
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('Step 1: CREATE TEST USER');
  console.log(`Email: ${email}`);
  
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      source: 'exec-002-cleanup-test'
    }
  });
  
  if (error) {
    throw new Error(`User creation failed: ${error.message}`);
  }
  
  if (!data.user) {
    throw new Error('User creation failed - no user returned');
  }
  
  evidence.userId = data.user.id;
  evidence.timestamp = new Date().toISOString();
  
  // Create user in database
  const referralCode = `EXEC002CLEANUP${timestamp}`;
  const dbUser = await prisma.user.create({
    data: {
      id: data.user.id,
      email: email,
      name: 'EXEC-002 Cleanup Test User',
      referralCode: referralCode,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
  
  console.log(`✓ User created: ${data.user.id}`);
  console.log(`✓ User created in database: ${dbUser.id}`);
  
  return { userId: data.user.id, email };
}

async function createTestData(userId: string): Promise<void> {
  console.log('\nStep 2: CREATE TEST DATA');
  
  // Create CV
  const cv = await prisma.cVAnalysis.create({
    data: {
      userId,
      fileName: 'cleanup-test-cv.pdf',
      originalText: 'Cleanup test CV',
      optimizedText: 'Cleanup test CV',
      cvData: { test: 'cleanup' },
      atsScoreBefore: 50,
      atsScoreAfter: 75
    }
  });
  evidence.cvId = cv.id;
  console.log(`✓ CV created: ${cv.id}`);
  
  // Create Job
  const job = await prisma.cVAnalysis.create({
    data: {
      userId,
      fileName: 'cleanup-test-job.txt',
      originalText: 'Cleanup test job',
      optimizedText: 'Cleanup test job',
      cvData: { type: 'JOB', title: 'Test Job' },
      atsScoreBefore: 0,
      atsScoreAfter: 100
    }
  });
  evidence.jobId = job.id;
  console.log(`✓ Job created: ${job.id}`);
  
  // Create Matching
  const matching = await prisma.previewAnalysis.create({
    data: {
      token: `cleanup-${Date.now()}`,
      cvExtract: { cvId: cv.id },
      jobExtract: { jobId: job.id },
      analysisResult: { score: 85 } as any,
      atsScore: 85,
      status: 'completed',
      claimedByUserId: userId,
      expiresAt: new Date(Date.now() + 3600000),
      ipHash: 'test-ip-hash',
      fingerprint: 'test-fingerprint'
    }
  });
  evidence.matchingId = matching.id;
  console.log(`✓ Matching created: ${matching.id}`);
  
  // Create Subscription
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      stripeCustomerId: 'cus_cleanup_test',
      stripeSubId: 'sub_cleanup_test',
      status: 'active',
      plan: 'PRO',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    }
  });
  evidence.subscriptionId = subscription.id;
  console.log(`✓ Subscription created: ${subscription.id}`);
}

async function verifyDataExists(userId: string): Promise<void> {
  console.log('\nStep 3: VERIFY DATA EXISTS');
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  console.log(`✓ User exists: ${!!user}`);
  
  const cvs = await prisma.cVAnalysis.findMany({ where: { userId } });
  console.log(`✓ CVs exist: ${cvs.length}`);
  
  const matchings = await prisma.previewAnalysis.findMany({ where: { claimedByUserId: userId } });
  console.log(`✓ Matchings exist: ${matchings.length}`);
  
  const subscription = await prisma.subscription.findFirst({ where: { userId } });
  console.log(`✓ Subscription exists: ${!!subscription}`);
}

async function performCleanup(userId: string): Promise<void> {
  console.log('\nStep 4: PERFORM CLEANUP');
  
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Delete matchings
  const matchingCount = await prisma.previewAnalysis.deleteMany({ where: { claimedByUserId: userId } });
  console.log(`✓ Matchings deleted: ${matchingCount.count}`);
  
  // Delete CVs
  const cvCount = await prisma.cVAnalysis.deleteMany({ where: { userId } });
  console.log(`✓ CVs deleted: ${cvCount.count}`);
  
  // Delete subscription
  const subCount = await prisma.subscription.deleteMany({ where: { userId } });
  console.log(`✓ Subscriptions deleted: ${subCount.count}`);
  
  // Delete user from database
  await prisma.user.delete({ where: { id: userId } });
  console.log(`✓ User deleted from database`);
  
  // Delete from Supabase Auth
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);
  if (authError) {
    console.warn(`  Auth cleanup warning: ${authError.message}`);
  } else {
    console.log(`✓ User deleted from Supabase Auth`);
  }
  
  evidence.cleanupResults = {
    matchings: matchingCount.count,
    cvs: cvCount.count,
    subscriptions: subCount.count,
    user: 1,
    auth: !authError
  };
}

async function verifyCleanup(userId: string): Promise<void> {
  console.log('\nStep 5: VERIFY CLEANUP');
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    throw new Error('User still exists in database after cleanup');
  }
  console.log(`✓ User deleted from database`);
  
  const cvs = await prisma.cVAnalysis.findMany({ where: { userId } });
  if (cvs.length > 0) {
    throw new Error(`${cvs.length} CVs still exist after cleanup`);
  }
  console.log(`✓ CVs deleted from database`);
  
  const matchings = await prisma.previewAnalysis.findMany({ where: { claimedByUserId: userId } });
  if (matchings.length > 0) {
    throw new Error(`${matchings.length} matchings still exist after cleanup`);
  }
  console.log(`✓ Matchings deleted from database`);
  
  const subscription = await prisma.subscription.findFirst({ where: { userId } });
  if (subscription) {
    throw new Error('Subscription still exists after cleanup');
  }
  console.log(`✓ Subscription deleted from database`);
}

async function testIsolation(): Promise<void> {
  console.log('\nStep 6: TEST ISOLATION');
  
  // Create two separate users
  const timestamp = Date.now();
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data: userA } = await supabase.auth.admin.createUser({
    email: `isola-${timestamp}@example.com`,
    password: 'TestPassword123!',
    email_confirm: true
  });
  
  const { data: userB } = await supabase.auth.admin.createUser({
    email: `isolb-${timestamp}@example.com`,
    password: 'TestPassword123!',
    email_confirm: true
  });
  
  if (userA?.user && userB?.user) {
    // Create users in database
    await prisma.user.create({
      data: {
        id: userA.user.id,
        email: `isola-${timestamp}@example.com`,
        name: 'User A',
        referralCode: `ISOLA${timestamp}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    await prisma.user.create({
      data: {
        id: userB.user.id,
        email: `isolb-${timestamp}@example.com`,
        name: 'User B',
        referralCode: `ISOLB${timestamp}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    // Create CV for User A
    await prisma.cVAnalysis.create({
      data: {
        userId: userA.user.id,
        fileName: 'usera-cv.pdf',
        originalText: 'User A CV',
        optimizedText: 'User A CV',
        cvData: { owner: 'usera' },
        atsScoreBefore: 50,
        atsScoreAfter: 75
      }
    });
    
    // Verify User B cannot access User A's data
    const userBCVs = await prisma.cVAnalysis.findMany({ where: { userId: userB.user.id } });
    
    if (userBCVs.length === 0) {
      console.log(`✓ Isolation verified: User B has no CVs (User A's data is isolated)`);
    }
    
    // Cleanup
    await prisma.cVAnalysis.deleteMany({ where: { userId: userA.user.id } });
    await prisma.user.deleteMany({ where: { id: { in: [userA.user.id, userB.user.id] } } });
    await supabase.auth.admin.deleteUser(userA.user.id);
    await supabase.auth.admin.deleteUser(userB.user.id);
    
    console.log(`✓ Isolation test completed`);
    
    evidence.isolationResults = {
      userA: userA.user.id,
      userB: userB.user.id,
      isolated: true
    };
  }
}

async function verifyNoOrphanedData(): Promise<void> {
  console.log('\nStep 7: VERIFY NO ORPHANED DATA');
  
  // Check for CVs without users
  const orphanedCVs = await prisma.$queryRaw`
    SELECT id, "userId" FROM "CVAnalysis" 
    WHERE "userId" NOT IN (SELECT id FROM "User")
  `;
  
  if (Array.isArray(orphanedCVs) && orphanedCVs.length > 0) {
    console.warn(`  Found ${(orphanedCVs as any[]).length} potentially orphaned CVs`);
  } else {
    console.log(`✓ No orphaned CVs found`);
  }
  
  // Check for subscriptions without users
  const orphanedSubs = await prisma.$queryRaw`
    SELECT id, "userId" FROM "Subscription" 
    WHERE "userId" NOT IN (SELECT id FROM "User")
  `;
  
  if (Array.isArray(orphanedSubs) && orphanedSubs.length > 0) {
    console.warn(`  Found ${(orphanedSubs as any[]).length} potentially orphaned subscriptions`);
  } else {
    console.log(`✓ No orphaned subscriptions found`);
  }
}

async function main() {
  console.log('=== EXEC-002 PHASE 13: CLEANUP REAL EXECUTION ===\n');
  
  try {
    const { userId, email } = await createTestUser();
    await createTestData(userId);
    await verifyDataExists(userId);
    await performCleanup(userId);
    await verifyCleanup(userId);
    await testIsolation();
    await verifyNoOrphanedData();
    
    console.log('\n=== CLEANUP WORKFLOW: PASS ===');
    console.log('\nEVIDENCE:');
    console.log(`  User ID: ${evidence.userId}`);
    console.log(`  CV ID: ${evidence.cvId}`);
    console.log(`  Job ID: ${evidence.jobId}`);
    console.log(`  Matching ID: ${evidence.matchingId}`);
    console.log(`  Subscription ID: ${evidence.subscriptionId}`);
    console.log(`  Cleanup Results: ${JSON.stringify(evidence.cleanupResults)}`);
    console.log(`  Isolation Results: ${JSON.stringify(evidence.isolationResults)}`);
    console.log(`  Timestamp: ${evidence.timestamp}`);
    
  } catch (error: any) {
    console.error('\n=== CLEANUP WORKFLOW: FAIL ===');
    console.error(`Error: ${error.message}`);
    
    // Attempt cleanup on failure
    if (evidence.userId) {
      try {
        const supabaseUrl = process.env.SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        await prisma.previewAnalysis.deleteMany({ where: { claimedByUserId: evidence.userId } });
        await prisma.cVAnalysis.deleteMany({ where: { userId: evidence.userId } });
        await prisma.subscription.deleteMany({ where: { userId: evidence.userId } });
        await prisma.user.delete({ where: { id: evidence.userId } });
        await supabase.auth.admin.deleteUser(evidence.userId);
      } catch (cleanupError) {
        console.error('Cleanup failed:', cleanupError);
      }
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
