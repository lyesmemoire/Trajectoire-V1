/**
 * Detect Orphan Data Script
 * 
 * Identifies orphaned records in the database:
 * - BehaviorEvents with non-existent InterviewSessions
 * - InterviewEvents with non-existent InterviewSessions
 * - CVAnalysis with non-existent Users
 * - CareerProfiles with non-existent Users
 * - Subscriptions with non-existent Users
 * - Sessions with non-existent Users
 * - Accounts with non-existent Users
 */
// @ts-nocheck


import prisma from '../../lib/prisma';

interface OrphanReport {
  table: string;
  foreignKey: string;
  referencedTable: string;
  orphanCount: number;
  orphanIds: string[];
}

async function detectOrphans() {
  console.log('🔍 Detecting orphaned data...\n');

  const reports: OrphanReport[] = [];

  // 1. BehaviorEvents with non-existent InterviewSessions
  console.log('Checking BehaviorEvents...');
  const orphanBehaviorEvents = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT be.id 
    FROM "BehaviorEvent" be
    LEFT JOIN "InterviewSession" is ON be."sessionId" = is.id
    WHERE is.id IS NULL
  `;

  if (orphanBehaviorEvents.length > 0) {
    reports.push({
      table: 'BehaviorEvent',
      foreignKey: 'sessionId',
      referencedTable: 'InterviewSession',
      orphanCount: orphanBehaviorEvents.length,
      orphanIds: orphanBehaviorEvents.map((e: any) => e.id),
    });
    console.log(`   ⚠️  Found ${orphanBehaviorEvents.length} orphaned BehaviorEvents`);
  } else {
    console.log('   ✅ No orphaned BehaviorEvents');
  }

  // 2. InterviewEvents with non-existent InterviewSessions
  console.log('Checking InterviewEvents...');
  const orphanInterviewEvents = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT ie.id 
    FROM "InterviewEvent" ie
    LEFT JOIN "InterviewSession" is ON ie."sessionId" = is.id
    WHERE is.id IS NULL
  `;

  if (orphanInterviewEvents.length > 0) {
    reports.push({
      table: 'InterviewEvent',
      foreignKey: 'sessionId',
      referencedTable: 'InterviewSession',
      orphanCount: orphanInterviewEvents.length,
      orphanIds: orphanInterviewEvents.map((e: any) => e.id),
    });
    console.log(`   ⚠️  Found ${orphanInterviewEvents.length} orphaned InterviewEvents`);
  } else {
    console.log('   ✅ No orphaned InterviewEvents');
  }

  // 3. CVAnalysis with non-existent Users
  console.log('Checking CVAnalysis...');
  const orphanCVAnalysis = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT cva.id 
    FROM "CVAnalysis" cva
    LEFT JOIN "User" u ON cva."userId" = u.id
    WHERE u.id IS NULL
  `;

  if (orphanCVAnalysis.length > 0) {
    reports.push({
      table: 'CVAnalysis',
      foreignKey: 'userId',
      referencedTable: 'User',
      orphanCount: orphanCVAnalysis.length,
      orphanIds: orphanCVAnalysis.map((e: any) => e.id),
    });
    console.log(`   ⚠️  Found ${orphanCVAnalysis.length} orphaned CVAnalysis`);
  } else {
    console.log('   ✅ No orphaned CVAnalysis');
  }

  // 4. CareerProfiles with non-existent Users
  console.log('Checking CareerProfiles...');
  const orphanCareerProfiles = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT cp.id 
    FROM "CareerProfile" cp
    LEFT JOIN "User" u ON cp."userId" = u.id
    WHERE u.id IS NULL
  `;

  if (orphanCareerProfiles.length > 0) {
    reports.push({
      table: 'CareerProfile',
      foreignKey: 'userId',
      referencedTable: 'User',
      orphanCount: orphanCareerProfiles.length,
      orphanIds: orphanCareerProfiles.map((e: any) => e.id),
    });
    console.log(`   ⚠️  Found ${orphanCareerProfiles.length} orphaned CareerProfiles`);
  } else {
    console.log('   ✅ No orphaned CareerProfiles');
  }

  // 5. Subscriptions with non-existent Users
  console.log('Checking Subscriptions...');
  const orphanSubscriptions = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT s.id 
    FROM "Subscription" s
    LEFT JOIN "User" u ON s."userId" = u.id
    WHERE u.id IS NULL
  `;

  if (orphanSubscriptions.length > 0) {
    reports.push({
      table: 'Subscription',
      foreignKey: 'userId',
      referencedTable: 'User',
      orphanCount: orphanSubscriptions.length,
      orphanIds: orphanSubscriptions.map((e: any) => e.id),
    });
    console.log(`   ⚠️  Found ${orphanSubscriptions.length} orphaned Subscriptions`);
  } else {
    console.log('   ✅ No orphaned Subscriptions');
  }

  // 6. Sessions with non-existent Users
  console.log('Checking Sessions...');
  const orphanSessions = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT s.id 
    FROM "Session" s
    LEFT JOIN "User" u ON s."userId" = u.id
    WHERE u.id IS NULL
  `;

  if (orphanSessions.length > 0) {
    reports.push({
      table: 'Session',
      foreignKey: 'userId',
      referencedTable: 'User',
      orphanCount: orphanSessions.length,
      orphanIds: orphanSessions.map((e: any) => e.id),
    });
    console.log(`   ⚠️  Found ${orphanSessions.length} orphaned Sessions`);
  } else {
    console.log('   ✅ No orphaned Sessions');
  }

  // 7. Accounts with non-existent Users
  console.log('Checking Accounts...');
  const orphanAccounts = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT a.id 
    FROM "Account" a
    LEFT JOIN "User" u ON a."userId" = u.id
    WHERE u.id IS NULL
  `;

  if (orphanAccounts.length > 0) {
    reports.push({
      table: 'Account',
      foreignKey: 'userId',
      referencedTable: 'User',
      orphanCount: orphanAccounts.length,
      orphanIds: orphanAccounts.map((e: any) => e.id),
    });
    console.log(`   ⚠️  Found ${orphanAccounts.length} orphaned Accounts`);
  } else {
    console.log('   ✅ No orphaned Accounts');
  }

  // 8. WaitlistEntry with non-existent Users
  console.log('Checking WaitlistEntry...');
  const orphanWaitlistEntries = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT we.id 
    FROM "WaitlistEntry" we
    LEFT JOIN "User" u ON we."userId" = u.id
    WHERE we."userId" IS NOT NULL AND u.id IS NULL
  `;

  if (orphanWaitlistEntries.length > 0) {
    reports.push({
      table: 'WaitlistEntry',
      foreignKey: 'userId',
      referencedTable: 'User',
      orphanCount: orphanWaitlistEntries.length,
      orphanIds: orphanWaitlistEntries.map((e: any) => e.id),
    });
    console.log(`   ⚠️  Found ${orphanWaitlistEntries.length} orphaned WaitlistEntries`);
  } else {
    console.log('   ✅ No orphaned WaitlistEntries');
  }

  // Summary
  console.log('\n📊 Orphan Detection Summary');
  console.log('=========================\n');

  if (reports.length === 0) {
    console.log('✅ No orphaned data detected. Database is clean.');
  } else {
    console.log(`⚠️  Found ${reports.length} tables with orphaned data:\n`);
    
    reports.forEach((report) => {
      console.log(`Table: ${report.table}`);
      console.log(`  Foreign Key: ${report.foreignKey} → ${report.referencedTable}`);
      console.log(`  Orphan Count: ${report.orphanCount}`);
      console.log(`  Sample IDs: ${report.orphanIds.slice(0, 5).join(', ')}${report.orphanIds.length > 5 ? '...' : ''}`);
      console.log('');
    });

    console.log('💡 To repair orphans, run: npm run repair-relations');
  }

  return reports;
}

detectOrphans()
  .then((reports) => {
    const totalOrphans = reports.reduce((sum, r) => sum + r.orphanCount, 0);
    console.log(`\nTotal orphaned records: ${totalOrphans}`);
    process.exit(totalOrphans > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('❌ Error detecting orphans:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
