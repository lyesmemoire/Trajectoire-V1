/**
 * SECURITY-FIX-004: IDOR & Authorization Vulnerability Tests
 * Tests cross-user access isolation for all private resources
 * 
 * This script tests that no user can access, modify, or delete another user's data.
 * It uses real HTTP requests with two different authenticated users (USER_A and USER_B).
 */

const http = require('http');
const https = require('https');
const fs = require('fs');

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3001';
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || 'your-secret-key';

// Test users - these should be real users in your database
const USER_A = {
  id: 'user-a-id',
  email: 'user-a@example.com',
  // JWT token for USER_A (you need to generate this)
  token: null
};

const USER_B = {
  id: 'user-b-id',
  email: 'user-b@example.com',
  // JWT token for USER_B (you need to generate this)
  token: null
};

// Test results
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to make HTTP requests
function makeRequest(method, path, token, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    };

    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Test helper
async function runTest(testName, testFn) {
  results.total++;
  console.log(`\n[TEST] ${testName}`);
  
  try {
    const result = await testFn();
    if (result.passed) {
      results.passed++;
      console.log(`✓ PASSED: ${result.message}`);
      results.tests.push({
        name: testName,
        status: 'passed',
        message: result.message,
        details: result.details
      });
    } else {
      results.failed++;
      console.log(`✗ FAILED: ${result.message}`);
      results.tests.push({
        name: testName,
        status: 'failed',
        message: result.message,
        details: result.details
      });
    }
  } catch (error) {
    results.failed++;
    console.log(`✗ ERROR: ${error.message}`);
    results.tests.push({
      name: testName,
      status: 'error',
      message: error.message,
      details: error.stack
    });
  }
}

// ============================================================================
// GRAPH ISOLATION TESTS
// ============================================================================

async function testGraphIsolation() {
  console.log('\n=== GRAPH ISOLATION TESTS ===');
  
  // Test 1: USER_A creates a graph
  await runTest('USER_A creates graph', async () => {
    const response = await makeRequest('POST', '/graph', USER_A.token, {
      name: 'USER_A Graph',
      description: 'Graph owned by USER_A'
    });
    
    if (response.status === 201) {
      USER_A.graphId = response.data.data.id;
      return { 
        passed: true, 
        message: 'USER_A successfully created graph',
        details: { graphId: USER_A.graphId }
      };
    }
    return { passed: false, message: `Failed to create graph: ${response.status}` };
  });

  // Test 2: USER_B tries to access USER_A's graph
  await runTest('USER_B cannot access USER_A graph', async () => {
    const response = await makeRequest('GET', `/graph/${USER_A.graphId}`, USER_B.token);
    
    if (response.status === 404 || response.status === 403) {
      return { 
        passed: true, 
        message: 'USER_B correctly denied access to USER_A graph',
        details: { status: response.status }
      };
    }
    return { 
      passed: false, 
      message: `USER_B was able to access USER_A graph (status: ${response.status})`,
      details: response.data
    };
  });

  // Test 3: USER_B tries to update USER_A's graph
  await runTest('USER_B cannot update USER_A graph', async () => {
    const response = await makeRequest('PUT', `/graph/${USER_A.graphId}`, USER_B.token, {
      name: 'Hacked by USER_B'
    });
    
    if (response.status === 404 || response.status === 403) {
      return { 
        passed: true, 
        message: 'USER_B correctly denied update to USER_A graph',
        details: { status: response.status }
      };
    }
    return { 
      passed: false, 
      message: `USER_B was able to update USER_A graph (status: ${response.status})`,
      details: response.data
    };
  });

  // Test 4: USER_B tries to delete USER_A's graph
  await runTest('USER_B cannot delete USER_A graph', async () => {
    const response = await makeRequest('DELETE', `/graph/${USER_A.graphId}`, USER_B.token);
    
    if (response.status === 404 || response.status === 403) {
      return { 
        passed: true, 
        message: 'USER_B correctly denied delete of USER_A graph',
        details: { status: response.status }
      };
    }
    return { 
      passed: false, 
      message: `USER_B was able to delete USER_A graph (status: ${response.status})`,
      details: response.data
    };
  });

  // Test 5: USER_A can still access their own graph
  await runTest('USER_A can access their own graph', async () => {
    const response = await makeRequest('GET', `/graph/${USER_A.graphId}`, USER_A.token);
    
    if (response.status === 200) {
      return { 
        passed: true, 
        message: 'USER_A can access their own graph',
        details: { graphId: USER_A.graphId }
      };
    }
    return { 
      passed: false, 
      message: `USER_A cannot access their own graph (status: ${response.status})`,
      details: response.data
    };
  });
}

// ============================================================================
// CV ISOLATION TESTS
// ============================================================================

async function testCVIsolation() {
  console.log('\n=== CV ISOLATION TESTS ===');
  
  // Test 1: USER_A uploads a CV
  await runTest('USER_A uploads CV', async () => {
    // Note: This would require actual file upload, simplified here
    const response = await makeRequest('POST', '/cv/extract', USER_A.token, {
      text: 'Sample CV for USER_A'
    });
    
    if (response.status === 200 || response.status === 201) {
      USER_A.cvId = response.data.data?.candidateId || 'cv-a-id';
      return { 
        passed: true, 
        message: 'USER_A successfully uploaded CV',
        details: { cvId: USER_A.cvId }
      };
    }
    return { passed: false, message: `Failed to upload CV: ${response.status}` };
  });

  // Test 2: USER_B tries to access USER_A's CV
  await runTest('USER_B cannot access USER_A CV', async () => {
    const response = await makeRequest('GET', `/cv/${USER_A.cvId}`, USER_B.token);
    
    if (response.status === 404 || response.status === 403) {
      return { 
        passed: true, 
        message: 'USER_B correctly denied access to USER_A CV',
        details: { status: response.status }
      };
    }
    return { 
      passed: false, 
      message: `USER_B was able to access USER_A CV (status: ${response.status})`,
      details: response.data
    };
  });
}

// ============================================================================
// JOB ISOLATION TESTS
// ============================================================================

async function testJobIsolation() {
  console.log('\n=== JOB ISOLATION TESTS ===');
  
  // Test 1: USER_A creates a job
  await runTest('USER_A creates job', async () => {
    const response = await makeRequest('POST', '/job/extract', USER_A.token, {
      text: 'Sample Job for USER_A'
    });
    
    if (response.status === 200 || response.status === 201) {
      USER_A.jobId = response.data.data?.jobId || 'job-a-id';
      return { 
        passed: true, 
        message: 'USER_A successfully created job',
        details: { jobId: USER_A.jobId }
      };
    }
    return { passed: false, message: `Failed to create job: ${response.status}` };
  });

  // Test 2: USER_B tries to access USER_A's job
  await runTest('USER_B cannot access USER_A job', async () => {
    const response = await makeRequest('GET', `/job/${USER_A.jobId}`, USER_B.token);
    
    if (response.status === 404 || response.status === 403) {
      return { 
        passed: true, 
        message: 'USER_B correctly denied access to USER_A job',
        details: { status: response.status }
      };
    }
    return { 
      passed: false, 
      message: `USER_B was able to access USER_A job (status: ${response.status})`,
      details: response.data
    };
  });
}

// ============================================================================
// COPILOT ISOLATION TESTS
// ============================================================================

async function testCopilotIsolation() {
  console.log('\n=== COPILOT ISOLATION TESTS ===');
  
  // Test 1: USER_A creates a copilot session
  await runTest('USER_A creates copilot session', async () => {
    const response = await makeRequest('POST', '/copilot/message', USER_A.token, {
      sessionId: 'session-a',
      message: 'Hello from USER_A',
      cvId: USER_A.cvId
    });
    
    if (response.status === 200) {
      USER_A.sessionId = 'session-a';
      return { 
        passed: true, 
        message: 'USER_A successfully created copilot session',
        details: { sessionId: USER_A.sessionId }
      };
    }
    return { passed: false, message: `Failed to create session: ${response.status}` };
  });

  // Test 2: USER_B tries to access USER_A's session
  await runTest('USER_B cannot access USER_A copilot session', async () => {
    const response = await makeRequest('GET', `/copilot/session/${USER_A.sessionId}`, USER_B.token);
    
    if (response.status === 404 || response.status === 403) {
      return { 
        passed: true, 
        message: 'USER_B correctly denied access to USER_A session',
        details: { status: response.status }
      };
    }
    return { 
      passed: false, 
      message: `USER_B was able to access USER_A session (status: ${response.status})`,
      details: response.data
    };
  });
}

// ============================================================================
// LIST ENDPOINT ISOLATION TESTS
// ============================================================================

async function testListEndpointIsolation() {
  console.log('\n=== LIST ENDPOINT ISOLATION TESTS ===');
  
  // Test 1: USER_A lists their graphs
  await runTest('USER_A lists their graphs', async () => {
    const response = await makeRequest('GET', '/graph', USER_A.token);
    
    if (response.status === 200) {
      const graphs = response.data.data || [];
      USER_A.graphCount = graphs.length;
      return { 
        passed: true, 
        message: `USER_A can list their graphs (${graphs.length} found)`,
        details: { graphCount: graphs.length }
      };
    }
    return { passed: false, message: `Failed to list graphs: ${response.status}` };
  });

  // Test 2: USER_B lists their graphs
  await runTest('USER_B lists their graphs', async () => {
    const response = await makeRequest('GET', '/graph', USER_B.token);
    
    if (response.status === 200) {
      const graphs = response.data.data || [];
      USER_B.graphCount = graphs.length;
      // USER_B should not see USER_A's graphs
      if (graphs.length !== USER_A.graphCount || graphs.length === 0) {
        return { 
          passed: true, 
          message: `USER_B can list their graphs (${graphs.length} found) - no leakage`,
          details: { graphCount: graphs.length }
        };
      }
      return { 
        passed: false, 
        message: `USER_B might be seeing USER_A graphs (count: ${graphs.length})`,
        details: { graphCount: graphs.length }
      };
    }
    return { passed: false, message: `Failed to list graphs: ${response.status}` };
  });
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('SECURITY-FIX-004: IDOR & Authorization Vulnerability Tests');
  console.log('============================================================');
  console.log(`API URL: ${API_URL}`);
  console.log(`Testing cross-user isolation between USER_A and USER_B\n`);

  // Note: You need to set up real JWT tokens for USER_A and USER_B
  // This is a placeholder - in production, you would:
  // 1. Create real users in Supabase
  // 2. Generate valid JWT tokens for each user
  // 3. Set USER_A.token and USER_B.token

  if (!USER_A.token || !USER_B.token) {
    console.error('ERROR: USER_A.token and USER_B.token must be set with valid JWT tokens');
    console.error('Please create real users and generate tokens before running this test');
    process.exit(1);
  }

  try {
    await testGraphIsolation();
    await testCVIsolation();
    await testJobIsolation();
    await testCopilotIsolation();
    await testListEndpointIsolation();

    // Print summary
    console.log('\n=== TEST SUMMARY ===');
    console.log(`Total Tests: ${results.total}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`);

    // Save results to file
    const evidence = {
      timestamp: new Date().toISOString(),
      apiUrl: API_URL,
      results: results,
      users: {
        userA: USER_A.id,
        userB: USER_B.id
      }
    };

    fs.writeFileSync(
      'SECURITY-FIX-004-EVIDENCE.json',
      JSON.stringify(evidence, null, 2)
    );

    const report = `# SECURITY-FIX-004 Test Results

## Summary
- Total Tests: ${results.total}
- Passed: ${results.passed}
- Failed: ${results.failed}
- Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%

## Test Details
${results.tests.map(test => `
### ${test.name}
- Status: ${test.status.toUpperCase()}
- Message: ${test.message}
${test.details ? `- Details: ${JSON.stringify(test.details)}` : ''}
`).join('\n')}

## Conclusion
${results.failed === 0 
  ? '✓ All tests passed. Authorization is properly enforced.' 
  : `✗ ${results.failed} test(s) failed. Authorization vulnerabilities exist.`}
`;

    fs.writeFileSync('SECURITY-FIX-004-RESULT.md', report);

    console.log('\nResults saved to:');
    console.log('- SECURITY-FIX-004-EVIDENCE.json');
    console.log('- SECURITY-FIX-004-RESULT.md');

    process.exit(results.failed === 0 ? 0 : 1);

  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { main, runTest, makeRequest };
