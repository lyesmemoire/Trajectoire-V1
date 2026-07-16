-- Migration: Fix WaitlistEntry foreign key cascade
-- Date: 2026-07-03
-- Purpose: Change WaitlistEntry.userId to ON DELETE CASCADE instead of SET NULL

-- Drop existing foreign key constraint
ALTER TABLE "public"."WaitlistEntry" DROP CONSTRAINT IF EXISTS "WaitlistEntry_userId_fkey";

-- Re-add foreign key with CASCADE delete
ALTER TABLE "public"."WaitlistEntry" 
ADD CONSTRAINT "WaitlistEntry_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "public"."User"("id") 
ON DELETE CASCADE ON UPDATE CASCADE;
