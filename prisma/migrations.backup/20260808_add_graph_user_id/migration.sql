-- Migration: Add userId to Graph model for tenant isolation
-- This migration adds explicit user ownership to the Graph model
-- to prevent cross-user data access and enable proper tenant isolation

-- Step 1: Add nullable userId column
ALTER TABLE "public"."graphs" 
ADD COLUMN "user_id" TEXT;

-- Step 2: Backfill userId from metadata for existing graphs
-- This preserves ownership for graphs that have userId in metadata
UPDATE "public"."graphs" 
SET "user_id" = (metadata->>'userId')::text 
WHERE metadata->>'userId' IS NOT NULL 
AND "user_id" IS NULL;

-- Step 3: Soft delete graphs without userId (orphans)
-- These cannot be associated with a user and should be marked as deleted
UPDATE "public"."graphs" 
SET "deleted_at" = NOW(), 
    "is_active" = false 
WHERE "user_id" IS NULL 
AND "deleted_at" IS NULL;

-- Step 4: Add foreign key constraint to User table
ALTER TABLE "public"."graphs" 
ADD CONSTRAINT "graphs_user_id_fkey" 
FOREIGN KEY ("user_id") 
REFERENCES "public"."User"(id) 
ON DELETE CASCADE;

-- Step 5: Add indexes for performance
CREATE INDEX "graphs_user_id_idx" ON "public"."graphs"("user_id");
CREATE INDEX "graphs_user_id_is_active_idx" ON "public"."graphs"("user_id", "is_active");

-- Step 6: Make userId NOT NULL (after backfill and orphan cleanup)
-- This step should only be run after verifying backfill success
-- Uncomment the following line after verification:
-- ALTER TABLE "public"."graphs" ALTER COLUMN "user_id" SET NOT NULL;

-- Rollback plan (if needed):
-- DROP INDEX IF EXISTS "graphs_user_id_is_active_idx";
-- DROP INDEX IF EXISTS "graphs_user_id_idx";
-- ALTER TABLE "public"."graphs" DROP CONSTRAINT IF EXISTS "graphs_user_id_fkey";
-- ALTER TABLE "public"."graphs" DROP COLUMN IF EXISTS "user_id";
