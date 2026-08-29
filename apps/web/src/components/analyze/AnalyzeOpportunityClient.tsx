"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowLeft,
  Building2,
  FileSearch,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react"

import { CVUploader } from "@/components/analyze/CVUploader"
import { JobInput } from "@/components/analyze/JobInput"
import { AnalyzeButton } from "@/components/analyze/AnalyzeButton"
import { PremiumATSResult } from "@/components/analyze/PremiumATSResult"
import { OpportunityCVTailoring } from "@/components/analyze/OpportunityCVTailoring"
import { ConversionPanel } from "@/components/conversion/ConversionPanel"
import { usePreviewStorage } from "@/hooks/usePreviewStorage"
import { csrfFetch } from "@/lib/security/csrf-client"
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
}

export function AnalyzeOpportunityClient({
  opportunity,
}: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [job, setJob] = useState(
    opportunity?.description ?? "",
  )
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showConversion, setShowConversion] = useState(false)

  const { savePreview } = usePreviewStorage()

  const canAnalyze = !!file && !loading

  const handleAnalyze = async () => {
    if (!canAnalyze) return

    setLoading(true)
    setError(null)

    try {
      /*
       * Opportunity flow:
       * 1. Extract CV text with the authenticated upload endpoint.
       * 2. Persist a real CVAnalysis + CareerProfile.
       * 3. Keep the existing job-specific preview for the current ATS UI.
       *
       * General /analyze keeps the lightweight public preview flow.
       */
      if (opportunity) {
        const uploadForm = new FormData()
        uploadForm.append("file", file!)

        const uploadResponse = await fetch("/api/cv/upload", {
          method: "POST",
          body: uploadForm,
        })

        const uploadPayload = await uploadResponse.json()

        if (!uploadResponse.ok) {
          throw new Error(
            uploadPayload.error ||
              "Impossible d'extraire le contenu du CV",
          )
        }

        const extractedText =
          typeof uploadPayload.extractedText === "string"
            ? uploadPayload.extractedText.trim()
            : ""

        if (extractedText.length < 50) {
          throw new Error(
            "Le contenu extrait du CV est insuffisant pour l'analyse.",
          )
        }

        const persistenceResponse = await csrfFetch("/api/cv/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": crypto.randomUUID(),
          },
          body: JSON.stringify({
            extractedText,
            fileName: file!.name,
          }),
        })

        const persistencePayload =
          await persistenceResponse.json()

        if (!persistenceResponse.ok) {
          if (persistenceResponse.status === 401) {
            throw new Error(
              "Ta session a expiré. Reconnecte-toi puis relance l'analyse.",
            )
          }

          if (persistenceResponse.status === 402) {
            throw new Error(
              "Crédits insuffisants pour analyser et enregistrer ce CV.",
            )
          }

          throw new Error(
            persistencePayload.error ||
              "Impossible d'enregistrer l'analyse du CV",
          )
        }

        if (!persistencePayload.success) {
          throw new Error(
            "L'analyse du CV n'a pas pu être enregistrée.",
          )
        }

        const analysisId =
          typeof persistencePayload.analysisId === "string"
            ? persistencePayload.analysisId.trim()
            : ""

        if (!analysisId) {
          throw new Error(
            "L'analyse du CV a été enregistrée sans identifiant exploitable.",
          )
        }

        const workspaceResponse = await csrfFetch(
          `/api/opportunities/${opportunity.id}/workspace`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              selectedCVAnalysisId:
                analysisId,
              readiness:
                "IN_PROGRESS",
              preparation: {
                cvAnalysisId:
                  analysisId,
                cvAnalyzed:
                  true,
              },
              metadata: {
                lastCVAnalysisId:
                  analysisId,
                cvSource:
                  "opportunity-analysis",
              },
            }),
          },
        )

        if (!workspaceResponse.ok) {
          const workspacePayload =
            await workspaceResponse
              .json()
              .catch(() => null)

          throw new Error(
            workspacePayload?.error ||
              "Le CV est analysé mais son rattachement à la candidature a échoué.",
          )
        }
      }

      const form = new FormData()

      form.append("cv", file!)
      form.append("jobDescription", job)

      const res = await fetch("/api/public/analyze-preview", {
        method: "POST",
        body: form,
      })

      const analysisResult = await res.json()

      if (!res.ok) {
        throw new Error(
          analysisResult.error || "Erreur d'analyse",
        )
      }

      setPreview(analysisResult)

      const payload: SavePreviewPayload = {
        atsResult: analysisResult as ATSResult,
        candidateData: {
          fullName: undefined,
          email: undefined,
        } as CandidateData,
        jobData: {
          title: opportunity?.title || job,
          description: job,
        } as JobData,
      }

      if (!opportunity) {
        await savePreview(payload)
        setShowConversion(true)
      } else {
        setShowConversion(false)
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Erreur inconnue",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 pb-24 pt-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        {opportunity ? (
          <Link
            href={`/opportunities/${opportunity.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'opportunité
          </Link>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <main>
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <FileSearch className="h-5 w-5" />
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight">
                {opportunity
                  ? "Adapter mon CV à cette offre"
                  : "Analysez votre CV"}
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                {opportunity
                  ? "Mesure l'alignement réel de ton CV avec cette opportunité avant de candidater."
                  : "Score objectif. Recommandations concrètes. En 30 secondes."}
              </p>
            </div>

            {opportunity ? (
              <section className="mt-7 rounded-[26px] border border-violet-100 bg-violet-50/70 p-5">
                <div className="flex items-start gap-3">
                  <Target className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
                      Opportunité connectée
                    </p>

                    <p className="mt-2 text-lg font-bold text-slate-950">
                      {opportunity.title}
                    </p>

                    {opportunity.company ? (
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                        <Building2 className="h-4 w-4" />
                        {opportunity.company}
                      </p>
                    ) : null}

                    {opportunity.matchScore !== null ? (
                      <p className="mt-3 text-sm font-semibold text-violet-900">
                        Opportunity Score actuel :{" "}
                        {opportunity.matchScore}/100
                        {opportunity.recommendationLabel
                          ? ` · ${opportunity.recommendationLabel}`
                          : ""}
                      </p>
                    ) : null}
                  </div>
                </div>
              </section>
            ) : null}

            {!preview ? (
              <section className="mt-6 space-y-6 rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
                <CVUploader
                  file={file}
                  onFile={setFile}
                />

                <div>
                  {opportunity ? (
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-slate-800">
                        Offre ciblée
                      </p>

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        Préremplie
                      </span>
                    </div>
                  ) : null}

                  <JobInput
                    value={job}
                    onChange={setJob}
                  />

                  {opportunity ? (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      La description provient automatiquement de
                      l'opportunité. Tu peux encore la corriger avant
                      l'analyse.
                    </p>
                  ) : null}
                </div>

                {error ? (
                  <p className="rounded-2xl bg-rose-50 p-3 text-center text-sm font-semibold text-rose-700">
                    {error}
                  </p>
                ) : null}

                <AnalyzeButton
                  disabled={!canAnalyze}
                  loading={loading}
                  onClick={handleAnalyze}
                />

                <div className="flex items-start gap-2 rounded-2xl bg-slate-50 p-4">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                  <p className="text-xs leading-5 text-slate-600">
                    Trajectoire peut reformuler et mieux positionner
                    uniquement les informations présentes dans ton CV.
                    Aucune expérience, compétence ou performance ne doit
                    être inventée.
                  </p>
                </div>
              </section>
            ) : (
              <div className="mt-6">
                <PremiumATSResult
                  score={preview.score}
                  radarDimensions={preview.radarDimensions}
                  strengths={preview.strengths}
                  weaknesses={[preview.weakness]}
                  recommendations={preview.recommendations}
                />

                {opportunity && file ? (
                  <OpportunityCVTailoring
                    file={file}
                    opportunity={opportunity}
                  />
                ) : null}
              </div>
            )}

            {showConversion && preview ? (
              <ConversionPanel
                atsScore={preview.score}
                onContinue={() => setShowConversion(false)}
              />
            ) : null}
          </main>

          <aside className="h-fit rounded-[28px] bg-slate-950 p-6 text-white lg:sticky lg:top-6">
            <Sparkles className="h-6 w-6 text-violet-300" />

            <h2 className="mt-4 text-xl font-bold">
              CV Targeting
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Le but n'est pas de fabriquer un meilleur candidat.
              Le but est de rendre visibles les preuves déjà présentes
              dans ton parcours.
            </p>

            {opportunity ? (
              <div className="mt-6 space-y-5">
                {opportunity.strengths.length > 0 ? (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-300">
                      Forces détectées
                    </p>

                    <div className="mt-3 space-y-2">
                      {opportunity.strengths
                        .slice(0, 3)
                        .map((strength) => (
                          <p
                            key={strength}
                            className="text-sm leading-5 text-slate-300"
                          >
                            • {strength}
                          </p>
                        ))}
                    </div>
                  </div>
                ) : null}

                {opportunity.gaps.length > 0 ? (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-amber-300">
                      À mieux démontrer
                    </p>

                    <div className="mt-3 space-y-2">
                      {opportunity.gaps
                        .slice(0, 3)
                        .map((gap) => (
                          <p
                            key={gap}
                            className="text-sm leading-5 text-slate-300"
                          >
                            • {gap}
                          </p>
                        ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="mt-6 text-sm leading-6 text-slate-400">
                Depuis une opportunité, Trajectoire peut
                automatiquement charger le poste ciblé ici.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}