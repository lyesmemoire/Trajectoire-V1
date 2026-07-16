// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createAdminClientSupabase } from "@/lib/supabase/admin";
import { getStrictUser } from "@/lib/auth/get-user";

export async function GET(req: NextRequest) {
  const user = await getStrictUser(req);
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createAdminClientSupabase();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const adminRoles = ["ADMIN_SUPPORT", "ADMIN_PRODUCT", "ADMIN_FOUNDER"];
  const isAdmin = profile?.role && adminRoles.includes(profile.role);
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ✅ OpenAI cost (24h)
  const { data: usage } = await supabase
    .from("ai_usage_stats")
    .select("estimated_cost")
    .gte(
      "created_at",
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    );

  const totalCost =
    usage?.reduce((sum, row) => sum + Number(row.estimated_cost || 0), 0) || 0;

  // ✅ Total credits consumed (24h)
  const { data: ledger } = await supabase
    .from("credit_ledger")
    .select("amount")
    .eq("type", "debit")
    .gte(
      "created_at",
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    );

  const totalCreditsUsed =
    ledger?.reduce((sum, row) => sum + row.amount, 0) || 0;

  // ✅ Organizations count
  const { count: orgCount } = await supabase
    .from("organizations")
    .select("*", { count: "exact", head: true });

  return NextResponse.json({
    totalCost,
    totalCreditsUsed,
    orgCount: orgCount || 0,
  });
}
