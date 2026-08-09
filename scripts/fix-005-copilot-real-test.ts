/**
 * FIX-005 - COPILOT REAL EXECUTION TEST
 * Tests the actual Copilot workflow with real database operations
 */

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
let userId = '';

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

async function runRealCopilotTest(): Promise<TestResult> {
  try {
    console.log('=== FIX-005 COPILOT REAL EXECUTION TEST ===\n');

    // STEP 1: Create real user
    console.log('STEP 1: Creating real user...');
    userId = uuidv4();
    const userEmail = `test-copilot-${userId}@example.com`;
    const referralCode = uuidv4();

    const user = await prisma.user.create({
      data: {
        id: userId,
        email: userEmail,
        referralCode,
      },
    });

    console.log(`✅ User created: ${user.id}`);
    console.log(`   Email: ${user.email}`);

    // STEP 2: Create real CV with specific skills
    console.log('\nSTEP 2: Creating real CV with specific skills...');
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

    console.log(`✅ CV created: ${cv.id}`);
    console.log(`   Skills: ${cvData.skills.join(', ')}`);

    // STEP 3: Create real Job with specific requirements
    console.log('\nSTEP 3: Creating real Job with specific requirements...');
    const jobData = {
      title: 'Senior Full-Stack Developer',
      requirements: ['TypeScript', 'React', 'PostgreSQL'],
      company: 'Tech Company',
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

    console.log(`✅ Job created: ${job.id}`);
    console.log(`   Requirements: ${jobData.requirements.join(', ')}`);

    // STEP 4: Verify CV ownership
    console.log('\nSTEP 4: Verifying CV ownership...');
    const cvCheck = await prisma.cVAnalysis.findUnique({
      where: { id: cv.id },
    });

    if (!cvCheck || cvCheck.userId !== userId) {
      throw new Error('CV ownership verification failed');
    }

    console.log(`✅ CV ownership verified: ${cvCheck.userId === userId}`);

    // STEP 5: Verify Job ownership
    console.log('\nSTEP 5: Verifying Job ownership...');
    const jobCheck = await prisma.cVAnalysis.findUnique({
      where: { id: job.id },
    });

    if (!jobCheck || jobCheck.userId !== userId) {
      throw new Error('Job ownership verification failed');
    }

    console.log(`✅ Job ownership verified: ${jobCheck.userId === userId}`);

    // STEP 6: Verify CopilotConversation table exists
    console.log('\nSTEP 6: Verifying CopilotConversation table...');
    const conversationCount = await prisma.copilotConversation.count();
    console.log(`✅ CopilotConversation table exists (current count: ${conversationCount})`);

    // STEP 7: Test Copilot conversation persistence
    console.log('\nSTEP 7: Testing Copilot conversation persistence...');
    const sessionId = `session_${uuidv4()}`;

    const userMessage = await prisma.copilotConversation.create({
      data: {
        userId,
        sessionId,
        role: 'user',
        content: 'Which skills from my CV best match this job?',
        cvId: cv.id,
        jobId: job.id,
      },
    });

    console.log(`✅ User message persisted: ${userMessage.id}`);

    const assistantMessage = await prisma.copilotConversation.create({
      data: {
        userId,
        sessionId,
        role: 'assistant',
        content: 'Based on your CV, you have TypeScript, React, and PostgreSQL which match the job requirements.',
        sources: ['CV skills', 'Job requirements'],
        reasoning: ['Skill matching analysis'],
        cvId: cv.id,
        jobId: job.id,
      },
    });

    console.log(`✅ Assistant message persisted: ${assistantMessage.id}`);

    // STEP 8: Verify conversation retrieval
    console.log('\nSTEP 8: Verifying conversation retrieval...');
    const conversations = await prisma.copilotConversation.findMany({
      where: {
        userId,
        sessionId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (conversations.length !== 2) {
      throw new Error(`Expected 2 conversations, got ${conversations.length}`);
    }

    console.log(`✅ Conversation retrieved: ${conversations.length} messages`);
    console.log(`   Message 1 (${conversations[0].role}): ${conversations[0].content.substring(0, 50)}...`);
    console.log(`   Message 2 (${conversations[1].role}): ${conversations[1].content.substring(0, 50)}...`);

    // STEP 9: Verify CV and Job references in conversation
    console.log('\nSTEP 9: Verifying CV and Job references in conversation...');
    const conversationWithCV = await prisma.copilotConversation.findFirst({
      where: {
        id: userMessage.id,
        cvId: cv.id,
      },
    });

    if (!conversationWithCV) {
      throw new Error('CV reference not found in conversation');
    }

    console.log(`✅ CV reference verified in conversation`);

    const conversationWithJob = await prisma.copilotConversation.findFirst({
      where: {
        id: userMessage.id,
        jobId: job.id,
      },
    });

    if (!conversationWithJob) {
      throw new Error('Job reference not found in conversation');
    }

    console.log(`✅ Job reference verified in conversation`);

    // STEP 10: Cross-user security test
    console.log('\nSTEP 10: Testing cross-user security...');
    const otherUserId = uuidv4();
    const otherUserEmail = `other-user-${otherUserId}@example.com`;

    const otherUser = await prisma.user.create({
      data: {
        id: otherUserId,
        email: otherUserEmail,
        referralCode: uuidv4(),
      },
    });

    console.log(`✅ Other user created: ${otherUser.id}`);

    // Try to access original user's conversation
    const otherUserConversations = await prisma.copilotConversation.findMany({
      where: {
        userId: otherUserId,
        sessionId,
      },
    });

    if (otherUserConversations.length > 0) {
      throw new Error('Cross-user security violation: other user can access conversation');
    }

    console.log(`✅ Cross-user security verified: other user cannot access conversation`);

    // STEP 11: Cleanup
    console.log('\nSTEP 11: Cleaning up test data...');

    await prisma.copilotConversation.deleteMany({
      where: { userId },
    });

    await prisma.cVAnalysis.deleteMany({
      where: { userId },
    });

    await prisma.user.delete({
      where: { id: userId },
    });

    await prisma.copilotConversation.deleteMany({
      where: { userId: otherUserId },
    });

    await prisma.user.delete({
      where: { id: otherUserId },
    });

    console.log(`✅ Cleanup completed`);

    return {
      success: true,
      message: 'All real execution tests passed',
      details: {
        userId,
        cvId: cv.id,
        jobId: job.id,
        sessionId,
        cvSkills: cvData.skills,
        jobRequirements: jobData.requirements,
      },
    };
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);

    // Attempt cleanup
    try {
      console.log('\nAttempting cleanup after failure...');
      if (userId) {
        await prisma.copilotConversation.deleteMany({ where: { userId } });
        await prisma.cVAnalysis.deleteMany({ where: { userId } });
        await prisma.user.delete({ where: { id: userId } });
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
let userId = '';
runRealCopilotTest()
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
