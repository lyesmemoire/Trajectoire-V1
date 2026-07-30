"use client"

import { useState } from "react"
import { CVUploader } from "@/components/analyze/CVUploader"
import { JobInput } from "@/components/analyze/JobInput"
import { AnalyzeButton } from "@/components/analyze/AnalyzeButton"

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null)
  const [job, setJob] = useState("")
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

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

      setPreview(await res.json())
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
          <div className="w-full bg-white p-8 rounded-2xl border border-ivoire-200 shadow-sm shadow-ivoire-200/50">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Résultat de l'analyse</h2>
            <div className="bg-ivoire-50 p-4 rounded-lg">
              <pre className="text-sm text-ink-700 whitespace-pre-wrap">{JSON.stringify(preview, null, 2)}</pre>
            </div>
            <button
              onClick={() => {
                setPreview(null)
                setFile(null)
                setJob("")
              }}
              className="mt-4 w-full py-3 bg-ink-900 text-white rounded-lg hover:bg-ink-800 transition-colors"
            >
              Nouvelle analyse
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
