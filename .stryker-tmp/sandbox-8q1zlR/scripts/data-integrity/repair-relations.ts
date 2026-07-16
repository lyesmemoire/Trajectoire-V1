/**
 * Repair Relations Script
 * 
 * Repairs orphaned records by:
 * - Deleting orphaned BehaviorEvents
 * - Deleting orphaned InterviewEvents
 * - Deleting orphaned CVAnalysis
 * - Deleting orphaned CareerProfiles
 * - Deleting orphaned Subscriptions
 * - Deleting orphaned Sessions
 * - Deleting orphaned Accounts
 * - Deleting orphaned WaitlistEntries
 * 
 * WARNING: This script permanently deletes data. Use with caution.
 */
// @ts-nocheck


import prisma from '../../lib/prisma';

interface RepairResult {
  table: string;
  deletedCount: number;
}

async function repairRelations() {
  console.log('🔧 Repairing orphaned relations...\n');

  const results: RepairResult[] = [];

  // 1. Delete orphaned BehaviorEvents
  console.log('Repairing BehaviorEvents...');
  const deletedBehaviorEvents = await prisma.$executeRaw`
    DELETE FROM "BehaviorEvent"
    WHERE id IN (
      SELECT be.id 
      FROM "BehaviorEvent" be
      LEFT JOIN "InterviewSession" is ON be."sessionId" = is.id
      WHERE is.id IS NULL
    )
  `;

  results.push({
    table: 'BehaviorEvent',
    deletedCount: Number(deletedBehaviorEvents),
  });
  console.log(`   ✅ Deleted ${deletedBehaviorEvents} orphaned BehaviorEvents`);

  // 2. Delete orphaned InterviewEvents
  console.log('Repairing InterviewEvents...');
  const deletedInterviewEvents = await prisma.$executeRaw`
    DELETE FROM "InterviewEvent"
    WHERE id IN (
      SELECT ie.id 
      FROM "InterviewEvent" ie
      LEFT JOIN "InterviewSession" is ON ie."sessionId" = is.id
      WHERE is.id IS NULL
    )
  `;

  results.push({
    table: 'InterviewEvent',
    deletedCount: Number(deletedInterviewEvents),
  });
  console.log(`   ✅ Deleted ${deletedInterviewEvents} orphaned InterviewEvents`);

  // 3. Delete orphaned CVAnalysis
  console.log('Repairing CVAnalysis...');
  const deletedCVAnalysis = await prisma.$executeRaw`
    DELETE FROM "CVAnalysis"
    WHERE id IN (
      SELECT cva.id 
      FROM "CVAnalysis" cva
      LEFT JOIN "User" u ON cva."userId" = u.id
      WHERE u.id IS NULL
    )
  `;

  results.push({
    table: 'CVAnalysis',
    deletedCount: Number(deletedCVAnalysis),
  });
  console.log(`   ✅ Deleted ${deletedCVAnalysis} orphaned CVAnalysis`);

  // 4. Delete orphaned CareerProfiles
  console.log('Repairing CareerProfiles...');
  const deletedCareerProfiles = await prisma.$executeRaw`
    DELETE FROM "CareerProfile"
    WHERE id IN (
      SELECT cp.id 
      FROM "CareerProfile" cp
      LEFT JOIN "User" u ON cp."userId" = u.id
      WHERE u.id IS NULL
    )
  `;

  results.push({
    table: 'CareerProfile',
    deletedCount: Number(deletedCareerProfiles),
  });
  console.log(`   ✅ Deleted ${deletedCareerProfiles} orphaned CareerProfiles`);

  // 5. Delete orphaned Subscriptions
  console.log('Repairing Subscriptions...');
  const deletedSubscriptions = await prisma.$executeRaw`
    DELETE FROM "Subscription"
    WHERE id IN (
      SELECT s.id 
      FROM "Subscription" s
      LEFT JOIN "User" u ON s."userId" = u.id
      WHERE u.id IS NULL
    )
  `;

  results.push({
    table: 'Subscription',
    deletedCount: Number(deletedSubscriptions),
  });
  console.log(`   ✅ Deleted ${deletedSubscriptions} orphaned Subscriptions`);

  // 6. Delete orphaned Sessions
  console.log('Repairing Sessions...');
  const deletedSessions = await prisma.$executeRaw`
    DELETE FROM "Session"
    WHERE id IN (
      SELECT s.id 
      FROM "Session" s
      LEFT JOIN "User" u ON s."userId" = u.id
      WHERE u.id IS NULL
    )
  `;

  results.push({
    table: 'Session',
    deletedCount: Number(deletedSessions),
  });
  console.log(`   ✅ Deleted ${deletedSessions} orphaned Sessions`);

  // 7. Delete orphaned Accounts
  console.log('Repairing Accounts...');
  const deletedAccounts = await prisma.$executeRaw`
    DELETE FROM "Account"
    WHERE id IN (
      SELECT a.id 
      FROM "Account" a
      LEFT JOIN "User" u ON a."userId" = u.id
      WHERE u.id IS NULL
    )
  `;

  results.push({
    table: 'Account',
    deletedCount: Number(deletedAccounts),
  });
  console.log(`   ✅ Deleted ${deletedAccounts} orphaned Accounts`);

  // 8. Delete orphaned WaitlistEntries
  console.log('Repairing WaitlistEntry...');
  const deletedWaitlistEntries = await prisma.$executeRaw`
    DELETE FROM "WaitlistEntry"
    WHERE id IN (
      SELECT we.id 
      FROM "WaitlistEntry" we
      LEFT JOIN "User" u ON we."userId" = u.id
      WHERE we."userId" IS NOT NULL AND u.id IS NULL
    )
  `;

  results.push({
    table: 'WaitlistEntry',
    deletedCount: Number(deletedWaitlistEntries),
  });
  console.log(`   ✅ Deleted ${deletedWaitlistEntries} orphaned WaitlistEntries`);

  // Summary
  console.log('\n📊 Repair Summary');
  console.log('================\n');

  const totalDeleted = results.reduce((sum, r) => sum + r.deletedCount, 0);

  results.forEach((result) => {
    console.log(`${result.table}: ${result.deletedCount} records deleted`);
  });

  console.log(`\nTotal records deleted: ${totalDeleted}`);

  if (totalDeleted === 0) {
    console.log('\n✅ No orphaned records found. Database is clean.');
  } else {
    console.log('\n✅ Orphaned records cleaned up successfully.');
  }

  return results;
}

// Add safety check
if (process.env.NODE_ENV === 'production') {
  console.error('❌ ERROR: Cannot run repair-relations in production environment.');
  console.error('   This script permanently deletes data.');
  console.error('   Run in development or staging only.');
  process.exit(1);
}

repairRelations()
  .then(() => {
    console.log('\n✅ Repair completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error repairing relations:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
