/**
 * SECURITY-FIX-004.6: Security Test Environment Check
 * Check if required test credentials are configured
 * 
 * This script verifies that the environment is ready for runtime security testing.
 * It checks for the presence of TEST_USER_* variables without exposing their values.
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Load security test credentials if .env.security-test exists
const securityTestEnvPath = path.join(process.cwd(), '.env.security-test');
if (fs.existsSync(securityTestEnvPath)) {
  require('dotenv').config({ path: securityTestEnvPath });
}

const requiredVars = {
  TEST_USER_A_TOKEN: process.env.TEST_USER_A_TOKEN,
  TEST_USER_B_TOKEN: process.env.TEST_USER_B_TOKEN,
  TEST_USER_A_ID: process.env.TEST_USER_A_ID,
  TEST_USER_B_ID: process.env.TEST_USER_B_ID
};

console.log('=== SECURITY TEST ENVIRONMENT CHECK ===\n');

const results = {
  timestamp: new Date().toISOString(),
  phase: 'SECURITY-FIX-004.6_ENVIRONMENT_CHECK',
  mode: 'READ-ONLY',
  variables: {}
};

let allRequiredPresent = true;

for (const [key, value] of Object.entries(requiredVars)) {
  const isSet = !!value;
  results.variables[key] = isSet ? 'SET' : 'NOT_SET';
  console.log(`${key}: ${isSet ? 'SET' : 'NOT_SET'}`);
  
  if (!isSet) {
    allRequiredPresent = false;
  }
}

console.log('\n=== VALIDATION ===');

if (allRequiredPresent) {
  // Verify A and B are different
  const userAId = requiredVars.TEST_USER_A_ID;
  const userBId = requiredVars.TEST_USER_B_ID;
  
  if (userAId === userBId) {
    console.log('ERROR: TEST_USER_A_ID and TEST_USER_B_ID must be different');
    results.status = 'FAIL';
    results.error = 'USER_A_ID and USER_B_ID are identical';
    allRequiredPresent = false;
  } else {
    console.log('✓ USER_A_ID and USER_B_ID are different');
  }
  
  // Verify ID format (basic check)
  if (userAId && userAId.length < 10) {
    console.log('WARNING: TEST_USER_A_ID format seems invalid (too short)');
  }
  if (userBId && userBId.length < 10) {
    console.log('WARNING: TEST_USER_B_ID format seems invalid (too short)');
  }
}

console.log('\n=== RESULT ===');

if (!allRequiredPresent) {
  console.log('SECURITY TEST ENVIRONMENT: NOT READY');
  console.log('\nMISSING VARIABLES:');
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value) {
      console.log(`  - ${key}`);
    }
  });
  console.log('\nTo prepare the environment:');
  console.log('1. Create two test users in Supabase (USER_A and USER_B)');
  console.log('2. Login with each user through the application');
  console.log('3. Retrieve the JWT tokens and user IDs');
  console.log('4. Add them to your .env file:');
  console.log('   TEST_USER_A_TOKEN=<JWT token for user A>');
  console.log('   TEST_USER_B_TOKEN=<JWT token for user B>');
  console.log('   TEST_USER_A_ID=<user ID for user A>');
  console.log('   TEST_USER_B_ID=<user ID for user B>');
  results.status = 'NOT_READY';
  results.verdict = 'NO-GO';
} else {
  console.log('SECURITY TEST ENVIRONMENT: READY');
  console.log('\nAll required credentials are present.');
  console.log('You can now run SECURITY-FIX-004.5 for runtime security testing.');
  results.status = 'READY';
  results.verdict = 'READY';
}

// Save results
const resultsPath = path.join(process.cwd(), 'SECURITY-FIX-004.6-ENV-CHECK.json');
fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

console.log(`\n✅ Results saved to: ${resultsPath}`);

process.exit(allRequiredPresent ? 0 : 1);
