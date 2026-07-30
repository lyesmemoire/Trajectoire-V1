import {  PrismaClient  } from '@prisma/client';
const prisma = new PrismaClient();

async function seedAILogs() {
  console.log("Seeding AI logs...");

  const features = ["interview", "ats", "dna", "replay", "optimize"];
  const _models = ["mistral-small-latest", "mistral-large-latest"];

  for (let i = 0; i < 50; i++) {
    const feature = features[Math.floor(Math.random() * features.length)];
    const model =
      feature === "replay" || feature === "dna"
        ? "mistral-large-latest"
        : "mistral-small-latest";
    const tokensIn = Math.floor(Math.random() * 2000) + 500;
    const tokensOut = Math.floor(Math.random() * 1000) + 100;
    const latency = Math.floor(Math.random() * 2000) + 300;
    const cost = model.includes("large")
      ? (tokensIn + tokensOut) * 0.000008
      : (tokensIn + tokensOut) * 0.0000002;

    await prisma.aIUsageLog.create({
      data: {
        provider: "Mistral",
        model,
        feature,
        tokensInput: tokensIn,
        tokensOutput: tokensOut,
        latencyMs: latency,
        costUsd: cost,
        cacheHit: Math.random() > 0.7,
        createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log("Seed completed.");
}

seedAILogs()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
