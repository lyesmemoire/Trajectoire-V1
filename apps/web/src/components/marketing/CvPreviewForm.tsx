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
  FileText,
  Loader2,
  Mic,
  Target,
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

const features = [
  { icon: Mic, label: "Simulation vocale" },
  { icon: FileText, label: "Analyse de CV" },
  { icon: Target, label: "Feedback personnalisé" },
]

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

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
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
          "Réponse invalide du serveur : token de prévisualisation manquant."
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
      className="w-full rounded-2xl border border-calm-line bg-calm-surface/90 p-4 shadow-premium backdrop-blur lg:border-calm-line"
    >
      {/* Upload CV */}
      <div
        onDragOver={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
        onDrop={handleDrop}
        className={[
          "rounded-xl border border-dashed p-3 transition-colors",
          file
            ? "border-calm-line bg-calm-bg"
            : "border-calm-line bg-calm-bg/60 hover:bg-calm-bg",
        ].join(" ")}
      >
        <div className="flex items-center gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-calm-accent text-calm-ink">
            {file ? (
              <CheckCircle2 className="size-5" aria-hidden="true" />
            ) : (
              <Upload className="size-5" aria-hidden="true" />
            )}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">
              {file ? file.name : "Ajoutez votre CV"}
            </p>

            <p className="text-sm text-calm-secondary">
              {fileMeta ?? `PDF, DOCX ou TXT · ${CV_MAX_FILE_SIZE_LABEL} maximum`}
            </p>
          </div>

          {file && (
            <button
              type="button"
              onClick={resetFile}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg border border-calm-line bg-calm-surface px-2.5 py-2 text-sm text-calm-secondary transition-colors hover:text-calm-ink disabled:cursor-not-allowed disabled:opacity-50 lg:border-calm-line"
              aria-label="Retirer le fichier"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <label className="mt-3 block cursor-pointer text-sm font-medium text-calm-ink">
          <span className="inline-flex items-center gap-2">
            <span className="underline underline-offset-4">
              Choisir un fichier
            </span>

            <span className="text-calm-secondary">(ou glisser-déposer)</span>
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
      </div>

      {/* Notice */}
      {notice && !error && (
        <div className="mt-3 rounded-xl border border-calm-line bg-calm-bg px-4 py-3 text-sm text-calm-secondary lg:border-calm-line">
          {notice}
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-3 rounded-xl border border-calm-warn-line bg-calm-warn-soft px-4 py-3 text-sm text-calm-warn"
        >
          {error}
        </div>
      )}

      {/* CTA */}
      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="
          mt-3 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl
          border border-transparent
          bg-calm-accent
          px-5 py-3.5 text-[15px] font-semibold text-white
          shadow-calm
          transition-all duration-200 ease-premium
          hover:bg-calm-accent-deep
          active:translate-y-0 active:shadow-premium
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-calm-accent
          focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg
          disabled:cursor-not-allowed disabled:opacity-70
          disabled:hover:translate-y-0
        "
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

      <p className="mt-2 text-center text-xs text-calm-secondary">
        Ajoutez votre CV pour démarrer. L’annonce est optionnelle.
      </p>

      {/* Annonce optionnelle */}
      <details className="mt-3 rounded-xl border border-calm-line bg-calm-surface px-4 py-3 lg:border-calm-line">
        <summary className="cursor-pointer text-sm font-medium text-calm-ink outline-none focus-visible:ring-2 focus-visible:ring-calm-accent">
          Ajouter l’annonce (optionnel)
        </summary>

        <div className="mt-3">
          <textarea
            value={job}
            onChange={(event) => setJob(event.target.value)}
            placeholder="Collez l’annonce (missions, profil recherché, compétences, outils, etc.)"
            rows={5}
            disabled={loading}
            className="w-full resize-none rounded-xl border border-calm-line bg-calm-surface px-4 py-3 text-sm outline-none placeholder:text-ink-400 focus-visible:ring-2 focus-visible:ring-calm-accent disabled:cursor-not-allowed disabled:bg-calm-bg lg:border-calm-line"
          />

          <p className="mt-2 text-xs text-calm-secondary">
            Plus l’annonce est détaillée, plus l’analyse et les questions seront
            ciblées.
          </p>
        </div>
      </details>

      {/* Fonctionnalités */}
      <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-calm-secondary">
        {features.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full border border-calm-line bg-calm-surface px-3 py-1 lg:border-calm-line"
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-calm-secondary">
        Vos documents restent privés. Vous gardez la main sur ce que vous
        partagez.
      </p>
    </form>
  )
}
