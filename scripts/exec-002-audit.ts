/**
 * EXEC-002 PHASE 14: ANTI-FALSE-POSITIVE AUDIT
 * 
 * This script scans and classifies all tests (REAL, PARTIAL, FALSE_POSITIVE, BROKEN, BLOCKED).
 */

import * as fs from 'fs';
import { resolve } from 'path';

interface TestAudit {
  script: string;
  phase: string;
  classification: 'REAL' | 'PARTIAL' | 'FALSE_POSITIVE' | 'BROKEN' | 'BLOCKED';
  reasons: string[];
  score: number;
}

const auditResults: TestAudit[] = [];

const scriptsDir = resolve(process.cwd(), 'scripts');
const exec002Scripts = fs.readdirSync(scriptsDir)
  .filter((file: string) => file.startsWith('exec-002-') && file.endsWith('.ts') && file !== 'exec-002-audit.ts')
  .sort();

console.log('=== EXEC-002 PHASE 14: ANTI-FALSE-POSITIVE AUDIT ===\n');

for (const script of exec002Scripts) {
  const scriptPath = resolve(scriptsDir, script);
  const content = fs.readFileSync(scriptPath, 'utf-8');
  
  const audit = classifyScript(script, content);
  auditResults.push(audit);
  
  console.log(`\n${script}`);
  console.log(`  Phase: ${audit.phase}`);
  console.log(`  Classification: ${audit.classification}`);
  console.log(`  Score: ${audit.score}/100`);
  console.log(`  Reasons: ${audit.reasons.join(', ')}`);
}

function classifyScript(script: string, content: string): TestAudit {
  const phase = extractPhase(script);
  let reasons: string[] = [];
  let score = 100;
  let classification: 'REAL' | 'PARTIAL' | 'FALSE_POSITIVE' | 'BROKEN' | 'BLOCKED' = 'REAL';
  
  // Check for forbidden patterns
  const forbiddenPatterns = [
    { pattern: /test\.skip\(/, reason: 'Uses test.skip()', penalty: 100 },
    { pattern: /expect\(response\.ok\(\)\)\.toBeTruthy\(\)/, reason: 'Uses HTTP 200 check without business validation', penalty: 50 },
    { pattern: /mock\(/, reason: 'Uses mocks', penalty: 100 },
    { pattern: /stub\(/, reason: 'Uses stubs', penalty: 100 },
    { pattern: /fixture/, reason: 'Uses fixtures', penalty: 100 },
    { pattern: /simulated.*response/i, reason: 'Uses simulated responses', penalty: 100 },
    { pattern: /dummy.*key/i, reason: 'Uses dummy keys without real service', penalty: 30 },
    { pattern: /BLOCKED.*OpenAI/i, reason: 'Marked as BLOCKED (OpenAI)', penalty: 100 }
  ];
  
  for (const { pattern, reason, penalty } of forbiddenPatterns) {
    if (pattern.test(content)) {
      reasons.push(reason);
      score -= penalty;
    }
  }
  
  // Check for required patterns (REAL tests)
  const requiredPatterns = [
    { pattern: /prisma\.(user|cVAnalysis|subscription|previewAnalysis)\.(create|findUnique|findMany)/, reason: 'Uses real database operations', bonus: 20 },
    { pattern: /supabase\.auth\.(admin|signIn)/, reason: 'Uses real Supabase Auth', bonus: 20 },
    { pattern: /stripe\.(customers|subscriptions)/, reason: 'Uses real Stripe operations', bonus: 15 },
    { pattern: /await.*delete.*cleanup/i, reason: 'Has cleanup logic', bonus: 10 },
    { pattern: /verify.*persistence/i, reason: 'Verifies persistence', bonus: 15 },
    { pattern: /evidence\./, reason: 'Collects evidence', bonus: 10 },
    { pattern: /console\.log.*✓/, reason: 'Has verification logs', bonus: 5 }
  ];
  
  for (const { pattern, reason, bonus } of requiredPatterns) {
    if (pattern.test(content)) {
      // Don't add to reasons for positive patterns
      score = Math.min(score + bonus, 100);
    }
  }
  
  // Check for database verification
  if (!/prisma\./.test(content)) {
    reasons.push('No database operations');
    score -= 50;
  }
  
  // Check for cleanup
  if (!/cleanup/i.test(content)) {
    reasons.push('No cleanup logic');
    score -= 20;
  }
  
  // Determine classification
  if (score >= 80) {
    classification = 'REAL';
  } else if (score >= 50) {
    classification = 'PARTIAL';
    reasons.push('Partial implementation');
  } else if (score >= 20) {
    classification = 'FALSE_POSITIVE';
    reasons.push('False positive risk');
  } else if (reasons.includes('Marked as BLOCKED')) {
    classification = 'BLOCKED';
  } else {
    classification = 'BROKEN';
    reasons.push('Test is broken');
  }
  
  // Special handling for COPILOT (Phase 6)
  if (phase === '6' && /BLOCKED.*OpenAI/i.test(content)) {
    classification = 'BLOCKED';
    score = 0;
    reasons = ['OpenAI not configured - BLOCKED'];
  }
  
  return {
    script,
    phase,
    classification,
    reasons,
    score
  };
}

function extractPhase(script: string): string {
  const match = script.match(/exec-002-(\w+)/);
  return match ? match[1] : 'unknown';
}

// Generate summary
console.log('\n=== AUDIT SUMMARY ===\n');

const summary = {
  REAL: 0,
  PARTIAL: 0,
  FALSE_POSITIVE: 0,
  BROKEN: 0,
  BLOCKED: 0
};

for (const audit of auditResults) {
  summary[audit.classification]++;
}

console.log(`REAL: ${summary.REAL}`);
console.log(`PARTIAL: ${summary.PARTIAL}`);
console.log(`FALSE_POSITIVE: ${summary.FALSE_POSITIVE}`);
console.log(`BROKEN: ${summary.BROKEN}`);
console.log(`BLOCKED: ${summary.BLOCKED}`);

const totalTests = auditResults.length;
const realPercentage = ((summary.REAL / totalTests) * 100).toFixed(1);
const blockedPercentage = ((summary.BLOCKED / totalTests) * 100).toFixed(1);

console.log(`\nTotal Tests: ${totalTests}`);
console.log(`REAL Percentage: ${realPercentage}%`);
console.log(`BLOCKED Percentage: ${blockedPercentage}%`);

// Write audit results to file
const auditOutput = {
  timestamp: new Date().toISOString(),
  summary,
  details: auditResults,
  metrics: {
    total: totalTests,
    realPercentage,
    blockedPercentage,
    zeroFalsePositive: summary.FALSE_POSITIVE === 0 && summary.BROKEN === 0
  }
};

console.log('\n=== AUDIT COMPLETE ===');
console.log(JSON.stringify(auditOutput, null, 2));
