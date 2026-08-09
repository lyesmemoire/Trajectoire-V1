/**
 * SECURITY-FIX-004.8: Reset Test User Passwords
 * 
 * This script uses Supabase Service Role Key to reset test user passwords.
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

// Test user emails
const USER_A_EMAIL = 'security-test-a@example.com';
const USER_B_EMAIL = 'security-test-b@example.com';
const USER_A_PASSWORD = 'TestPasswordA123!';
const USER_B_PASSWORD = 'TestPasswordB123!';

console.log('=== SECURITY TEST USERS PASSWORD RESET ===\n');

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

// Reset user password
async function resetUserPassword(email, password, label) {
  console.log(`Resetting password for ${label}...`);
  
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(
      null, // Will be replaced with user ID
      { password: password }
    );

    if (error) {
      console.log(`${label} PASSWORD RESET: FAILED`);
      console.log(`ERROR: ${error.message}`);
      return null;
    }

    console.log(`${label} PASSWORD RESET: SUCCESS`);
    return data;
  } catch (error) {
    console.log(`${label} PASSWORD RESET: FAILED`);
    console.log(`ERROR: ${error.message}`);
    return null;
  }
}

// Main execution
async function main() {
  console.log('=== PASSWORD RESET FLOW ===\n');

  // Get user IDs by email
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.log('LIST USERS: FAILED');
    console.log(`ERROR: ${listError.message}`);
    process.exit(1);
  }

  const userA = users.users.find(u => u.email === USER_A_EMAIL);
  const userB = users.users.find(u => u.email === USER_B_EMAIL);

  if (!userA) {
    console.log('USER_A NOT FOUND');
    console.log('ERROR: User with email security-test-a@example.com does not exist');
    process.exit(1);
  }

  if (!userB) {
    console.log('USER_B NOT FOUND');
    console.log('ERROR: User with email security-test-b@example.com does not exist');
    process.exit(1);
  }

  console.log('USER_A FOUND: YES');
  console.log('USER_B FOUND: YES\n');

  // Reset passwords
  const resultA = await supabase.auth.admin.updateUserById(userA.id, {
    password: USER_A_PASSWORD
  });

  if (resultA.error) {
    console.log('USER_A PASSWORD RESET: FAILED');
    console.log(`ERROR: ${resultA.error.message}`);
    process.exit(1);
  }

  console.log('USER_A PASSWORD RESET: SUCCESS');

  const resultB = await supabase.auth.admin.updateUserById(userB.id, {
    password: USER_B_PASSWORD
  });

  if (resultB.error) {
    console.log('USER_B PASSWORD RESET: FAILED');
    console.log(`ERROR: ${resultB.error.message}`);
    process.exit(1);
  }

  console.log('USER_B PASSWORD RESET: SUCCESS\n');

  console.log('=== RESULT ===');
  console.log('PASSWORD RESET: PASS');
  console.log('NEXT STEP: Run bootstrap script');
  console.log('  node scripts/security-test-users-bootstrap.cjs');
}

main().catch(error => {
  console.error('FATAL ERROR:', error);
  process.exit(1);
});
