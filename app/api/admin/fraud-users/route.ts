import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service";
import { getStrictUser } from "@/lib/auth/session-logic";

export async function GET(req: NextRequest) {
  const { user, isAdmin } = await getStrictUser();
  if (!user || !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("user_risk_scores")
    .select(
      `
      user_id,
      risk_score,
      fraud_flag,
      flags,
      updated_at,
      profiles (
        credits,
        plan,
        banned,
        organization_id
      )
    `,
    )
    .order("risk_score", { ascending: false });

  if (error) {
    console.error("Fraud users fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  return NextResponse.json(data);
}
