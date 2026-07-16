// @ts-nocheck
// app/api/interview/history/route.ts
// Récupère l'historique des sessions d'entretien de l'utilisateur

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getStrictUser } from "@/lib/auth/get-user";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const supabase = await createServerClient();

    // Récupérer les sessions (dernières 20)
    const { data: sessions, error } = await (supabase as any)
      .from("interview_sessions")
      .select("id, job_title, final_score, level, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Failed to fetch interview history:", error);
      return NextResponse.json({ sessions: [], sessionsThisMonth: 0 });
    }

    // Compter les sessions du mois en cours
    const now = new Date();
    const firstOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).toISOString();

    const { count } = await (supabase as any)
      .from("interview_sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", firstOfMonth);

    return NextResponse.json({
      sessions: sessions || [],
      sessionsThisMonth: count ?? 0,
    });
  } catch (err: any) {
    if (err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/interview/history error:", err);
    return NextResponse.json({ sessions: [], sessionsThisMonth: 0 });
  }
}
