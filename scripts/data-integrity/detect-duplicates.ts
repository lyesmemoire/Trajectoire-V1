/**
 * Detect Duplicate Data Script
 * 
 * Identifies duplicate records in the database:
 * - Duplicate User emails
 * - Duplicate User referral codes
 * - Duplicate Subscription stripeSubId
 * - Duplicate Session sessionToken
 * - Duplicate PublicChallenge slug
 * - Duplicate PublicChallengeEntry (challengeId, userId)
 */

import prisma from '../../lib/prisma';

interface DuplicateReport {
  table: string;
  columns: string[];
  duplicateCount: number;
  sampleRecords: any[];
}

async function detectDuplicates() {
  console.log('🔍 Detecting duplicate data...\n');

  const reports: DuplicateReport[] = [];

  // 1. Duplicate User emails
  console.log('Checking User emails...');
  const duplicateEmails = await prisma.$queryRaw<Array<{ email: string; count: bigint }>>`
    SELECT email, COUNT(*) as count
    FROM "User"
    GROUP BY email
    HAVING COUNT(*) > 1
  `;

  if (duplicateEmails.length > 0) {
    const sampleRecords = await prisma.$queryRaw<Array<any>>`
      SELECT id, email, "createdAt"
      FROM "User"
      WHERE email IN (SELECT email FROM "User" GROUP BY email HAVING COUNT(*) > 1)
      ORDER BY email
      LIMIT 10
    `;
    
    reports.push({
      table: 'User',
      columns: ['email'],
      duplicateCount: duplicateEmails.length,
      sampleRecords,
    });
    console.log(`   ⚠️  Found ${duplicateEmails.length} duplicate email groups`);
  } else {
    console.log('   ✅ No duplicate User emails');
  }

  // 2. Duplicate User referral codes
  console.log('Checking User referral codes...');
  const duplicateReferralCodes = await prisma.$queryRaw<Array<{ referralCode: string; count: bigint }>>`
    SELECT "referralCode", COUNT(*) as count
    FROM "User"
    GROUP BY "referralCode"
    HAVING COUNT(*) > 1
  `;

  if (duplicateReferralCodes.length > 0) {
    const sampleRecords = await prisma.$queryRaw<Array<any>>`
      SELECT id, "referralCode", email
      FROM "User"
      WHERE "referralCode" IN (SELECT "referralCode" FROM "User" GROUP BY "referralCode" HAVING COUNT(*) > 1)
      ORDER BY "referralCode"
      LIMIT 10
    `;
    
    reports.push({
      table: 'User',
      columns: ['referralCode'],
      duplicateCount: duplicateReferralCodes.length,
      sampleRecords,
    });
    console.log(`   ⚠️  Found ${duplicateReferralCodes.length} duplicate referral code groups`);
  } else {
    console.log('   ✅ No duplicate User referral codes');
  }

  // 3. Duplicate Subscription stripeSubId
  console.log('Checking Subscription stripeSubId...');
  const duplicateStripeSubIds = await prisma.$queryRaw<Array<{ stripeSubId: string; count: bigint }>>`
    SELECT "stripeSubId", COUNT(*) as count
    FROM "Subscription"
    GROUP BY "stripeSubId"
    HAVING COUNT(*) > 1
  `;

  if (duplicateStripeSubIds.length > 0) {
    const sampleRecords = await prisma.$queryRaw<Array<any>>`
      SELECT id, "stripeSubId", "userId"
      FROM "Subscription"
      WHERE "stripeSubId" IN (SELECT "stripeSubId" FROM "Subscription" GROUP BY "stripeSubId" HAVING COUNT(*) > 1)
      ORDER BY "stripeSubId"
      LIMIT 10
    `;
    
    reports.push({
      table: 'Subscription',
      columns: ['stripeSubId'],
      duplicateCount: duplicateStripeSubIds.length,
      sampleRecords,
    });
    console.log(`   ⚠️  Found ${duplicateStripeSubIds.length} duplicate stripeSubId groups`);
  } else {
    console.log('   ✅ No duplicate Subscription stripeSubId');
  }

  // 4. Duplicate Session sessionToken
  console.log('Checking Session sessionToken...');
  const duplicateSessionTokens = await prisma.$queryRaw<Array<{ sessionToken: string; count: bigint }>>`
    SELECT "sessionToken", COUNT(*) as count
    FROM "Session"
    GROUP BY "sessionToken"
    HAVING COUNT(*) > 1
  `;

  if (duplicateSessionTokens.length > 0) {
    const sampleRecords = await prisma.$queryRaw<Array<any>>`
      SELECT id, "sessionToken", "userId"
      FROM "Session"
      WHERE "sessionToken" IN (SELECT "sessionToken" FROM "Session" GROUP BY "sessionToken" HAVING COUNT(*) > 1)
      ORDER BY "sessionToken"
      LIMIT 10
    `;
    
    reports.push({
      table: 'Session',
      columns: ['sessionToken'],
      duplicateCount: duplicateSessionTokens.length,
      sampleRecords,
    });
    console.log(`   ⚠️  Found ${duplicateSessionTokens.length} duplicate sessionToken groups`);
  } else {
    console.log('   ✅ No duplicate Session sessionToken');
  }

  // 5. Duplicate PublicChallenge slug
  console.log('Checking PublicChallenge slug...');
  const duplicateSlugs = await prisma.$queryRaw<Array<{ slug: string; count: bigint }>>`
    SELECT slug, COUNT(*) as count
    FROM "PublicChallenge"
    GROUP BY slug
    HAVING COUNT(*) > 1
  `;

  if (duplicateSlugs.length > 0) {
    const sampleRecords = await prisma.$queryRaw<Array<any>>`
      SELECT id, slug, name
      FROM "PublicChallenge"
      WHERE slug IN (SELECT slug FROM "PublicChallenge" GROUP BY slug HAVING COUNT(*) > 1)
      ORDER BY slug
      LIMIT 10
    `;
    
    reports.push({
      table: 'PublicChallenge',
      columns: ['slug'],
      duplicateCount: duplicateSlugs.length,
      sampleRecords,
    });
    console.log(`   ⚠️  Found ${duplicateSlugs.length} duplicate slug groups`);
  } else {
    console.log('   ✅ No duplicate PublicChallenge slug');
  }

  // 6. Duplicate PublicChallengeEntry (challengeId, userId)
  console.log('Checking PublicChallengeEntry (challengeId, userId)...');
  const duplicateChallengeEntries = await prisma.$queryRaw<Array<{ challengeId: string; userId: string; count: bigint }>>`
    SELECT "challengeId", "userId", COUNT(*) as count
    FROM "PublicChallengeEntry"
    GROUP BY "challengeId", "userId"
    HAVING COUNT(*) > 1
  `;

  if (duplicateChallengeEntries.length > 0) {
    const sampleRecords = await prisma.$queryRaw<Array<any>>`
      SELECT id, "challengeId", "userId"
      FROM "PublicChallengeEntry"
      WHERE ("challengeId", "userId") IN (
        SELECT "challengeId", "userId" 
        FROM "PublicChallengeEntry" 
        GROUP BY "challengeId", "userId" 
        HAVING COUNT(*) > 1
      )
      ORDER BY "challengeId", "userId"
      LIMIT 10
    `;
    
    reports.push({
      table: 'PublicChallengeEntry',
      columns: ['challengeId', 'userId'],
      duplicateCount: duplicateChallengeEntries.length,
      sampleRecords,
    });
    console.log(`   ⚠️  Found ${duplicateChallengeEntries.length} duplicate (challengeId, userId) groups`);
  } else {
    console.log('   ✅ No duplicate PublicChallengeEntry');
  }

  // Summary
  console.log('\n📊 Duplicate Detection Summary');
  console.log('=============================\n');

  if (reports.length === 0) {
    console.log('✅ No duplicate data detected. Database is clean.');
  } else {
    console.log(`⚠️  Found ${reports.length} tables with duplicate data:\n`);
    
    reports.forEach((report) => {
      console.log(`Table: ${report.table}`);
      console.log(`  Columns: ${report.columns.join(', ')}`);
      console.log(`  Duplicate Groups: ${report.duplicateCount}`);
      console.log(`  Sample Records:`);
      report.sampleRecords.slice(0, 3).forEach((record) => {
        console.log(`    ${JSON.stringify(record)}`);
      });
      console.log('');
    });

    console.log('💡 Manual review required to resolve duplicates.');
  }

  return reports;
}

detectDuplicates()
  .then((reports) => {
    const totalDuplicates = reports.reduce((sum, r) => sum + r.duplicateCount, 0);
    console.log(`\nTotal duplicate groups: ${totalDuplicates}`);
    process.exit(totalDuplicates > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('❌ Error detecting duplicates:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
