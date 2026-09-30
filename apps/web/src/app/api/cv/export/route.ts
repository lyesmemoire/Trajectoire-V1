import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { buildCvDocx } from "@/lib/cv-export/docx"
import { CvDocumentSchema, cvFileBaseName, normalizeCvDocument, toCvBlocks } from "@/lib/cv-export/document"
import { buildCvPdf } from "@/lib/cv-export/pdf"
import { prisma } from "@/lib/prisma"
import { requireFullCvAnalysis } from "@/lib/quota/plan-access"
import { RateLimitScope, RouteType } from "@/lib/rate-limiting/centralized-rate-limit.service"
import { rateLimit } from "@/lib/rate-limiting/rate-limit.middleware"
import { csrfProtect } from "@/lib/security/csrf-middleware"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/** Taille maximale du corps (le document est borné champ par champ par le schéma). */
const MAX_BODY_BYTES = 200_000

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

const BodySchema = z
  .object({
    analysisId: z.string().trim().min(1).max(64),
    format: z.enum(["docx", "pdf"]),
    document: CvDocumentSchema,
  })
  .strict()

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

/**
 * POST /api/cv/export : génère le CV (DOCX ou PDF) à partir du document relu par l'utilisateur.
 *
 * - Réservé au Pack et à Pro (403 sinon). Aucune IA, aucun coût ; rien n'est enregistré : le document
 *   n'est pas conservé, le fichier est renvoyé à l'appelant.
 * - `analysisId` doit appartenir à l'utilisateur (404 sinon, même réponse qu'une analyse inexistante).
 */
async function handleExport(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return error("Non authentifié", 401)

  const planGate = await requireFullCvAnalysis(user.id)
  if (planGate) return planGate

  let raw: string
  try {
    raw = await request.text()
  } catch {
    return error("Corps de requête invalide", 400)
  }
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) return error("Document trop volumineux", 413)

  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return error("Corps de requête invalide", 400)
  }

  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    const where = issue?.path.length ? ` (${issue.path.join(".")})` : ""
    return error(`Document invalide${where}`, 400)
  }

  const { analysisId, format } = parsed.data
  const document = normalizeCvDocument(parsed.data.document)

  if (!document.personal.name) return error("Le nom est nécessaire pour générer le CV.", 400)
  if (toCvBlocks(document).every(b => b.kind === "name" || b.kind === "headline" || b.kind === "contact")) {
    return error("Le CV est vide : ajoutez un profil, une expérience, une formation ou des compétences.", 400)
  }

  const owned = await prisma.cVAnalysis.findFirst({
    where: { id: analysisId, userId: user.id },
    select: { id: true },
  })
  if (!owned) return error("Analyse introuvable", 404)

  try {
    const bytes = format === "docx" ? new Uint8Array(await buildCvDocx(document)) : await buildCvPdf(document)
    const filename = `${cvFileBaseName(document)}.${format}`

    return new NextResponse(bytes as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": format === "docx" ? DOCX_MIME : "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(bytes.byteLength),
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    return error("Impossible de générer le fichier. Réessayez dans un instant.", 500)
  }
}

// Génération (CPU) : CSRF et limite de débit par utilisateur et par IP.
export const POST = csrfProtect(
  rateLimit(RouteType.UPLOAD, handleExport, {
    scopes: [RateLimitScope.USER, RateLimitScope.IP],
  }),
)
