import { timingSafeEqual } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { radarSyncJob } from "@/lib/radar/syncJob"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const maxDuration = 60

/**
 * Synchronisation planifiée du Radar des offres : vieillissement du catalogue et actualisation des recherches
 * actives. Appelée par le planificateur avec `Authorization: Bearer <CRON_SECRET>` ; sans secret configuré, la
 * route refuse tout (comme `cleanup-previews`).
 */
function isAuthorized(request: NextRequest, secret: string): boolean {
  const header = request.headers.get("authorization") ?? ""
  const expected = `Bearer ${secret}`
  const a = Buffer.from(header)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return NextResponse.json({ error: "Tâche planifiée non configurée" }, { status: 503 })
  if (!isAuthorized(request, secret)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const result = await radarSyncJob()
  return NextResponse.json(result, { status: result.success ? 200 : 500 })
}
