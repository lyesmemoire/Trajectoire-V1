import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('=== Fixing credit_transactions.user_id to TEXT ===\n');

  // Change user_id from UUID to TEXT to match User.id (cuid)
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE public.credit_transactions 
      ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
    `);
    console.log('✓ credit_transactions.user_id changed to TEXT');
  } catch (e: any) {
    console.log('⚠ Error:', e.message.substring(0, 120));
  }

  // Recreate add_credits_atomic without the ::UUID cast
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
            VALUES (p_idemp_key, uid, amt, p_action, 'committed');
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

  // Recreate reserve_credits_atomic without UUID cast
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
        VALUES (p_idemp_key, p_user_id, p_amount, p_action, 'reserved')
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

  // Fix rollback to not cast to TEXT (already TEXT now)
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
        WHERE id = v_tx.user_id;
      END;
      $$;
    `);
    console.log('✓ Recreated rollback_credits_atomic');
  } catch (e: any) {
    console.log('✗ rollback_credits_atomic:', e.message.substring(0, 120));
  }

  console.log('\n=== Done ===');
}

main().finally(() => prisma.$disconnect());
