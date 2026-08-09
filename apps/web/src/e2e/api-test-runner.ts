/**
 * API Test Runner - SPRINT-4.6
 * 
 * Simplified E2E test runner using Node.js fetch
 * Runs all API tests without requiring Playwright browsers
 */

const API_TEST_BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

const results: TestResult[] = [];

async function runTest(name: string, testFn: () => Promise<void>): Promise<void> {
  const start = Date.now();
  try {
    await testFn();
    const duration = Date.now() - start;
    results.push({ name, passed: true, duration });
    console.log(`✅ ${name} (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - start;
    const errorMessage = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, duration, error: errorMessage });
    console.log(`❌ ${name} (${duration}ms) - ${errorMessage}`);
  }
}

// Auth Tests
async function testAuthCheckAccess() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/auth/check-access`);
  const status = response.status;
  if (![200, 401].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

async function testAuthClaimPreview() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/auth/claim-preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: 'test-token' }),
  });
  const status = response.status;
  if (![200, 400, 401].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

async function testAuthSyncUser() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/auth/sync-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const status = response.status;
  if (![200, 401].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

// CV Tests
async function testCVAnalyze() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/cv/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cvText: 'Experienced developer with React and TypeScript skills',
      jobDescription: 'Looking for React developer',
    }),
  });
  const status = response.status;
  if (![200, 400, 401, 500].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

async function testCVRewrite() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/cv/rewrite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cvText: 'Original CV content',
      jobDescription: 'Target job description',
    }),
  });
  const status = response.status;
  if (![200, 400, 401, 500].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

async function testCVUpload() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/cv/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: 'test.pdf',
      fileData: 'base64encodeddata',
    }),
  });
  const status = response.status;
  if (![200, 400, 401].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

// Interview Tests
async function testInterviewCreate() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/interview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jobTitle: 'Software Engineer',
      level: 'mid',
    }),
  });
  const status = response.status;
  if (![200, 400, 401].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

async function testInterviewQuestions() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/interview/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jobTitle: 'Software Engineer',
      level: 'mid',
    }),
  });
  const status = response.status;
  if (![200, 400, 401, 500].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

async function testInterviewEvaluate() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/interview/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'test-session',
      question: 'What is your experience with React?',
      answer: 'I have 3 years of experience with React',
    }),
  });
  const status = response.status;
  if (![200, 400, 401, 500].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

// Matching Tests
async function testMatchingCalculateScore() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/matching/calculate-score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cvText: 'React developer with TypeScript experience',
      jobDescription: 'Looking for React and TypeScript developer',
    }),
  });
  const status = response.status;
  if (![200, 400].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

async function testMatchingHistory() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/matching/history`);
  const status = response.status;
  if (![200, 401].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

// Health Tests
async function testHealth() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/health`);
  if (response.status !== 200) {
    throw new Error(`Unexpected status: ${response.status}`);
  }
  const data = await response.json();
  if (!data.status || data.status !== 'ok') {
    throw new Error('Health check failed');
  }
}

async function testPerformanceHealth() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/performance/health`);
  if (response.status !== 200) {
    throw new Error(`Unexpected status: ${response.status}`);
  }
  const data = await response.json();
  if (!data.metrics || !data.optimizer) {
    throw new Error('Performance health check failed');
  }
}

// Knowledge Tests
async function testKnowledgeNodes() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/knowledge/nodes`);
  const status = response.status;
  if (![200, 401].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

async function testKnowledgeCreateNode() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/knowledge/nodes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'skill',
      data: { name: 'React', level: 'expert' },
    }),
  });
  const status = response.status;
  if (![200, 400, 401].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

// Stripe Tests
async function testStripeCheckout() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/stripe/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId: 'test-price-id',
    }),
  });
  const status = response.status;
  if (![200, 400, 401, 403, 500, 503].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

async function testStripeCustomerPortal() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/stripe/customer-portal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const status = response.status;
  if (![200, 400, 401, 403, 500, 503].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

async function testStripeWebhook() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/stripe/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ test: 'true' }),
  });
  const status = response.status;
  if (![400, 401].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

// Simulation Tests
async function testSimulationCreate() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/simulation/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      scenario: 'technical-interview',
      candidateProfile: {
        name: 'Test Candidate',
        experience: 5,
      },
    }),
  });
  const status = response.status;
  if (![200, 400, 401].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

async function testSimulationMessage() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/simulation/test-id/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Hello, I am ready for the interview',
    }),
  });
  const status = response.status;
  if (![200, 400, 401, 404, 500].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

async function testSimulationEnd() {
  const response = await fetch(`${API_TEST_BASE_URL}/api/simulation/end`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      simulationId: 'test-id',
    }),
  });
  const status = response.status;
  if (![200, 400, 401].includes(status)) {
    throw new Error(`Unexpected status: ${status}`);
  }
}

// Main test runner
async function runApiTests() {
  console.log('='.repeat(60));
  console.log('SPRINT-4.6 API Test Runner');
  console.log(`Base URL: ${API_TEST_BASE_URL}`);
  console.log('='.repeat(60));
  console.log('');

  // Check if server is running
  try {
    await fetch(`${API_TEST_BASE_URL}/api/health`, { method: 'HEAD' });
  } catch {
    console.error('❌ Server not running. Please start dev server with: npm run dev');
    process.exit(1);
  }

  // Run all tests
  await runTest('Auth: Check Access', testAuthCheckAccess);
  await runTest('Auth: Claim Preview', testAuthClaimPreview);
  await runTest('Auth: Sync User', testAuthSyncUser);
  
  await runTest('CV: Analyze', testCVAnalyze);
  await runTest('CV: Rewrite', testCVRewrite);
  await runTest('CV: Upload', testCVUpload);
  
  await runTest('Interview: Create', testInterviewCreate);
  await runTest('Interview: Questions', testInterviewQuestions);
  await runTest('Interview: Evaluate', testInterviewEvaluate);
  
  await runTest('Matching: Calculate Score', testMatchingCalculateScore);
  await runTest('Matching: History', testMatchingHistory);
  
  await runTest('Health: Health Check', testHealth);
  await runTest('Health: Performance Health', testPerformanceHealth);
  
  await runTest('Knowledge: Get Nodes', testKnowledgeNodes);
  await runTest('Knowledge: Create Node', testKnowledgeCreateNode);
  
  await runTest('Stripe: Checkout', testStripeCheckout);
  await runTest('Stripe: Customer Portal', testStripeCustomerPortal);
  await runTest('Stripe: Webhook', testStripeWebhook);
  
  await runTest('Simulation: Create', testSimulationCreate);
  await runTest('Simulation: Message', testSimulationMessage);
  await runTest('Simulation: End', testSimulationEnd);

  // Print results
  console.log('');
  console.log('='.repeat(60));
  console.log('TEST RESULTS');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  
  console.log(`Total: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('');
    console.log('Failed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
  }
  
  console.log('='.repeat(60));
  
  // Exit with appropriate code
  process.exit(failed === 0 ? 0 : 1);
}

runApiTests().catch(console.error);