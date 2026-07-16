/**
 * Script to apply credit_reservations migration directly via Supabase client
 * Usage: node scripts/apply-credit-reservations-migration.js
 */
// @ts-nocheck


const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const migrationSQL = `
-- Create credit_reservations table
CREATE TABLE IF NOT EXISTS credit_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('reserved', 'committed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 minutes',
  UNIQUE(session_id)
);

-- Index for fast lookups by session_id
CREATE INDEX IF NOT EXISTS idx_credit_reservations_session_id ON credit_reservations(session_id);

-- Index for cleanup of expired reservations
CREATE INDEX IF NOT EXISTS idx_credit_reservations_expires_at ON credit_reservations(expires_at);

-- Function to reserve credit (does NOT decrement yet)
CREATE OR REPLACE FUNCTION reserve_credit(p_user_id UUID, p_session_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_plan TEXT;
  v_limit INTEGER;
  v_month_key TEXT;
  v_current_count INTEGER;
BEGIN
  -- Get user's current plan and usage
  SELECT plan, interviews_this_month, month_key
  INTO v_plan, v_current_count, v_month_key
  FROM user_usage
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- If no record, create one
  IF NOT FOUND THEN
    INSERT INTO user_usage (user_id, plan, interviews_this_month, month_key)
    VALUES (p_user_id, 'free', 0, TO_CHAR(NOW(), 'YYYY-MM'));
    v_plan := 'free';
    v_current_count := 0;
    v_month_key := TO_CHAR(NOW(), 'YYYY-MM');
  END IF;

  -- Reset monthly if needed
  IF v_month_key != TO_CHAR(NOW(), 'YYYY-MM') THEN
    UPDATE user_usage
    SET interviews_this_month = 0, month_key = TO_CHAR(NOW(), 'YYYY-MM')
    WHERE user_id = p_user_id;
    v_current_count := 0;
  END IF;

  -- Determine actual plan (check subscription status)
  IF v_plan != 'free' THEN
    SELECT subscription_status, current_period_end
    INTO v_plan, v_month_key
    FROM user_usage
    WHERE user_id = p_user_id;
    
    IF v_month_key IS NOT NULL AND v_month_key < NOW() THEN
      v_plan := 'free';
    END IF;
  END IF;

  -- Get plan limit
  v_limit := CASE v_plan
    WHEN 'free' THEN 3
    WHEN 'pro' THEN 20
    WHEN 'premium' THEN 999999
    ELSE 3
  END;

  -- Check if user has available credits
  IF v_current_count >= v_limit THEN
    RETURN FALSE;
  END IF;

  -- Create reservation
  INSERT INTO credit_reservations (user_id, session_id, status)
  VALUES (p_user_id, p_session_id, 'reserved');

  RETURN TRUE;
END;
$$;

-- Function to commit reservation (actually decrement credit)
CREATE OR REPLACE FUNCTION commit_credit(p_session_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id UUID;
  v_status TEXT;
BEGIN
  -- Get reservation
  SELECT user_id, status
  INTO v_user_id, v_status
  FROM credit_reservations
  WHERE session_id = p_session_id
  FOR UPDATE;

  -- If no reservation or already processed, return false
  IF NOT FOUND OR v_status != 'reserved' THEN
    RETURN FALSE;
  END IF;

  -- Update reservation status
  UPDATE credit_reservations
  SET status = 'committed'
  WHERE session_id = p_session_id;

  -- Actually decrement credit
  UPDATE user_usage
  SET interviews_this_month = interviews_this_month + 1
  WHERE user_id = v_user_id;

  RETURN TRUE;
END;
$$;

-- Function to cancel reservation (no credit consumed)
CREATE OR REPLACE FUNCTION cancel_credit(p_session_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete reservation if still reserved
  DELETE FROM credit_reservations
  WHERE session_id = p_session_id AND status = 'reserved';

  RETURN TRUE;
END;
$$;

-- Cleanup function for expired reservations (call via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  DELETE FROM credit_reservations
  WHERE expires_at < NOW() AND status = 'reserved';

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;
`;

async function applyMigration() {
  console.log('🚀 Applying credit_reservations migration...');
  
  try {
    // Execute the migration SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      // If exec_sql doesn't exist, try direct SQL via REST API
      console.log('⚠️ exec_sql not available, trying alternative approach...');
      
      // Split into individual statements and execute via raw SQL
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      for (const statement of statements) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        const { error: stmtError } = await supabase.from('_').select('*').limit(1);
        // This won't work, need different approach
      }
      
      throw error;
    }
    
    console.log('✅ Migration applied successfully!');
    
    // Verify table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('credit_reservations')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Table verification failed:', tableError);
    } else {
      console.log('✅ Table credit_reservations verified!');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n⚠️ Please apply the migration manually via Supabase dashboard:');
    console.log('   File: supabase/migrations/20260626140000_credit_reservations.sql');
    process.exit(1);
  }
}

applyMigration();
