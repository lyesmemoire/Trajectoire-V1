/**
 * Simple API Test - SPRINT-4.6
 * 
 * Basic connectivity test without full server requirement
 */

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

async function testConnectivity() {
  console.log('Testing API connectivity...');
  console.log(`Base URL: ${BASE_URL}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Server is running');
      console.log(`Status: ${data.status}`);
      return true;
    } else {
      console.log(`⚠️ Server responded with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Server is not running or not accessible');
    console.log('Error:', error instanceof Error ? error.message : String(error));
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('SPRINT-4.6 Simple API Test');
  console.log('='.repeat(60));
  console.log('');
  
  const isRunning = await testConnectivity();
  
  if (!isRunning) {
    console.log('');
    console.log('To run full E2E tests:');
    console.log('1. Start dev server: npm run dev');
    console.log('2. Run API tests: npm run test:api');
    console.log('3. Run Playwright tests: npm run test:e2e');
  }
  
  console.log('');
  console.log('='.repeat(60));
}

main().catch(console.error);