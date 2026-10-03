import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { CvExportEditor } from "@/components/cv/CvExportEditor"
import { getCVExportDraft, getCVRewrites } from "@/lib/cv/queries"
import { hasFullCvAnalysis } from "@/lib/quota/plan-access"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Exporter mon CV – Trajectoire",
}

export const dynamic = "force-dynamic"

export default async function CVExportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const exportDraft = await getCVExportDraft(id, user.id)
  if (!exportDraft) notFound()

  const allowed = await hasFullCvAnalysis(user.id)
  const rewrites = allowed ? await getCVRewrites(id, user.id) : []
  const summaries = rewrites
    .filter((r) => r.action === "rewrite_summary")
    .slice(0, 5)
    .map((r) => ({ id: r.id, text: r.rewrittenContent, date: r.createdAt.toISOString() }))

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href={`/cv/${id}`}
        className="mb-4 inline-flex min-h-11 items-center text-sm text-calm-secondary transition-colors hover:text-calm-ink"
      >
        ← Retour à l&apos;analyse
      </Link>
      <h1 className="mb-2 text-3xl font-bold text-calm-ink">Exporter mon CV</h1>
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-calm-secondary">
        Voici les informations que nous avons pu lire dans «&nbsp;{exportDraft.fileName.trim() || "votre CV"}&nbsp;». La lecture
        automatique peut oublier ou déplacer des éléments : relisez et complétez chaque section avant de télécharger. Le fichier est
        généré à partir de ce que vous validez ici, rien n&apos;est ajouté ni inventé.
      </p>

      {allowed ? (
        <CvExportEditor analysisId={exportDraft.id} initialDocument={exportDraft.draft} summaries={summaries} />
      ) : (
        <div className="rounded-2xl border border-calm-line bg-calm-surface p-6">
          <h2 className="font-sans mb-2 text-lg font-semibold text-calm-ink tracking-normal">L&apos;export est inclus dans le Pack Entretien et dans Pro</h2>
          <p className="mb-5 text-sm text-calm-secondary">Téléchargez votre CV en DOCX ou en PDF, lisible par les logiciels de recrutement.</p>
          <Link
            href="/pricing"
            className="inline-flex min-h-11 items-center rounded-xl bg-calm-accent px-5 text-sm font-semibold text-white outline-none transition-colors hover:bg-calm-accent-deep focus-visible:ring-2 focus-visible:ring-calm-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg"
          >
            Voir les formules
          </Link>
        </div>
      )}
    </div>
  )
}
