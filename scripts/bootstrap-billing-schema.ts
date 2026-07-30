import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Bootstrapping billing schema on remote Supabase ===\n');

  // 1. Create the tx_state enum if it doesn't exist
  try {
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE public.tx_state AS ENUM ('reserved', 'committed', 'failed', 'expired');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✓ tx_state enum');
  } catch (e: any) {
    console.log('⚠ tx_state:', e.message.substring(0, 80));
  }

  // 2. Create credit_transactions table
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS public.credit_transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        idempotency_key TEXT UNIQUE NOT NULL,
        user_id UUID NOT NULL,
        amount INTEGER NOT NULL,
        action TEXT NOT NULL,
        state tx_state DEFAULT 'reserved' NOT NULL,
        tokens_used INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✓ credit_transactions table');
  } catch (e: any) {
    console.log('⚠ credit_transactions:', e.message.substring(0, 80));
  }

  // 3. Create credit_usage table if missing
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS public.credit_usage (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        action TEXT,
        reason TEXT,
        amount INTEGER DEFAULT 0,
        credits_spent INTEGER DEFAULT 0,
        tokens INTEGER DEFAULT 0,
        tokens_used INTEGER DEFAULT 0,
        cost DECIMAL DEFAULT 0,
        estimated_cost_eur DECIMAL DEFAULT 0,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✓ credit_usage table');
  } catch (e: any) {
    console.log('⚠ credit_usage:', e.message.substring(0, 80));
  }

  // 4. Create stripe_events table if missing
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS public.stripe_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id TEXT UNIQUE NOT NULL,
        user_id UUID NOT NULL,
        credits_added INTEGER DEFAULT 0,
        processed_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✓ stripe_events table');
  } catch (e: any) {
    console.log('⚠ stripe_events:', e.message.substring(0, 80));
  }

  // 5. Apply the billing RPCs from consolidated-migration.sql (sections 5.4 to 5.9)
  const sqlFile = fs.readFileSync(
    path.join(process.cwd(), 'supabase/consolidated-migration.sql'),
    'utf-8'
  );

  // Extract functions 5.4 through 5.9 (lines 380-637 approximately)
  const functionNames = [
    'reserve_credits_atomic',
    'commit_credits_atomic',
    'rollback_credits_atomic',
    'cleanup_expired_transactions',
  ];

  // Apply the billing_fixes migration (overrides add_credits_atomic and commit_credits_atomic)
  const fixesSql = fs.readFileSync(
    path.join(process.cwd(), 'supabase/migrations/20260730000002_billing_fixes.sql'),
    'utf-8'
  );

  // Split by CREATE OR REPLACE FUNCTION and DO blocks
  const blocks = fixesSql.split(/(?=(?:CREATE OR REPLACE FUNCTION|DO \$\$))/gi).filter(b => b.trim());

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    const label = trimmed.substring(0, 60).replace(/\n/g, ' ');
    try {
      await prisma.$executeRawUnsafe(trimmed);
      console.log(`✓ Applied: ${label}...`);
    } catch (e: any) {
      console.log(`⚠ Failed (${label}...): ${e.message.substring(0, 100)}`);
    }
  }

  // Now apply the original RPCs from consolidated-migration that we didn't override
  // Extract each function block
  const funcRegex = /CREATE OR REPLACE FUNCTION public\.(reserve_credits_atomic|rollback_credits_atomic|cleanup_expired_transactions)\b[\s\S]*?\$\$;/g;
  let match;
  while ((match = funcRegex.exec(sqlFile)) !== null) {
    const funcName = match[1];
    const funcBody = match[0];
    try {
      await prisma.$executeRawUnsafe(funcBody);
      console.log(`✓ Applied: ${funcName}`);
    } catch (e: any) {
      console.log(`⚠ Failed ${funcName}: ${e.message.substring(0, 100)}`);
    }
  }

  // 6. Create indexes
  try {
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_state 
      ON public.credit_transactions (user_id, state);
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_credit_transactions_created 
      ON public.credit_transactions (created_at) WHERE state = 'reserved';
    `);
    console.log('✓ Indexes created');
  } catch (e: any) {
    console.log('⚠ Indexes:', e.message.substring(0, 80));
  }

  console.log('\n=== Bootstrap complete ===');
}

main().finally(() => prisma.$disconnect());
