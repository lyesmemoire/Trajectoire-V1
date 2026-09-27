-- ==========================================
-- MIGRATION UP
-- ==========================================

-- 1. credit_transactions
DROP POLICY IF EXISTS "Service can manage credit transactions" ON public.credit_transactions;
CREATE POLICY "Service can manage credit transactions" 
ON public.credit_transactions 
FOR ALL TO service_role 
USING (true) WITH CHECK (true);

-- 2. credit_usage
DROP POLICY IF EXISTS "Service can manage credit usage" ON public.credit_usage;
CREATE POLICY "Service can manage credit usage" 
ON public.credit_usage 
FOR ALL TO service_role 
USING (true) WITH CHECK (true);

-- 3. stripe_events
DROP POLICY IF EXISTS "Service can manage stripe events" ON public.stripe_events;
CREATE POLICY "Service can manage stripe events" 
ON public.stripe_events 
FOR ALL TO service_role 
USING (true) WITH CHECK (true);

-- 4. idempotency
DROP POLICY IF EXISTS "Service can manage idempotency" ON public.idempotency;
CREATE POLICY "Service can manage idempotency" 
ON public.idempotency 
FOR ALL TO service_role 
USING (true) WITH CHECK (true);

-- 5. cv_rewrites
DROP POLICY IF EXISTS "Service can manage cv rewrites" ON public.cv_rewrites;
CREATE POLICY "Service can manage cv rewrites" 
ON public.cv_rewrites 
FOR ALL TO service_role 
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read own cv rewrites" ON public.cv_rewrites;
CREATE POLICY "Users can read own cv rewrites" 
ON public.cv_rewrites 
FOR SELECT TO authenticated 
USING (user_id = auth.uid()::text);

-- ==========================================
-- MIGRATION DOWN
-- ==========================================
/*
DROP POLICY IF EXISTS "Service can manage credit transactions" ON public.credit_transactions;
CREATE POLICY "Service can manage credit transactions" ON public.credit_transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service can manage credit usage" ON public.credit_usage;
CREATE POLICY "Service can manage credit usage" ON public.credit_usage FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service can manage stripe events" ON public.stripe_events;
CREATE POLICY "Service can manage stripe events" ON public.stripe_events FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service can manage idempotency" ON public.idempotency;
CREATE POLICY "Service can manage idempotency" ON public.idempotency FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service can manage cv rewrites" ON public.cv_rewrites;
CREATE POLICY "Service can manage cv rewrites" ON public.cv_rewrites FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Users can read own cv rewrites" ON public.cv_rewrites;
*/
