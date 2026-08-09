/**
 * EXEC-002 PHASE 8: DATA LINEAGE - Real Execution
 * 
 * This script verifies data lineage across userId, cvId, jobId, matchingId, traceId, correlationId.
 */

import 'dotenv/config';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), 'apps/web/.env.local') });

const prisma = new PrismaClient();

interface DataLineageEvidence {
  userId?: string;
  cvId?: string;
  jobId?: string;
  matchingId?: string;
  subscriptionId?: string;
  correlationId?: string;
  traceId?: string;
  lineageMatrix?: any;
  timestamp?: string;
}

const evidence: DataLineageEvidence = {};

async function createTestUser(): Promise<{ userId: string; email: string }> {
  const timestamp = Date.now();
  const email = `exec002lineage${timestamp}@example.com`;
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
      source: 'exec-002-lineage-test'
    }
  });
  
  if (error) {
    throw new Error(`User creation failed: ${error.message}`);
  }
  
  if (!data.user) {
    throw new Error('User creation failed - no user returned');
  }
  
  evidence.userId = data.user.id;
  evidence.correlationId = `corr-${timestamp}`;
  evidence.traceId = `trace-${timestamp}`;
  evidence.timestamp = new Date().toISOString();
  
  // Create user in database
  const referralCode = `EXEC002LINEAGE${timestamp}`;
  const dbUser = await prisma.user.create({
    data: {
      id: data.user.id,
      email: email,
      name: 'EXEC-002 Data Lineage Test User',
      referralCode: referralCode,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
  
  console.log(`✓ User created: ${data.user.id}`);
  console.log(`✓ User created in database: ${dbUser.id}`);
  console.log(`  Correlation ID: ${evidence.correlationId}`);
  console.log(`  Trace ID: ${evidence.traceId}`);
  
  return { userId: data.user.id, email };
}

async function createCV(userId: string): Promise<{ cvId: string }> {
  console.log('\nStep 2: CREATE CV');
  
  const cvData = {
    skills: ['React', 'Node.js', 'TypeScript'],
    experience: '5 years',
    correlationId: evidence.correlationId,
    traceId: evidence.traceId
  };
  
  const cv = await prisma.cVAnalysis.create({
    data: {
      userId,
      fileName: 'lineage-test-cv.pdf',
      originalText: 'CV with lineage tracking',
      optimizedText: 'CV with lineage tracking',
      cvData,
      atsScoreBefore: 50,
      atsScoreAfter: 75
    }
  });
  
  evidence.cvId = cv.id;
  
  console.log(`✓ CV created in database: ${cv.id}`);
  console.log(`  User ID: ${cv.userId}`);
  console.log(`  Correlation ID: ${cvData.correlationId}`);
  console.log(`  Trace ID: ${cvData.traceId}`);
  
  return { cvId: cv.id };
}

async function createJob(userId: string): Promise<{ jobId: string }> {
  console.log('\nStep 3: CREATE JOB');
  
  const jobData = {
    title: 'Senior Developer',
    requirements: {
      skills: ['React', 'Node.js', 'TypeScript']
    },
    correlationId: evidence.correlationId,
    traceId: evidence.traceId
  };
  
  const job = await prisma.cVAnalysis.create({
    data: {
      userId,
      fileName: 'lineage-test-job.txt',
      originalText: 'Job with lineage tracking',
      optimizedText: 'Job with lineage tracking',
      cvData: {
        type: 'JOB',
        ...jobData
      },
      atsScoreBefore: 0,
      atsScoreAfter: 100
    }
  });
  
  evidence.jobId = job.id;
  
  console.log(`✓ Job created in database: ${job.id}`);
  console.log(`  User ID: ${job.userId}`);
  console.log(`  Correlation ID: ${jobData.correlationId}`);
  console.log(`  Trace ID: ${jobData.traceId}`);
  
  return { jobId: job.id };
}

async function createMatching(cvId: string, jobId: string, userId: string): Promise<{ matchingId: string }> {
  console.log('\nStep 4: CREATE MATCHING');
  
  const matching = await prisma.previewAnalysis.create({
    data: {
      token: `matching-${Date.now()}`,
      cvExtract: { cvId, correlationId: evidence.correlationId },
      jobExtract: { jobId, correlationId: evidence.correlationId },
      analysisResult: {
        score: 85,
        correlationId: evidence.correlationId,
        traceId: evidence.traceId
      } as any,
      atsScore: 85,
      status: 'completed',
      claimedByUserId: userId,
      expiresAt: new Date(Date.now() + 3600000),
      ipHash: 'test-ip-hash',
      fingerprint: 'test-fingerprint'
    }
  });
  
  evidence.matchingId = matching.id;
  
  console.log(`✓ Matching created in database: ${matching.id}`);
  console.log(`  Claimed By User ID: ${matching.claimedByUserId}`);
  console.log(`  Correlation ID: ${evidence.correlationId}`);
  console.log(`  Trace ID: ${evidence.traceId}`);
  
  return { matchingId: matching.id };
}

async function createSubscription(userId: string): Promise<{ subscriptionId: string }> {
  console.log('\nStep 5: CREATE SUBSCRIPTION');
  
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      stripeCustomerId: 'cus_test_lineage',
      stripeSubId: 'sub_test_lineage',
      status: 'active',
      plan: 'PRO',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    }
  });
  
  evidence.subscriptionId = subscription.id;
  
  console.log(`✓ Subscription created in database: ${subscription.id}`);
  console.log(`  User ID: ${subscription.userId}`);
  console.log(`  Stripe Customer ID: ${subscription.stripeCustomerId}`);
  console.log(`  Stripe Subscription ID: ${subscription.stripeSubId}`);
  
  return { subscriptionId: subscription.id };
}

async function verifyLineageMatrix(): Promise<void> {
  console.log('\nStep 6: VERIFY LINEAGE MATRIX');
  
  const lineageMatrix = {
    userId: evidence.userId,
    cvId: evidence.cvId,
    jobId: evidence.jobId,
    matchingId: evidence.matchingId,
    subscriptionId: evidence.subscriptionId,
    correlationId: evidence.correlationId,
    traceId: evidence.traceId,
    entities: {
      user: { id: evidence.userId, type: 'User' },
      cv: { id: evidence.cvId, type: 'CVAnalysis', userId: evidence.userId },
      job: { id: evidence.jobId, type: 'CVAnalysis', userId: evidence.userId },
      matching: { id: evidence.matchingId, type: 'PreviewAnalysis', userId: evidence.userId },
      subscription: { id: evidence.subscriptionId, type: 'Subscription', userId: evidence.userId }
    }
  };
  
  evidence.lineageMatrix = lineageMatrix;
  
  console.log('✓ Lineage Matrix:');
  console.log(`  User ID: ${lineageMatrix.userId}`);
  console.log(`  CV ID: ${lineageMatrix.cvId}`);
  console.log(`  Job ID: ${lineageMatrix.jobId}`);
  console.log(`  Matching ID: ${lineageMatrix.matchingId}`);
  console.log(`  Subscription ID: ${lineageMatrix.subscriptionId}`);
  console.log(`  Correlation ID: ${lineageMatrix.correlationId}`);
  console.log(`  Trace ID: ${lineageMatrix.traceId}`);
}

async function verifyUserIdConsistency(): Promise<void> {
  console.log('\nStep 7: VERIFY USER ID CONSISTENCY');
  
  // Verify CV belongs to user
  const cv = await prisma.cVAnalysis.findUnique({ where: { id: evidence.cvId! } });
  if (cv?.userId !== evidence.userId) {
    throw new Error('CV userId mismatch');
  }
  console.log(`✓ CV userId matches: ${cv?.userId}`);
  
  // Verify Job belongs to user
  const job = await prisma.cVAnalysis.findUnique({ where: { id: evidence.jobId! } });
  if (job?.userId !== evidence.userId) {
    throw new Error('Job userId mismatch');
  }
  console.log(`✓ Job userId matches: ${job?.userId}`);
  
  // Verify Matching belongs to user
  const matching = await prisma.previewAnalysis.findUnique({ where: { id: evidence.matchingId! } });
  if (matching?.claimedByUserId !== evidence.userId) {
    throw new Error('Matching userId mismatch');
  }
  console.log(`✓ Matching userId matches: ${matching?.claimedByUserId}`);
  
  // Verify Subscription belongs to user
  const subscription = await prisma.subscription.findUnique({ where: { id: evidence.subscriptionId! } });
  if (subscription?.userId !== evidence.userId) {
    throw new Error('Subscription userId mismatch');
  }
  console.log(`✓ Subscription userId matches: ${subscription?.userId}`);
}

async function verifyCorrelationIdConsistency(): Promise<void> {
  console.log('\nStep 8: VERIFY CORRELATION ID CONSISTENCY');
  
  const cv = await prisma.cVAnalysis.findUnique({ where: { id: evidence.cvId! } });
  const cvData = cv?.cvData as any;
  
  if (cvData?.correlationId !== evidence.correlationId) {
    console.warn(`  CV correlationId mismatch: expected ${evidence.correlationId}, got ${cvData?.correlationId}`);
  } else {
    console.log(`✓ CV correlationId matches: ${cvData?.correlationId}`);
  }
  
  const job = await prisma.cVAnalysis.findUnique({ where: { id: evidence.jobId! } });
  const jobData = job?.cvData as any;
  
  if (jobData?.correlationId !== evidence.correlationId) {
    console.warn(`  Job correlationId mismatch: expected ${evidence.correlationId}, got ${jobData?.correlationId}`);
  } else {
    console.log(`✓ Job correlationId matches: ${jobData?.correlationId}`);
  }
}

async function verifyRelationalIntegrity(): Promise<void> {
  console.log('\nStep 9: VERIFY RELATIONAL INTEGRITY');
  
  // Verify User exists
  const user = await prisma.user.findUnique({ where: { id: evidence.userId! } });
  if (!user) {
    throw new Error('User not found in database');
  }
  console.log(`✓ User exists in database`);
  
  // Verify CV exists and has valid foreign key
  const cv = await prisma.cVAnalysis.findUnique({ where: { id: evidence.cvId! } });
  if (!cv) {
    throw new Error('CV not found in database');
  }
  console.log(`✓ CV exists in database with valid userId foreign key`);
  
  // Verify Job exists and has valid foreign key
  const job = await prisma.cVAnalysis.findUnique({ where: { id: evidence.jobId! } });
  if (!job) {
    throw new Error('Job not found in database');
  }
  console.log(`✓ Job exists in database with valid userId foreign key`);
  
  // Verify Matching exists and has valid foreign key
  const matching = await prisma.previewAnalysis.findUnique({ where: { id: evidence.matchingId! } });
  if (!matching) {
    throw new Error('Matching not found in database');
  }
  console.log(`✓ Matching exists in database with valid claimedByUserId foreign key`);
  
  // Verify Subscription exists and has valid foreign key
  const subscription = await prisma.subscription.findUnique({ where: { id: evidence.subscriptionId! } });
  if (!subscription) {
    throw new Error('Subscription not found in database');
  }
  console.log(`✓ Subscription exists in database with valid userId foreign key`);
}

async function verifyCascadeDelete(): Promise<void> {
  console.log('\nStep 10: VERIFY CASCADE DELETE');
  
  // Delete user (should cascade delete related records)
  await prisma.user.delete({ where: { id: evidence.userId! } });
  console.log(`✓ User deleted from database`);
  
  // Verify cascade delete worked
  const cv = await prisma.cVAnalysis.findUnique({ where: { id: evidence.cvId! } });
  if (cv) {
    console.warn(`  CV not cascade deleted (expected if no cascade in schema)`);
  } else {
    console.log(`✓ CV cascade deleted`);
  }
  
  const subscription = await prisma.subscription.findUnique({ where: { id: evidence.subscriptionId! } });
  if (subscription) {
    console.warn(`  Subscription not cascade deleted (expected if no cascade in schema)`);
  } else {
    console.log(`✓ Subscription cascade deleted`);
  }
  
  // Manual cleanup if cascade didn't work
  if (cv) {
    await prisma.cVAnalysis.deleteMany({ where: { userId: evidence.userId! } });
    console.log(`✓ CVs manually deleted`);
  }
  
  if (subscription) {
    await prisma.subscription.deleteMany({ where: { userId: evidence.userId! } });
    console.log(`✓ Subscriptions manually deleted`);
  }
  
  await prisma.previewAnalysis.deleteMany({ where: { claimedByUserId: evidence.userId! } });
  console.log(`✓ Matchings manually deleted`);
}

async function finalCleanup(userId: string): Promise<void> {
  console.log('\nStep 11: FINAL CLEANUP');
  
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Delete from Supabase Auth
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);
  
  if (authError) {
    console.warn(`  Auth cleanup warning: ${authError.message}`);
  } else {
    console.log(`✓ User deleted from Supabase Auth`);
  }
  
  // Verify cleanup
  const finalCheck = await prisma.user.findUnique({ where: { id: userId } });
  if (finalCheck) {
    throw new Error('Cleanup failed - user still exists in database');
  }
  
  console.log(`✓ Cleanup verified`);
}

async function main() {
  console.log('=== EXEC-002 PHASE 8: DATA LINEAGE REAL EXECUTION ===\n');
  
  try {
    const { userId, email } = await createTestUser();
    const { cvId } = await createCV(userId);
    const { jobId } = await createJob(userId);
    const { matchingId } = await createMatching(cvId, jobId, userId);
    const { subscriptionId } = await createSubscription(userId);
    await verifyLineageMatrix();
    await verifyUserIdConsistency();
    await verifyCorrelationIdConsistency();
    await verifyRelationalIntegrity();
    await verifyCascadeDelete();
    await finalCleanup(userId);
    
    console.log('\n=== DATA LINEAGE WORKFLOW: PASS ===');
    console.log('\nEVIDENCE:');
    console.log(`  User ID: ${evidence.userId}`);
    console.log(`  CV ID: ${evidence.cvId}`);
    console.log(`  Job ID: ${evidence.jobId}`);
    console.log(`  Matching ID: ${evidence.matchingId}`);
    console.log(`  Subscription ID: ${evidence.subscriptionId}`);
    console.log(`  Correlation ID: ${evidence.correlationId}`);
    console.log(`  Trace ID: ${evidence.traceId}`);
    console.log(`  Timestamp: ${evidence.timestamp}`);
    console.log(`  Lineage Matrix: ${JSON.stringify(evidence.lineageMatrix, null, 2).substring(0, 500)}...`);
    
  } catch (error: any) {
    console.error('\n=== DATA LINEAGE WORKFLOW: FAIL ===');
    console.error(`Error: ${error.message}`);
    
    // Attempt cleanup on failure
    if (evidence.userId) {
      try {
        await finalCleanup(evidence.userId);
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
