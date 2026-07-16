// @ts-nocheck
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Applying DB migration manually...");

    // Add monthlyAiCredits to User
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "monthlyAiCredits" INTEGER NOT NULL DEFAULT 20;`,
    );

    // Create ResumeVersion table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "public"."ResumeVersion" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "title" TEXT,
          "parsedCv" JSONB NOT NULL,
          "atsScore" INTEGER,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT "ResumeVersion_pkey" PRIMARY KEY ("id")
      );
    `);

    // Create ResumeRewriteHistory table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "public"."ResumeRewriteHistory" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "resumeId" TEXT NOT NULL,
          "section" TEXT NOT NULL,
          "original" TEXT NOT NULL,
          "rewritten" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT "ResumeRewriteHistory_pkey" PRIMARY KEY ("id")
      );
    `);

    // Add indexes (if they don't exist, we wrap in DO block for safe creation)
    await prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS "ResumeVersion_userId_idx" ON "public"."ResumeVersion"("userId");`,
    );
    await prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS "ResumeRewriteHistory_userId_idx" ON "public"."ResumeRewriteHistory"("userId");`,
    );
    await prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS "ResumeRewriteHistory_resumeId_idx" ON "public"."ResumeRewriteHistory"("resumeId");`,
    );

    // Add Foreign Keys (If not exists isn't supported for constraints, but we can try creating them)
    try {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "public"."ResumeVersion" ADD CONSTRAINT "ResumeVersion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`,
      );
    } catch (e) {
      console.log("FK ResumeVersion_userId_fkey may already exist or failed.");
    }

    try {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "public"."ResumeRewriteHistory" ADD CONSTRAINT "ResumeRewriteHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`,
      );
    } catch (e) {
      console.log(
        "FK ResumeRewriteHistory_userId_fkey may already exist or failed.",
      );
    }

    try {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "public"."ResumeRewriteHistory" ADD CONSTRAINT "ResumeRewriteHistory_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "public"."ResumeVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;`,
      );
    } catch (e) {
      console.log(
        "FK ResumeRewriteHistory_resumeId_fkey may already exist or failed.",
      );
    }

    console.log("Database update applied successfully!");
  } catch (e) {
    console.error("Migration Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
