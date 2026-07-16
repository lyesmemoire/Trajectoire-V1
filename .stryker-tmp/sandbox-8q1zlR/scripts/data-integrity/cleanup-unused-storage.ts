/**
 * Cleanup Unused Storage Script
 * 
 * Identifies and cleans up unused storage files:
 * - StorageFile records without corresponding User
 * - StorageFile records with missing actual files in storage
 * - Orphaned storage files (files in storage but not in database)
 * 
 * Requires Supabase Storage client for actual file verification.
 */
// @ts-nocheck


import prisma from '../../lib/prisma';

interface StorageCleanupResult {
  orphanedDbRecords: number;
  missingFiles: number;
  totalSizeBytes: number;
  cleanedRecords: number[];
}

async function cleanupUnusedStorage() {
  console.log('🧹 Cleaning up unused storage...\n');

  const result: StorageCleanupResult = {
    orphanedDbRecords: 0,
    missingFiles: 0,
    totalSizeBytes: 0,
    cleanedRecords: [],
  };

  // 1. Find StorageFile records without corresponding User
  console.log('Checking for orphaned StorageFile records...');
  const orphanedStorageFiles = await prisma.$queryRaw<Array<{ id: string; size: bigint }>>`
    SELECT sf.id, sf.size
    FROM "StorageFile" sf
    LEFT JOIN "User" u ON sf."userId" = u.id
    WHERE sf."userId" IS NOT NULL AND u.id IS NULL
  `;

  if (orphanedStorageFiles.length > 0) {
    console.log(`   ⚠️  Found ${orphanedStorageFiles.length} orphaned StorageFile records`);
    
    const totalSize = orphanedStorageFiles.reduce((sum, file) => sum + Number(file.size), 0);
    result.orphanedDbRecords = orphanedStorageFiles.length;
    result.totalSizeBytes += totalSize;

    // Delete orphaned records
    const orphanedIds = orphanedStorageFiles.map((f: any) => f.id);
    await prisma.storageFile.deleteMany({
      where: {
        id: { in: orphanedIds },
      },
    });

    result.cleanedRecords.push(...orphanedIds);
    console.log(`   ✅ Deleted ${orphanedStorageFiles.length} orphaned records (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
  } else {
    console.log('   ✅ No orphaned StorageFile records');
  }

  // 2. Find StorageFile records with potentially missing files
  // Note: This requires actual Supabase Storage client to verify file existence
  console.log('Checking for potentially missing files in storage...');
  const allStorageFiles = await prisma.storageFile.findMany({
    select: {
      id: true,
      bucket: true,
      path: true,
      size: true,
      createdAt: true,
    },
  });

  if (allStorageFiles.length > 0) {
    console.log(`   ℹ️  Found ${allStorageFiles.length} StorageFile records`);
    console.log('   ℹ️  Note: Actual file verification requires Supabase Storage client');
    console.log('   ℹ️  Run manual verification with Supabase admin tools');
    
    // Identify old files (> 30 days) that might be unused
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const oldFiles = allStorageFiles.filter((f: any) => f.createdAt < thirtyDaysAgo);
    
    if (oldFiles.length > 0) {
      console.log(`   ⚠️  Found ${oldFiles.length} files older than 30 days`);
      console.log('   💡 Review these files for cleanup:');
      oldFiles.slice(0, 10).forEach((file: any) => {
        console.log(`      - ${file.bucket}/${file.path} (${(Number(file.size) / 1024).toFixed(2)} KB)`);
      });
    }
  } else {
    console.log('   ✅ No StorageFile records found');
  }

  // 3. Statistics
  console.log('\n📊 Storage Cleanup Summary');
  console.log('=========================\n');

  console.log(`Orphaned DB Records: ${result.orphanedDbRecords}`);
  console.log(`Records Cleaned: ${result.cleanedRecords.length}`);
  console.log(`Total Size Freed: ${(result.totalSizeBytes / 1024 / 1024).toFixed(2)} MB`);

  if (result.orphanedDbRecords === 0) {
    console.log('\n✅ No orphaned storage records found.');
  } else {
    console.log('\n✅ Orphaned storage records cleaned up.');
  }

  console.log('\n💡 For complete storage cleanup:');
  console.log('   1. Verify actual files in Supabase Storage');
  console.log('   2. Delete files not in database');
  console.log('   3. Delete database records for missing files');
  console.log('   4. Consider implementing automatic cleanup on user deletion');

  return result;
}

// Add safety check
if (process.env.NODE_ENV === 'production') {
  console.error('❌ ERROR: Cannot run cleanup-unused-storage in production environment.');
  console.error('   This script permanently deletes data.');
  console.error('   Run in development or staging only.');
  process.exit(1);
}

cleanupUnusedStorage()
  .then(() => {
    console.log('\n✅ Storage cleanup completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error cleaning up storage:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
