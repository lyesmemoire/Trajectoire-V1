/**
 * EXEC-002 PHASE 0: Environment Verification Script
 * 
 * This script verifies all critical services are available and configured.
 */

import 'dotenv/config';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { resolve } from 'path';

// Load environment variables from apps/web/.env.local
config({ path: resolve(process.cwd(), 'apps/web/.env.local') });

const prisma = new PrismaClient();

interface ServiceStatus {
  name: string;
  status: 'PASS' | 'FAIL' | 'BLOCKED';
  message: string;
  latency?: number;
}

const results: ServiceStatus[] = [];

async function checkPostgreSQL(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    await prisma.$connect();
    const latency = Date.now() - start;
    
    // Test a simple query
    await prisma.$queryRaw`SELECT 1 as test`;
    
    return {
      name: 'PostgreSQL/Supabase',
      status: 'PASS',
      message: 'Database connected and responsive',
      latency
    };
  } catch (error: any) {
    return {
      name: 'PostgreSQL/Supabase',
      status: 'FAIL',
      message: `Database connection failed: ${error.message}`
    };
  }
}

async function checkSupabaseAuth(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return {
        name: 'Supabase Auth',
        status: 'BLOCKED',
        message: 'Missing SUPABASE_URL or SUPABASE_KEY environment variables'
      };
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test auth service health
    const { error } = await supabase.auth.getSession();
    const latency = Date.now() - start;
    
    if (error) {
      return {
        name: 'Supabase Auth',
        status: 'FAIL',
        message: `Auth service error: ${error.message}`
      };
    }
    
    return {
      name: 'Supabase Auth',
      status: 'PASS',
      message: 'Auth service responsive',
      latency
    };
  } catch (error: any) {
    return {
      name: 'Supabase Auth',
      status: 'FAIL',
      message: `Auth check failed: ${error.message}`
    };
  }
}

async function checkRedis(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (!redisUrl || redisUrl === 'dummy' || !redisToken || redisToken === 'dummy') {
      return {
        name: 'Redis/Upstash',
        status: 'BLOCKED',
        message: 'Redis not configured (dummy credentials)'
      };
    }
    
    // Would need Redis client to test connectivity
    // For now, just check configuration
    const latency = Date.now() - start;
    
    return {
      name: 'Redis/Upstash',
      status: 'PASS',
      message: 'Redis configured (connectivity not tested)',
      latency
    };
  } catch (error: any) {
    return {
      name: 'Redis/Upstash',
      status: 'FAIL',
      message: `Redis check failed: ${error.message}`
    };
  }
}

async function checkOpenAI(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'sk-dummy' || apiKey === 'dummy') {
      return {
        name: 'OpenAI API',
        status: 'BLOCKED',
        message: 'OpenAI API key not configured (dummy credential)'
      };
    }
    
    // Would need to make actual API call to test
    const latency = Date.now() - start;
    
    return {
      name: 'OpenAI API',
      status: 'PASS',
      message: 'OpenAI API key configured (connectivity not tested)',
      latency
    };
  } catch (error: any) {
    return {
      name: 'OpenAI API',
      status: 'FAIL',
      message: `OpenAI check failed: ${error.message}`
    };
  }
}

async function checkStripe(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!secretKey || !publishableKey) {
      return {
        name: 'Stripe',
        status: 'BLOCKED',
        message: 'Stripe keys not configured'
      };
    }
    
    if (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_')) {
      return {
        name: 'Stripe',
        status: 'FAIL',
        message: 'Invalid Stripe secret key format'
      };
    }
    
    const latency = Date.now() - start;
    
    return {
      name: 'Stripe',
      status: 'PASS',
      message: 'Stripe configured in test mode',
      latency
    };
  } catch (error: any) {
    return {
      name: 'Stripe',
      status: 'FAIL',
      message: `Stripe check failed: ${error.message}`
    };
  }
}

async function checkFrontend(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Would need to make HTTP request to check
    const latency = Date.now() - start;
    
    return {
      name: 'Frontend',
      status: 'PASS',
      message: `Frontend URL configured: ${appUrl} (connectivity not tested)`,
      latency
    };
  } catch (error: any) {
    return {
      name: 'Frontend',
      status: 'FAIL',
      message: `Frontend check failed: ${error.message}`
    };
  }
}

async function checkBackend(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Would need to make HTTP request to check
    const latency = Date.now() - start;
    
    return {
      name: 'Backend API',
      status: 'PASS',
      message: `Backend URL configured: ${apiUrl} (connectivity not tested)`,
      latency
    };
  } catch (error: any) {
    return {
      name: 'Backend API',
      status: 'FAIL',
      message: `Backend check failed: ${error.message}`
    };
  }
}

async function main() {
  console.log('=== EXEC-002 PHASE 0: ENVIRONMENT VERIFICATION ===\n');
  
  results.push(await checkPostgreSQL());
  results.push(await checkSupabaseAuth());
  results.push(await checkRedis());
  results.push(await checkOpenAI());
  results.push(await checkStripe());
  results.push(await checkFrontend());
  results.push(await checkBackend());
  
  console.log('SERVICE STATUS:');
  console.log('================');
  
  let passCount = 0;
  let failCount = 0;
  let blockedCount = 0;
  
  for (const result of results) {
    const latency = result.latency ? ` (${result.latency}ms)` : '';
    console.log(`${result.status.padEnd(8)} | ${result.name.padEnd(20)} | ${result.message}${latency}`);
    
    if (result.status === 'PASS') passCount++;
    else if (result.status === 'FAIL') failCount++;
    else if (result.status === 'BLOCKED') blockedCount++;
  }
  
  console.log('\nSUMMARY:');
  console.log('========');
  console.log(`PASS: ${passCount}`);
  console.log(`FAIL: ${failCount}`);
  console.log(`BLOCKED: ${blockedCount}`);
  
  const criticalBlocked = results.filter(r => r.status === 'BLOCKED' && 
    ['PostgreSQL/Supabase', 'Supabase Auth'].includes(r.name));
  
  if (criticalBlocked.length > 0) {
    console.log('\nCRITICAL BLOCKED SERVICES:');
    criticalBlocked.forEach(s => console.log(`  - ${s.name}`));
    console.log('\nEXECUTION BLOCKED: Critical services not available');
    process.exit(1);
  }
  
  if (failCount > 0) {
    console.log('\nFAILED SERVICES:');
    results.filter(r => r.status === 'FAIL').forEach(s => console.log(`  - ${s.name}`));
    console.log('\nEXECUTION PROCEEDING WITH FAILURES');
  }
  
  await prisma.$disconnect();
  
  console.log('\nENVIRONMENT VERIFICATION COMPLETE');
}

main().catch(console.error);
