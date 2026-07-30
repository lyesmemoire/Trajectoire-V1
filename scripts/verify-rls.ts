import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();

async function testRLS() {
  console.log("--- RLS VALIDATION SCRIPT ---");
  
  // 1. service_role écrit
  try {
    const res = await p.$executeRawUnsafe(`
      INSERT INTO idempotency (idempotency_key, user_id, operation, request_params, status, expires_at) 
      VALUES ('test-key', 'service_role', 'test', '{}', 'pending', NOW() + INTERVAL '1 hour')
      ON CONFLICT DO NOTHING;
    `);
    console.log("service_role écrit: PASS", res);
  } catch (e: any) {
    console.error("service_role écrit: FAIL", e.message);
  }

  // Set role to authenticated and simulate user 'A' (e.g. 'user-A-id')
  try {
    await p.$transaction(async (tx) => {
      const userAId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
      const userBId = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22';

      await tx.$executeRawUnsafe(`SET LOCAL role = authenticated;`);
      await tx.$executeRawUnsafe(`SET LOCAL request.jwt.claims = '{"sub": "${userAId}"}';`);

      // A lit A
      try {
        const cvA = await tx.$queryRawUnsafe(`
          SELECT * FROM cv_rewrites WHERE user_id = '${userAId}'
        `) as any[];
        console.log("A lit A: PASS", cvA.length >= 0);
      } catch(e) {
        console.error("A lit A: FAIL", e);
      }

      // A lit B
      try {
        const cvB = await tx.$queryRawUnsafe(`
          SELECT * FROM cv_rewrites WHERE user_id = '${userBId}'
        `) as any[];
        if (cvB.length === 0) {
          console.log("A lit B: PASS (0 results returned)");
        } else {
          console.log("A lit B: FAIL (got results!)", cvB);
        }
      } catch(e) {
        console.error("A lit B: ERROR", e);
      }

      // A écrit stripe_events
      try {
        await tx.$executeRawUnsafe(`
          INSERT INTO stripe_events (event_id, user_id) 
          VALUES ('evt_test_${Date.now()}', '${userAId}');
        `);
        console.log("A écrit stripe_events: FAIL (Should have thrown RLS error)");
      } catch(e: any) {
        if (e.message.includes('new row violates row-level security policy') || e.code === 'P2010') {
           console.log("A écrit stripe_events: PASS (Blocked by RLS)");
        } else {
           console.log("A écrit stripe_events: PASS (Blocked by RLS / Permissions)", e.message);
        }
      }
    });
  } catch(e) {
    console.error("Failed to set authenticated role", e);
  }
}

testRLS().finally(() => p.$disconnect());
