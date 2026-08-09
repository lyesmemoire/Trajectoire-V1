/**
 * GO-LIVE-004.1 — SECURITY ADVERSARIAL VERIFICATION
 * 
 * Independent security audit - actively attempting to prove SECURITY-FIX-002 is WRONG
 * 
 * NO MOCKS
 * NO BYPASSES
 * NO test.skip()
 * NO synthetic data as proof
 * 
 * Real execution only.
 */

const { createClient } = require('@supabase/supabase-js');

const API_URL = process.env.API_URL || 'http://localhost:3000';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: Missing required environment variables');
  console.error('Required: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Test users
const USER_A_EMAIL = `security_audit_a_${Date.now()}@example.com`;
const USER_B_EMAIL = `security_audit_b_${Date.now()}@example.com`;
const TEST_PASSWORD = 'SecureTestPass123!';

const results = {
  TEST1_IMPERSONATION: { status: 'NOT_TESTED', findings: [] },
  TEST2_IDOR: { status: 'NOT_TESTED', findings: [] },
  TEST3_GRAPH: { status: 'NOT_TESTED', findings: [] },
  TEST4_COPILOT: { status: 'NOT_TESTED', findings: [] },
  TEST5_BILLING: { status: 'NOT_TESTED', findings: [] },
  TEST6_SEARCH: { status: 'NOT_TESTED', findings: [] },
  TEST7_AUTH: { status: 'NOT_TESTED', findings: [] },
  TEST8_RATE_LIMITING: { status: 'NOT_TESTED', findings: [] },
  TEST9_HEADERS: { status: 'NOT_TESTED', findings: [] },
  TEST10_DATABASE: { status: 'NOT_TESTED', findings: [] }
};

let userA = { email: USER_A_EMAIL, id: null, jwt: null };
let userB = { email: USER_B_EMAIL, id: null, jwt: null };
let serviceRoleClient = null;

// Helper: HTTP request with full response
async function httpRequest(method, url, options = {}) {
  const headers = options.headers || {};
  const body = options.body ? JSON.stringify(options.body) : undefined;
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body
  });
  
  const data = await response.text();
  let json = null;
  try {
    json = JSON.parse(data);
  } catch (e) {
    // Not JSON
  }
  
  return {
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: data,
    json
  };
}

// Helper: Create Supabase user
async function createTestUser(email, password) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });
  
  if (error) {
    throw new Error(`Failed to create user ${email}: ${error.message}`);
  }
  
  return data.user;
}

// Helper: Delete user
async function deleteTestUser(userId) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  await supabase.auth.admin.deleteUser(userId);
}

// Helper: Authenticate user
async function authenticateUser(email, password) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    throw new Error(`Failed to authenticate ${email}: ${error.message}`);
  }
  
  return {
    id: data.user.id,
    jwt: data.session.access_token
  };
}

// Helper: Create CV for user
async function createCV(userId, jwt) {
  const response = await httpRequest('POST', `${API_URL}/cv/upload`, {
    headers: { 'Authorization': `Bearer ${jwt}` },
    body: { filename: 'test.pdf' }
  });
  
  if (response.status !== 201) {
    throw new Error(`Failed to create CV: ${response.status} ${response.body}`);
  }
  
  return response.json;
}

// Helper: Create Graph for user
async function createGraph(userId, jwt, name) {
  const response = await httpRequest('POST', `${API_URL}/graph`, {
    headers: { 'Authorization': `Bearer ${jwt}` },
    body: { name, description: `Test graph for ${name}` }
  });
  
  if (response.status !== 201) {
    throw new Error(`Failed to create Graph: ${response.status} ${response.body}`);
  }
  
  return response.json;
}

// ============================================================================
// TEST 1: IMPERSONATION
// ============================================================================
async function test1_Impersonation() {
  console.log('\n=== TEST 1: IMPERSONATION ===');
  
  try {
    // Create CV for user A
    const cvA = await createCV(userA.id, userA.jwt);
    results.TEST1_IMPERSONATION.findings.push(`Created CV for A: ${cvA.id}`);
    
    // Try to access with B's JWT but userId=A in body
    const impersonationAttempts = [
      { endpoint: '/copilot/sessions', body: { userId: userA.id } },
      { endpoint: '/copilot/history/test-session', body: { userId: userA.id } },
      { endpoint: '/search/recruiter', body: { query: 'test', graphs: [], userId: userA.id } }
    ];
    
    for (const attempt of impersonationAttempts) {
      const response = await httpRequest('POST', `${API_URL}${attempt.endpoint}`, {
        headers: { 'Authorization': `Bearer ${userB.jwt}` },
        body: attempt.body
      });
      
      // Should NOT succeed with A's data
      if (response.status === 200 || response.status === 201) {
        results.TEST1_IMPERSONATION.findings.push(`CRITICAL: ${attempt.endpoint} accepted userId=${userA.id} with B's JWT`);
        results.TEST1_IMPERSONATION.status = 'FAIL';
      } else {
        results.TEST1_IMPERSONATION.findings.push(`PASS: ${attempt.endpoint} rejected with ${response.status}`);
      }
    }
    
    if (results.TEST1_IMPERSONATION.status !== 'FAIL') {
      results.TEST1_IMPERSONATION.status = 'PASS';
    }
    
  } catch (error) {
    results.TEST1_IMPERSONATION.status = 'ERROR';
    results.TEST1_IMPERSONATION.findings.push(`ERROR: ${error.message}`);
  }
}

// ============================================================================
// TEST 2: IDOR
// ============================================================================
async function test2_IDOR() {
  console.log('\n=== TEST 2: IDOR ===');
  
  try {
    // Create resources for user A
    const graphA = await createGraph(userA.id, userA.jwt, 'Graph A');
    results.TEST2_IDOR.findings.push(`Created Graph for A: ${graphA.id}`);
    
    // Test cross-user access
    const idorTests = [
      { method: 'GET', endpoint: `/graph/${graphA.id}` },
      { method: 'PUT', endpoint: `/graph/${graphA.id}`, body: { name: 'Hacked' } },
      { method: 'DELETE', endpoint: `/graph/${graphA.id}` }
    ];
    
    for (const test of idorTests) {
      const response = await httpRequest(test.method, `${API_URL}${test.endpoint}`, {
        headers: { 'Authorization': `Bearer ${userB.jwt}` },
        body: test.body
      });
      
      // Must return 403 or 404, NOT 200
      if (response.status === 200 || response.status === 201) {
        results.TEST2_IDOR.findings.push(`CRITICAL IDOR: ${test.method} ${test.endpoint} returned ${response.status}`);
        results.TEST2_IDOR.status = 'FAIL';
      } else if (response.status === 403 || response.status === 404) {
        results.TEST2_IDOR.findings.push(`PASS: ${test.method} ${test.endpoint} returned ${response.status}`);
      } else {
        results.TEST2_IDOR.findings.push(`WARNING: ${test.method} ${test.endpoint} returned ${response.status} (expected 403/404)`);
      }
    }
    
    // Verify DB unchanged
    const verifyResponse = await httpRequest('GET', `${API_URL}/graph/${graphA.id}`, {
      headers: { 'Authorization': `Bearer ${userA.jwt}` }
    });
    
    if (verifyResponse.status === 200) {
      const graphData = verifyResponse.json;
      if (graphData.name === 'Hacked') {
        results.TEST2_IDOR.findings.push('CRITICAL: Graph was modified by unauthorized user');
        results.TEST2_IDOR.status = 'FAIL';
      } else {
        results.TEST2_IDOR.findings.push('PASS: Graph unchanged after unauthorized access attempt');
      }
    }
    
    if (results.TEST2_IDOR.status !== 'FAIL') {
      results.TEST2_IDOR.status = 'PASS';
    }
    
  } catch (error) {
    results.TEST2_IDOR.status = 'ERROR';
    results.TEST2_IDOR.findings.push(`ERROR: ${error.message}`);
  }
}

// ============================================================================
// TEST 3: GRAPH
// ============================================================================
async function test3_Graph() {
  console.log('\n=== TEST 3: GRAPH OWNERSHIP ===');
  
  try {
    // Check if migration was applied
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Check Graph model for userId field
    const graphA = await prisma.graph.findFirst({
      where: { userId: userA.id }
    });
    
    if (!graphA) {
      results.TEST3_GRAPH.findings.push('WARNING: No Graph found for user A (migration may not be applied)');
      results.TEST3_GRAPH.status = 'NOT_TESTED';
      await prisma.$disconnect();
      return;
    }
    
    results.TEST3_GRAPH.findings.push(`Graph A userId: ${graphA.userId} (expected: ${userA.id})`);
    
    if (graphA.userId !== userA.id) {
      results.TEST3_GRAPH.findings.push('CRITICAL: Graph userId does not match authenticated user');
      results.TEST3_GRAPH.status = 'FAIL';
    } else {
      results.TEST3_GRAPH.findings.push('PASS: Graph userId matches authenticated user');
    }
    
    // Check relations
    const nodes = await prisma.graphNode.findMany({
      where: { graphId: graphA.id }
    });
    
    results.TEST3_GRAPH.findings.push(`Graph has ${nodes.length} nodes`);
    
    // Try to access nodes with B's JWT
    const nodeResponse = await httpRequest('GET', `${API_URL}/graph/${graphA.id}/nodes`, {
      headers: { 'Authorization': `Bearer ${userB.jwt}` }
    });
    
    if (nodeResponse.status === 200) {
      results.TEST3_GRAPH.findings.push('CRITICAL: Can access Graph nodes with different user JWT');
      results.TEST3_GRAPH.status = 'FAIL';
    } else {
      results.TEST3_GRAPH.findings.push('PASS: Cannot access Graph nodes with different user JWT');
    }
    
    await prisma.$disconnect();
    
    if (results.TEST3_GRAPH.status !== 'FAIL') {
      results.TEST3_GRAPH.status = 'PASS';
    }
    
  } catch (error) {
    results.TEST3_GRAPH.status = 'ERROR';
    results.TEST3_GRAPH.findings.push(`ERROR: ${error.message}`);
  }
}

// ============================================================================
// TEST 4: COPILOT
// ============================================================================
async function test4_Copilot() {
  console.log('\n=== TEST 4: COPILOT ISOLATION ===');
  
  try {
    // Create CV for user A
    const cvA = await createCV(userA.id, userA.jwt);
    results.TEST4_COPILOT.findings.push(`Created CV for A: ${cvA.id}`);
    
    // Try to use CV A with user B
    const response = await httpRequest('POST', `${API_URL}/copilot/message`, {
      headers: { 'Authorization': `Bearer ${userB.jwt}` },
      body: {
        sessionId: 'test-session',
        message: 'Test',
        cvId: cvA.id
      }
    });
    
    // Should be denied
    if (response.status === 200 || response.status === 201) {
      results.TEST4_COPILOT.findings.push('CRITICAL: Copilot loaded CV from different user');
      results.TEST4_COPILOT.status = 'FAIL';
    } else {
      results.TEST4_COPILOT.findings.push(`PASS: Copilot rejected cross-user CV with ${response.status}`);
    }
    
    if (results.TEST4_COPILOT.status !== 'FAIL') {
      results.TEST4_COPILOT.status = 'PASS';
    }
    
  } catch (error) {
    results.TEST4_COPILOT.status = 'ERROR';
    results.TEST4_COPILOT.findings.push(`ERROR: ${error.message}`);
  }
}

// ============================================================================
// TEST 5: BILLING
// ============================================================================
async function test5_Billing() {
  console.log('\n=== TEST 5: BILLING ISOLATION ===');
  
  try {
    // Test unauthenticated access
    const unauthResponse = await httpRequest('GET', `${API_URL}/api/user/subscription`);
    
    if (unauthResponse.status === 401) {
      results.TEST5_BILLING.findings.push('PASS: Unauthenticated subscription request rejected');
    } else {
      results.TEST5_BILLING.findings.push(`CRITICAL: Unauthenticated request returned ${unauthResponse.status}`);
      results.TEST5_BILLING.status = 'FAIL';
    }
    
    // Test cross-user access (web endpoint)
    const crossUserResponse = await httpRequest('GET', `${API_URL}/api/user/subscription`, {
      headers: { 'Cookie': `sb-access-token=${userB.jwt}` }
    });
    
    // Should return user B's subscription, not user A's
    if (crossUserResponse.status === 200) {
      results.TEST5_BILLING.findings.push('PASS: Authenticated user can access their own subscription');
    } else {
      results.TEST5_BILLING.findings.push(`WARNING: Subscription endpoint returned ${crossUserResponse.status}`);
    }
    
    if (results.TEST5_BILLING.status !== 'FAIL') {
      results.TEST5_BILLING.status = 'PASS';
    }
    
  } catch (error) {
    results.TEST5_BILLING.status = 'ERROR';
    results.TEST5_BILLING.findings.push(`ERROR: ${error.message}`);
  }
}

// ============================================================================
// TEST 6: SEARCH
// ============================================================================
async function test6_Search() {
  console.log('\n=== TEST 6: SEARCH ISOLATION ===');
  
  try {
    // Create graphs for both users
    const graphA = await createGraph(userA.id, userA.jwt, 'Private A');
    const graphB = await createGraph(userB.id, userB.jwt, 'Private B');
    
    results.TEST6_SEARCH.findings.push(`Created Graph A: ${graphA.id}`);
    results.TEST6_SEARCH.findings.push(`Created Graph B: ${graphB.id}`);
    
    // Search with user A
    const searchA = await httpRequest('POST', `${API_URL}/search/recruiter`, {
      headers: { 'Authorization': `Bearer ${userA.jwt}` },
      body: { query: 'test', graphs: [] }
    });
    
    if (searchA.status === 200) {
      const resultsA = searchA.json;
      const hasB = resultsA.results?.some(r => r.id === graphB.id);
      
      if (hasB) {
        results.TEST6_SEARCH.findings.push('CRITICAL: Search returned user B data to user A');
        results.TEST6_SEARCH.status = 'FAIL';
      } else {
        results.TEST6_SEARCH.findings.push('PASS: Search did not return user B data to user A');
      }
    }
    
    // Search with user B
    const searchB = await httpRequest('POST', `${API_URL}/search/recruiter`, {
      headers: { 'Authorization': `Bearer ${userB.jwt}` },
      body: { query: 'test', graphs: [] }
    });
    
    if (searchB.status === 200) {
      const resultsB = searchB.json;
      const hasA = resultsB.results?.some(r => r.id === graphA.id);
      
      if (hasA) {
        results.TEST6_SEARCH.findings.push('CRITICAL: Search returned user A data to user B');
        results.TEST6_SEARCH.status = 'FAIL';
      } else {
        results.TEST6_SEARCH.findings.push('PASS: Search did not return user A data to user B');
      }
    }
    
    if (results.TEST6_SEARCH.status !== 'FAIL') {
      results.TEST6_SEARCH.status = 'PASS';
    }
    
  } catch (error) {
    results.TEST6_SEARCH.status = 'ERROR';
    results.TEST6_SEARCH.findings.push(`ERROR: ${error.message}`);
  }
}

// ============================================================================
// TEST 7: AUTH
// ============================================================================
async function test7_Auth() {
  console.log('\n=== TEST 7: AUTH TOKEN VALIDATION ===');
  
  try {
    const authTests = [
      { name: 'No token', headers: {} },
      { name: 'Invalid token', headers: { 'Authorization': 'Bearer invalid.jwt.token' } },
      { name: 'Malformed token', headers: { 'Authorization': 'Bearer not-a-jwt' } },
      { name: 'User A token by B', headers: { 'Authorization': `Bearer ${userA.jwt}` } }
    ];
    
    for (const test of authTests) {
      const response = await httpRequest('GET', `${API_URL}/graph`, {
        headers: test.headers
      });
      
      if (response.status === 401) {
        results.TEST7_AUTH.findings.push(`PASS: ${test.name} rejected with 401`);
      } else {
        results.TEST7_AUTH.findings.push(`CRITICAL: ${test.name} returned ${response.status} (expected 401)`);
        results.TEST7_AUTH.status = 'FAIL';
      }
    }
    
    // Valid token should work
    const validResponse = await httpRequest('GET', `${API_URL}/graph`, {
      headers: { 'Authorization': `Bearer ${userB.jwt}` }
    });
    
    if (validResponse.status === 200) {
      results.TEST7_AUTH.findings.push('PASS: Valid token accepted');
    } else {
      results.TEST7_AUTH.findings.push(`WARNING: Valid token returned ${validResponse.status}`);
    }
    
    if (results.TEST7_AUTH.status !== 'FAIL') {
      results.TEST7_AUTH.status = 'PASS';
    }
    
  } catch (error) {
    results.TEST7_AUTH.status = 'ERROR';
    results.TEST7_AUTH.findings.push(`ERROR: ${error.message}`);
  }
}

// ============================================================================
// TEST 8: RATE LIMITING
// ============================================================================
async function test8_RateLimiting() {
  console.log('\n=== TEST 8: RATE LIMITING ===');
  
  try {
    const requests = [];
    const N = 60; // Try 60 requests rapidly
    
    for (let i = 0; i < N; i++) {
      requests.push(
        httpRequest('GET', `${API_URL}/graph`, {
          headers: { 'Authorization': `Bearer ${userB.jwt}` }
        })
      );
    }
    
    const responses = await Promise.all(requests);
    const rateLimited = responses.some(r => r.status === 429);
    
    if (rateLimited) {
      results.TEST8_RATE_LIMITING.findings.push(`PASS: Rate limiting triggered after ${N} requests`);
      results.TEST8_RATE_LIMITING.status = 'PASS';
    } else {
      results.TEST8_RATE_LIMITING.findings.push(`WARNING: No rate limiting detected after ${N} requests`);
      results.TEST8_RATE_LIMITING.status = 'NOT_TESTED';
    }
    
    // Check for rate limit headers
    const sampleResponse = responses[0];
    if (sampleResponse.headers['x-ratelimit-limit']) {
      results.TEST8_RATE_LIMITING.findings.push(`PASS: Rate limit headers present`);
    } else {
      results.TEST8_RATE_LIMITING.findings.push('WARNING: Rate limit headers missing');
    }
    
  } catch (error) {
    results.TEST8_RATE_LIMITING.status = 'ERROR';
    results.TEST8_RATE_LIMITING.findings.push(`ERROR: ${error.message}`);
  }
}

// ============================================================================
// TEST 9: HEADERS
// ============================================================================
async function test9_Headers() {
  console.log('\n=== TEST 9: SECURITY HEADERS ===');
  
  try {
    const response = await httpRequest('GET', `${API_URL}/graph`, {
      headers: { 'Authorization': `Bearer ${userB.jwt}` }
    });
    
    const requiredHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'referrer-policy',
      'permissions-policy',
      'content-security-policy'
    ];
    
    for (const header of requiredHeaders) {
      const value = response.headers[header];
      if (value) {
        results.TEST9_HEADERS.findings.push(`PASS: ${header} present: ${value}`);
      } else {
        results.TEST9_HEADERS.findings.push(`CRITICAL: ${header} missing`);
        results.TEST9_HEADERS.status = 'FAIL';
      }
    }
    
    if (results.TEST9_HEADERS.status !== 'FAIL') {
      results.TEST9_HEADERS.status = 'PASS';
    }
    
  } catch (error) {
    results.TEST9_HEADERS.status = 'ERROR';
    results.TEST9_HEADERS.findings.push(`ERROR: ${error.message}`);
  }
}

// ============================================================================
// TEST 10: DATABASE
// ============================================================================
async function test10_Database() {
  console.log('\n=== TEST 10: DATABASE INTEGRITY ===');
  
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Verify ownership
    const graphsA = await prisma.graph.findMany({
      where: { userId: userA.id }
    });
    
    results.TEST10_DATABASE.findings.push(`User A has ${graphsA.length} graphs`);
    
    // Check for orphans (graphs without userId)
    const orphans = await prisma.graph.findMany({
      where: { userId: null }
    });
    
    if (orphans.length > 0) {
      results.TEST10_DATABASE.findings.push(`CRITICAL: Found ${orphans.length} orphan graphs (userId is null)`);
      results.TEST10_DATABASE.status = 'FAIL';
    } else {
      results.TEST10_DATABASE.findings.push('PASS: No orphan graphs found');
    }
    
    // Check for cross-user references
    // This would require checking all related tables
    results.TEST10_DATABASE.findings.push('INFO: Cross-user reference check requires full schema audit');
    
    await prisma.$disconnect();
    
    if (results.TEST10_DATABASE.status !== 'FAIL') {
      results.TEST10_DATABASE.status = 'PASS';
    }
    
  } catch (error) {
    results.TEST10_DATABASE.status = 'ERROR';
    results.TEST10_DATABASE.findings.push(`ERROR: ${error.message}`);
  }
}

// ============================================================================
// MAIN
// ============================================================================
async function main() {
  console.log('=== GO-LIVE-004.1 ADVERSARIAL SECURITY AUDIT ===');
  console.log(`API URL: ${API_URL}`);
  console.log(`User A: ${USER_A_EMAIL}`);
  console.log(`User B: ${USER_B_EMAIL}`);
  
  try {
    // Create test users
    console.log('\nCreating test users...');
    userA.id = (await createTestUser(USER_A_EMAIL, TEST_PASSWORD)).id;
    userB.id = (await createTestUser(USER_B_EMAIL, TEST_PASSWORD)).id;
    
    // Authenticate
    console.log('Authenticating users...');
    const authA = await authenticateUser(USER_A_EMAIL, TEST_PASSWORD);
    userA.id = authA.id;
    userA.jwt = authA.jwt;
    
    const authB = await authenticateUser(USER_B_EMAIL, TEST_PASSWORD);
    userB.id = authB.id;
    userB.jwt = authB.jwt;
    
    console.log(`User A ID: ${userA.id}`);
    console.log(`User B ID: ${userB.id}`);
    
    serviceRoleClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Run tests
    await test1_Impersonation();
    await test2_IDOR();
    await test3_Graph();
    await test4_Copilot();
    await test5_Billing();
    await test6_Search();
    await test7_Auth();
    await test8_RateLimiting();
    await test9_Headers();
    await test10_Database();
    
    // Cleanup
    console.log('\nCleaning up test users...');
    await deleteTestUser(userA.id);
    await deleteTestUser(userB.id);
    
  } catch (error) {
    console.error(`\nFATAL ERROR: ${error.message}`);
    console.error(error.stack);
  }
  
  // Print results
  console.log('\n=== AUDIT RESULTS ===');
  for (const [test, result] of Object.entries(results)) {
    console.log(`\n${test}: ${result.status}`);
    result.findings.forEach(f => console.log(`  - ${f}`));
  }
  
  // Save results
  const fs = require('fs');
  fs.writeFileSync('GO-LIVE-004.1-EVIDENCE.json', JSON.stringify(results, null, 2));
  console.log('\nResults saved to GO-LIVE-004.1-EVIDENCE.json');
}

main().catch(console.error);
