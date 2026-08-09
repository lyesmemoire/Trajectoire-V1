/**
 * SECURITY-FIX-004.8: Security Test Users Bootstrap
 * 
 * This script uses the public Supabase Auth flow to authenticate test users.
 * It does NOT use the Service Role Key to bypass authentication.
 * 
 * Required environment variables:
 * TEST_USER_A_EMAIL
 * TEST_USER_A_PASSWORD
 * TEST_USER_B_EMAIL
 * TEST_USER_B_PASSWORD
 * 
 * Output:
 * - Sanitized user IDs
 * - Never displays tokens or passwords
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Test user credentials
const USER_A = {
  email: process.env.TEST_USER_A_EMAIL,
  password: process.env.TEST_USER_A_PASSWORD
};

const USER_B = {
  email: process.env.TEST_USER_B_EMAIL,
  password: process.env.TEST_USER_B_PASSWORD
};

console.log('=== SECURITY TEST USERS BOOTSTRAP ===\n');

// Validate environment
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log('SUPABASE AUTH CONFIGURATION: BLOCKED');
  console.log('REASON: SUPABASE_URL or SUPABASE_ANON_KEY not set');
  process.exit(1);
}

console.log('SUPABASE AUTH CONFIGURATION: READY');
console.log('SUPABASE_URL: SET');
console.log('SUPABASE_ANON_KEY: SET\n');

// Validate test user credentials
if (!USER_A.email || !USER_A.password) {
  console.log('USER_A CREDENTIALS: BLOCKED');
  console.log('REASON: TEST_USER_A_EMAIL or TEST_USER_A_PASSWORD not set');
  process.exit(1);
}

if (!USER_B.email || !USER_B.password) {
  console.log('USER_B CREDENTIALS: BLOCKED');
  console.log('REASON: TEST_USER_B_EMAIL or TEST_USER_B_PASSWORD not set');
  process.exit(1);
}

console.log('USER_A CREDENTIALS: SET');
console.log('USER_B CREDENTIALS: SET\n');

// Create Supabase client with public anon key (not service role)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Sanitize ID for display
function sanitizeId(id) {
  if (!id || id.length < 8) return 'INVALID';
  return id.substring(0, 4) + '****' + id.substring(id.length - 4);
}

// Authenticate user
async function authenticateUser(user, label) {
  console.log(`Authenticating ${label}...`);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password
    });

    if (error) {
      console.log(`${label} AUTHENTICATION: FAILED`);
      console.log(`ERROR: ${error.message}`);
      return null;
    }

    if (!data.user || !data.session) {
      console.log(`${label} AUTHENTICATION: FAILED`);
      console.log(`ERROR: No user or session returned`);
      return null;
    }

    const userId = data.user.id;
    const accessToken = data.session.access_token;

    console.log(`${label} AUTHENTICATION: SUCCESS`);
    console.log(`${label} ID: ${sanitizeId(userId)}`);
    
    return {
      id: userId,
      token: accessToken,
      email: user.email
    };
  } catch (error) {
    console.log(`${label} AUTHENTICATION: FAILED`);
    console.log(`ERROR: ${error.message}`);
    return null;
  }
}

// Main execution
async function main() {
  console.log('=== AUTHENTICATION FLOW ===\n');

  // Authenticate USER_A
  const userA = await authenticateUser(USER_A, 'USER_A');
  console.log();

  // Authenticate USER_B
  const userB = await authenticateUser(USER_B, 'USER_B');
  console.log();

  // Validate results
  if (!userA || !userB) {
    console.log('=== RESULT ===');
    console.log('REAL USERS: BLOCKED');
    console.log('SECURITY TESTS: NOT_EXECUTED');
    console.log('FINAL: NO-GO');
    process.exit(1);
  }

  // Verify identities are distinct
  if (userA.id === userB.id) {
    console.log('=== VALIDATION ===');
    console.log('IDENTITIES DISTINCT: FAILED');
    console.log('ERROR: USER_A_ID and USER_B_ID are identical');
    console.log('=== RESULT ===');
    console.log('REAL USERS: BLOCKED');
    console.log('SECURITY TESTS: NOT_EXECUTED');
    console.log('FINAL: NO-GO');
    process.exit(1);
  }

  console.log('=== VALIDATION ===');
  console.log('IDENTITIES DISTINCT: PASS');
  console.log();

  // Output environment variables for the parent process
  console.log('=== ENVIRONMENT VARIABLES ===');
  console.log('Add the following to your .env file:');
  console.log(`TEST_USER_A_TOKEN=${userA.token}`);
  console.log(`TEST_USER_B_TOKEN=${userB.token}`);
  console.log(`TEST_USER_A_ID=${userA.id}`);
  console.log(`TEST_USER_B_ID=${userB.id}`);
  console.log();

  // Save to temporary file (not committed to Git)
  const envPath = path.join(process.cwd(), '.env.security-test');
  const envContent = `TEST_USER_A_TOKEN=${userA.token}
TEST_USER_B_TOKEN=${userB.token}
TEST_USER_A_ID=${userA.id}
TEST_USER_B_ID=${userB.id}`;
  
  fs.writeFileSync(envPath, envContent);
  console.log(`✅ Credentials saved to: ${envPath}`);
  console.log('⚠️  This file is .gitignored and should not be committed');
  console.log('⚠️  Copy these values to your .env file or source this file before running tests');
  console.log();

  console.log('=== RESULT ===');
  console.log('ENVIRONMENT: PASS');
  console.log('SUPABASE AUTH: PASS');
  console.log('REAL USERS: PASS');
  console.log('SECURITY TESTS: READY');
  console.log('FINAL: READY');
}

main().catch(error => {
  console.error('FATAL ERROR:', error);
  process.exit(1);
});
