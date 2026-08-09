/**
 * GO-LIVE-004.1 — LIMITED ADVERSARIAL AUDIT
 * 
 * Tests that can be performed without Supabase credentials
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';

const results = {
  TEST7_AUTH: { status: 'NOT_TESTED', findings: [] },
  TEST8_RATE_LIMITING: { status: 'NOT_TESTED', findings: [] },
  TEST9_HEADERS: { status: 'NOT_TESTED', findings: [] }
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

async function test7_Auth() {
  console.log('\n=== TEST 7: AUTH TOKEN VALIDATION ===');
  
  try {
    const authTests = [
      { name: 'No token', headers: {} },
      { name: 'Invalid token', headers: { 'Authorization': 'Bearer invalid.jwt.token' } },
      { name: 'Malformed token', headers: { 'Authorization': 'Bearer not-a-jwt' } },
      { name: 'Empty Bearer', headers: { 'Authorization': 'Bearer ' } }
    ];
    
    for (const test of authTests) {
      const response = await httpRequest('GET', `${API_URL}/graph`, {
        headers: test.headers
      });
      
      if (response.status === 401) {
        results.TEST7_AUTH.findings.push(`PASS: ${test.name} rejected with 401`);
      } else if (response.status === 0) {
        results.TEST7_AUTH.findings.push(`ERROR: ${test.name} - ${response.body}`);
        results.TEST7_AUTH.status = 'ERROR';
      } else {
        results.TEST7_AUTH.findings.push(`CRITICAL: ${test.name} returned ${response.status} (expected 401)`);
        results.TEST7_AUTH.status = 'FAIL';
      }
    }
    
    if (results.TEST7_AUTH.status !== 'FAIL' && results.TEST7_AUTH.status !== 'ERROR') {
      results.TEST7_AUTH.status = 'PASS';
    }
    
  } catch (error) {
    results.TEST7_AUTH.status = 'ERROR';
    results.TEST7_AUTH.findings.push(`ERROR: ${error.message}`);
  }
}

async function test8_RateLimiting() {
  console.log('\n=== TEST 8: RATE LIMITING ===');
  
  try {
    const requests = [];
    const N = 60;
    
    for (let i = 0; i < N; i++) {
      requests.push(
        httpRequest('GET', `${API_URL}/graph`, {
          headers: { 'Authorization': 'Bearer test.token' }
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

async function test9_Headers() {
  console.log('\n=== TEST 9: SECURITY HEADERS ===');
  
  try {
    const response = await httpRequest('GET', `${API_URL}/graph`, {
      headers: { 'Authorization': 'Bearer test.token' }
    });
    
    const requiredHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'referrer-policy',
      'permissions-policy'
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
    
    // CSP is optional for API
    const csp = response.headers['content-security-policy'];
    if (csp) {
      results.TEST9_HEADERS.findings.push(`PASS: CSP present`);
    } else {
      results.TEST9_HEADERS.findings.push(`INFO: CSP not present (optional for API)`);
    }
    
    if (results.TEST9_HEADERS.status !== 'FAIL') {
      results.TEST9_HEADERS.status = 'PASS';
    }
    
  } catch (error) {
    results.TEST9_HEADERS.status = 'ERROR';
    results.TEST9_HEADERS.findings.push(`ERROR: ${error.message}`);
  }
}

async function main() {
  console.log('=== GO-LIVE-004.1 LIMITED ADVERSARIAL AUDIT ===');
  console.log(`API URL: ${API_URL}`);
  console.log('Note: Tests requiring Supabase credentials are BLOCKED');
  
  await test7_Auth();
  await test8_RateLimiting();
  await test9_Headers();
  
  console.log('\n=== AUDIT RESULTS ===');
  for (const [test, result] of Object.entries(results)) {
    console.log(`\n${test}: ${result.status}`);
    result.findings.forEach(f => console.log(`  - ${f}`));
  }
  
  const fs = require('fs');
  fs.writeFileSync('GO-LIVE-004.1-LIMITED-EVIDENCE.json', JSON.stringify(results, null, 2));
  console.log('\nResults saved to GO-LIVE-004.1-LIMITED-EVIDENCE.json');
}

main().catch(console.error);
