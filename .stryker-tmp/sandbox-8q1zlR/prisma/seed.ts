// @ts-nocheck
import { PrismaClient, UserRole, Plan } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data (for development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Cleaning existing data...');
    await prisma.behaviorEvent.deleteMany();
    await prisma.interviewEvent.deleteMany();
    await prisma.interviewSession.deleteMany();
    await prisma.cVAnalysis.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
  }

  // Create Users
  console.log('👤 Creating users...');
  
  // Admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@trajectoire.com',
      name: 'Admin User',
      role: UserRole.ADMIN_FOUNDER,
      plan: Plan.EXPERT,
      referralCode: 'ADMIN001',
    },
  });

  // Premium user
  const premium = await prisma.user.create({
    data: {
      email: 'premium@trajectoire.com',
      name: 'Premium User',
      role: UserRole.USER,
      plan: Plan.PRO,
      referralCode: 'PREM001',
    },
  });

  // Free user
  const free = await prisma.user.create({
    data: {
      email: 'free@trajectoire.com',
      name: 'Free User',
      role: UserRole.USER,
      plan: Plan.FREE,
      referralCode: 'FREE001',
    },
  });

  // Recruiter user
  const recruiter = await prisma.user.create({
    data: {
      email: 'recruiter@trajectoire.com',
      name: 'Recruiter User',
      role: UserRole.USER,
      plan: Plan.EXPERT,
      referralCode: 'RECR001',
    },
  });

  // Create additional users for testing
  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@trajectoire.com`,
        name: `Test User ${i}`,
        role: UserRole.USER,
        plan: i % 2 === 0 ? Plan.PRO : Plan.FREE,
        referralCode: `USER${i.toString().padStart(3, '0')}`,
      },
    });
    users.push(user);
  }

  console.log(`✅ Created ${users.length + 4} users`);

  // Create Career Profiles
  console.log('📊 Creating career profiles...');
  
  await prisma.careerProfile.create({
    data: {
      userId: premium.id,
      employabilityScore: 85,
      clarityTrend: 0.15,
      confidenceTrend: 0.2,
      ownershipTrend: 0.18,
      stressResistance: 75,
      leadershipScore: 80,
      communicationScore: 85,
      careerDNA: {
        primaryStrength: 'Leadership',
        growthArea: 'Technical Skills',
        careerPath: 'Management',
      },
      unlockedPersonas: ['executive', 'manager'],
    },
  });

  await prisma.careerProfile.create({
    data: {
      userId: free.id,
      employabilityScore: 65,
      clarityTrend: 0.1,
      confidenceTrend: 0.05,
      ownershipTrend: 0.08,
      stressResistance: 60,
      leadershipScore: 55,
      communicationScore: 70,
      careerDNA: {
        primaryStrength: 'Communication',
        growthArea: 'Leadership',
        careerPath: 'Individual Contributor',
      },
      unlockedPersonas: ['individual'],
    },
  });

  // Create CV Analyses
  console.log('📄 Creating CV analyses...');
  
  for (let i = 0; i < 20; i++) {
    const user = users[i % users.length];
    await prisma.cVAnalysis.create({
      data: {
        userId: user.id,
        fileName: `cv_${i + 1}.pdf`,
        originalText: `Original CV content ${i + 1}`,
        optimizedText: `Optimized CV content ${i + 1}`,
        cvData: {
          skills: ['JavaScript', 'TypeScript', 'React'],
          experience: `${i + 1} years`,
          education: 'Computer Science',
        },
        atsScoreBefore: 60 + Math.floor(Math.random() * 20),
        atsScoreAfter: 75 + Math.floor(Math.random() * 20),
        improvements: {
          keywords: ['improved', 'enhanced'],
          structure: 'better',
        },
        keywords: ['leadership', 'communication', 'problem-solving'],
      },
    });
  }

  console.log('✅ Created 20 CV analyses');

  // Create Interview Sessions
  console.log('🎤 Creating interview sessions...');
  
  for (let i = 0; i < 10; i++) {
    const user = users[i % users.length];
    const isPremium = user.plan === Plan.PRO || user.plan === Plan.EXPERT;
    
    await prisma.interviewSession.create({
      data: {
        userId: user.id,
        persona: isPremium ? 'executive' : 'manager',
        currentState: 'COMPLETED',
        clarityScore: 70 + Math.random() * 20,
        confidenceScore: 65 + Math.random() * 25,
        ownershipScore: 70 + Math.random() * 20,
        specificityScore: 75 + Math.random() * 20,
        pressureLevel: Math.floor(Math.random() * 50),
        authenticityScore: 0.8 + Math.random() * 0.2,
        jobTitle: i % 2 === 0 ? 'Senior Developer' : 'Team Lead',
        company: 'Tech Corp',
        score: Math.floor(70 + Math.random() * 25),
        status: 'completed',
        questions: [
          { content: 'Tell me about yourself', intent: 'introduction' },
          { content: 'What are your strengths?', intent: 'assessment' },
        ],
        answers: [
          { content: 'I am a developer', submittedAt: new Date() },
          { content: 'My strength is coding', submittedAt: new Date() },
        ],
        analysis: {
          overallScore: 75 + Math.random() * 20,
          strengths: ['technical', 'communication'],
          improvements: ['leadership'],
        },
        startedAt: new Date(Date.now() - 86400000 * (i + 1)),
        completedAt: new Date(Date.now() - 86400000 * i),
      },
    });
  }

  console.log('✅ Created 10 interview sessions');

  // Create Subscriptions
  console.log('💳 Creating subscriptions...');
  
  await prisma.subscription.create({
    data: {
      userId: premium.id,
      stripeCustomerId: 'cus_premium_test',
      stripeSubId: 'sub_premium_test',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000),
      plan: Plan.PRO,
      updatedAt: new Date(),
    },
  });

  await prisma.subscription.create({
    data: {
      userId: recruiter.id,
      stripeCustomerId: 'cus_recruiter_test',
      stripeSubId: 'sub_recruiter_test',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 365 * 86400000),
      plan: Plan.EXPERT,
      updatedAt: new Date(),
    },
  });

  console.log('✅ Created 2 subscriptions');

  // Create User Behavior Profiles
  console.log('🧠 Creating behavior profiles...');
  
  await prisma.userBehaviorProfile.create({
    data: {
      userId: premium.id,
      pressureType: 'high_stakes',
      weaknessPattern: 'time_management',
      targetArchetype: 'executive',
      returnProbability: 0.85,
      returnSegment: 'high_value',
      lastPredictionDate: new Date(),
      onboardingCompleted: true,
    },
  });

  await prisma.userBehaviorProfile.create({
    data: {
      userId: free.id,
      pressureType: 'moderate',
      weaknessPattern: 'confidence',
      targetArchetype: 'individual_contributor',
      returnProbability: 0.65,
      returnSegment: 'mid_value',
      lastPredictionDate: new Date(),
      onboardingCompleted: true,
    },
  });

  console.log('✅ Created 2 behavior profiles');

  // Create User Prediction Snapshots
  console.log('📈 Creating prediction snapshots...');
  
  for (let i = 0; i < 5; i++) {
    await prisma.userPredictionSnapshot.create({
      data: {
        userId: premium.id,
        sessionId: `session_${i}`,
        returnProbability: 0.8 + Math.random() * 0.15,
        returnSegment: 'high_value',
        primaryDriver: 'engagement',
        stressScore: 0.3 + Math.random() * 0.4,
        recoveryScore: 0.6 + Math.random() * 0.3,
        engagementScore: 0.7 + Math.random() * 0.25,
      },
    });
  }

  console.log('✅ Created 5 prediction snapshots');

  // Create Public Challenges
  console.log('🏆 Creating public challenges...');
  
  const challenge = await prisma.publicChallenge.create({
    data: {
      slug: 'weekly-interview-challenge',
      name: 'Weekly Interview Challenge',
      description: 'Complete 5 interviews this week',
      type: 'interview',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 86400000),
      isActive: true,
      config: {
        requiredInterviews: 5,
        rewardCredits: 100,
      },
      rewardCredits: 100,
    },
  });

  // Create Challenge Entries
  for (let i = 0; i < 3; i++) {
    await prisma.publicChallengeEntry.create({
      data: {
        challengeId: challenge.id,
        userId: users[i].id,
        bestScore: Math.floor(70 + Math.random() * 25),
        maxPressure: Math.floor(Math.random() * 50),
        interruptions: Math.floor(Math.random() * 3),
        completedAt: new Date(),
      },
    });
  }

  console.log('✅ Created 1 challenge with 3 entries');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
