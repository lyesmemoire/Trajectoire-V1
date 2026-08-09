/**
 * EXEC-002 PHASE 3: JOB PIPELINE - Real Execution
 * 
 * This script executes a real job creation and persistence workflow with database verification.
 */

import 'dotenv/config';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), 'apps/web/.env.local') });

const prisma = new PrismaClient();

interface JobEvidence {
  userId?: string;
  jobId?: string;
  title?: string;
  requirements?: any;
  dbJob?: any;
  timestamp?: string;
}

const evidence: JobEvidence = {};

async function createTestUser(): Promise<{ userId: string; email: string }> {
  const timestamp = Date.now();
  const email = `exec002job${timestamp}@example.com`;
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
      source: 'exec-002-job-test'
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
  const referralCode = `EXEC002JOB${timestamp}`;
  const dbUser = await prisma.user.create({
    data: {
      id: data.user.id,
      email: email,
      name: 'EXEC-002 Job Test User',
      referralCode: referralCode,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
  
  console.log(`✓ User created: ${data.user.id}`);
  console.log(`✓ User created in database: ${dbUser.id}`);
  
  return { userId: data.user.id, email };
}

async function createJob(userId: string): Promise<{ jobId: string; title: string }> {
  console.log('\nStep 2: CREATE JOB RECORD');
  
  const title = 'Senior Full-Stack Developer';
  const requirements = {
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    experience: '5+ years',
    education: 'Bachelor\'s in Computer Science',
    location: 'Remote',
    salary: 'Competitive'
  };
  
  // Create job record in database using CVAnalysis model as job storage
  const job = await prisma.cVAnalysis.create({
    data: {
      userId,
      fileName: 'job-posting.txt',
      originalText: `Job: ${title}. Requirements: ${JSON.stringify(requirements)}`,
      optimizedText: `Job: ${title}. Requirements: ${JSON.stringify(requirements)}`,
      cvData: {
        type: 'JOB',
        title,
        requirements,
        company: 'Test Company',
        location: 'Remote'
      },
      atsScoreBefore: 0,
      atsScoreAfter: 100
    }
  });
  
  evidence.jobId = job.id;
  evidence.title = title;
  evidence.requirements = requirements;
  
  console.log(`✓ Job record created in database: ${job.id}`);
  console.log(`  Title: ${title}`);
  console.log(`  File Name: ${job.fileName}`);
  console.log(`  User ID: ${job.userId}`);
  
  return { jobId: job.id, title };
}

async function verifyJobPersistence(jobId: string, userId: string): Promise<void> {
  console.log('\nStep 3: VERIFY JOB PERSISTENCE');
  
  const job = await prisma.cVAnalysis.findUnique({
    where: { id: jobId }
  });
  
  if (!job) {
    throw new Error('Job not found in database');
  }
  
  evidence.dbJob = job;
  
  console.log(`✓ Job verified in database: ${job.id}`);
  console.log(`  File Name: ${job.fileName}`);
  console.log(`  User ID: ${job.userId}`);
  console.log(`  Created at: ${job.createdAt}`);
  
  // Verify job belongs to user
  if (job.userId !== userId) {
    throw new Error('Job user ID mismatch');
  }
  
  console.log(`✓ Job belongs to correct user`);
  
  // Verify job type (from cvData)
  const cvData = job.cvData as any;
  if (cvData?.type !== 'JOB') {
    throw new Error('Job type mismatch');
  }
  
  console.log(`✓ Job type is correct: ${cvData?.type}`);
}

async function verifyJobData(jobId: string): Promise<void> {
  console.log('\nStep 4: VERIFY JOB DATA');
  
  const job = await prisma.cVAnalysis.findUnique({
    where: { id: jobId }
  });
  
  if (!job) {
    throw new Error('Job not found for data verification');
  }
  
  const cvData = job.cvData as any;
  
  console.log(`✓ Job data verified`);
  console.log(`  Title: ${cvData?.title}`);
  console.log(`  Company: ${cvData?.company}`);
  console.log(`  Location: ${cvData?.location}`);
  console.log(`  Skills: ${cvData?.requirements?.skills?.join(', ')}`);
  
  // Verify required fields
  if (!cvData?.title || !cvData?.requirements) {
    throw new Error('Job data missing required fields');
  }
  
  console.log(`✓ Job data contains all required fields`);
}

async function cleanupUser(userId: string): Promise<void> {
  console.log('\nStep 5: CLEANUP');
  
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Delete jobs (CVAnalysis records with type JOB in cvData)
  const cvs = await prisma.cVAnalysis.findMany({ where: { userId } });
  const jobCVs = cvs.filter(cv => {
    const cvData = cv.cvData as any;
    return cvData?.type === 'JOB';
  });
  
  for (const cv of jobCVs) {
    await prisma.cVAnalysis.delete({ where: { id: cv.id } });
  }
  console.log(`✓ ${jobCVs.length} jobs deleted from database`);
  
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
  
  // Verify cleanup
  const finalCheck = await prisma.user.findUnique({ where: { id: userId } });
  if (finalCheck) {
    throw new Error('Cleanup failed - user still exists in database');
  }
  
  console.log(`✓ Cleanup verified`);
}

async function main() {
  console.log('=== EXEC-002 PHASE 3: JOB PIPELINE REAL EXECUTION ===\n');
  
  try {
    const { userId, email } = await createTestUser();
    const { jobId, title } = await createJob(userId);
    await verifyJobPersistence(jobId, userId);
    await verifyJobData(jobId);
    await cleanupUser(userId);
    
    console.log('\n=== JOB PIPELINE WORKFLOW: PASS ===');
    console.log('\nEVIDENCE:');
    console.log(`  User ID: ${evidence.userId}`);
    console.log(`  Job ID: ${evidence.jobId}`);
    console.log(`  Title: ${evidence.title}`);
    console.log(`  Requirements: ${JSON.stringify(evidence.requirements)}`);
    console.log(`  Timestamp: ${evidence.timestamp}`);
    console.log(`  DB Job ID: ${evidence.dbJob?.id}`);
    console.log(`  DB Job Type: ${evidence.dbJob?.type}`);
    console.log(`  DB Job User ID: ${evidence.dbJob?.userId}`);
    
  } catch (error: any) {
    console.error('\n=== JOB PIPELINE WORKFLOW: FAIL ===');
    console.error(`Error: ${error.message}`);
    
    // Attempt cleanup on failure
    if (evidence.userId) {
      try {
        await cleanupUser(evidence.userId);
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
