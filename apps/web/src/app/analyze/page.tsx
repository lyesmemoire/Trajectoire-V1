"use client"

import { useState } from "react"
import { CVUploader } from "@/components/analyze/CVUploader"
import { JobInput } from "@/components/analyze/JobInput"
import { AnalyzeButton } from "@/components/analyze/AnalyzeButton"
import { usePreviewStorage } from "@/hooks/usePreviewStorage"
import { SavePreviewPayload, ATSResult, CandidateData, JobData } from "@/types/preview"
import { PremiumATSResult } from "@/components/analyze/PremiumATSResult"
import { ConversionPanel } from "@/components/conversion/ConversionPanel"

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null)
  const [job, setJob] = useState("")
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showConversion, setShowConversion] = useState(false)
  
  const { savePreview, loading: previewLoading } = usePreviewStorage()

  const canAnalyze = !!file && !loading

  const handleAnalyze = async () => {
    if (!canAnalyze) return
    
    setLoading(true)
    setError(null)

    try {
      const form = new FormData()
      form.append("cv", file!)
      form.append("jobDescription", job)

      const res = await fetch("/api/public/analyze-preview", {
        method: "POST",
        body: form,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur d'analyse")
      }

      const analysisResult = await res.json()
      setPreview(analysisResult)

      // Sauvegarder automatiquement la preview
      const payload: SavePreviewPayload = {
        atsResult: analysisResult as ATSResult,
        candidateData: {
          fullName: undefined,
          email: undefined,
        } as CandidateData,
        jobData: {
          title: job,
          description: job,
        } as JobData,
      }

      await savePreview(payload)

      // Afficher le panneau de conversion après l'analyse
      setShowConversion(true)
    } catch (e: any) {
      setError(e instanceof Error ? e.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen text-ink-900 pt-16 pb-24 px-6">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        
        {/* En-tête de la page */}
        <h1 className="text-4xl font-serif font-bold text-ink-900 mb-4 text-center">
          Analysez votre CV
        </h1>
        <p className="text-lg text-ink-600 mb-10 text-center">
          Score objectif. Recommandations concrètes. En 30 secondes.
        </p>

        {/* Bloc principal blanc (comme sur la home) */}
        {!preview ? (
          <div className="w-full bg-white p-8 rounded-2xl border border-ivoire-200 shadow-sm shadow-ivoire-200/50 space-y-6">
            
            <CVUploader file={file} onFile={setFile} />
            
            <JobInput value={job} onChange={setJob} />
            
            {error && (
              <p className="text-brick-500 text-sm text-center">{error}</p>
            )}
            
            <AnalyzeButton
              disabled={!canAnalyze}
              loading={loading}
              onClick={handleAnalyze}
            />
            
            <p className="text-xs text-ink-500 text-center pt-2">
              Vos données ne sont pas conservées sans votre accord.
            </p>
          </div>
        ) : (
          <PremiumATSResult
            score={preview.score}
            radarDimensions={preview.radarDimensions}
            strengths={preview.strengths}
            weaknesses={[preview.weakness]}
            recommendations={preview.recommendations}
          />
        )}

        {/* Conversion Panel */}
        {showConversion && preview && (
          <ConversionPanel
            atsScore={preview.score}
            onContinue={() => setShowConversion(false)}
          />
        )}

      </div>
    </div>
  )
}
