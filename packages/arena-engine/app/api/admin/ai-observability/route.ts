import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createSupabaseServerClient();
    const { data: logs } = await supabase
      .from("ai_usage_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    const metrics = {
      totalCost: logs?.reduce((acc, l) => acc + l.costUsd, 0) || 0,
      avgLatency: logs?.length
        ? logs.reduce((acc, l) => acc + l.latencyMs, 0) / logs.length
        : 0,
      cacheHitRate: logs?.length
        ? (logs.filter((l) => l.cacheHit).length / logs.length) * 100
        : 0,
    };

    return NextResponse.json({ metrics, logs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
