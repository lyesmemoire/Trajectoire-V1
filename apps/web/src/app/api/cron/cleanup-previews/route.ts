import { timingSafeEqual } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { previewCleanupJob } from "@/lib/preview-analysis/previewCleanupJob"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * Nettoyage planifié des aperçus d'analyse expirés (aperçus gratuits anonymes).
 *
 * Appelé par le planificateur (Vercel Cron : `vercel.json`, « crons ») avec
 * `Authorization: Bearer <CRON_SECRET>` : Vercel l'ajoute tout seul quand la variable `CRON_SECRET`
 * existe. Sans secret configuré, la route refuse tout (elle ne doit jamais être publique).
 * La route d'administration `POST /api/admin/cleanup-previews` reste disponible pour un lancement manuel.
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
  if (!secret) {
    return NextResponse.json({ error: "Tâche planifiée non configurée" }, { status: 503 })
  }
  if (!isAuthorized(request, secret)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const result = await previewCleanupJob()
  return NextResponse.json(result, { status: result.success ? 200 : 500 })
}
