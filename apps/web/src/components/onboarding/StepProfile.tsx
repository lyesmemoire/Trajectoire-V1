"use client"

import { useRef } from "react"
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  BUTTON_GHOST,
  CV_ACCEPT,
  CV_ALLOWED_EXTENSIONS,
  CV_MAX_BYTES,
  CV_NOTICE,
  FOCUS_RING,
  type OnboardingFormData,
} from "./constants"

interface StepProfileProps {
  data: OnboardingFormData
  onChange: (patch: Partial<OnboardingFormData>) => void
}

async function readUploadError(response: Response): Promise<string> {
  if (response.status === 401) {
    return "Votre session a expiré. Reconnectez-vous puis réessayez."
  }

  const payload = (await response.json().catch(() => null)) as {
    error?: string
    hint?: string
  } | null

  return (
    [payload?.error, payload?.hint].filter(Boolean).join(" ") ||
    "Impossible de lire ce CV."
  )
}

export function StepProfile({ data, onChange }: StepProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? ""

    if (!(CV_ALLOWED_EXTENSIONS as readonly string[]).includes(extension)) {
      onChange({
        cvStatus: "error",
        cvFileName: "",
        cvError: "Format non supporté. Utilisez un PDF ou un DOCX.",
      })
      return
    }

    if (file.size === 0) {
      onChange({ cvStatus: "error", cvFileName: "", cvError: "Le fichier est vide." })
      return
    }

    if (file.size > CV_MAX_BYTES) {
      onChange({
        cvStatus: "error",
        cvFileName: "",
        cvError: "Fichier trop volumineux. Maximum 8 Mo.",
      })
      return
    }

    onChange({ cvStatus: "uploading", cvFileName: file.name, cvError: "" })

    try {
      const body = new FormData()
      body.append("file", file)

      const response = await fetch("/api/cv/upload", { method: "POST", body })

      if (!response.ok) {
        onChange({
          cvStatus: "error",
          cvFileName: "",
          cvError: await readUploadError(response),
        })
        return
      }

      // Le texte extrait est volontairement ignoré : l'onboarding ne stocke
      // ni n'analyse le CV (l'analyse se lance depuis le tableau de bord).
      onChange({ cvStatus: "ready", cvFileName: file.name, cvError: "" })
    } catch {
      onChange({
        cvStatus: "error",
        cvFileName: "",
        cvError: "Impossible d'envoyer le fichier. Vérifiez votre connexion.",
      })
    }
  }

  const uploading = data.cvStatus === "uploading"

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2
          data-step-heading
          tabIndex={-1}
          className="text-2xl font-semibold tracking-tight text-white/80 outline-none"
        >
          Parlons de vous
        </h2>
        <p className="text-sm leading-relaxed text-white/50">
          Ces informations personnalisent vos simulations et votre tableau de
          bord.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="onboarding-name"
          className="block text-sm font-medium text-white/80"
        >
          Votre nom
        </label>
        <Input
          id="onboarding-name"
          value={data.name}
          onChange={(event) => onChange({ name: event.target.value })}
          maxLength={80}
          autoComplete="name"
          placeholder="Ex. Léa Martin"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium text-white/80">CV</span>
          <span className="text-xs text-white/40">Optionnel</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={CV_ACCEPT}
          tabIndex={-1}
          aria-hidden
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            // Permet de re-sélectionner le même fichier après une erreur.
            event.target.value = ""
            if (file) void handleFile(file)
          }}
        />

        {data.cvStatus === "ready" ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-400/25 bg-emerald-500/[0.06] px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-400" aria-hidden />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white/80">
                  {data.cvFileName}
                </p>
                <p className="text-xs text-emerald-300" role="status">
                  CV lu avec succès
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChange({ cvStatus: "idle", cvFileName: "", cvError: "" })
              }
              className={BUTTON_GHOST}
              aria-label={`Retirer le CV ${data.cvFileName}`}
            >
              <X className="size-4" aria-hidden />
              Retirer
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className={`flex w-full items-center gap-3 rounded-lg border border-dashed border-white/[0.14] bg-zinc-950 px-4 py-4 text-left transition-colors hover:border-indigo-400/50 hover:bg-white/[0.02] disabled:cursor-wait disabled:opacity-70 ${FOCUS_RING}`}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-400/20">
              {uploading ? (
                <Loader2 className="size-5 animate-spin" aria-hidden />
              ) : (
                <Upload className="size-5" aria-hidden />
              )}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-white/80">
                {uploading ? "Lecture du CV…" : "Ajouter mon CV"}
              </span>
              <span className="mt-0.5 flex items-center gap-1.5 text-xs text-white/40">
                <FileText className="size-3.5" aria-hidden />
                {uploading && data.cvFileName
                  ? data.cvFileName
                  : "PDF ou DOCX · 8 Mo maximum"}
              </span>
            </span>
          </button>
        )}

        {data.cvStatus === "error" && data.cvError ? (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            {data.cvError}
          </p>
        ) : null}

        <p className="text-xs leading-relaxed text-white/40">{CV_NOTICE}</p>
      </div>
    </div>
  )
}
