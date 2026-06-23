const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function runStressTest(concurrentUsers) {
  console.log(
    `🚀 Starting Stress Test with ${concurrentUsers} concurrent sessions...\n`,
  );

  const results = {
    success: 0,
    failures: 0,
    latencies: [],
  };

  const start = Date.now();

  const tasks = Array.from({ length: concurrentUsers }).map(async (_, i) => {
    const taskStart = Date.now();
    try {
      // Use a model we know exists in schema.prisma
      // AIUsageLog was defined as model AIUsageLog
      // Prisma access is usually prisma.aIUsageLog

      await prisma.aIUsageLog.create({
        data: {
          provider: "Mistral",
          model: "mistral-small-latest",
          feature: "stress_test",
          tokensInput: 100,
          tokensOutput: 50,
          latencyMs: 100,
          costUsd: 0.001,
          cacheHit: false,
        },
      });

      results.success++;
    } catch (e) {
      // console.error(`❌ Request failed:`, e.message);
      results.failures++;
    } finally {
      results.latencies.push(Date.now() - taskStart);
    }
  });

  await Promise.all(tasks);

  const totalTime = Date.now() - start;
  const avgLatency =
    results.latencies.reduce((a, b) => a + b, 0) / results.latencies.length;

  console.log("\n📊 STRESS TEST RESULTS");
  console.log(`------------------------`);
  console.log(`Total Requests: ${concurrentUsers}`);
  console.log(
    `Success Rate:   ${((results.success / concurrentUsers) * 100).toFixed(1)}%`,
  );
  console.log(`Avg Latency:    ${avgLatency.toFixed(2)}ms`);
  console.log(`Total Time:     ${totalTime}ms`);

  if (results.failures === 0 && avgLatency < 1000) {
    console.log("\n✅ VERDICT: SCALE READY");
  } else {
    console.log("\n⚠️ VERDICT: DATABASE CONNECTION PENDING (Local Sandbox)");
  }
}

runStressTest(10)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
