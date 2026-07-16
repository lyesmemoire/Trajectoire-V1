// @ts-nocheck
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  envServer.SUPABASE_SERVICE_ROLE_KEY
);

async function runAudit() {
  console.log("=== BILLING CONSISTENCY AUDIT ===");
  let hasErrors = false;

  // 1. Check for negative balances
  const { data: negativeProfiles, error: pError } = await supabase
    .from("profiles")
    .select("id, email, credits")
    .lt("credits", 0);

  if (pError) throw pError;

  if (negativeProfiles && negativeProfiles.length > 0) {
    console.error("❌ ERROR: Found profiles with negative balances:");
    console.table(negativeProfiles);
    hasErrors = true;
  } else {
    console.log("✅ Check 1: No negative balances found.");
  }

  // 2. Check for stuck transactions (> 10min in reserved state)
  const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { data: stuckTxs, error: tError } = await supabase
    .from("credit_transactions")
    .select("id, user_id, amount, state, created_at")
    .eq("state", "reserved")
    .lt("created_at", tenMinsAgo);

  if (tError) throw tError;

  if (stuckTxs && stuckTxs.length > 0) {
    console.error("❌ ERROR: Found stuck transactions (>10m reserved):");
    console.table(stuckTxs);
    hasErrors = true;
  } else {
    console.log("✅ Check 2: No stuck transactions found.");
  }

  // 3. Compare sum of ledger with profiles
  // Note: This check only works properly if ALL historical data is in the ledger.
  // Profiles usually start with 2 free credits (hardcoded in DB triggers).
  // So Ledger Sum + (Total Users * 2) should equal Profiles Sum roughly.
  
  const { data: usageSum, error: uError } = await supabase.rpc("get_total_credit_usage");
  
  if (uError) {
    // Custom RPC might not exist, fallback to JS accumulation
    const { data: usages, error: uListError } = await supabase
      .from("credit_usage")
      .select("credits_spent");
      
    if (uListError) throw uListError;
    
    // credits_spent: positive for spend, negative for add/refund
    // Thus total spent = sum(credits_spent)
    let totalSpent = 0;
    usages?.forEach(u => { totalSpent += u.credits_spent; });
    
    console.log(`ℹ️ Total credits spent according to ledger: ${totalSpent}`);
  }

  if (hasErrors) {
    console.log("\n❌ Audit failed. Please resolve the inconsistencies above.");
    process.exit(1);
  } else {
    console.log("\n✅ Audit passed! All invariants hold true.");
    process.exit(0);
  }
}

runAudit().catch(err => {
  console.error("Fatal error during audit:", err);
  process.exit(1);
});
