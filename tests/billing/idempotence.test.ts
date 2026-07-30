/**
 * Tests d'idempotence et de concurrence sur le système de crédits.
 * 
 * Ces tests appellent directement les RPCs Supabase (pas le service Node.js)
 * pour valider les garanties transactionnelles au niveau PostgreSQL,
 * qui est la seule couche où l'atomicité est réellement garantie.
 * 
 * Cible : base de staging Supabase (pas locale — Docker Desktop non disponible).
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Hardcoded: vitest.config.ts overrides process.env with localhost values
const SUPABASE_URL = 'https://bzxdozzbdvzgvgshyamp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6eGRvenpiZHZ6Z3Znc2h5YW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE3MzYwOSwiZXhwIjoyMDk5NzQ5NjA5fQ.yFHRDZpaD-JfyrZIqJhj3srkX99v8ZTnIAP4AbFzMfk';

let supabase: SupabaseClient;
let testUserId: string;

beforeAll(async () => {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Create a test user in the User table (Prisma naming, PK is text/cuid)
  testUserId = `test-idem-${Date.now()}`;
  const { error } = await supabase.from('User').insert({
    id: testUserId,
    email: `${testUserId}@test.example.com`,
    referralCode: `REF-${Date.now()}`,
    credits: 200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  if (error) {
    console.warn('User insert failed:', error.message);
  }
});

afterAll(async () => {
  // Cleanup test data
  await supabase.from('credit_transactions').delete().eq('user_id', testUserId);
  await supabase.from('User').delete().eq('id', testUserId);
});

// ─────────────────────────────────────────────────────────────────
// 1. add_credits_atomic — idempotence via UNIQUE(idempotency_key)
// ─────────────────────────────────────────────────────────────────
describe('add_credits_atomic idempotency', () => {
  it('should credit exactly once even when called twice with the same key', async () => {
    const idempKey = `test-add-${Date.now()}`;

    // First call — should add 50 credits (200 → 250)
    const { data: balance1, error: err1 } = await supabase.rpc('add_credits_atomic', {
      uid: testUserId,
      amt: 50,
      p_idemp_key: idempKey,
      p_action: 'test_add',
    });
    expect(err1).toBeNull();
    expect(balance1).toBe(250);

    // Second call — same key, should NOT add again
    const { data: balance2, error: err2 } = await supabase.rpc('add_credits_atomic', {
      uid: testUserId,
      amt: 50,
      p_idemp_key: idempKey,
      p_action: 'test_add',
    });
    expect(err2).toBeNull();
    // Balance should still be 250, not 300
    expect(balance2).toBe(250);
  });

  it('should handle 10 concurrent calls with the same key — only one credits', async () => {
    // Reset balance to a known state
    await supabase.from('User').update({ credits: 100 }).eq('id', testUserId);

    const idempKey = `test-concurrent-add-${Date.now()}`;

    const promises = Array.from({ length: 10 }, () =>
      supabase.rpc('add_credits_atomic', {
        uid: testUserId,
        amt: 30,
        p_idemp_key: idempKey,
        p_action: 'concurrent_test',
      })
    );

    const results = await Promise.allSettled(promises);
    const successes = results.filter(r => r.status === 'fulfilled' && !(r.value as any).error);

    // All calls should succeed (return balance), but only one should have actually added
    expect(successes.length).toBeGreaterThanOrEqual(1);

    // Verify final balance is exactly 130, not 100 + (30 * N)
    const { data: user } = await supabase
      .from('User')
      .select('credits')
      .eq('id', testUserId)
      .single();

    expect(user?.credits).toBe(130);
  });
});

// ─────────────────────────────────────────────────────────────────
// 2. reserve → commit — normal flow
// ─────────────────────────────────────────────────────────────────
describe('reserve/commit flow', () => {
  it('should deduct on reserve, then finalize on commit', async () => {
    // Reset
    await supabase.from('User').update({ credits: 100 }).eq('id', testUserId);
    const idempKey = `test-reserve-${Date.now()}`;

    // Reserve 20
    const { data: txId, error: resErr } = await supabase.rpc('reserve_credits_atomic', {
      p_user_id: testUserId,
      p_amount: 20,
      p_action: 'test_reserve',
      p_idemp_key: idempKey,
    });
    expect(resErr).toBeNull();
    expect(txId).toBeTruthy();

    // Balance should be 80 now
    const { data: mid } = await supabase.from('User').select('credits').eq('id', testUserId).single();
    expect(mid?.credits).toBe(80);

    // Commit
    const { error: commitErr } = await supabase.rpc('commit_credits_atomic', {
      p_tx_id: txId,
      p_tokens: 150,
    });
    expect(commitErr).toBeNull();

    // Balance stays 80 (commit doesn't change balance, just state)
    const { data: final } = await supabase.from('User').select('credits').eq('id', testUserId).single();
    expect(final?.credits).toBe(80);

    // Transaction state should be committed
    const { data: tx } = await supabase
      .from('credit_transactions')
      .select('state')
      .eq('id', txId)
      .single();
    expect(tx?.state).toBe('committed');
  });
});

// ─────────────────────────────────────────────────────────────────
// 3. reserve → rollback — credits restored
// ─────────────────────────────────────────────────────────────────
describe('reserve/rollback flow', () => {
  it('should restore credits on rollback', async () => {
    await supabase.from('User').update({ credits: 100 }).eq('id', testUserId);
    const idempKey = `test-rollback-${Date.now()}`;

    // Reserve 30
    const { data: txId } = await supabase.rpc('reserve_credits_atomic', {
      p_user_id: testUserId,
      p_amount: 30,
      p_action: 'test_rollback',
      p_idemp_key: idempKey,
    });

    // Balance = 70
    const { data: mid } = await supabase.from('User').select('credits').eq('id', testUserId).single();
    expect(mid?.credits).toBe(70);

    // Rollback
    const { error: rbErr } = await supabase.rpc('rollback_credits_atomic', {
      p_tx_id: txId,
      p_reason: 'LLM timeout',
    });
    expect(rbErr).toBeNull();

    // Balance restored to 100
    const { data: final } = await supabase.from('User').select('credits').eq('id', testUserId).single();
    expect(final?.credits).toBe(100);
  });
});

// ─────────────────────────────────────────────────────────────────
// 4. commit must reject non-reserved transactions
// ─────────────────────────────────────────────────────────────────
describe('commit rejects non-reserved state', () => {
  it('should fail to commit an already rolled-back transaction', async () => {
    await supabase.from('User').update({ credits: 100 }).eq('id', testUserId);
    const idempKey = `test-double-commit-${Date.now()}`;

    const { data: txId } = await supabase.rpc('reserve_credits_atomic', {
      p_user_id: testUserId,
      p_amount: 10,
      p_action: 'test_dc',
      p_idemp_key: idempKey,
    });

    // Rollback first
    await supabase.rpc('rollback_credits_atomic', { p_tx_id: txId, p_reason: 'test' });

    // Now try to commit — should fail
    const { error: commitErr } = await supabase.rpc('commit_credits_atomic', {
      p_tx_id: txId,
      p_tokens: 0,
    });

    expect(commitErr).not.toBeNull();
    expect(commitErr!.message).toContain('not in reserved state');
  });
});
