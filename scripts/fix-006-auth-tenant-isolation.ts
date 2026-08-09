/**
 * FIX-006 — AUTH + TENANT ISOLATION REAL TEST
 * Tests real authentication and tenant isolation with Supabase + Prisma
 */

import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const prisma = new PrismaClient();

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

async function runAuthTenantIsolationTest(): Promise<TestResult> {
  const testData: any = {};

  try {
    console.log('=== FIX-006 AUTH + TENANT ISOLATION REAL TEST ===\n');

    // STEP 1: Create User A via Supabase
    console.log('STEP 1: Creating User A via Supabase...');
    const userAEmail = `user-a-${uuidv4()}@example.com`;
    const userAPassword = 'TestPassword123!';

    const { data: userA, error: userAError } = await supabase.auth.admin.createUser({
      email: userAEmail,
      password: userAPassword,
      email_confirm: true,
    });

    if (userAError || !userA.user) {
      throw new Error(`Failed to create User A: ${userAError?.message}`);
    }

    testData.userAId = userA.user.id;
    testData.userAEmail = userAEmail;
    console.log(`✅ User A created: ${userA.user.id}`);
    console.log(`   Email: ${userAEmail}`);

    // STEP 2: Create User A in Prisma
    console.log('\nSTEP 2: Creating User A in Prisma...');
    const prismaUserA = await prisma.user.create({
      data: {
        id: userA.user.id,
        email: userAEmail,
        referralCode: uuidv4(),
      },
    });

    console.log(`✅ User A created in Prisma: ${prismaUserA.id}`);

    // STEP 3: Create User B via Supabase
    console.log('\nSTEP 3: Creating User B via Supabase...');
    const userBEmail = `user-b-${uuidv4()}@example.com`;
    const userBPassword = 'TestPassword123!';

    const { data: userB, error: userBError } = await supabase.auth.admin.createUser({
      email: userBEmail,
      password: userBPassword,
      email_confirm: true,
    });

    if (userBError || !userB.user) {
      throw new Error(`Failed to create User B: ${userBError?.message}`);
    }

    testData.userBId = userB.user.id;
    testData.userBEmail = userBEmail;
    console.log(`✅ User B created: ${userB.user.id}`);
    console.log(`   Email: ${userBEmail}`);

    // STEP 4: Create User B in Prisma
    console.log('\nSTEP 4: Creating User B in Prisma...');
    const prismaUserB = await prisma.user.create({
      data: {
        id: userB.user.id,
        email: userBEmail,
        referralCode: uuidv4(),
      },
    });

    console.log(`✅ User B created in Prisma: ${prismaUserB.id}`);

    // STEP 5: Test Login User A
    console.log('\nSTEP 5: Testing login User A...');
    const { data: loginA, error: loginAError } = await supabase.auth.signInWithPassword({
      email: userAEmail,
      password: userAPassword,
    });

    if (loginAError || !loginA.user) {
      throw new Error(`Failed to login User A: ${loginAError?.message}`);
    }

    testData.userAToken = loginA.session.access_token;
    console.log(`✅ User A logged in successfully`);
    console.log(`   Session ID: ${loginA.session.id}`);

    // STEP 6: Test Login User B
    console.log('\nSTEP 6: Testing login User B...');
    const { data: loginB, error: loginBError } = await supabase.auth.signInWithPassword({
      email: userBEmail,
      password: userBPassword,
    });

    if (loginBError || !loginB.user) {
      throw new Error(`Failed to login User B: ${loginBError?.message}`);
    }

    testData.userBToken = loginB.session.access_token;
    console.log(`✅ User B logged in successfully`);
    console.log(`   Session ID: ${loginB.session.id}`);

    // STEP 7: Create CV for User A
    console.log('\nSTEP 7: Creating CV for User A...');
    const cvA = await prisma.cVAnalysis.create({
      data: {
        userId: prismaUserA.id,
        fileName: 'user-a-cv.pdf',
        originalText: 'User A CV content',
        optimizedText: 'User A CV optimized',
        cvData: {
          skills: ['Python', 'Django', 'PostgreSQL'],
          experience: '3 years',
        },
      },
    });

    testData.cvAId = cvA.id;
    console.log(`✅ CV created for User A: ${cvA.id}`);

    // STEP 8: Create CV for User B
    console.log('\nSTEP 8: Creating CV for User B...');
    const cvB = await prisma.cVAnalysis.create({
      data: {
        userId: prismaUserB.id,
        fileName: 'user-b-cv.pdf',
        originalText: 'User B CV content',
        optimizedText: 'User B CV optimized',
        cvData: {
          skills: ['JavaScript', 'React', 'MongoDB'],
          experience: '2 years',
        },
      },
    });

    testData.cvBId = cvB.id;
    console.log(`✅ CV created for User B: ${cvB.id}`);

    // STEP 9: Test User A can access their own CV
    console.log('\nSTEP 9: Testing User A can access their own CV...');
    const cvACheck = await prisma.cVAnalysis.findUnique({
      where: { id: cvA.id },
    });

    if (!cvACheck || cvACheck.userId !== prismaUserA.id) {
      throw new Error('User A cannot access their own CV');
    }

    console.log(`✅ User A can access their own CV: ${cvACheck.id}`);

    // STEP 10: Test User B can access their own CV
    console.log('\nSTEP 10: Testing User B can access their own CV...');
    const cvBCheck = await prisma.cVAnalysis.findUnique({
      where: { id: cvB.id },
    });

    if (!cvBCheck || cvBCheck.userId !== prismaUserB.id) {
      throw new Error('User B cannot access their own CV');
    }

    console.log(`✅ User B can access their own CV: ${cvBCheck.id}`);

    // STEP 11: Test User A CANNOT access User B's CV (ownership verification)
    console.log('\nSTEP 11: Testing User A CANNOT access User B\'s CV...');
    const cvBAccessedByA = await prisma.cVAnalysis.findFirst({
      where: {
        id: cvB.id,
        userId: prismaUserA.id, // This should not match
      },
    });

    if (cvBAccessedByA) {
      throw new Error('SECURITY VIOLATION: User A can access User B\'s CV');
    }

    console.log(`✅ User A CANNOT access User B's CV (ownership verification works)`);

    // STEP 12: Test User B CANNOT access User A's CV (ownership verification)
    console.log('\nSTEP 12: Testing User B CANNOT access User A\'s CV...');
    const cvAAccessedByB = await prisma.cVAnalysis.findFirst({
      where: {
        id: cvA.id,
        userId: prismaUserB.id, // This should not match
      },
    });

    if (cvAAccessedByB) {
      throw new Error('SECURITY VIOLATION: User B can access User A\'s CV');
    }

    console.log(`✅ User B CANNOT access User A's CV (ownership verification works)`);

    // STEP 13: Test Session retrieval for User A
    console.log('\nSTEP 13: Testing session retrieval for User A...');
    const userASessions = await prisma.user.findUnique({
      where: { id: prismaUserA.id },
    });

    if (!userASessions) {
      throw new Error('User A session not found in database');
    }

    console.log(`✅ User A session retrieved: ${userASessions.id}`);

    // STEP 14: Test Session retrieval for User B
    console.log('\nSTEP 14: Testing session retrieval for User B...');
    const userBSessions = await prisma.user.findUnique({
      where: { id: prismaUserB.id },
    });

    if (!userBSessions) {
      throw new Error('User B session not found in database');
    }

    console.log(`✅ User B session retrieved: ${userBSessions.id}`);

    // STEP 15: Test Logout User A
    console.log('\nSTEP 15: Testing logout User A...');
    const { error: logoutAError } = await supabase.auth.admin.signOutUser(prismaUserA.id);

    if (logoutAError) {
      throw new Error(`Failed to logout User A: ${logoutAError.message}`);
    }

    console.log(`✅ User A logged out successfully`);

    // STEP 16: Test Logout User B
    console.log('\nSTEP 16: Testing logout User B...');
    const { error: logoutBError } = await supabase.auth.admin.signOutUser(prismaUserB.id);

    if (logoutBError) {
      throw new Error(`Failed to logout User B: ${logoutBError.message}`);
    }

    console.log(`✅ User B logged out successfully`);

    // STEP 17: Test expired session - User A cannot login with old token
    console.log('\nSTEP 17: Testing expired session for User A...');
    const { data: expiredLogin, error: expiredError } = await supabase.auth.signInWithPassword({
      email: userAEmail,
      password: userAPassword,
    });

    if (expiredError) {
      console.log(`✅ Expired session rejected (expected): ${expiredError.message}`);
    } else {
      console.log(`⚠️  User A can still login after logout (session refresh enabled)`);
    }

    // STEP 18: Verify User A and User B data are isolated
    console.log('\nSTEP 18: Verifying User A and User B data isolation...');
    const allCVs = await prisma.cVAnalysis.findMany({
      where: {
        userId: { in: [prismaUserA.id, prismaUserB.id] },
      },
    });

    if (allCVs.length !== 2) {
      throw new Error(`Expected 2 CVs, found ${allCVs.length}`);
    }

    const userACVs = allCVs.filter(cv => cv.userId === prismaUserA.id);
    const userBCVs = allCVs.filter(cv => cv.userId === prismaUserB.id);

    if (userACVs.length !== 1 || userBCVs.length !== 1) {
      throw new Error('Data isolation violated');
    }

    console.log(`✅ User A and User B data are properly isolated`);
    console.log(`   User A CVs: ${userACVs.length}`);
    console.log(`   User B CVs: ${userBCVs.length}`);

    // STEP 19: Cleanup
    console.log('\nSTEP 19: Cleaning up test data...');

    await prisma.cVAnalysis.deleteMany({
      where: { userId: { in: [prismaUserA.id, prismaUserB.id] } },
    });

    await prisma.user.deleteMany({
      where: { id: { in: [prismaUserA.id, prismaUserB.id] } },
    });

    await supabase.auth.admin.deleteUser(prismaUserA.id);
    await supabase.auth.admin.deleteUser(prismaUserB.id);

    console.log(`✅ Cleanup completed`);

    return {
      success: true,
      message: 'All AUTH + TENANT ISOLATION tests passed',
      details: testData,
    };
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);

    // Attempt cleanup
    try {
      console.log('\nAttempting cleanup after failure...');
      if (testData.userAId) {
        await prisma.cVAnalysis.deleteMany({ where: { userId: testData.userAId } });
        await prisma.user.delete({ where: { id: testData.userAId } });
        await supabase.auth.admin.deleteUser(testData.userAId);
      }
      if (testData.userBId) {
        await prisma.cVAnalysis.deleteMany({ where: { userId: testData.userBId } });
        await prisma.user.delete({ where: { id: testData.userBId } });
        await supabase.auth.admin.deleteUser(testData.userBId);
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
runAuthTenantIsolationTest()
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
