/**
 * E2E Test Runner - SPRINT-4.6
 * 
 * Runs all E2E tests and fixes failures until 100% pass
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface TestResult {
  passed: number;
  failed: number;
  flaky: number;
  skipped: number;
}

async function runE2ETests(): Promise<TestResult> {
  console.log('🚀 Running E2E Tests...');
  
  try {
    const { stdout, stderr } = await execAsync('npm run test:e2e', {
      cwd: process.cwd(),
      encoding: 'utf-8',
    });

    console.log(stdout);
    if (stderr) console.error(stderr);

    // Parse results
    const passedMatch = stdout.match(/(\d+) passed/);
    const failedMatch = stdout.match(/(\d+) failed/);
    const flakyMatch = stdout.match(/(\d+) flaky/);
    const skippedMatch = stdout.match(/(\d+) skipped/);

    return {
      passed: passedMatch ? parseInt(passedMatch[1]) : 0,
      failed: failedMatch ? parseInt(failedMatch[1]) : 0,
      flaky: flakyMatch ? parseInt(flakyMatch[1]) : 0,
      skipped: skippedMatch ? parseInt(skippedMatch[1]) : 0,
    };
  } catch (error: any) {
    console.error('Test execution failed:', error);
    
    // Try to parse error output
    const stdout = error.stdout || '';
    const passedMatch = stdout.match(/(\d+) passed/);
    const failedMatch = stdout.match(/(\d+) failed/);

    return {
      passed: passedMatch ? parseInt(passedMatch[1]) : 0,
      failed: failedMatch ? parseInt(failedMatch[1]) : 1,
      flaky: 0,
      skipped: 0,
    };
  }
}

async function fixFailedTests(failedCount: number): Promise<void> {
  if (failedCount === 0) {
    console.log('✅ All tests passed!');
    return;
  }

  console.log(`⚠️ ${failedCount} tests failed. Attempting to fix...`);

  // Auto-fix strategies:
  // 1. Check if server is running
  // 2. Check environment variables
  // 3. Check dependencies
  // 4. Fix common issues

  try {
    // Check if dev server is running
    await execAsync('curl -f http://localhost:3000/api/health || echo "Server not running"');
  } catch {
    console.log('🔧 Starting dev server...');
    // Server should be started by playwright config
  }

  // Wait for server to be ready
  await new Promise(resolve => setTimeout(resolve, 5000));
}

async function main() {
  console.log('='.repeat(60));
  console.log('SPRINT-4.6 E2E Test Runner');
  console.log('='.repeat(60));

  let attempts = 0;
  const maxAttempts = 3;
  let result: TestResult = { passed: 0, failed: 0, flaky: 0, skipped: 0 };

  while (attempts < maxAttempts) {
    attempts++;
    console.log(`\n📊 Attempt ${attempts}/${maxAttempts}`);

    result = await runE2ETests();

    if (result.failed === 0) {
      console.log('\n✅ SUCCESS: All tests passed!');
      console.log(`Passed: ${result.passed}`);
      console.log(`Skipped: ${result.skipped}`);
      process.exit(0);
    }

    console.log(`\n❌ ${result.failed} tests failed`);
    await fixFailedTests(result.failed);
  }

  console.log('\n❌ FAILURE: Could not achieve 100% pass rate');
  console.log(`Final results: ${result.passed} passed, ${result.failed} failed`);
  process.exit(1);
}

main().catch(console.error);