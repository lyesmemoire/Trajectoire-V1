"use client"

import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useMemo,
  useRef,
  useState,
} from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Upload,
  X,
} from "lucide-react"
import { PreviewTokenManager } from "@/lib/preview-analysis/previewTokenManager"
import {
  CV_ACCEPT_ATTRIBUTE,
  CV_ACCEPT_EXTENSIONS,
  CV_MAX_FILE_SIZE,
  CV_MAX_FILE_SIZE_LABEL,
} from "@/lib/cv/cv-limits"

/**
 * Dépôt du CV de la page d'accueil : seule partie interactive de la page (sélection du fichier, glisser-déposer,
 * appel de l'aperçu gratuit). Isolée ici pour que le reste de la page reste un composant serveur, rendu sans
 * hydratation.
 */

type AnalyzePreviewResponse = {
  previewToken?: string
  message?: string
  error?: string
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return ""

  const units = ["B", "KB", "MB", "GB"]
  let index = 0
  let size = bytes

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index++
  }

  return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}

function isAllowedFile(file: File) {
  const name = file.name.toLowerCase()

  return CV_ACCEPT_EXTENSIONS.some((extension) =>
    name.endsWith(extension)
  )
}

export function CvPreviewForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [job, setJob] = useState("")
  const [showJob, setShowJob] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  const fileMeta = useMemo(() => {
    if (!file) return null

    const extension = file.name.split(".").pop()?.toUpperCase() ?? ""

    return `${formatBytes(file.size)} · ${extension}`
  }, [file])

  const resetFile = () => {
    setFile(null)
    setError("")
    setNotice("")

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateFile = (nextFile: File | null) => {
    setError("")
    setNotice("")

    if (!nextFile) {
      setFile(null)
      return
    }

    if (!isAllowedFile(nextFile)) {
      setFile(null)
      setError(
        "Format non pris en charge. Utilisez un PDF, un DOCX ou un TXT."
      )

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      return
    }

    if (nextFile.size > CV_MAX_FILE_SIZE) {
      setFile(null)
      setError(
        `Votre CV ne doit pas dépasser ${CV_MAX_FILE_SIZE_LABEL} (actuel : ${formatBytes(
          nextFile.size
        )}).`
      )

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      return
    }

    setFile(nextFile)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    validateFile(event.target.files?.[0] ?? null)
  }

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (loading) return

    validateFile(event.dataTransfer.files?.[0] ?? null)
  }

  const openFilePicker = () => {
    if (loading) return

    setError("")
    setNotice("Ajoutez votre CV pour lancer l’analyse.")

    // Permet de sélectionner à nouveau exactement le même fichier.
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
      fileInputRef.current.click()
    }
  }

  const handleAnalyze = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (loading) return

    if (!file) {
      openFilePicker()
      return
    }

    setLoading(true)
    setError("")
    setNotice("")

    try {
      const formData = new FormData()

      formData.append("cv", file)

      const trimmedJob = job.trim()

      if (trimmedJob) {
        formData.append("jobDescription", trimmedJob)
      }

      const response = await fetch("/api/public/analyze-preview", {
        method: "POST",
        body: formData,
      })

      let data: AnalyzePreviewResponse | null = null

      try {
        data = (await response.json()) as AnalyzePreviewResponse
      } catch {
        data = null
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "La demande n’a pas pu être traitée pour le moment."
        )
      }

      if (!data?.previewToken) {
        throw new Error(
          "Réponse invalide du serveur : token de prévisualisation manquant."
        )
      }

      PreviewTokenManager.setSessionToken(data.previewToken)

      router.push(
        `/analyze?preview=${encodeURIComponent(data.previewToken)}`
      )
    } catch (requestError) {
      console.error("Preview analysis failed:", requestError)

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Une erreur est survenue. Veuillez réessayer."
      )

      setLoading(false)
    }
  }

  // CTA principal fixe : il ne change jamais de libellé.
  const ctaLabel = "Obtenir mon diagnostic gratuit"

  return (
    <form
      onSubmit={handleAnalyze}
      className="w-full rounded-[22px] border border-calm-line bg-calm-surface p-5 shadow-calm sm:p-6"
    >
      {/* Dépôt du CV : toute la zone est cliquable (étiquette du champ fichier) */}
      <label
        onDragOver={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
        onDrop={handleDrop}
        className={[
          "flex min-h-[132px] cursor-pointer flex-col items-center justify-center gap-1 rounded-[18px] border-2 border-dashed border-calm-accent-line bg-calm-accent-wash p-5 text-center transition-colors hover:bg-calm-accent-soft",
          "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-calm-accent",
          loading ? "pointer-events-none opacity-70" : "",
        ].join(" ")}
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-calm-accent-soft text-calm-accent-deep">
          {file ? <CheckCircle2 className="size-5" aria-hidden="true" /> : <Upload className="size-5" aria-hidden="true" />}
        </span>
        <span className="mt-1 max-w-full truncate font-semibold text-calm-ink">{file ? file.name : "Déposez votre CV"}</span>
        <span className="text-sm text-calm-secondary">
          {fileMeta ?? `PDF, DOCX ou TXT · ${CV_MAX_FILE_SIZE_LABEL} maximum`}
        </span>
        <input
          ref={fileInputRef}
          className="sr-only"
          type="file"
          accept={CV_ACCEPT_ATTRIBUTE}
          disabled={loading}
          onChange={handleFileChange}
        />
      </label>

      {file && (
        <button
          type="button"
          onClick={resetFile}
          disabled={loading}
          className="tap-target mt-2 inline-flex items-center gap-2 rounded-[14px] px-3 text-sm text-calm-secondary transition-colors hover:text-calm-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="size-4" aria-hidden="true" />
          Retirer le fichier
        </button>
      )}

      {/* Notice */}
      {notice && !error && (
        <div className="mt-3 rounded-[14px] border border-calm-line bg-calm-bg px-4 py-3 text-sm text-calm-secondary">{notice}</div>
      )}

      {/* Erreur */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-3 rounded-[14px] border border-calm-warn-line bg-calm-warn-soft px-4 py-3 text-sm text-calm-warn"
        >
          {error}
        </div>
      )}

      {/* CTA principal (unique) */}
      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="tap-target mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-calm-accent px-5 py-3.5 text-[15px] font-semibold text-white shadow-calm transition-colors hover:bg-calm-accent-deep disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Analyse en cours…
          </>
        ) : (
          <>
            {ctaLabel}
            <ArrowRight className="size-4" aria-hidden="true" />
          </>
        )}
      </button>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <button
          type="button"
          aria-expanded={showJob}
          aria-controls="offre-visee"
          onClick={() => setShowJob((v) => !v)}
          className="tap-target rounded-[14px] px-1 text-sm font-semibold text-calm-accent-deep underline-offset-4 hover:underline"
        >
          {showJob ? "− Masquer l’offre visée" : "+ Ajouter l’offre visée"}
        </button>
        <p className="text-sm text-calm-secondary">Gratuit · sans carte bancaire · résultat en 1 minute</p>
      </div>

      <div id="offre-visee" hidden={!showJob} className="mt-2">
        <label htmlFor="offre-texte" className="sr-only">
          Texte de l’offre visée
        </label>
        <textarea
          id="offre-texte"
          value={job}
          onChange={(event) => setJob(event.target.value)}
          placeholder="Collez l’offre (missions, profil recherché, compétences, outils…)"
          rows={5}
          disabled={loading}
          className="w-full resize-none rounded-[14px] border border-calm-input bg-calm-surface px-4 py-3 text-sm text-calm-ink placeholder:text-calm-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-calm-accent disabled:cursor-not-allowed disabled:bg-calm-bg"
        />
        <p className="mt-2 text-xs text-calm-secondary">
          Plus l’offre est détaillée, plus les questions seront ciblées.
        </p>
      </div>
    </form>
  )
}
