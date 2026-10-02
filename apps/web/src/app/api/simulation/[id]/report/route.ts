import { NextRequest, NextResponse } from "next/server"
import { getVerifiedUserWithRetry } from "@/lib/auth/verified-user"

/**
 * État du rapport d'une séance : { status: "ready", reportId } | { status: "pending" } | { status: "missing" }.
 * Léger (deux lectures), pour l'attente après la fin d'un entretien : la page /report/[id] l'interroge tant que le
 * rapport est en cours de génération. Lecture seule, réservée au propriétaire de la séance.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { supabase, user, authError } = await getVerifiedUserWithRetry()
    if (authError || !user) return NextResponse.json({ status: "missing" }, { status: 401 })

    const { data: session } = await supabase
      .from("interview_sessions")
      .select("id, status")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle()
    if (!session) return NextResponse.json({ status: "missing" }, { status: 404 })

    const { data: report } = await supabase.from("reports").select("id").eq("session_id", id).maybeSingle()
    if (report) return NextResponse.json({ status: "ready", reportId: report.id })
    return NextResponse.json({ status: session.status === "completed" ? "pending" : "missing" })
  } catch {
    return NextResponse.json({ status: "missing" }, { status: 500 })
  }
}
