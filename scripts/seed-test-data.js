import {  PrismaClient  } from '@prisma/client';
const prisma = new PrismaClient();

async function seedTestData() {
  console.log("Seeding test data for QA...");

  // Créer des utilisateurs de test avec différents plans
  const testUsers = [
    {
      email: "test-free@example.com",
      name: "Test Free User",
      plan: "FREE",
    },
    {
      email: "test-pro@example.com",
      name: "Test Pro User",
      plan: "PRO",
    },
    {
      email: "test-expert@example.com",
      name: "Test Expert User",
      plan: "EXPERT",
    },
  ];

  for (const userData of testUsers) {
    const existing = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!existing) {
      await prisma.user.create({
        data: {
          ...userData,
          emailVerified: new Date(),
          referralCode: `REF-${Math.random().toString(36).substring(7)}`,
        },
      });
      console.log(`Created user: ${userData.email} (${userData.plan})`);
    }
  }

  // Créer des sessions de simulation avec différents scores
  const users = await prisma.user.findMany({
    where: { email: { in: testUsers.map(u => u.email) } },
  });

  for (const user of users) {
    // Score élevé (75-100) → forest
    await prisma.interviewSession.create({
      data: {
        userId: user.id,
        persona: "Senior Product Manager",
        currentState: "completed",
        clarityScore: 0.85,
        confidenceScore: 0.9,
        ownershipScore: 0.88,
        specificityScore: 0.82,
        pressureLevel: 45,
        jobTitle: "Senior Product Manager",
        company: "TechCorp",
        score: 85,
        status: "completed",
        completedAt: new Date(),
        careerTrajectoryScore: 0.85,
      },
    });

    // Score moyen (50-74) → terracotta
    await prisma.interviewSession.create({
      data: {
        userId: user.id,
        persona: "Product Manager",
        currentState: "completed",
        clarityScore: 0.65,
        confidenceScore: 0.7,
        ownershipScore: 0.68,
        specificityScore: 0.62,
        pressureLevel: 65,
        jobTitle: "Product Manager",
        company: "StartupInc",
        score: 65,
        status: "completed",
        completedAt: new Date(),
        careerTrajectoryScore: 0.65,
      },
    });

    // Score faible (<50) → brick
    await prisma.interviewSession.create({
      data: {
        userId: user.id,
        persona: "Junior PM",
        currentState: "completed",
        clarityScore: 0.35,
        confidenceScore: 0.4,
        ownershipScore: 0.38,
        specificityScore: 0.32,
        pressureLevel: 85,
        jobTitle: "Junior PM",
        company: "EarlyStage",
        score: 35,
        status: "completed",
        completedAt: new Date(),
        careerTrajectoryScore: 0.35,
      },
    });

    // Session active pour test simulation
    const activeSession = await prisma.interviewSession.create({
      data: {
        userId: user.id,
        persona: "Senior Product Manager",
        currentState: "active",
        clarityScore: null,
        confidenceScore: null,
        ownershipScore: null,
        specificityScore: null,
        pressureLevel: 0,
        jobTitle: "Senior Product Manager",
        company: "TechCorp",
        score: null,
        status: "active",
        careerTrajectoryScore: null,
      },
    });

    console.log(`Created sessions for ${user.email}, active session ID: ${activeSession.id}`);
  }

  // Créer un challenge public avec entries pour le leaderboard
  const challenge = await prisma.publicChallenge.findFirst();
  
  if (!challenge) {
    const newChallenge = await prisma.publicChallenge.create({
      data: {
        slug: "qa-test-challenge",
        name: "QA Test Challenge",
        description: "Challenge de test pour QA visuelle",
        type: "pressure",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        config: {},
        rewardCredits: 10,
      },
    });
    console.log(`Created challenge: ${newChallenge.slug} (ID: ${newChallenge.id})`);

    // Ajouter des entries au leaderboard
    for (const user of users) {
      await prisma.publicChallengeEntry.create({
        data: {
          challengeId: newChallenge.id,
          userId: user.id,
          bestScore: Math.floor(Math.random() * 30) + 70, // 70-100
          maxPressure: Math.floor(Math.random() * 40) + 50,
          interruptions: Math.floor(Math.random() * 5),
          completedAt: new Date(),
        },
      });
    }
    console.log("Created challenge entries for leaderboard");
  }

  console.log("Seed completed successfully!");
  console.log("\nTest accounts:");
  console.log("- test-free@example.com (FREE)");
  console.log("- test-pro@example.com (PRO)");
  console.log("- test-expert@example.com (EXPERT)");
  console.log("\nUse these emails to login and test different plan badges.");
}

seedTestData()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
