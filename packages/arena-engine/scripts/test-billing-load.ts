import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function runLoadTest() {
  console.log("=== BILLING FINAL SEAL: DOUBLE SPEND TEST ===");

  const testUserEmail = `test_double_spend_${Date.now()}@example.com`;

  // 1. Create a temporary user
  console.log(`-> Creating temporary user: ${testUserEmail}`);
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: testUserEmail,
    password: "TestPassword123!",
    email_confirm: true,
  });

  if (authError) {
    console.error("Failed to create user:", authError);
    process.exit(1);
  }

  const userId = authData.user.id;

  try {
    // 2. Initialize with exactly 1 credit
    console.log(`-> Setting balance to exactly 1 credit for user ${userId}`);
    
    // We override whatever the trigger set to exactly 1
    const { error: setErr } = await supabase
      .from("profiles")
      .update({ credits: 1 })
      .eq("id", userId);
      
    if (setErr) throw setErr;

    // 3. 10 Concurrent requests of 1 credit
    console.log("-> Launching 10 concurrent reserve requests...");
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(
        supabase.rpc("reserve_credits_atomic", {
          user_id_input: userId,
          amount_input: 1,
          reason_input: "test_concurrency",
          reference_input: crypto.randomUUID()
        })
      );
    }

    const results = await Promise.allSettled(promises);
    
    const successes = results.filter((r: any) => r.status === "fulfilled" && r.value.data).length;
    const failures = results.filter((r: any) => r.status === "fulfilled" && !r.value.data).length;
    const errors = results.filter((r: any) => r.status === "rejected").length;

    console.log(`\nRESULTS:`);
    console.log(`Successes: ${successes} (Expected: 1)`);
    console.log(`Clean Failures: ${failures} (Expected: 9)`);
    console.log(`Errors: ${errors} (Expected: 0)`);

    // 4. Verification
    if (successes !== 1) {
      console.error("\n❌ TEST FAILED: System is vulnerable to double spending!");
      process.exit(1);
    } else {
      console.log("\n✅ TEST PASSED: Exactly 1 success. The invariants held firm under concurrent load.");
    }

    // Verify final balance is 0
    const { data: finalProfile } = await supabase.from("profiles").select("credits").eq("id", userId).single();
    if (finalProfile?.credits !== 0) {
      console.error(`\n❌ TEST FAILED: Final balance is not 0. It is ${finalProfile?.credits}`);
      process.exit(1);
    } else {
      console.log("✅ TEST PASSED: Final balance is correctly 0.");
    }

  } finally {
    // Cleanup
    console.log(`-> Cleaning up temporary user ${userId}`);
    await supabase.auth.admin.deleteUser(userId);
  }
}

runLoadTest().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
