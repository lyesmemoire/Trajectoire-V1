// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getStrictUser(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createServerClient();
    const { data: logs } = await supabase
      .from("ai_usage_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    const metrics = {
      totalCost: logs?.reduce((acc: number, l: any) => acc + l.costUsd, 0) || 0,
      avgLatency: logs?.length
        ? logs.reduce((acc: number, l: any) => acc + l.latencyMs, 0) / logs.length
        : 0,
      cacheHitRate: logs?.length
        ? (logs.filter((l: any) => l.cacheHit).length / logs.length) * 100
        : 0,
    };

    return NextResponse.json({ metrics, logs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
