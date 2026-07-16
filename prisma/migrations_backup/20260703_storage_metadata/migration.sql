-- Migration: Storage Metadata Table
-- Date: 2026-07-03
-- Purpose: Add table to track storage files and their metadata

-- Create storage metadata table
CREATE TABLE IF NOT EXISTS "public"."StorageFile" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "bucket" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT,
    "size" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "StorageFile_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "StorageFile_userId_idx" ON "public"."StorageFile"("userId");
CREATE INDEX IF NOT EXISTS "StorageFile_bucket_idx" ON "public"."StorageFile"("bucket");
CREATE INDEX IF NOT EXISTS "StorageFile_path_idx" ON "public"."StorageFile"("path");

-- Add foreign key constraint
ALTER TABLE "public"."StorageFile" 
ADD CONSTRAINT IF NOT EXISTS "StorageFile_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "public"."User"("id") 
ON DELETE CASCADE ON UPDATE CASCADE;

-- Add unique constraint on bucket + path (files should be unique per bucket)
CREATE UNIQUE INDEX IF NOT EXISTS "StorageFile_bucket_path_key" 
ON "public"."StorageFile"("bucket", "path");
