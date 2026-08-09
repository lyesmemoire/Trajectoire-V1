/**
 * SECURITY-FIX-004.8: Create Test Users via Supabase Admin API
 * 
 * This script uses Supabase Service Role Key to create test users.
 * This is an administrative operation to configure the test environment.
 * The security tests themselves will use public authentication with JWT tokens.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Test user configuration
const USER_A_EMAIL = 'security-test-a@example.com';
const USER_A_PASSWORD = 'TestPasswordA123!';
const USER_B_EMAIL = 'security-test-b@example.com';
const USER_B_PASSWORD = 'TestPasswordB123!';

console.log('=== SECURITY TEST USERS CREATION ===\n');

// Validate environment
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.log('SUPABASE ADMIN CONFIGURATION: BLOCKED');
  console.log('REASON: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set');
  process.exit(1);
}

console.log('SUPABASE ADMIN CONFIGURATION: READY');
console.log('SUPABASE_URL: SET');
console.log('SUPABASE_SERVICE_ROLE_KEY: SET\n');

// Create Supabase client with service role key (admin privileges)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Create user
async function createUser(email, password, label) {
  console.log(`Creating ${label}...`);
  
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        role: 'test_user',
        created_for: 'security_testing'
      }
    });

    if (error) {
      console.log(`${label} CREATION: FAILED`);
      console.log(`ERROR: ${error.message}`);
      return null;
    }

    console.log(`${label} CREATION: SUCCESS`);
    console.log(`${label} ID: ${data.user.id}`);
    return data.user;
  } catch (error) {
    console.log(`${label} CREATION: FAILED`);
    console.log(`ERROR: ${error.message}`);
    return null;
  }
}

// Main execution
async function main() {
  console.log('=== USER CREATION FLOW ===\n');

  // Check if users already exist
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.log('LIST USERS: FAILED');
    console.log(`ERROR: ${listError.message}`);
    process.exit(1);
  }

  const existingUserA = users.users.find(u => u.email === USER_A_EMAIL);
  const existingUserB = users.users.find(u => u.email === USER_B_EMAIL);

  let userA, userB;

  if (existingUserA) {
    console.log('USER_A ALREADY EXISTS');
    console.log('USER_A ID:', existingUserA.id);
    
    // Update password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUserA.id,
      { password: USER_A_PASSWORD }
    );
    
    if (updateError) {
      console.log('USER_A PASSWORD UPDATE: FAILED');
      console.log(`ERROR: ${updateError.message}`);
    } else {
      console.log('USER_A PASSWORD UPDATE: SUCCESS');
    }
    
    userA = existingUserA;
  } else {
    userA = await createUser(USER_A_EMAIL, USER_A_PASSWORD, 'USER_A');
  }

  console.log();

  if (existingUserB) {
    console.log('USER_B ALREADY EXISTS');
    console.log('USER_B ID:', existingUserB.id);
    
    // Update password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUserB.id,
      { password: USER_B_PASSWORD }
    );
    
    if (updateError) {
      console.log('USER_B PASSWORD UPDATE: FAILED');
      console.log(`ERROR: ${updateError.message}`);
    } else {
      console.log('USER_B PASSWORD UPDATE: SUCCESS');
    }
    
    userB = existingUserB;
  } else {
    userB = await createUser(USER_B_EMAIL, USER_B_PASSWORD, 'USER_B');
  }

  console.log();

  if (!userA || !userB) {
    console.log('=== RESULT ===');
    console.log('USER CREATION: FAILED');
    console.log('FINAL: NO-GO');
    process.exit(1);
  }

  // Verify IDs are distinct
  if (userA.id === userB.id) {
    console.log('=== VALIDATION ===');
    console.log('IDENTITIES DISTINCT: FAILED');
    console.log('ERROR: USER_A_ID and USER_B_ID are identical');
    console.log('=== RESULT ===');
    console.log('USER CREATION: FAILED');
    console.log('FINAL: NO-GO');
    process.exit(1);
  }

  console.log('=== VALIDATION ===');
  console.log('IDENTITIES DISTINCT: PASS');
  console.log();

  console.log('=== RESULT ===');
  console.log('USER CREATION: PASS');
  console.log('NEXT STEP: Run bootstrap script');
  console.log('  $env:TEST_USER_A_EMAIL="security-test-a@example.com"');
  console.log('  $env:TEST_USER_A_PASSWORD="TestPasswordA123!"');
  console.log('  $env:TEST_USER_B_EMAIL="security-test-b@example.com"');
  console.log('  $env:TEST_USER_B_PASSWORD="TestPasswordB123!"');
  console.log('  node scripts/security-test-users-bootstrap.cjs');
}

main().catch(error => {
  console.error('FATAL ERROR:', error);
  process.exit(1);
});
