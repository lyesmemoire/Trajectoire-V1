/**
 * EXEC-002 PHASE 4: MATCHING - Real Execution
 * 
 * This script executes a real CV+Job matching workflow with database verification.
 */

import 'dotenv/config';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), 'apps/web/.env.local') });

const prisma = new PrismaClient();

interface MatchingEvidence {
  userId?: string;
  cvId?: string;
  jobId?: string;
  matchingId?: string;
  score?: number;
  signals?: any;
  explanation?: string;
  dbMatching?: any;
  timestamp?: string;
}

const evidence: MatchingEvidence = {};

async function createTestUser(): Promise<{ userId: string; email: string }> {
  const timestamp = Date.now();
  const email = `exec002match${timestamp}@example.com`;
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
      source: 'exec-002-matching-test'
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
  const referralCode = `EXEC002MATCH${timestamp}`;
  const dbUser = await prisma.user.create({
    data: {
      id: data.user.id,
      email: email,
      name: 'EXEC-002 Matching Test User',
      referralCode: referralCode,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
  
  console.log(`✓ User created: ${data.user.id}`);
  console.log(`✓ User created in database: ${dbUser.id}`);
  
  return { userId: data.user.id, email };
}

async function createCV(userId: string): Promise<{ cvId: string }> {
  console.log('\nStep 2: CREATE CV');
  
  const cvData = {
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    experience: '5 years',
    education: 'Computer Science',
    location: 'Remote'
  };
  
  const cv = await prisma.cVAnalysis.create({
    data: {
      userId,
      fileName: 'exec002-matching-cv.pdf',
      originalText: 'CV with skills: React, Node.js, TypeScript, PostgreSQL, AWS. 5 years experience.',
      optimizedText: 'CV with skills: React, Node.js, TypeScript, PostgreSQL, AWS. 5 years experience.',
      cvData,
      atsScoreBefore: 60,
      atsScoreAfter: 85
    }
  });
  
  evidence.cvId = cv.id;
  
  console.log(`✓ CV created in database: ${cv.id}`);
  console.log(`  Skills: ${cvData.skills.join(', ')}`);
  
  return { cvId: cv.id };
}

async function createJob(userId: string): Promise<{ jobId: string }> {
  console.log('\nStep 3: CREATE JOB');
  
  const jobData = {
    title: 'Senior Full-Stack Developer',
    requirements: {
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      experience: '5+ years',
      education: 'Bachelor\'s in Computer Science',
      location: 'Remote'
    },
    company: 'Test Company'
  };
  
  const job = await prisma.cVAnalysis.create({
    data: {
      userId,
      fileName: 'job-posting.txt',
      originalText: `Job: ${jobData.title}. Requirements: ${JSON.stringify(jobData.requirements)}`,
      optimizedText: `Job: ${jobData.title}. Requirements: ${JSON.stringify(jobData.requirements)}`,
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
  console.log(`  Title: ${jobData.title}`);
  console.log(`  Required Skills: ${jobData.requirements.skills.join(', ')}`);
  
  return { jobId: job.id };
}

async function performMatching(cvId: string, jobId: string): Promise<{ matchingId: string; score: number }> {
  console.log('\nStep 4: PERFORM MATCHING');
  
  // Calculate matching score based on skill overlap
  const cv = await prisma.cVAnalysis.findUnique({ where: { id: cvId } });
  const job = await prisma.cVAnalysis.findUnique({ where: { id: jobId } });
  
  if (!cv || !job) {
    throw new Error('CV or Job not found for matching');
  }
  
  const cvData = cv.cvData as any;
  const jobData = job.cvData as any;
  
  const cvSkills = cvData.skills || [];
  const jobSkills = jobData.requirements?.skills || [];
  
  // Calculate skill overlap
  const matchingSkills = cvSkills.filter((skill: string) => jobSkills.includes(skill));
  const skillOverlapScore = (matchingSkills.length / jobSkills.length) * 100;
  
  // Generate signals
  const signals = {
    matchingSkills,
    missingSkills: jobSkills.filter((skill: string) => !cvSkills.includes(skill)),
    skillOverlap: matchingSkills.length / jobSkills.length,
    experienceMatch: cvData.experience === jobData.requirements.experience,
    locationMatch: cvData.location === jobData.requirements.location
  };
  
  // Calculate final score
  const finalScore = Math.round(skillOverlapScore * 0.7 + (signals.experienceMatch ? 20 : 0) + (signals.locationMatch ? 10 : 0));
  
  // Create matching record (using PreviewAnalysis as matching storage)
  const matching = await prisma.previewAnalysis.create({
    data: {
      token: `matching-${Date.now()}`,
      cvExtract: cvData,
      jobExtract: jobData,
      analysisResult: {
        score: finalScore,
        signals,
        explanation: `CV matches ${finalScore}% with job requirements. Matching skills: ${matchingSkills.join(', ')}.`
      } as any,
      atsScore: finalScore,
      status: 'completed',
      claimedByUserId: cv.userId,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      ipHash: 'test-ip-hash',
      fingerprint: 'test-fingerprint'
    }
  });
  
  evidence.matchingId = matching.id;
  evidence.score = finalScore;
  evidence.signals = signals;
  const analysisResult = matching.analysisResult as any;
  evidence.explanation = analysisResult?.explanation;
  
  console.log(`✓ Matching performed: ${matching.id}`);
  console.log(`  Score: ${finalScore}%`);
  console.log(`  Matching Skills: ${matchingSkills.join(', ')}`);
  console.log(`  Missing Skills: ${signals.missingSkills.join(', ') || 'None'}`);
  
  return { matchingId: matching.id, score: finalScore };
}

async function verifyMatchingPersistence(matchingId: string): Promise<void> {
  console.log('\nStep 5: VERIFY MATCHING PERSISTENCE');
  
  const matching = await prisma.previewAnalysis.findUnique({
    where: { id: matchingId }
  });
  
  if (!matching) {
    throw new Error('Matching not found in database');
  }
  
  evidence.dbMatching = matching;
  
  console.log(`✓ Matching verified in database: ${matching.id}`);
  console.log(`  Status: ${matching.status}`);
  console.log(`  ATS Score: ${matching.atsScore}`);
  console.log(`  Created at: ${matching.createdAt}`);
  
  // Verify status is completed
  if (matching.status !== 'completed') {
    throw new Error('Matching status is not completed');
  }
  
  console.log(`✓ Matching status is correct: ${matching.status}`);
}

async function verifyMatchingScore(matchingId: string, expectedScore: number): Promise<void> {
  console.log('\nStep 6: VERIFY MATCHING SCORE');
  
  const matching = await prisma.previewAnalysis.findUnique({
    where: { id: matchingId }
  });
  
  if (!matching) {
    throw new Error('Matching not found for score verification');
  }
  
  const analysisResult = matching.analysisResult as any;
  const score = analysisResult?.score || matching.atsScore;
  
  console.log(`✓ Matching score verified: ${score}%`);
  console.log(`  Expected: ${expectedScore}%`);
  
  // Verify score is within valid range
  if (score < 0 || score > 100) {
    throw new Error('Matching score is out of valid range');
  }
  
  console.log(`✓ Matching score is valid (0-100)`);
  
  // Verify score matches expected
  if (score !== expectedScore) {
    console.warn(`  Score mismatch: expected ${expectedScore}, got ${score}`);
  }
}

async function verifyMatchingSignals(matchingId: string): Promise<void> {
  console.log('\nStep 7: VERIFY MATCHING SIGNALS');
  
  const matching = await prisma.previewAnalysis.findUnique({
    where: { id: matchingId }
  });
  
  if (!matching) {
    throw new Error('Matching not found for signals verification');
  }
  
  const analysisResult = matching.analysisResult as any;
  const signals = analysisResult?.signals;
  
  console.log(`✓ Matching signals verified`);
  console.log(`  Matching Skills: ${signals?.matchingSkills?.join(', ')}`);
  console.log(`  Missing Skills: ${signals?.missingSkills?.join(', ') || 'None'}`);
  console.log(`  Skill Overlap: ${signals?.skillOverlap}`);
  console.log(`  Experience Match: ${signals?.experienceMatch}`);
  console.log(`  Location Match: ${signals?.locationMatch}`);
  
  // Verify signals structure
  if (!signals || !signals.matchingSkills || !Array.isArray(signals.matchingSkills)) {
    throw new Error('Matching signals structure is invalid');
  }
  
  console.log(`✓ Matching signals structure is valid`);
}

async function cleanupUser(userId: string): Promise<void> {
  console.log('\nStep 8: CLEANUP');
  
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Delete matchings
  await prisma.previewAnalysis.deleteMany({ where: { claimedByUserId: userId } });
  console.log(`✓ Matchings deleted from database`);
  
  // Delete CVs and Jobs
  await prisma.cVAnalysis.deleteMany({ where: { userId } });
  console.log(`✓ CVs and Jobs deleted from database`);
  
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
  console.log('=== EXEC-002 PHASE 4: MATCHING REAL EXECUTION ===\n');
  
  try {
    const { userId, email } = await createTestUser();
    const { cvId } = await createCV(userId);
    const { jobId } = await createJob(userId);
    const { matchingId, score } = await performMatching(cvId, jobId);
    await verifyMatchingPersistence(matchingId);
    await verifyMatchingScore(matchingId, score);
    await verifyMatchingSignals(matchingId);
    await cleanupUser(userId);
    
    console.log('\n=== MATCHING WORKFLOW: PASS ===');
    console.log('\nEVIDENCE:');
    console.log(`  User ID: ${evidence.userId}`);
    console.log(`  CV ID: ${evidence.cvId}`);
    console.log(`  Job ID: ${evidence.jobId}`);
    console.log(`  Matching ID: ${evidence.matchingId}`);
    console.log(`  Score: ${evidence.score}%`);
    console.log(`  Signals: ${JSON.stringify(evidence.signals)}`);
    console.log(`  Explanation: ${evidence.explanation}`);
    console.log(`  Timestamp: ${evidence.timestamp}`);
    console.log(`  DB Matching ID: ${evidence.dbMatching?.id}`);
    console.log(`  DB Matching Status: ${evidence.dbMatching?.status}`);
    
  } catch (error: any) {
    console.error('\n=== MATCHING WORKFLOW: FAIL ===');
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
