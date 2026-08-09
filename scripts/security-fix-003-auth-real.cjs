/**
 * SECURITY-FIX-003 — AUTHENTICATION ENFORCEMENT / RUNTIME TRUTH
 * 
 * Real security test script - NO MOCKS, NO BYPASSES
 * Tests actual HTTP requests against running API
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';

const results = {
  build: { status: 'NOT_TESTED', timestamp: null },
  runtime: { status: 'NOT_TESTED', pid: null, timestamp: null },
  tests: []
};

async function httpRequest(method, url, options = {}) {
  const headers = options.headers || {};
  const body = options.body ? JSON.stringify(options.body) : undefined;
  
  try {
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
  } catch (error) {
    return {
      status: 0,
      headers: {},
      body: error.message,
      json: null
    };
  }
}

async function getServerPID() {
  // Use known PID from startup or try netstat
  const { execSync } = require('child_process');
  try {
    // Try netstat first (cross-platform)
    const output = execSync('netstat -ano | findstr :3000', { encoding: 'utf8' });
    const match = output.match(/LISTENING\s+(\d+)/);
    return match ? parseInt(match[1]) : null;
  } catch (error) {
    // Fallback: assume server is running
    console.log('WARNING: Could not determine PID, assuming server is running');
    return 'UNKNOWN';
  }
}

async function testAuthentication() {
  console.log('=== SECURITY-FIX-003 AUTHENTICATION TEST ===');
  console.log(`API URL: ${API_URL}`);
  
  // Get server PID
  const pid = await getServerPID();
  results.runtime.pid = pid;
  results.runtime.timestamp = new Date().toISOString();
  
  if (!pid) {
    console.error('ERROR: No server listening on port 3000');
    results.runtime.status = 'FAIL';
    return;
  }
  
  console.log(`Server PID: ${pid}`);
  results.runtime.status = 'PASS';
  
  // Test 1: POST protected route without token → 401
  const test1 = await httpRequest('POST', `${API_URL}/cv/extract`, {
    body: { text: 'test' }
  });
  results.tests.push({
    name: 'POST CV endpoint without token',
    endpoint: '/cv/extract',
    method: 'POST',
    auth: 'none',
    expectedStatus: 401,
    actualStatus: test1.status,
    pid,
    timestamp: new Date().toISOString(),
    result: test1.status === 401 ? 'PASS' : 'FAIL',
    evidence: test1.status === 404 ? 'CRITICAL: 404 used instead of 401 - route not protected' : `Status: ${test1.status}`
  });
  
  // Test 2: POST protected route with invalid token → 401
  const test2 = await httpRequest('POST', `${API_URL}/cv/extract`, {
    headers: { 'Authorization': 'Bearer invalid.jwt.token' },
    body: { text: 'test' }
  });
  results.tests.push({
    name: 'POST CV endpoint with invalid token',
    endpoint: '/cv/extract',
    method: 'POST',
    auth: 'Bearer invalid.jwt.token',
    expectedStatus: 401,
    actualStatus: test2.status,
    pid,
    timestamp: new Date().toISOString(),
    result: test2.status === 401 ? 'PASS' : 'FAIL',
    evidence: test2.status === 404 ? 'CRITICAL: 404 used instead of 401' : `Status: ${test2.status}`
  });
  
  // Test 3: POST protected route with malformed token → 401
  const test3 = await httpRequest('POST', `${API_URL}/cv/extract`, {
    headers: { 'Authorization': 'Bearer not-a-jwt' },
    body: { text: 'test' }
  });
  results.tests.push({
    name: 'POST CV endpoint with malformed token',
    endpoint: '/cv/extract',
    method: 'POST',
    auth: 'Bearer not-a-jwt',
    expectedStatus: 401,
    actualStatus: test3.status,
    pid,
    timestamp: new Date().toISOString(),
    result: test3.status === 401 ? 'PASS' : 'FAIL',
    evidence: test3.status === 404 ? 'CRITICAL: 404 used instead of 401' : `Status: ${test3.status}`
  });
  
  // Test 4: POST protected route with empty Bearer → 401
  const test4 = await httpRequest('POST', `${API_URL}/cv/extract`, {
    headers: { 'Authorization': 'Bearer ' },
    body: { text: 'test' }
  });
  results.tests.push({
    name: 'POST CV endpoint with empty Bearer',
    endpoint: '/cv/extract',
    method: 'POST',
    auth: 'Bearer ',
    expectedStatus: 401,
    actualStatus: test4.status,
    pid,
    timestamp: new Date().toISOString(),
    result: test4.status === 401 ? 'PASS' : 'FAIL',
    evidence: test4.status === 404 ? 'CRITICAL: 404 used instead of 401' : `Status: ${test4.status}`
  });
  
  // Test 5: GET public health endpoint → 200
  const test5 = await httpRequest('GET', `${API_URL}/health`);
  results.tests.push({
    name: 'GET public health endpoint',
    endpoint: '/health',
    method: 'GET',
    auth: 'none',
    expectedStatus: 200,
    actualStatus: test5.status,
    pid,
    timestamp: new Date().toISOString(),
    result: test5.status === 200 ? 'PASS' : 'FAIL',
    evidence: `Status: ${test5.status}`
  });
  
  // Test 6: POST CV endpoint without token → 401
  const test6 = await httpRequest('POST', `${API_URL}/cv/extract`, {
    body: { text: 'test' }
  });
  results.tests.push({
    name: 'POST CV endpoint without token',
    endpoint: '/cv/extract',
    method: 'POST',
    auth: 'none',
    expectedStatus: 401,
    actualStatus: test6.status,
    pid,
    timestamp: new Date().toISOString(),
    result: test6.status === 401 ? 'PASS' : 'FAIL',
    evidence: test6.status === 404 ? 'CRITICAL: 404 used instead of 401' : `Status: ${test6.status}`
  });
  
  // Test 7: POST Copilot endpoint without token → 401
  const test7 = await httpRequest('POST', `${API_URL}/copilot/sessions`, {
    body: { message: 'test' }
  });
  results.tests.push({
    name: 'POST Copilot endpoint without token',
    endpoint: '/copilot/sessions',
    method: 'POST',
    auth: 'none',
    expectedStatus: 401,
    actualStatus: test7.status,
    pid,
    timestamp: new Date().toISOString(),
    result: test7.status === 401 ? 'PASS' : 'FAIL',
    evidence: test7.status === 404 ? 'CRITICAL: 404 used instead of 401' : `Status: ${test7.status}`
  });
  
  // Test 8: POST Search endpoint without token → 401
  const test8 = await httpRequest('POST', `${API_URL}/search/candidates`, {
    body: { jobGraph: { id: 'test' }, candidateGraphs: [] }
  });
  results.tests.push({
    name: 'POST Search endpoint without token',
    endpoint: '/search/candidates',
    method: 'POST',
    auth: 'none',
    expectedStatus: 401,
    actualStatus: test8.status,
    pid,
    timestamp: new Date().toISOString(),
    result: test8.status === 401 ? 'PASS' : 'FAIL',
    evidence: test8.status === 404 ? 'CRITICAL: 404 used instead of 401' : `Status: ${test8.status}`
  });
  
  // Test 9: POST Matching endpoint without token → 401
  const test9 = await httpRequest('POST', `${API_URL}/matching/calculate-score`, {
    body: { candidateGraph: { id: 'test' }, jobGraph: { id: 'test' } }
  });
  results.tests.push({
    name: 'POST Matching endpoint without token',
    endpoint: '/matching/calculate-score',
    method: 'POST',
    auth: 'none',
    expectedStatus: 401,
    actualStatus: test9.status,
    pid,
    timestamp: new Date().toISOString(),
    result: test9.status === 401 ? 'PASS' : 'FAIL',
    evidence: test9.status === 404 ? 'CRITICAL: 404 used instead of 401' : `Status: ${test9.status}`
  });
  
  // Print results
  console.log('\n=== TEST RESULTS ===');
  results.tests.forEach(test => {
    console.log(`\n${test.name}`);
    console.log(`  Result: ${test.result}`);
    console.log(`  Expected: ${test.expectedStatus}, Actual: ${test.actualStatus}`);
    console.log(`  Evidence: ${test.evidence}`);
  });
  
  // Anti-false-positive checks
  const has404As401 = results.tests.some(t => t.actualStatus === 404 && t.expectedStatus === 401);
  const hasUnauthenticatedAccess = results.tests.some(t => t.actualStatus === 200 && t.expectedStatus === 401);
  const publicEndpointFails = results.tests.find(t => t.endpoint === '/health' && t.result !== 'PASS');
  
  console.log('\n=== ANTI-FALSE-POSITIVE CHECKS ===');
  console.log(`404 used instead of 401: ${has404As401 ? 'FAIL - CRITICAL' : 'PASS'}`);
  console.log(`Unauthenticated access to protected routes: ${hasUnauthenticatedAccess ? 'FAIL - CRITICAL' : 'PASS'}`);
  console.log(`Public endpoint accessible: ${publicEndpointFails ? 'FAIL' : 'PASS'}`);
  
  // Save results
  const fs = require('fs');
  fs.writeFileSync('SECURITY-FIX-003-EVIDENCE.json', JSON.stringify(results, null, 2));
  console.log('\nResults saved to SECURITY-FIX-003-EVIDENCE.json');
  
  // Exit with appropriate code
  const failedTests = results.tests.filter(t => t.result === 'FAIL');
  if (failedTests.length > 0 || has404As401 || hasUnauthenticatedAccess) {
    console.log('\n=== FINAL RESULT: FAIL ===');
    process.exit(1);
  } else {
    console.log('\n=== FINAL RESULT: PASS ===');
    process.exit(0);
  }
}

testAuthentication().catch(error => {
  console.error('FATAL ERROR:', error);
  process.exit(1);
});
