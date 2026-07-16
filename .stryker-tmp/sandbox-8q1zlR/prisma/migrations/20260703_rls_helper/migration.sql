-- Migration: RLS Helper Functions
-- Date: 2026-07-03
-- Purpose: Add helper functions for Row Level Security policies

-- Function: Check if user is admin
CREATE OR REPLACE FUNCTION "public"."is_admin"()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "public"."User" 
    WHERE id = auth.uid() 
    AND role IN ('ADMIN_SUPPORT', 'ADMIN_PRODUCT', 'ADMIN_FOUNDER')
  );
END;
$$;

-- Function: Check if user owns a record
CREATE OR REPLACE FUNCTION "public"."is_owner"(user_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN user_id = auth.uid();
END;
$$;

-- Function: Get current user ID
CREATE OR REPLACE FUNCTION "public"."current_user_id"()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN auth.uid()::TEXT;
END;
$$;

-- Grant execute permissions on helper functions
GRANT EXECUTE ON FUNCTION "public"."is_admin"() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION "public"."is_owner"(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION "public"."current_user_id"() TO authenticated, anon;
