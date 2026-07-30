/**
 * Documentation Examples Validator
 * Validates that all CLI documentation examples actually work
 */

import { execa } from 'execa';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

interface ExampleValidation {
  command: string;
  description: string;
  exitCode: number;
  duration: number;
  stdout: string;
  stderr: string;
  success: boolean;
  timestamp: string;
}

const examples = [
  {
    command: 'npx tsx bin/blueprint --help',
    description: 'Display help information',
  },
  {
    command: 'npx tsx bin/blueprint --version',
    description: 'Display version information',
  },
  {
    command: 'npx tsx bin/blueprint doctor',
    description: 'Check system health',
  },
  {
    command: 'npx tsx bin/blueprint doctor --json',
    description: 'Check system health with JSON output',
  },
];

async function validateExample(example: { command: string; description: string }): Promise<ExampleValidation> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  try {
    const result = await execa('npx', example.command.split(' ').slice(1), {
      cwd: process.cwd(),
      reject: false,
      timeout: 30000,
    });
    
    const duration = Date.now() - startTime;
    
    return {
      command: example.command,
      description: example.description,
      exitCode: result.exitCode || 0,
      duration,
      stdout: result.stdout,
      stderr: result.stderr,
      success: result.exitCode === 0,
      timestamp,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    
    return {
      command: example.command,
      description: example.description,
      exitCode: 1,
      duration,
      stdout: '',
      stderr: error instanceof Error ? error.message : 'Unknown error',
      success: false,
      timestamp,
    };
  }
}

async function main() {
  const validationDir = path.join(process.cwd(), 'reports', 'cli', 'documentation');
  await fs.mkdir(validationDir, { recursive: true });
  
  console.log('=== Validating Documentation Examples ===\n');
  
  const results: ExampleValidation[] = [];
  
  for (const example of examples) {
    console.log(`Validating: ${example.description}`);
    console.log(`  Command: ${example.command}`);
    
    const result = await validateExample(example);
    results.push(result);
    
    console.log(`  Exit Code: ${result.exitCode}`);
    console.log(`  Duration: ${result.duration}ms`);
    console.log(`  Status: ${result.success ? '✓ PASS' : '✗ FAIL'}\n`);
  }
  
  // Generate validation report
  const report = {
    timestamp: new Date().toISOString(),
    environment: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
    },
    examples: results,
    summary: {
      total: results.length,
      passed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      passRate: ((results.filter(r => r.success).length / results.length) * 100).toFixed(2) + '%',
    },
  };
  
  const reportPath = path.join(validationDir, 'validated-examples.md');
  
  let markdown = `# Documentation Examples Validation Report\n\n`;
  markdown += `**Generated:** ${report.timestamp}\n`;
  markdown += `**Platform:** ${report.environment.platform} ${report.environment.arch}\n`;
  markdown += `**Node Version:** ${report.environment.nodeVersion}\n\n`;
  markdown += `## Summary\n\n`;
  markdown += `- **Total Examples:** ${report.summary.total}\n`;
  markdown += `- **Passed:** ${report.summary.passed}\n`;
  markdown += `- **Failed:** ${report.summary.failed}\n`;
  markdown += `- **Pass Rate:** ${report.summary.passRate}\n\n`;
  markdown += `## Results\n\n`;
  
  for (const result of results) {
    markdown += `### ${result.description}\n\n`;
    markdown += `**Command:** \`${result.command}\`\n\n`;
    markdown += `**Exit Code:** ${result.exitCode}\n`;
    markdown += `**Duration:** ${result.duration}ms\n`;
    markdown += `**Status:** ${result.success ? '✓ PASS' : '✗ FAIL'}\n\n`;
    
    if (result.stdout) {
      markdown += `**Stdout:**\n\`\`\`\n${result.stdout.substring(0, 500)}${result.stdout.length > 500 ? '...' : ''}\n\`\`\`\n\n`;
    }
    
    if (result.stderr) {
      markdown += `**Stderr:**\n\`\`\`\n${result.stderr.substring(0, 500)}${result.stderr.length > 500 ? '...' : ''}\n\`\`\`\n\n`;
    }
    
    markdown += `---\n\n`;
  }
  
  await fs.writeFile(reportPath, markdown);
  
  // Also save JSON version
  const jsonReportPath = path.join(validationDir, 'validated-examples.json');
  await fs.writeFile(jsonReportPath, JSON.stringify(report, null, 2));
  
  console.log('=== Validation Complete ===');
  console.log(`Report saved to: ${reportPath}`);
  console.log(`Pass Rate: ${report.summary.passRate}`);
}

main().catch(console.error);
