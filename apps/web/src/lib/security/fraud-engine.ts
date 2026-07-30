import { createAdminClient } from "@/lib/supabase/service";

const isProduction = process.env.NODE_ENV === "production";

export async function evaluateFraud({
  userId, ip, fingerprint}: {
  userId: string;
  ip: string;
  fingerprint?: string;
}) {
  let risk = 0;
  const flags: string[] = [];
  const supabaseAdmin = createAdminClient();

  /* -----------------------------
     ✅ 1. IP Risk Check (IPQS)
  ----------------------------- */

  if (isProduction && !process.env.IPQS_KEY) {
    throw new Error("IPQS_KEY manquante en production");
  }

  if (process.env.IPQS_KEY) {
    try {
      const response = await fetch(
        `https://ipqualityscore.com/api/json/ip/${process.env.IPQS_KEY}/${ip}`,
      );
      const data = await response.json();

      if (data.proxy || data.tor || data.vpn) {
        risk += 40;
        flags.push("vpn_detected");
      }

      if (data.fraud_score > 75) {
        risk += 30;
        flags.push("high_ip_fraud_score");
      }
    } catch (error) {
      console.error("IPQS Error", error);
    }
  }

  /* -----------------------------
     ✅ 2. Multi-account device
  ----------------------------- */

  if (fingerprint) {
    const { data: existing } = await (supabaseAdmin  as any)
      .from("user_devices")
      .select("id")
      .eq("fingerprint", fingerprint);

    if (existing && existing.length >= 2) {
      risk += 35;
      flags.push("multi_account_device");
    }
  }

  /* -----------------------------
     ✅ 3. IP registration spike
  ----------------------------- */

  const { data: ipData } = await (supabaseAdmin  as any)
    .from("ip_activity")
    .select("*")
    .eq("ip_address", ip)
    .single();

  if (ipData && (ipData  as any).registration_count > 3) {
    risk += 30;
    flags.push("ip_spike");
  }

  /* -----------------------------
     ✅ Final evaluation
  ----------------------------- */

  const fraudFlag = risk >= 70;

  await (supabaseAdmin  as any).from("user_risk_scores").upsert({
    user_id: userId,
    risk_score: risk,
    fraud_flag: fraudFlag,
    flags,
    updated_at: new Date().toISOString(),
  });

  return { risk, fraudFlag };
}
