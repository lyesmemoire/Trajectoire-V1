/**
 * SECURITY-GATE-005: Precheck Snapshot (READ-ONLY)
 * Capture system state before security testing
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env
config();

async function precheckSnapshot() {
  console.log('=== SECURITY-GATE-005 PRECHECK SNAPSHOT ===\n');
  
  const snapshot: any = {
    timestamp: new Date().toISOString(),
    phase: 'SECURITY-GATE-005_PRECHECK',
    mode: 'READ-ONLY'
  };
  
  try {
    // Git status
    console.log('=== GIT STATUS ===');
    try {
      const gitStatus = execSync('git status --short', { encoding: 'utf-8', cwd: process.cwd() });
      snapshot.git_status = gitStatus.trim() || 'CLEAN';
      console.log('Git status:', snapshot.git_status);
    } catch (error) {
      snapshot.git_status = 'ERROR: Not a git repository or git not available';
      console.log(snapshot.git_status);
    }
    
    // Git branch
    console.log('\n=== GIT BRANCH ===');
    try {
      const gitBranch = execSync('git branch --show-current', { encoding: 'utf-8', cwd: process.cwd() });
      snapshot.git_branch = gitBranch.trim();
      console.log('Git branch:', snapshot.git_branch);
    } catch (error) {
      snapshot.git_branch = 'ERROR: Not available';
      console.log(snapshot.git_branch);
    }
    
    // Git commit SHA
    console.log('\n=== GIT COMMIT SHA ===');
    try {
      const gitSha = execSync('git rev-parse HEAD', { encoding: 'utf-8', cwd: process.cwd() });
      snapshot.git_commit_sha = gitSha.trim();
      console.log('Git commit SHA:', snapshot.git_commit_sha);
    } catch (error) {
      snapshot.git_commit_sha = 'ERROR: Not available';
      console.log(snapshot.git_commit_sha);
    }
    
    // Node version
    console.log('\n=== NODE VERSION ===');
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf-8' });
      snapshot.node_version = nodeVersion.trim();
      console.log('Node version:', snapshot.node_version);
    } catch (error) {
      snapshot.node_version = 'ERROR: Not available';
      console.log(snapshot.node_version);
    }
    
    // pnpm version
    console.log('\n=== PNPM VERSION ===');
    try {
      const pnpmVersion = execSync('pnpm --version', { encoding: 'utf-8' });
      snapshot.pnpm_version = pnpmVersion.trim();
      console.log('pnpm version:', snapshot.pnpmVersion);
    } catch (error) {
      snapshot.pnpm_version = 'ERROR: Not available';
      console.log(snapshot.pnpm_version);
    }
    
    // Prisma version
    console.log('\n=== PRISMA VERSION ===');
    try {
      const prismaVersion = execSync('pnpm exec prisma --version', { encoding: 'utf-8', cwd: process.cwd() });
      snapshot.prisma_version = prismaVersion.trim();
      console.log('Prisma version:', snapshot.prisma_version);
    } catch (error) {
      snapshot.prisma_version = 'ERROR: Not available';
      console.log(snapshot.prisma_version);
    }
    
    // Environment variables (masked)
    console.log('\n=== ENVIRONMENT VARIABLES (MASKED) ===');
    const databaseUrl = process.env.DATABASE_URL;
    const directUrl = process.env.DIRECT_URL;
    
    if (databaseUrl) {
      const dbHost = databaseUrl.match(/@([^:]+):/)?.[1];
      snapshot.database_url_host = dbHost || 'not parsed';
      console.log('DATABASE_URL host:', snapshot.database_url_host);
    } else {
      snapshot.database_url_host = 'NOT_SET';
      console.log('DATABASE_URL: NOT_SET');
    }
    
    if (directUrl) {
      const directHost = directUrl.match(/@([^:]+):/)?.[1];
      snapshot.direct_url_host = directHost || 'not parsed';
      console.log('DIRECT_URL host:', snapshot.direct_url_host);
    } else {
      snapshot.direct_url_host = 'NOT_SET';
      console.log('DIRECT_URL: NOT_SET');
    }
    
    // API URL
    snapshot.api_url = process.env.API_URL || 'http://localhost:3000';
    console.log('API URL:', snapshot.api_url);
    
    // Web URL
    snapshot.web_url = process.env.WEB_URL || 'http://localhost:3001';
    console.log('Web URL:', snapshot.web_url);
    
    // Supabase variables presence (without secrets)
    console.log('\n=== SUPABASE VARIABLES PRESENCE ===');
    snapshot.supabase_variables = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    };
    console.log('Supabase variables presence:', snapshot.supabase_variables);
    
    // Prisma Client presence
    console.log('\n=== PRISMA CLIENT PRESENCE ===');
    try {
      const prismaClientPath = join(process.cwd(), 'node_modules', '.prisma', 'client');
      const fs = await import('fs');
      snapshot.prisma_client_exists = fs.existsSync(prismaClientPath);
      console.log('Prisma client exists:', snapshot.prisma_client_exists);
    } catch (error) {
      snapshot.prisma_client_exists = false;
      console.log('Prisma client exists: ERROR');
    }
    
    // API build state
    console.log('\n=== API BUILD STATE ===');
    try {
      const apiDistPath = join(process.cwd(), 'apps', 'api', 'dist');
      const fs = await import('fs');
      snapshot.api_build_exists = fs.existsSync(apiDistPath);
      console.log('API build exists:', snapshot.api_build_exists);
    } catch (error) {
      snapshot.api_build_exists = false;
      console.log('API build exists: ERROR');
    }
    
    // Web build state
    console.log('\n=== WEB BUILD STATE ===');
    try {
      const webDistPath = join(process.cwd(), 'apps', 'web', '.next');
      const fs = await import('fs');
      snapshot.web_build_exists = fs.existsSync(webDistPath);
      console.log('Web build exists:', snapshot.web_build_exists);
    } catch (error) {
      snapshot.web_build_exists = false;
      console.log('Web build exists: ERROR');
    }
    
    // Save snapshot
    const fs = await import('fs');
    const snapshotPath = join(process.cwd(), 'SECURITY-GATE-005-PRECHECK.json');
    fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
    
    console.log('\n✅ Snapshot saved to:', snapshotPath);
    console.log('\n=== PRECHECK COMPLETE ===');
    
    return snapshot;
    
  } catch (error) {
    console.error('Error during precheck:', error);
    throw error;
  }
}

precheckSnapshot();
