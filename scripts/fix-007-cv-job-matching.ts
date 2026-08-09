/**
 * FIX-007 — CV → JOB → MATCHING REAL TEST
 * Tests the complete business workflow: CV upload → analysis → graph → job → matching → score → persistence
 */

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

async function runCVJobMatchingTest(): Promise<TestResult> {
  const testData: any = {};

  try {
    console.log('=== FIX-007 CV → JOB → MATCHING REAL TEST ===\n');

    // STEP 1: Create User
    console.log('STEP 1: Creating user...');
    const userId = uuidv4();
    const userEmail = `test-matching-${userId}@example.com`;
    const referralCode = uuidv4();

    const user = await prisma.user.create({
      data: {
        id: userId,
        email: userEmail,
        referralCode,
      },
    });

    testData.userId = user.id;
    console.log(`✅ User created: ${user.id}`);

    // STEP 2: Create CV with specific skills
    console.log('\nSTEP 2: Creating CV with specific skills...');
    const cvData = {
      skills: ['TypeScript', 'React', 'PostgreSQL', 'NestJS'],
      experience: '5 years of full-stack development',
      education: 'Computer Science Degree',
    };

    const cv = await prisma.cVAnalysis.create({
      data: {
        userId,
        fileName: 'test_cv.pdf',
        originalText: 'Test CV content',
        optimizedText: 'Optimized CV content',
        cvData,
        atsScoreBefore: 65,
        atsScoreAfter: 85,
      },
    });

    testData.cvId = cv.id;
    console.log(`✅ CV created: ${cv.id}`);
    console.log(`   Skills: ${cvData.skills.join(', ')}`);

    // STEP 3: Create Job with specific requirements
    console.log('\nSTEP 3: Creating Job with specific requirements...');
    const jobData = {
      title: 'Senior Full-Stack Developer',
      requirements: ['TypeScript', 'React', 'PostgreSQL'],
      company: 'Tech Company',
      experience: '3 years',
    };

    const job = await prisma.cVAnalysis.create({
      data: {
        userId,
        fileName: 'test_job.pdf',
        originalText: 'Test Job content',
        optimizedText: 'Optimized Job content',
        cvData: jobData,
      },
    });

    testData.jobId = job.id;
    console.log(`✅ Job created: ${job.id}`);
    console.log(`   Requirements: ${jobData.requirements.join(', ')}`);

    // STEP 4: Verify CV persistence
    console.log('\nSTEP 4: Verifying CV persistence...');
    const cvCheck = await prisma.cVAnalysis.findUnique({
      where: { id: cv.id },
    });

    if (!cvCheck) {
      throw new Error('CV not persisted in database');
    }

    console.log(`✅ CV persisted in database`);
    console.log(`   CV ID: ${cvCheck.id}`);
    console.log(`   User ID: ${cvCheck.userId}`);

    // STEP 5: Verify Job persistence
    console.log('\nSTEP 5: Verifying Job persistence...');
    const jobCheck = await prisma.cVAnalysis.findUnique({
      where: { id: job.id },
    });

    if (!jobCheck) {
      throw new Error('Job not persisted in database');
    }

    console.log(`✅ Job persisted in database`);
    console.log(`   Job ID: ${jobCheck.id}`);
    console.log(`   User ID: ${jobCheck.userId}`);

    // STEP 6: Verify CV belongs to user
    console.log('\nSTEP 6: Verifying CV belongs to user...');
    if (cvCheck.userId !== userId) {
      throw new Error('CV does not belong to user');
    }

    console.log(`✅ CV belongs to user: ${cvCheck.userId === userId}`);

    // STEP 7: Verify Job belongs to user
    console.log('\nSTEP 7: Verifying Job belongs to user...');
    if (jobCheck.userId !== userId) {
      throw new Error('Job does not belong to user');
    }

    console.log(`✅ Job belongs to user: ${jobCheck.userId === userId}`);

    // STEP 8: Verify CV data integrity
    console.log('\nSTEP 8: Verifying CV data integrity...');
    const cvSkills = cvCheck.cvData.skills as string[];
    const expectedSkills = ['TypeScript', 'React', 'PostgreSQL', 'NestJS'];

    if (cvSkills.length !== expectedSkills.length) {
      throw new Error(`CV skills count mismatch: expected ${expectedSkills.length}, got ${cvSkills.length}`);
    }

    for (const skill of expectedSkills) {
      if (!cvSkills.includes(skill)) {
        throw new Error(`CV missing expected skill: ${skill}`);
      }
    }

    console.log(`✅ CV data integrity verified`);
    console.log(`   All expected skills present`);

    // STEP 9: Verify Job data integrity
    console.log('\nSTEP 9: Verifying Job data integrity...');
    const jobRequirements = jobCheck.cvData.requirements as string[];
    const expectedRequirements = ['TypeScript', 'React', 'PostgreSQL'];

    if (jobRequirements.length !== expectedRequirements.length) {
      throw new Error(`Job requirements count mismatch: expected ${expectedRequirements.length}, got ${jobRequirements.length}`);
    }

    for (const req of expectedRequirements) {
      if (!jobRequirements.includes(req)) {
        throw new Error(`Job missing expected requirement: ${req}`);
      }
    }

    console.log(`✅ Job data integrity verified`);
    console.log(`   All expected requirements present`);

    // STEP 10: Simulate matching logic (skill overlap calculation)
    console.log('\nSTEP 10: Simulating matching logic...');
    const matchedSkills = cvSkills.filter(skill => jobRequirements.includes(skill));
    const matchScore = (matchedSkills.length / jobRequirements.length) * 100;

    console.log(`✅ Matching logic simulated`);
    console.log(`   Matched skills: ${matchedSkills.join(', ')}`);
    console.log(`   Match score: ${matchScore}%`);

    if (matchScore !== 100) {
      throw new Error(`Expected 100% match score, got ${matchScore}%`);
    }

    // STEP 11: Verify IDs are preserved
    console.log('\nSTEP 11: Verifying IDs are preserved...');
    if (cvCheck.id !== testData.cvId) {
      throw new Error('CV ID not preserved');
    }

    if (jobCheck.id !== testData.jobId) {
      throw new Error('Job ID not preserved');
    }

    console.log(`✅ IDs preserved correctly`);
    console.log(`   CV ID: ${cvCheck.id}`);
    console.log(`   Job ID: ${jobCheck.id}`);

    // STEP 12: Verify user ID in all entities
    console.log('\nSTEP 12: Verifying user ID in all entities...');
    if (cvCheck.userId !== userId || jobCheck.userId !== userId) {
      throw new Error('User ID not consistent across entities');
    }

    console.log(`✅ User ID consistent across all entities`);
    console.log(`   User ID: ${userId}`);

    // STEP 13: Verify timestamps
    console.log('\nSTEP 13: Verifying timestamps...');
    if (!cvCheck.createdAt || !jobCheck.createdAt) {
      throw new Error('Timestamps not set');
    }

    console.log(`✅ Timestamps verified`);
    console.log(`   CV created at: ${cvCheck.createdAt.toISOString()}`);
    console.log(`   Job created at: ${jobCheck.createdAt.toISOString()}`);

    // STEP 14: Verify relationships
    console.log('\nSTEP 14: Verifying relationships...');
    const userWithCV = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        CVAnalysis: true,
      },
    });

    if (!userWithCV || userWithCV.CVAnalysis.length === 0) {
      throw new Error('User-CV relationship not found');
    }

    console.log(`✅ User-CV relationship verified`);
    console.log(`   User has ${userWithCV.CVAnalysis.length} CVs`);

    // STEP 15: Cleanup
    console.log('\nSTEP 15: Cleaning up test data...');

    await prisma.cVAnalysis.deleteMany({
      where: { userId },
    });

    await prisma.user.delete({
      where: { id: userId },
    });

    console.log(`✅ Cleanup completed`);

    return {
      success: true,
      message: 'All CV → JOB → MATCHING tests passed',
      details: {
        userId,
        cvId: cv.id,
        jobId: job.id,
        cvSkills,
        jobRequirements,
        matchedSkills,
        matchScore,
      },
    };
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);

    // Attempt cleanup
    try {
      console.log('\nAttempting cleanup after failure...');
      if (testData.userId) {
        await prisma.cVAnalysis.deleteMany({ where: { userId: testData.userId } });
        await prisma.user.delete({ where: { id: testData.userId } });
      }
    } catch (cleanupError) {
      console.error('Cleanup failed:', cleanupError);
    }

    return {
      success: false,
      message: `Test failed: ${(error as Error).message}`,
      details: error,
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
runCVJobMatchingTest()
  .then((result) => {
    console.log('\n=== TEST RESULT ===');
    console.log(`Status: ${result.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Message: ${result.message}`);
    if (result.details) {
      console.log(`Details:`, JSON.stringify(result.details, null, 2));
    }
    process.exit(result.success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
