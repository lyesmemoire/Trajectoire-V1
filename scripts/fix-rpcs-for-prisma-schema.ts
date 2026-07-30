import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('=== Fixing RPCs to use "User" table instead of profiles ===\n');

  // 1. Add credits column to User table
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE public."User" ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 100 NOT NULL;
    `);
    console.log('✓ Added credits column to User (default 100)');
  } catch (e: any) {
    console.log('⚠ credits column:', e.message.substring(0, 100));
  }

  // 2. Recreate add_credits_atomic using "User" table
  try {
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION public.add_credits_atomic(
        uid TEXT,
        amt INTEGER,
        p_idemp_key TEXT DEFAULT NULL,
        p_action TEXT DEFAULT 'add_credits'
      )
      RETURNS INTEGER
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      DECLARE
        v_new_credits INTEGER;
      BEGIN
        IF amt <= 0 THEN
          RAISE EXCEPTION 'Addition amount must be positive, got %', amt;
        END IF;

        IF p_idemp_key IS NOT NULL THEN
          BEGIN
            INSERT INTO public.credit_transactions (idempotency_key, user_id, amount, action, state)
            VALUES (p_idemp_key, uid::UUID, amt, p_action, 'committed');
          EXCEPTION WHEN unique_violation THEN
            SELECT credits INTO v_new_credits FROM public."User" WHERE id = uid;
            RETURN v_new_credits;
          END;
        END IF;

        UPDATE public."User"
        SET credits = credits + amt, "updatedAt" = NOW()
        WHERE id = uid
        RETURNING credits INTO v_new_credits;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'User % not found', uid;
        END IF;

        RETURN v_new_credits;
      END;
      $$;
    `);
    console.log('✓ Recreated add_credits_atomic');
  } catch (e: any) {
    console.log('✗ add_credits_atomic:', e.message.substring(0, 120));
  }

  // 3. Recreate reserve_credits_atomic
  try {
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION public.reserve_credits_atomic(
        p_user_id TEXT,
        p_amount INTEGER,
        p_action TEXT,
        p_idemp_key TEXT
      )
      RETURNS UUID
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      DECLARE
        v_current_credits INTEGER;
        v_tx_id UUID;
      BEGIN
        SELECT credits INTO v_current_credits
        FROM public."User"
        WHERE id = p_user_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'User % not found', p_user_id;
        END IF;

        IF v_current_credits < p_amount THEN
          RAISE EXCEPTION 'Insufficient credits: has %, needs %', v_current_credits, p_amount;
        END IF;

        INSERT INTO public.credit_transactions (idempotency_key, user_id, amount, action, state)
        VALUES (p_idemp_key, p_user_id::UUID, p_amount, p_action, 'reserved')
        RETURNING id INTO v_tx_id;

        UPDATE public."User"
        SET credits = credits - p_amount, "updatedAt" = NOW()
        WHERE id = p_user_id;

        RETURN v_tx_id;
      END;
      $$;
    `);
    console.log('✓ Recreated reserve_credits_atomic');
  } catch (e: any) {
    console.log('✗ reserve_credits_atomic:', e.message.substring(0, 120));
  }

  // 4. Recreate commit_credits_atomic (with state guard)
  try {
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION public.commit_credits_atomic(
        p_tx_id UUID,
        p_tokens INTEGER DEFAULT 0
      )
      RETURNS VOID
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      DECLARE
        v_tx RECORD;
      BEGIN
        SELECT * INTO v_tx FROM public.credit_transactions WHERE id = p_tx_id FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'Transaction % not found', p_tx_id;
        END IF;

        IF v_tx.state != 'reserved' THEN
          RAISE EXCEPTION 'Transaction % is not in reserved state (current: %)', p_tx_id, v_tx.state;
        END IF;

        UPDATE public.credit_transactions
        SET state = 'committed', tokens_used = p_tokens, updated_at = NOW()
        WHERE id = p_tx_id;
      END;
      $$;
    `);
    console.log('✓ Recreated commit_credits_atomic');
  } catch (e: any) {
    console.log('✗ commit_credits_atomic:', e.message.substring(0, 120));
  }

  // 5. Recreate rollback_credits_atomic
  try {
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION public.rollback_credits_atomic(
        p_tx_id UUID,
        p_reason TEXT
      )
      RETURNS VOID
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      DECLARE
        v_tx RECORD;
      BEGIN
        SELECT * INTO v_tx FROM public.credit_transactions WHERE id = p_tx_id FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'Transaction % not found', p_tx_id;
        END IF;

        IF v_tx.state != 'reserved' THEN
          RAISE EXCEPTION 'Cannot rollback transaction % (state: %)', p_tx_id, v_tx.state;
        END IF;

        UPDATE public.credit_transactions
        SET state = 'failed', updated_at = NOW()
        WHERE id = p_tx_id;

        UPDATE public."User"
        SET credits = credits + v_tx.amount, "updatedAt" = NOW()
        WHERE id = v_tx.user_id::TEXT;
      END;
      $$;
    `);
    console.log('✓ Recreated rollback_credits_atomic');
  } catch (e: any) {
    console.log('✗ rollback_credits_atomic:', e.message.substring(0, 120));
  }

  // 6. Recreate cleanup_expired_transactions
  try {
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION public.cleanup_expired_transactions(
        p_minutes_old INTEGER DEFAULT 5
      )
      RETURNS INTEGER
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      DECLARE
        v_record RECORD;
        v_count INTEGER := 0;
      BEGIN
        FOR v_record IN
          SELECT id FROM public.credit_transactions
          WHERE state = 'reserved'
            AND created_at < NOW() - (p_minutes_old || ' minutes')::interval
        LOOP
          BEGIN
            PERFORM public.rollback_credits_atomic(v_record.id, 'expired_timeout');
            UPDATE public.credit_transactions SET state = 'expired' WHERE id = v_record.id;
            v_count := v_count + 1;
          EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Failed to cleanup transaction %: %', v_record.id, SQLERRM;
          END;
        END LOOP;
        RETURN v_count;
      END;
      $$;
    `);
    console.log('✓ Recreated cleanup_expired_transactions');
  } catch (e: any) {
    console.log('✗ cleanup_expired_transactions:', e.message.substring(0, 120));
  }

  console.log('\n=== Fix complete ===');
}

main().finally(() => prisma.$disconnect());
