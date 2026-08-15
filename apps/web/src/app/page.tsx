"use client"

import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useMemo,
  useRef,
  useState,
} from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Lock,
  Mic,
  Target,
  Upload,
  X,
} from "lucide-react"
import { PreviewTokenManager } from "@/lib/preview-analysis/previewTokenManager"

const heroImage = "/images/hero-professional.jpg"
const MAX_FILE_SIZE = 10 * 1024 * 1024

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

  return [".pdf", ".doc", ".docx"].some((extension) =>
    name.endsWith(extension)
  )
}

export default function HomePage() {
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
        "Format non pris en charge. Utilisez un PDF, DOC ou DOCX."
      )

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      return
    }

    if (nextFile.size > MAX_FILE_SIZE) {
      setFile(null)
      setError(
        `Votre CV ne doit pas dépasser 10 Mo (actuel : ${formatBytes(
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
  const ctaLabel = "Obtenir mon diagnostic"

  return (
    <main className="relative min-h-[calc(100dvh-73px)] bg-ivoire-50 text-ink-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 500px at 18% 12%, rgba(156,111,62,0.07), transparent 60%)," +
            "radial-gradient(700px 450px at 85% 10%, rgba(212,184,150,0.06), transparent 55%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-6 pb-14 lg:pt-8 lg:pb-16">
        <div className="mx-auto w-full max-w-[1120px]">
          <div className="grid gap-8 lg:grid-cols-[540px_540px] lg:justify-center lg:gap-12 lg:items-start">
            {/* ─────────────────────────────
                COLONNE GAUCHE
            ───────────────────────────── */}
            <section className="flex w-full flex-col items-start gap-5">
              <h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
                Avancez sereinement
                <br />
                vers votre
                <br />
                prochain entretien.
              </h1>

              <p className="max-w-[46ch] leading-7 text-ink-700">
                Importez votre CV et obtenez un diagnostic immédiat. Vous
                pouvez aussi coller l’annonce pour rendre l’analyse encore
                plus ciblée.
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-600">
                <span className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  Confidentiel
                </span>

                <span aria-hidden="true" className="opacity-60">
                  •
                </span>

                <span>Résultat immédiat</span>

                <span aria-hidden="true" className="opacity-60">
                  •
                </span>

                <span>Sans engagement</span>
              </div>

              {/* ─────────────────────────────
                  FORMULAIRE PRINCIPAL
              ───────────────────────────── */}
              <form
                onSubmit={handleAnalyze}
                className="w-full rounded-2xl border border-ivoire-200 bg-white/90 p-4 shadow-premium backdrop-blur lg:border-ivoire-300"
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
                      ? "border-ivoire-300 bg-ivoire-50"
                      : "border-ivoire-300 bg-ivoire-50/60 hover:bg-ivoire-50",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-ink-900 text-white">
                      {file ? (
                        <CheckCircle2
                          className="size-5"
                          aria-hidden="true"
                        />
                      ) : (
                        <Upload className="size-5" aria-hidden="true" />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {file ? file.name : "Ajoutez votre CV"}
                      </p>

                      <p className="text-sm text-ink-500">
                        {fileMeta ?? "PDF, DOC ou DOCX · 10 Mo maximum"}
                      </p>
                    </div>

                    {file && (
                      <button
                        type="button"
                        onClick={resetFile}
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-lg border border-ivoire-200 bg-white px-2.5 py-2 text-sm text-ink-500 transition-colors hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-50 lg:border-ivoire-300"
                        aria-label="Retirer le fichier"
                      >
                        <X className="size-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>

                  <label className="mt-3 block cursor-pointer text-sm font-medium text-ink-900">
                    <span className="inline-flex items-center gap-2">
                      <span className="underline underline-offset-4">
                        Choisir un fichier
                      </span>

                      <span className="text-ink-500">
                        (ou glisser-déposer)
                      </span>
                    </span>

                    <input
                      ref={fileInputRef}
                      className="sr-only"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      disabled={loading}
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {/* Notice */}
                {notice && !error && (
                  <div className="mt-3 rounded-xl border border-ivoire-200 bg-ivoire-50 px-4 py-3 text-sm text-ink-700 lg:border-ivoire-300">
                    {notice}
                  </div>
                )}

                {/* Erreur */}
                {error && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
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
                    mt-3 flex w-full min-h-[52px] items-center justify-center gap-2 rounded-xl
                    bg-gradient-to-b from-ink-900 to-ink-800
                    px-5 py-3.5 text-[15px] font-semibold text-white
                    shadow-premium-lg
                    border border-bronze-400/18
                    ring-1 ring-bronze-400/35
                    transition-all duration-200 ease-premium
                    hover:-translate-y-[1px] hover:ring-bronze-400/60 hover:border-bronze-400/28
                    active:translate-y-0 active:shadow-premium
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze-400
                    focus-visible:ring-offset-2 focus-visible:ring-offset-ivoire-50
                    disabled:cursor-not-allowed disabled:opacity-70
                    disabled:hover:translate-y-0
                  "
                >
                  {loading ? (
                    <>
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                      Analyse en cours…
                    </>
                  ) : (
                    <>
                      {ctaLabel}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </>
                  )}
                </button>

                <p className="mt-2 text-center text-xs text-ink-500">
                  Ajoutez votre CV pour démarrer. L’annonce est optionnelle.
                </p>

                {/* Annonce optionnelle */}
                <details className="mt-3 rounded-xl border border-ivoire-200 bg-white px-4 py-3 lg:border-ivoire-300">
                  <summary className="cursor-pointer text-sm font-medium text-ink-900 outline-none focus-visible:ring-2 focus-visible:ring-bronze-400">
                    Ajouter l’annonce (optionnel)
                  </summary>

                  <div className="mt-3">
                    <textarea
                      value={job}
                      onChange={(event) => setJob(event.target.value)}
                      placeholder="Collez l’annonce (missions, profil recherché, compétences, outils, etc.)"
                      rows={5}
                      disabled={loading}
                      className="w-full resize-none rounded-xl border border-ivoire-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-ink-400 focus-visible:ring-2 focus-visible:ring-bronze-400 disabled:cursor-not-allowed disabled:bg-ivoire-50 lg:border-ivoire-300"
                    />

                    <p className="mt-2 text-xs text-ink-500">
                      Plus l’annonce est détaillée, plus l’analyse et les
                      questions seront ciblées.
                    </p>
                  </div>
                </details>

                {/* Fonctionnalités */}
                <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-ink-500">
                  {features.map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-ivoire-200 bg-white px-3 py-1 lg:border-ivoire-300"
                    >
                      <Icon className="size-3.5" aria-hidden="true" />
                      {label}
                    </span>
                  ))}
                </div>

                <p className="mt-3 text-center text-xs text-ink-500">
                  Vos documents restent privés. Vous gardez la main sur ce
                  que vous partagez.
                </p>
              </form>

              {/* Réassurance */}
              <div className="mt-3 mb-2 flex w-full items-center justify-start">
                <div className="inline-flex items-center gap-3 rounded-full border border-ivoire-200 bg-white/85 px-5 py-2 shadow-premium backdrop-blur lg:border-ivoire-300">
                  <div className="flex -space-x-2" aria-hidden="true">
                    {["A", "M", "S", "L"].map((initial) => (
                      <span
                        key={initial}
                        className="flex size-8 items-center justify-center rounded-full border-2 border-ivoire-50 bg-white text-xs font-semibold text-ink-900 shadow-sm"
                      >
                        {initial}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm leading-snug text-ink-700">
                    Conçu pour des profils{" "}
                    <span className="font-semibold text-ink-900">
                      juniors, seniors
                    </span>{" "}
                    et en{" "}
                    <span className="font-semibold text-ink-900">
                      reconversion
                    </span>
                    .
                  </p>
                </div>
              </div>
            </section>

            {/* ─────────────────────────────
                IMAGE HERO
            ───────────────────────────── */}
            <aside className="relative w-full overflow-hidden rounded-3xl border border-ivoire-200 bg-white shadow-premium lg:mt-8 lg:border-ivoire-300">
              <div className="relative h-[340px] w-full sm:h-[420px] lg:h-[620px]">
                <Image
                  src={heroImage}
                  alt="Préparation d’entretien dans un contexte professionnel"
                  fill
                  sizes="(max-width: 1024px) 100vw, 540px"
                  className="object-cover object-center"
                  priority
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}