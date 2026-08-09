/**
 * SECURITY-FIX-004.5: Environment Gate
 * Check required environment variables for runtime security testing
 */

import { config } from 'dotenv';

// Load environment variables
config();

const requiredVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  TEST_USER_A_TOKEN: process.env.TEST_USER_A_TOKEN,
  TEST_USER_B_TOKEN: process.env.TEST_USER_B_TOKEN,
  TEST_USER_A_ID: process.env.TEST_USER_A_ID,
  TEST_USER_B_ID: process.env.TEST_USER_B_ID
};

console.log('=== SECURITY-FIX-004.5 ENVIRONMENT GATE ===\n');

const results: any = {
  timestamp: new Date().toISOString(),
  phase: 'SECURITY-FIX-004.5_ENVIRONMENT_GATE',
  mode: 'VERIFICATION_ONLY',
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

console.log('\n=== ENVIRONMENT GATE RESULT ===');

if (!allRequiredPresent) {
  console.log('SECURITY GATE: BLOCKED');
  console.log('REASON: REAL TEST CREDENTIALS NOT CONFIGURED');
  console.log('\nREQUIRED VARIABLES:');
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value) {
      console.log(`  - ${key}: MISSING`);
    }
  });
  console.log('\nCURRENT VERDICT: NO-GO');
  results.status = 'BLOCKED';
  results.verdict = 'NO-GO';
  results.reason = 'Real test credentials not configured';
} else {
  console.log('SECURITY GATE: PASS');
  results.status = 'PASS';
  results.verdict = 'PENDING';
}

// Save results
const fs = await import('fs');
const path = await import('path');
const resultsPath = path.join(process.cwd(), 'SECURITY-FIX-004.5-ENV-GATE.json');
fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

console.log(`\n✅ Environment gate results saved to: ${resultsPath}`);

if (!allRequiredPresent) {
  console.log('\n⚠️ STOPPING: Runtime security tests cannot proceed without real authentication credentials.');
  console.log('⚠️ Please configure the following environment variables in .env:');
  console.log('  TEST_USER_A_TOKEN=<JWT token for user A>');
  console.log('  TEST_USER_B_TOKEN=<JWT token for user B>');
  console.log('  TEST_USER_A_ID=<user ID for user A>');
  console.log('  TEST_USER_B_ID=<user ID for user B>');
  process.exit(1);
}

export default results;
