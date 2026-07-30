import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();

const upCommands = [
  // credit_transactions
  `DROP POLICY IF EXISTS "Service can manage credit transactions" ON public.credit_transactions`,
  `CREATE POLICY "Service can manage credit transactions" ON public.credit_transactions FOR ALL TO service_role USING (true) WITH CHECK (true)`,
  // credit_usage
  `DROP POLICY IF EXISTS "Service can manage credit usage" ON public.credit_usage`,
  `CREATE POLICY "Service can manage credit usage" ON public.credit_usage FOR ALL TO service_role USING (true) WITH CHECK (true)`,
  // stripe_events
  `DROP POLICY IF EXISTS "Service can manage stripe events" ON public.stripe_events`,
  `CREATE POLICY "Service can manage stripe events" ON public.stripe_events FOR ALL TO service_role USING (true) WITH CHECK (true)`,
  // idempotency
  `DROP POLICY IF EXISTS "Service can manage idempotency" ON public.idempotency`,
  `CREATE POLICY "Service can manage idempotency" ON public.idempotency FOR ALL TO service_role USING (true) WITH CHECK (true)`,
  // cv_rewrites
  `DROP POLICY IF EXISTS "Service can manage cv rewrites" ON public.cv_rewrites`,
  `CREATE POLICY "Service can manage cv rewrites" ON public.cv_rewrites FOR ALL TO service_role USING (true) WITH CHECK (true)`,
  `DROP POLICY IF EXISTS "Users can read own cv rewrites" ON public.cv_rewrites`,
  `CREATE POLICY "Users can read own cv rewrites" ON public.cv_rewrites FOR SELECT TO authenticated USING (user_id = auth.uid()::text)`
];

const downCommands = [
  `DROP POLICY IF EXISTS "Service can manage credit transactions" ON public.credit_transactions`,
  `CREATE POLICY "Service can manage credit transactions" ON public.credit_transactions FOR ALL USING (true) WITH CHECK (true)`,
  `DROP POLICY IF EXISTS "Service can manage credit usage" ON public.credit_usage`,
  `CREATE POLICY "Service can manage credit usage" ON public.credit_usage FOR ALL USING (true) WITH CHECK (true)`,
  `DROP POLICY IF EXISTS "Service can manage stripe events" ON public.stripe_events`,
  `CREATE POLICY "Service can manage stripe events" ON public.stripe_events FOR ALL USING (true) WITH CHECK (true)`,
  `DROP POLICY IF EXISTS "Service can manage idempotency" ON public.idempotency`,
  `CREATE POLICY "Service can manage idempotency" ON public.idempotency FOR ALL USING (true) WITH CHECK (true)`,
  `DROP POLICY IF EXISTS "Service can manage cv rewrites" ON public.cv_rewrites`,
  `CREATE POLICY "Service can manage cv rewrites" ON public.cv_rewrites FOR ALL USING (true) WITH CHECK (true)`,
  `DROP POLICY IF EXISTS "Users can read own cv rewrites" ON public.cv_rewrites`
];

async function run() {
  console.log('Running UP migration...');
  for (const cmd of upCommands) {
    await p.$executeRawUnsafe(cmd);
  }
  console.log('UP migration applied.');

  console.log('Running DOWN migration...');
  for (const cmd of downCommands) {
    await p.$executeRawUnsafe(cmd);
  }
  console.log('DOWN migration applied.');

  console.log('Running UP migration again (final)...');
  for (const cmd of upCommands) {
    await p.$executeRawUnsafe(cmd);
  }
  console.log('Final UP migration applied successfully.');
}

run().finally(() => p.$disconnect());
