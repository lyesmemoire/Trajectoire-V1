"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Building2,
  FileText,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react"

import { CVUploader } from "@/components/analyze/CVUploader"
import { JobInput } from "@/components/analyze/JobInput"
import { AnalyzeButton } from "@/components/analyze/AnalyzeButton"
import { PremiumATSResult } from "@/components/analyze/PremiumATSResult"
import { OpportunityCVTailoring } from "@/components/analyze/OpportunityCVTailoring"
import { ConversionPanel } from "@/components/conversion/ConversionPanel"
import { usePreviewStorage } from "@/hooks/usePreviewStorage"
import { csrfFetch } from "@/lib/security/csrf-client"
import { PreviewTokenManager } from "@/lib/preview-analysis/previewTokenManager"
import {
  ATSResult,
  CandidateData,
  JobData,
  SavePreviewPayload,
} from "@/types/preview"

type OpportunityContext = {
  id: string
  title: string
  company: string | null
  description: string
  matchScore: number | null
  recommendationLabel: string | null
  strengths: string[]
  gaps: string[]
}

type Props = {
  opportunity: OpportunityContext | null
  isAuthenticated?: boolean
  hasPremiumAccess?: boolean
}

export function AnalyzeOpportunityClient({
  opportunity,
  isAuthenticated = false,
  hasPremiumAccess = false,
}: Props) {
  const searchParams = useSearchParams()

  const [file, setFile] = useState<File | null>(null)
  const [job, setJob] = useState(opportunity?.description ?? "")
  const [loading, setLoading] = useState(!!searchParams?.get("preview"))
  const [preview, setPreview] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showConversion, setShowConversion] = useState(false)

  const { savePreview } = usePreviewStorage()

  useEffect(() => {
    let token = searchParams?.get("preview")

    if (token) {
      PreviewTokenManager.setSessionToken(token)
    } else {
      token = PreviewTokenManager.getSessionToken()
    }

    if (!token) {
      setLoading(false)
      return
    }

    let isMounted = true
    const fetchPreview = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/public/preview/${encodeURIComponent(token!)}`)
        if (!res.ok) {
          throw new Error(res.status === 404 ? "L'analyse a expiré ou n'existe plus. Veuillez importer un nouveau CV." : "Erreur lors de la récupération de l'analyse.")
        }
        const data = await res.json()
        if (isMounted) {
          setPreview(data)
          if (!opportunity) {
            setShowConversion(true)
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Erreur réseau.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (!preview) {
      fetchPreview()
    }

    return () => { isMounted = false }
  }, [searchParams, opportunity, preview])
  const canAnalyze = !!file && !loading

  const handleAnalyze = async () => {
    if (!canAnalyze) return
    setLoading(true)
    setError(null)

    try {
      if (opportunity) {
        const uploadForm = new FormData()
        uploadForm.append("file", file!)

        const uploadResponse = await fetch("/api/cv/upload", {
          method: "POST",
          body: uploadForm,
        })
        const uploadPayload = await uploadResponse.json()

        if (!uploadResponse.ok) {
          throw new Error(uploadPayload.error || "Impossible d'extraire le contenu du CV")
        }

        const extractedText =
          typeof uploadPayload.extractedText === "string"
            ? uploadPayload.extractedText.trim()
            : ""

        if (extractedText.length < 50) {
          throw new Error("Le contenu extrait du CV est insuffisant pour l'analyse.")
        }

        const persistenceResponse = await csrfFetch("/api/cv/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": crypto.randomUUID(),
          },
          body: JSON.stringify({ extractedText, fileName: file!.name }),
        })
        const persistencePayload = await persistenceResponse.json()

        if (!persistenceResponse.ok) {
          if (persistenceResponse.status === 401) {
            throw new Error("Ta session a expiré. Reconnecte-toi puis relance l'analyse.")
          }
          if (persistenceResponse.status === 402) {
            throw new Error("Crédits insuffisants pour analyser et enregistrer ce CV.")
          }
          throw new Error(persistencePayload.error || "Impossible d'enregistrer l'analyse du CV")
        }

        if (!persistencePayload.success) {
          throw new Error("L'analyse du CV n'a pas pu être enregistrée.")
        }

        const analysisId =
          typeof persistencePayload.analysisId === "string"
            ? persistencePayload.analysisId.trim()
            : ""

        if (!analysisId) {
          throw new Error("L'analyse du CV a été enregistrée sans identifiant exploitable.")
        }

        const workspaceResponse = await csrfFetch(
          `/api/opportunities/${opportunity.id}/workspace`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              selectedCVAnalysisId: analysisId,
              readiness: "IN_PROGRESS",
              preparation: { cvAnalysisId: analysisId, cvAnalyzed: true },
              metadata: { lastCVAnalysisId: analysisId, cvSource: "opportunity-analysis" },
            }),
          },
        )

        if (!workspaceResponse.ok) {
          const workspacePayload = await workspaceResponse.json().catch(() => null)
          throw new Error(
            workspacePayload?.error ||
              "Le CV est analysé mais son rattachement à la candidature a échoué.",
          )
        }
      }

      const form = new FormData()
      form.append("cv", file!)
      form.append("jobDescription", job)

      const res = await fetch("/api/public/analyze-preview", { method: "POST", body: form })
      const analysisResult = await res.json()

      if (!res.ok) {
        throw new Error(analysisResult.error || "Erreur d'analyse")
      }

      setPreview(analysisResult)

      const payload: SavePreviewPayload = {
        atsResult: analysisResult as ATSResult,
        candidateData: { fullName: undefined, email: undefined } as CandidateData,
        jobData: { title: opportunity?.title || job, description: job } as JobData,
      }

      if (!opportunity) {
        await savePreview(payload)
        setShowConversion(true)
      } else {
        setShowConversion(false)
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1120px] px-6 pb-24 pt-10">

        {/* Breadcrumb */}
        {opportunity ? (
          <Link
            href={`/opportunities/${opportunity.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 transition hover:text-violet-800"
          >
            <ArrowLeft className="size-4" />
            Retour à l'opportunité
          </Link>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">

          {/* ============== COLONNE PRINCIPALE ============== */}
          <main className="space-y-6">

            {/* HEADER */}
            <div>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-violet-100">
                  <Zap className="size-4 text-violet-600" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-violet-600">
                  Analyse ATS
                </span>
              </div>
              <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                {opportunity ? "Adapter votre CV à cette offre" : "Diagnostiquer votre CV"}
              </h1>
              <p className="mt-2 text-base leading-relaxed text-foreground-muted">
                {opportunity
                  ? "Mesurez l'alignement réel de votre CV avec cette opportunité avant de candidater."
                  : "Un score objectif, des recommandations concrètes — en 30 secondes."}
              </p>
            </div>

            {/* Opportunité connectée */}
            {opportunity ? (
              <div className="flex items-start gap-4 rounded-xl border border-violet-200 bg-violet-50 p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-100">
                  <Building2 className="size-4 text-violet-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-violet-500">
                    Opportunité ciblée
                  </p>
                  <p className="mt-0.5 text-base font-semibold text-foreground">
                    {opportunity.title}
                  </p>
                  {opportunity.company ? (
                    <p className="text-sm text-foreground-muted">{opportunity.company}</p>
                  ) : null}
                  {opportunity.matchScore !== null ? (
                    <p className="mt-1 text-sm font-medium text-violet-700">
                      Score actuel : {opportunity.matchScore}/100
                      {opportunity.recommendationLabel ? ` · ${opportunity.recommendationLabel}` : ""}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {loading && !file ? (
              <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
                <Loader2 className="size-8 animate-spin text-violet-600" />
                <p className="text-sm font-medium text-foreground-muted">
                  Récupération de votre diagnostic...
                </p>
              </div>
            ) : !preview ? (
              /* ========== FORMULAIRE ÉTAPES ========== */
              <div className="space-y-4">

                {/* Étape 01 — CV */}
                <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-7 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                      1
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-foreground-muted" />
                      <span className="text-sm font-semibold text-foreground">
                        Importez votre CV
                      </span>
                    </div>
                    <span className="ml-auto rounded-full bg-surface-muted px-2 py-0.5 text-xs text-foreground-muted">
                      PDF · DOCX · TXT — max 5 MB
                    </span>
                  </div>
                  <CVUploader file={file} onFile={setFile} />
                </div>

                {/* Étape 02 — Offre */}
                <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-7 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                      2
                    </div>
                    <div className="flex items-center gap-2">
                      <Search className="size-4 text-foreground-muted" />
                      <span className="text-sm font-semibold text-foreground">
                        {opportunity ? "Vérifiez la description de l'offre" : "Collez la description du poste"}
                      </span>
                    </div>
                    {opportunity ? (
                      <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Préremplie
                      </span>
                    ) : null}
                  </div>

                  <JobInput value={job} onChange={setJob} />

                  {opportunity ? (
                    <p className="mt-2 text-xs text-foreground-muted">
                      Pré-remplie depuis l'opportunité — modifiable si besoin.
                    </p>
                  ) : null}
                </div>

                {/* Étape 03 — Lancer */}
                <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex size-7 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                      3
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      Lancez l'analyse
                    </span>
                  </div>

                  {error ? (
                    <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
                      {error}
                    </div>
                  ) : null}

                  <AnalyzeButton disabled={!canAnalyze} loading={loading} onClick={handleAnalyze} />

                  <div className="mt-4 flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    <p className="text-xs leading-relaxed text-foreground-muted">
                      Trajectoire reformule uniquement ce qui est déjà dans votre CV.
                      Aucune expérience fictive ne sera ajoutée.
                    </p>
                  </div>
                </div>
              </div>

            ) : (
              /* ========== RÉSULTATS ========== */
              <div className="space-y-6">
                <PremiumATSResult
                  score={preview.score}
                  radarDimensions={preview.radarDimensions}
                  strengths={preview.strengths}
                  weaknesses={[preview.weakness]}
                  recommendations={preview.recommendations}
                  isAuthenticated={isAuthenticated}
                  hasPremiumAccess={hasPremiumAccess}
                />

                {opportunity && file ? (
                  <OpportunityCVTailoring file={file} opportunity={opportunity} />
                ) : null}
              </div>
            )}

            {showConversion && preview ? (
              <ConversionPanel atsScore={preview.score} onContinue={() => setShowConversion(false)} />
            ) : null}
          </main>

          {/* ============== COLONNE LATÉRALE ============== */}
          <aside className="h-fit rounded-xl bg-foreground p-6 text-background lg:sticky lg:top-8">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-violet-500/20">
                <Sparkles className="size-4 text-violet-300" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-background/50">
                CV Targeting IA
              </span>
            </div>

            <h2 className="mt-4 font-serif text-xl font-medium leading-snug text-background">
              Votre parcours contient déjà les preuves. On les rend visibles.
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-background/60">
              Le but n'est pas d'inventer un meilleur candidat. C'est de rendre
              immédiatement lisibles les preuves que vous avez déjà accumulées.
            </p>

            {opportunity ? (
              <div className="mt-6 space-y-5">
                {opportunity.strengths.length > 0 ? (
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                      ✓ Vos forces détectées
                    </p>
                    <ul className="space-y-2">
                      {opportunity.strengths.slice(0, 3).map((s) => (
                        <li key={s} className="flex gap-2 text-sm leading-5 text-background/70">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-400" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {opportunity.gaps.length > 0 ? (
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                      → À mieux démontrer
                    </p>
                    <ul className="space-y-2">
                      {opportunity.gaps.slice(0, 3).map((g) => (
                        <li key={g} className="flex gap-2 text-sm leading-5 text-background/70">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-400" />
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="mt-6 text-sm leading-relaxed text-background/50">
                Connectez une opportunité pour voir automatiquement vos forces et écarts ici.
              </p>
            )}

            <div className="mt-6 border-t border-background/10 pt-5">
              <p className="text-xs text-background/40">
                Analyse basée sur votre CV importé × la description du poste.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}