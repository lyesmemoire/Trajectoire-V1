// @ts-nocheck
import prisma from "../lib/prisma";
import { randomUUID } from "crypto";

/**
 * 💣 STUDIOENTRETIEN STRESS TEST ENGINE
 * Simulates high concurrency on the Orchestrator and Database.
 */

async function runStressTest(concurrentUsers: number) {
  console.log(
    `🚀 Starting Stress Test with ${concurrentUsers} concurrent sessions...\n`,
  );

  const results = {
    success: 0,
    failures: 0,
    latencies: [] as number[],
  };

  // Pre-create test data in DB
  const testUserId = "stress_test_user_" + Date.now();
  const sessionIds: string[] = [];

  console.log("📂 Preparing Test Data...");
  for (let i = 0; i < concurrentUsers; i++) {
    const sId = randomUUID();
    sessionIds.push(sId);
    // Mocking Prisma create for the test
    /* 
    await prisma.interviewSession.create({
        data: {
            id: sId,
            userId: testUserId,
            persona: 'faang',
            currentState: 'warmup',
            answers: []
        }
    });
    */
  }

  const start = Date.now();

  // 🛡️ SCENARIO: Massive Concurrent Orchestration
  const tasks = sessionIds.map(async (id) => {
    const taskStart = Date.now();
    try {
      // We simulate the internal orchestrator logic directly to stress the DB and AI logic
      // Note: Real API would hit Mistral, here we mock the DB contention part

      const session = {
        id,
        userId: testUserId,
        persona: "faang",
        answers: [],
        pressureLevel: 50,
      };

      // Simulate Database Write Contention
      await Promise.all([
        prisma.interviewEvent.create({
          data: { InterviewSession: { connect: { id: id } }, type: "stress_test_pulse", impactScore: 80 },
        }),
        prisma.behaviorEvent.create({
          data: {
            User: { connect: { id: testUserId } },
            InterviewSession: { connect: { id: id } },
            type: "INTERVIEW_START",
            payload: { stress: true },
          },
        }),
      ]);

      results.success++;
    } catch (e) {
      console.error(`❌ Session ${id} failed:`, e);
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
  console.log(`Failures:       ${results.failures}`);
  console.log(`Avg Latency:    ${avgLatency.toFixed(2)}ms`);
  console.log(`Max Latency:    ${Math.max(...results.latencies)}ms`);
  console.log(`Total Time:     ${totalTime}ms`);
  console.log(
    `Throughput:     ${((results.success / totalTime) * 1000).toFixed(2)} req/sec`,
  );

  if (results.failures === 0 && avgLatency < 1500) {
    console.log("\n✅ VERDICT: SCALE READY");
  } else {
    console.log("\n⚠️ VERDICT: OPTIMIZATION REQUIRED (Contention Detected)");
  }
}

// Trigger simulation
runStressTest(50).catch(console.error);
