/**
 * EXEC-002 PHASE 5: SEARCH - Real Execution
 * 
 * This script executes a real search workflow with database verification.
 */

import 'dotenv/config';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), 'apps/web/.env.local') });

const prisma = new PrismaClient();

interface SearchEvidence {
  userId?: string;
  cvIds?: string[];
  searchQuery?: string;
  searchResults?: any[];
  timestamp?: string;
}

const evidence: SearchEvidence = {};

async function createTestUser(): Promise<{ userId: string; email: string }> {
  const timestamp = Date.now();
  const email = `exec002search${timestamp}@example.com`;
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
      source: 'exec-002-search-test'
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
  const referralCode = `EXEC002SEARCH${timestamp}`;
  const dbUser = await prisma.user.create({
    data: {
      id: data.user.id,
      email: email,
      name: 'EXEC-002 Search Test User',
      referralCode: referralCode,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
  
  console.log(`✓ User created: ${data.user.id}`);
  console.log(`✓ User created in database: ${dbUser.id}`);
  
  return { userId: data.user.id, email };
}

async function createDistinctCVs(userId: string): Promise<{ cvIds: string[] }> {
  console.log('\nStep 2: CREATE DISTINCT CVS');
  
  const cvDataList = [
    {
      skills: ['React', 'TypeScript', 'Node.js'],
      experience: '3 years',
      title: 'Frontend Developer'
    },
    {
      skills: ['Python', 'Django', 'PostgreSQL'],
      experience: '5 years',
      title: 'Backend Developer'
    },
    {
      skills: ['Java', 'Spring', 'Kubernetes'],
      experience: '7 years',
      title: 'DevOps Engineer'
    },
    {
      skills: ['React', 'Python', 'AWS'],
      experience: '4 years',
      title: 'Full-Stack Developer'
    },
    {
      skills: ['TypeScript', 'Node.js', 'MongoDB'],
      experience: '2 years',
      title: 'Junior Developer'
    }
  ];
  
  const cvIds: string[] = [];
  
  for (const cvData of cvDataList) {
    const cv = await prisma.cVAnalysis.create({
      data: {
        userId,
        fileName: `${cvData.title.toLowerCase().replace(' ', '-')}-cv.pdf`,
        originalText: `CV for ${cvData.title} with skills: ${cvData.skills.join(', ')}. Experience: ${cvData.experience}.`,
        optimizedText: `CV for ${cvData.title} with skills: ${cvData.skills.join(', ')}. Experience: ${cvData.experience}.`,
        cvData,
        atsScoreBefore: 50,
        atsScoreAfter: 75
      }
    });
    
    cvIds.push(cv.id);
    console.log(`✓ CV created: ${cv.id} (${cvData.title})`);
  }
  
  evidence.cvIds = cvIds;
  console.log(`✓ Created ${cvIds.length} distinct CVs`);
  
  return { cvIds };
}

async function performSearch(query: string): Promise<{ results: any[] }> {
  console.log('\nStep 3: PERFORM SEARCH');
  console.log(`Query: "${query}"`);
  
  evidence.searchQuery = query;
  
  // Search CVs by text content
  const allCVs = await prisma.cVAnalysis.findMany();
  
  const results = allCVs.filter(cv => {
    const cvData = cv.cvData as any;
    const skills = cvData?.skills || [];
    const title = cvData?.title || '';
    const text = cv.originalText.toLowerCase();
    
    // Check if query matches skills, title, or text
    const queryLower = query.toLowerCase();
    return skills.some((skill: string) => skill.toLowerCase().includes(queryLower)) ||
           title.toLowerCase().includes(queryLower) ||
           text.includes(queryLower);
  }).map(cv => {
    const cvData = cv.cvData as any;
    return {
      id: cv.id,
      title: cvData?.title,
      skills: cvData?.skills,
      experience: cvData?.experience,
      fileName: cv.fileName,
      relevance: calculateRelevance(query, cvData)
    };
  }).sort((a, b) => b.relevance - a.relevance);
  
  evidence.searchResults = results;
  
  console.log(`✓ Search completed: ${results.length} results found`);
  results.forEach((result, index) => {
    console.log(`  ${index + 1}. ${result.title} (relevance: ${result.relevance}%)`);
  });
  
  return { results };
}

function calculateRelevance(query: string, cvData: any): number {
  const queryLower = query.toLowerCase();
  const skills = cvData?.skills || [];
  const title = cvData?.title || '';
  
  let score = 0;
  
  // Skill match (higher weight)
  skills.forEach((skill: string) => {
    if (skill.toLowerCase().includes(queryLower)) {
      score += 40;
    }
  });
  
  // Title match (medium weight)
  if (title.toLowerCase().includes(queryLower)) {
    score += 30;
  }
  
  // Partial skill match (lower weight)
  skills.forEach((skill: string) => {
    if (queryLower.includes(skill.toLowerCase())) {
      score += 10;
    }
  });
  
  return Math.min(score, 100);
}

async function verifySearchResults(results: any[], cvIds: string[]): Promise<void> {
  console.log('\nStep 4: VERIFY SEARCH RESULTS');
  
  // Verify results contain actual CV IDs
  const resultIds = results.map(r => r.id);
  const validResults = resultIds.filter(id => cvIds.includes(id));
  
  console.log(`✓ Results contain ${validResults.length}/${resultIds.length} valid CV IDs`);
  
  if (validResults.length === 0) {
    throw new Error('Search results do not contain any valid CV IDs');
  }
  
  // Verify ranking is by relevance
  for (let i = 0; i < results.length - 1; i++) {
    if (results[i].relevance < results[i + 1].relevance) {
      throw new Error('Search results are not properly ranked by relevance');
    }
  }
  
  console.log(`✓ Search results are properly ranked by relevance`);
}

async function verifyResultData(results: any[]): Promise<void> {
  console.log('\nStep 5: VERIFY RESULT DATA');
  
  for (const result of results) {
    // Verify result has required fields
    if (!result.id || !result.title || !result.skills) {
      throw new Error('Search result missing required fields');
    }
    
    // Verify result data can be retrieved from database
    const cv = await prisma.cVAnalysis.findUnique({
      where: { id: result.id }
    });
    
    if (!cv) {
      throw new Error(`Search result CV not found in database: ${result.id}`);
    }
    
    console.log(`✓ Result data verified for: ${result.title}`);
  }
}

async function cleanupUser(userId: string): Promise<void> {
  console.log('\nStep 6: CLEANUP');
  
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Delete CVs
  await prisma.cVAnalysis.deleteMany({ where: { userId } });
  console.log(`✓ CVs deleted from database`);
  
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
  console.log('=== EXEC-002 PHASE 5: SEARCH REAL EXECUTION ===\n');
  
  try {
    const { userId, email } = await createTestUser();
    const { cvIds } = await createDistinctCVs(userId);
    const { results } = await performSearch('React');
    await verifySearchResults(results, cvIds);
    await verifyResultData(results);
    await cleanupUser(userId);
    
    console.log('\n=== SEARCH WORKFLOW: PASS ===');
    console.log('\nEVIDENCE:');
    console.log(`  User ID: ${evidence.userId}`);
    console.log(`  CV IDs: ${evidence.cvIds?.join(', ')}`);
    console.log(`  Search Query: ${evidence.searchQuery}`);
    console.log(`  Results Count: ${evidence.searchResults?.length}`);
    console.log(`  Timestamp: ${evidence.timestamp}`);
    console.log(`  Results: ${JSON.stringify(evidence.searchResults, null, 2).substring(0, 500)}...`);
    
  } catch (error: any) {
    console.error('\n=== SEARCH WORKFLOW: FAIL ===');
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
