#!/usr/bin/env ts-node
/**
 * CODEMOD: Fix NextRequest → NextRequest
 * 
 * This codemod replaces all occurrences of NextRequest with NextRequest
 * and ensures NextRequest is imported from 'next/server'
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
    
    // Count occurrences of NextRequest
    const nextRequestRegex = /NextRequest/g;
    const matches = content.match(nextRequestRegex);
    result.occurrences = matches ? matches.length : 0;
    
    if (result.occurrences === 0) {
      return result;
    }
    
    // Replace NextRequest with NextRequest
    content = content.replace(/NextRequest/g, 'NextRequest');
    
    // Check if NextRequest is imported, if not add it
    const hasNextRequestImport = /import.*NextRequest.*from.*['"]next\/server['"]/.test(content);
    const hasNextResponseImport = /import.*NextResponse.*from.*['"]next\/server['"]/.test(content);
    
    if (!hasNextRequestImport && hasNextResponseImport) {
      // Add NextRequest to existing import
      content = content.replace(
        /import\s+{([^}]*NextResponse[^}]*)}\s+from\s+['"]next\/server['"]/,
        (match, imports) => {
          const importsList = imports.split(',').map(i => i.trim());
          if (!importsList.includes('NextRequest')) {
            importsList.push('NextRequest');
          }
          return `import { ${importsList.join(', ')} } from 'next/server'`;
        }
      );
    } else if (!hasNextRequestImport) {
      // Add new import statement
      content = `import { NextRequest } from 'next/server';\n` + content;
    }
    
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
  
  console.log('🔍 Scanning for NextRequest occurrences...');
  
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
  console.log(`   Files with NextRequest: ${results.length}`);
  console.log(`   Total occurrences: ${totalOccurrences}`);
  console.log(`   Files fixed: ${totalFixed}`);
  
  // Save results to file
  const reportPath = 'C:/Temp/codemod-nextrequest-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Report saved to: ${reportPath}`);
}

main();
