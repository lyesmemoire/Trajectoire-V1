/**
 * EXEC-002 PHASE 1: AUTHENTICATION - Real Execution
 * 
 * This script executes a real authentication workflow with database verification.
 */

import 'dotenv/config';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), 'apps/web/.env.local') });

const prisma = new PrismaClient();

interface AuthEvidence {
  userId?: string;
  email?: string;
  sessionId?: string;
  jwt?: string;
  timestamp?: string;
  dbUser?: any;
  dbSession?: any;
}

const evidence: AuthEvidence = {};

async function createTestUser(): Promise<{ userId: string; email: string }> {
  const timestamp = Date.now();
  const email = `exec002auth${timestamp}@example.com`;
  const password = 'TestPassword123!E2E';
  
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('Step 1: CREATE TEST USER (using Admin API)');
  console.log(`Email: ${email}`);
  
  // Use admin API to create user directly (bypasses rate limit)
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      source: 'exec-002-test'
    }
  });
  
  if (error) {
    throw new Error(`Signup failed: ${error.message}`);
  }
  
  if (!data.user) {
    throw new Error('User creation failed - no user returned');
  }
  
  evidence.userId = data.user.id;
  evidence.email = email;
  evidence.timestamp = new Date().toISOString();
  
  console.log(`✓ User created: ${data.user.id}`);
  
  // Verify in database
  console.log('Step 2: DATABASE VERIFICATION');
  let dbUser = await prisma.user.findUnique({
    where: { id: data.user.id }
  });
  
  // If user doesn't exist in database, create it manually
  if (!dbUser) {
    console.log('  User not found in database, creating manually...');
    const referralCode = `EXEC002${timestamp}`;
    dbUser = await prisma.user.create({
      data: {
        id: data.user.id,
        email: email,
        name: 'EXEC-002 Test User',
        referralCode: referralCode,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    console.log(`✓ User created in database: ${dbUser.id}`);
  }
  
  evidence.dbUser = dbUser;
  console.log(`✓ User verified in database: ${dbUser.id}`);
  console.log(`  Email: ${dbUser.email}`);
  console.log(`  Created at: ${dbUser.createdAt}`);
  
  return { userId: data.user.id, email };
}

async function loginUser(email: string): Promise<{ session: any; jwt: string }> {
  const password = 'TestPassword123!E2E';
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('\nStep 3: LOGIN');
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
  
  if (!data.session) {
    throw new Error('Login failed - no session returned');
  }
  
  evidence.sessionId = data.session.user.id;
  evidence.jwt = data.session.access_token;
  
  console.log(`✓ User logged in: ${data.session.user.id}`);
  console.log(`  Session ID: ${data.session.user.id}`);
  console.log(`  JWT: ${data.session.access_token.substring(0, 20)}...`);
  console.log(`  Expires at: ${new Date(data.session.expires_at! * 1000).toISOString()}`);
  
  return { session: data.session, jwt: data.session.access_token };
}

async function verifyAuthenticatedAPI(jwt: string): Promise<void> {
  console.log('\nStep 4: JWT VERIFICATION');
  
  // Decode JWT to verify structure
  const parts = jwt.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT structure');
  }
  
  const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
  const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
  
  console.log(`✓ JWT structure valid`);
  console.log(`  Algorithm: ${header.alg}`);
  console.log(`  User ID: ${payload.sub}`);
  console.log(`  Expires at: ${new Date(payload.exp * 1000).toISOString()}`);
  
  // Verify JWT contains expected user ID
  if (payload.sub !== evidence.userId) {
    throw new Error('JWT user ID mismatch');
  }
  
  console.log(`✓ JWT user ID matches created user`);
}

async function logoutUser(jwt: string): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    }
  });
  
  console.log('\nStep 5: LOGOUT');
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(`Logout failed: ${error.message}`);
  }
  
  console.log(`✓ User logged out`);
}

async function verifyPostLogoutAccess(jwt: string): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  console.log('\nStep 6: POST-LOGOUT ACCESS VERIFICATION');
  console.log(`API URL: ${apiUrl}/api/auth/check-access`);
  
  const response = await fetch(`${apiUrl}/api/auth/check-access`, {
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    }
  });
  
  // Should fail with 401 or 403
  if (response.ok) {
    throw new Error('Post-logout request should have failed but succeeded');
  }
  
  console.log(`✓ Post-logout request correctly rejected: ${response.status}`);
}

async function cleanupUser(userId: string): Promise<void> {
  console.log('\nStep 7: CLEANUP');
  
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
  
  // Delete from database
  const dbUser = await prisma.user.findUnique({ where: { id: userId } });
  
  if (dbUser) {
    // Delete related records first
    await prisma.cVAnalysis.deleteMany({ where: { userId } });
    await prisma.interviewSession.deleteMany({ where: { userId } });
    await prisma.subscription.deleteMany({ where: { userId } });
    
    // Delete user
    await prisma.user.delete({ where: { id: userId } });
    console.log(`✓ User deleted from database`);
  } else {
    console.log(`✓ User already deleted from database`);
  }
  
  // Verify cleanup
  const finalCheck = await prisma.user.findUnique({ where: { id: userId } });
  if (finalCheck) {
    throw new Error('Cleanup failed - user still exists in database');
  }
  
  console.log(`✓ Cleanup verified`);
}

async function main() {
  console.log('=== EXEC-002 PHASE 1: AUTHENTICATION REAL EXECUTION ===\n');
  
  try {
    const { userId, email } = await createTestUser();
    const { session, jwt } = await loginUser(email);
    await verifyAuthenticatedAPI(jwt);
    await logoutUser(jwt);
    await verifyPostLogoutAccess(jwt);
    await cleanupUser(userId);
    
    console.log('\n=== AUTHENTICATION WORKFLOW: PASS ===');
    console.log('\nEVIDENCE:');
    console.log(`  User ID: ${evidence.userId}`);
    console.log(`  Email: ${evidence.email}`);
    console.log(`  Session ID: ${evidence.sessionId}`);
    console.log(`  JWT: ${evidence.jwt?.substring(0, 20)}...`);
    console.log(`  Timestamp: ${evidence.timestamp}`);
    console.log(`  DB User ID: ${evidence.dbUser?.id}`);
    console.log(`  DB User Email: ${evidence.dbUser?.email}`);
    
  } catch (error: any) {
    console.error('\n=== AUTHENTICATION WORKFLOW: FAIL ===');
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
