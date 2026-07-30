#!/usr/bin/env ts-node
/**
 * CODEMOD: Fix Stripe API version
 * 
 * This codemod replaces incorrect Stripe API version declarations
 * with the correct type-safe approach
 */

import * as fs from 'fs';
import * as path from 'path';

interface FileResult {
  file: string;
  occurrences: number;
  fixed: boolean;
}

const results: FileResult[] = [];

function processFile(filePath: string): FileResult {
  const result: FileResult = { file: filePath, occurrences: 0, fixed: false };
  
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Count occurrences of incorrect Stripe API version patterns
    const patterns = [
      /apiVersion:\s*"[^"]*"\s+as\s+unknown/g,
      /apiVersion:\s*"2025-05-28\.basil"/g,
      /apiVersion:\s*"2024-[^"]*"/g,
    ];
    
    let totalMatches = 0;
    for (const pattern of patterns) {
      const matches = content.match(pattern);
      totalMatches += matches ? matches.length : 0;
    }
    
    result.occurrences = totalMatches;
    
    if (result.occurrences === 0) {
      return result;
    }
    
    // Replace incorrect patterns with correct type-safe version
    content = content.replace(
      /apiVersion:\s*"[^"]*"\s+as\s+unknown/g,
      'apiVersion: "2025-08-27.basil" as Stripe.LatestApiVersion'
    );
    
    content = content.replace(
      /apiVersion:\s*"2025-05-28\.basil"/g,
      'apiVersion: "2025-08-27.basil" as Stripe.LatestApiVersion'
    );
    
    content = content.replace(
      /apiVersion:\s*"2024-[^"]*"/g,
      'apiVersion: "2025-08-27.basil" as Stripe.LatestApiVersion'
    );
    
    fs.writeFileSync(filePath, content, 'utf-8');
    result.fixed = true;
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
  
  return result;
}

function walkDirectory(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .next, dist, build
      if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(item)) {
        files.push(...walkDirectory(fullPath, extensions));
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (extensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

function main() {
  const rootDir = process.cwd();
  const extensions = ['.ts', '.tsx', '.js', '.jsx'];
  
  console.log('🔍 Scanning for Stripe API version issues...');
  
  const files = walkDirectory(rootDir, extensions);
  console.log(`📁 Found ${files.length} TypeScript/JavaScript files`);
  
  for (const file of files) {
    const result = processFile(file);
    if (result.occurrences > 0) {
      results.push(result);
      console.log(`✓ ${file}: ${result.occurrences} occurrences fixed`);
    }
  }
  
  const totalOccurrences = results.reduce((sum, r) => sum + r.occurrences, 0);
  const totalFixed = results.filter(r => r.fixed).length;
  
  console.log('\n📊 SUMMARY:');
  console.log(`   Total files processed: ${files.length}`);
  console.log(`   Files with Stripe API version issues: ${results.length}`);
  console.log(`   Total occurrences: ${totalOccurrences}`);
  console.log(`   Files fixed: ${totalFixed}`);
  
  // Save results to file
  const reportPath = 'C:/Temp/codemod-stripe-api-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Report saved to: ${reportPath}`);
}

main();
