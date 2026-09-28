ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "onboardingData" JSONB,
ADD COLUMN IF NOT EXISTS "onboardingCompletedAt" TIMESTAMP(3);
