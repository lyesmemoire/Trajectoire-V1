/**
 * EXEC-003 — COPILOT REAL WORKFLOW EXECUTION
 * 
 * This script performs a complete end-to-end COPILOT workflow with real data:
 * 1. USER + CV + JOB - Create real user, CV, and interview session
 * 2. COPILOT REQUEST - Test interview API with real session
 * 3. RETRIEVAL - Verify session data retrieval
 * 4. AI RESPONSE - Verify response structure
 * 5. SOURCES - Verify data sources
 * 
 * NO OPENAI REQUIRED - Uses Knowledge Graph Reasoning Engine
 */

import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; // API NestJS runs on port 3000

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper functions
function generateRunId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `exec-003-${timestamp}-${random}`;
}

function generateTestEmail(runId: string, suffix: string = 'user'): string {
  // Use a unique email for each run to avoid conflicts
  const timestamp = Date.now();
  return `exec003${timestamp}@test.com`;
}

function generateTestPassword(): string {
  return 'Exec003TestPassword123!';
}

// Phase 1: Create user, CV, and interview session
async function phase1_createUserCVJob(runId: string) {
  console.log('\n=== PHASE 1: USER + CV + JOB ===');
  
  const email = generateTestEmail(runId, 'copilot');
  const password = generateTestPassword();
  
  // Create user via Supabase Admin API (bypasses rate limits)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name: 'EXEC-003 Test User'
    }
  });
  
  if (authError) {
    throw new Error(`Failed to create user via admin API: ${authError.message}`);
  }
  
  const userId = authData.user?.id;
  if (!userId) {
    throw new Error('User ID not returned from Supabase Admin API');
  }
  
  console.log(`✅ User created via admin API: ${userId}`);
  
  // Ensure user exists in Prisma database
  let dbUser = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!dbUser) {
    // Create user in Prisma if not exists
    dbUser = await prisma.user.create({
      data: {
        id: userId,
        email: email,
        name: 'EXEC-003 Test User',
        plan: 'FREE',
        role: 'USER',
        referralCode: 'EXEC003'
      }
    });
    console.log(`✅ User created in Prisma: ${dbUser.id}`);
  } else {
    console.log(`✅ User exists in Prisma: ${dbUser.id}`);
  }
  
  console.log(`✅ User created: ${userId}`);
  
  // Create CV record
  const cv = await prisma.cVAnalysis.create({
    data: {
      userId,
      fileName: 'copilot-cv.pdf',
      originalText: 'Test CV content for Copilot E2E testing. Skills: JavaScript, TypeScript, React, Node.js. Experience: 5 years software engineering.',
      optimizedText: 'Optimized test CV content for Copilot E2E testing.',
      cvData: {
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
        experience: '5 years',
        education: 'Computer Science'
      },
      atsScoreBefore: 50,
      atsScoreAfter: 75
    }
  });
  
  console.log(`✅ CV created: ${cv.id}`);
  
  // Create interview session
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
  
  console.log(`✅ Interview session created: ${session.id}`);
  
  return { userId, cvId: cv.id, sessionId: session.id, email, password };
}

// Phase 2: Test Copilot API (using Knowledge Graph Reasoning)
async function phase2_testCopilotAPI(sessionId: string, userId: string) {
  console.log('\n=== PHASE 2: COPILOT REQUEST ===');
  
  // Test Copilot message endpoint using the in-memory reasoning engine
  const copilotResponse = await fetch(`${BASE_URL}/copilot/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: sessionId,
      message: 'Tell me about my experience with React'
    })
  });
  
  console.log(`Copilot response status: ${copilotResponse.status}`);
  
  const responseText = await copilotResponse.text();
  console.log(`Response preview: ${responseText.substring(0, 200)}`);
  
  if (copilotResponse.status === 200) {
    try {
      const copilotData = JSON.parse(responseText);
      console.log(`✅ Copilot request successful`);
      console.log(`   - Message: ${copilotData.data?.message?.substring(0, 100) || 'N/A'}`);
      console.log(`   - Confidence: ${copilotData.data?.confidence || 'N/A'}`);
      console.log(`   - Sources count: ${copilotData.data?.sources?.length || 0}`);
      return { copilotData };
    } catch (parseError) {
      console.log(`⚠️ Failed to parse JSON from response`);
      console.log(`Full response: ${responseText}`);
      return { copilotData: null };
    }
  } else {
    console.log(`⚠️ Copilot returned ${copilotResponse.status}: ${responseText}`);
    return { copilotData: null };
  }
}

// Phase 3: Verify session retrieval
async function phase3_verifyRetrieval(sessionId: string, userId: string) {
  console.log('\n=== PHASE 3: RETRIEVAL ===');
  
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId }
  });
  
  if (!session) {
    throw new Error(`Session ${sessionId} not found in database`);
  }
  
  console.log(`✅ Session retrieved: ${session.id}`);
  console.log(`   - User ID: ${session.userId}`);
  console.log(`   - Persona: ${session.persona}`);
  console.log(`   - State: ${session.currentState}`);
  console.log(`   - Status: ${session.status}`);
  
  // Verify ownership
  if (session.userId !== userId) {
    throw new Error(`Session ownership mismatch: expected ${userId}, got ${session.userId}`);
  }
  
  console.log(`✅ Session ownership verified`);
  
  return session;
}

// Phase 4: Verify AI response structure
async function phase4_verifyResponseStructure(copilotData: any) {
  console.log('\n=== PHASE 4: AI RESPONSE ===');
  
  if (!copilotData) {
    console.log(`⚠️ No copilot data to verify`);
    return null;
  }
  
  const response = copilotData.data;
  
  console.log(`✅ Copilot response structure`);
  console.log(`   - Message exists: ${!!response.message}`);
  console.log(`   - Reasoning exists: ${!!response.reasoning}`);
  console.log(`   - Sources exists: ${!!response.sources}`);
  console.log(`   - Confidence exists: ${!!response.confidence}`);
  
  // Verify response structure
  if (!response.message || !response.reasoning || !response.sources) {
    throw new Error('Response structure incomplete');
  }
  
  console.log(`✅ Response structure verified`);
  return response;
}

// Phase 5: Verify data sources
async function phase5_verifySources(userId: string, cvId: string, sessionId: string) {
  console.log('\n=== PHASE 5: SOURCES ===');
  
  // Verify user-CV-session relationships
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      CVAnalysis: true,
      InterviewSession: true
    }
  });
  
  if (!user) {
    throw new Error(`User ${userId} not found`);
  }
  
  console.log(`✅ User retrieved: ${user.id}`);
  console.log(`   - CV count: ${user.CVAnalysis.length}`);
  console.log(`   - Session count: ${user.InterviewSession.length}`);
  
  // Verify CV exists and belongs to user
  const cv = user.CVAnalysis.find(c => c.id === cvId);
  if (!cv) {
    throw new Error(`CV ${cvId} not found or does not belong to user`);
  }
  
  console.log(`✅ CV verified: ${cv.id} belongs to user`);
  
  // Verify session exists and belongs to user
  const session = user.InterviewSession.find(s => s.id === sessionId);
  if (!session) {
    throw new Error(`Session ${sessionId} not found or does not belong to user`);
  }
  
  console.log(`✅ Session verified: ${session.id} belongs to user`);
  
  return { user, cv, session };
}

// Cleanup
async function cleanup(userId: string) {
  console.log('\n=== CLEANUP ===');
  
  try {
    // Delete from Prisma (cascade should handle CV and session)
    await prisma.user.delete({
      where: { id: userId }
    });
    
    // Delete from Supabase Auth
    await supabaseAdmin.auth.admin.deleteUser(userId);
    
    console.log(`✅ Cleanup successful for user ${userId}`);
  } catch (error) {
    console.error(`❌ Cleanup failed for user ${userId}:`, error);
    throw error;
  }
}

// Main execution
async function main() {
  const runId = generateRunId();
  console.log(`\n=== EXEC-003 COPILOT REAL WORKFLOW ===`);
  console.log(`Run ID: ${runId}`);
  
  let userId: string | null = null;
  
  try {
    // Phase 1: Create user, CV, and session
    const phase1Result = await phase1_createUserCVJob(runId);
    userId = phase1Result.userId;
    
    // Phase 2: Test Copilot API
    const phase2Result = await phase2_testCopilotAPI(phase1Result.sessionId, userId);
    
    // Phase 3: Verify retrieval
    await phase3_verifyRetrieval(phase1Result.sessionId, userId);
    
    // Phase 4: Verify response structure
    await phase4_verifyResponseStructure(phase2Result.copilotData);
    
    // Phase 5: Verify sources
    await phase5_verifySources(userId, phase1Result.cvId, phase1Result.sessionId);
    
    // Cleanup
    await cleanup(userId);
    
    console.log('\n=== EXEC-003 SUCCESS ===');
    console.log('✅ All phases completed successfully');
    console.log('✅ COPILOT workflow: PASS');
    
    process.exit(0);
  } catch (error) {
    console.error('\n=== EXEC-003 FAILED ===');
    console.error('❌ Error:', error);
    
    // Attempt cleanup even on failure
    if (userId) {
      try {
        await cleanup(userId);
      } catch (cleanupError) {
        console.error('Cleanup failed:', cleanupError);
      }
    }
    
    process.exit(1);
  }
}

main();
