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
          className="font-sans text-2xl font-semibold tracking-tight text-calm-ink outline-none"
        >
          Parlons de vous
        </h2>
        <p className="text-sm leading-relaxed text-calm-secondary">
          Ces informations personnalisent vos simulations et votre tableau de
          bord.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="onboarding-name"
          className="block text-sm font-medium text-calm-ink"
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
          <span className="text-sm font-medium text-calm-ink">CV</span>
          <span className="text-xs text-calm-tertiary">Optionnel</span>
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
          <div className="flex items-center justify-between gap-3 rounded-lg border border-calm-accent-line bg-calm-accent-soft px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <CheckCircle2 className="size-5 shrink-0 text-calm-accent" aria-hidden />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-calm-ink">
                  {data.cvFileName}
                </p>
                <p className="text-xs text-calm-accent" role="status">
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
            className={`flex w-full items-center gap-3 rounded-lg border border-dashed border-calm-accent-line bg-calm-bg px-4 py-4 text-left transition-colors hover:border-calm-accent-line hover:bg-calm-accent-wash disabled:cursor-wait disabled:opacity-70 ${FOCUS_RING}`}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-calm-accent-soft text-calm-accent ring-1 ring-inset ring-calm-accent-line">
              {uploading ? (
                <Loader2 className="size-5 animate-spin" aria-hidden />
              ) : (
                <Upload className="size-5" aria-hidden />
              )}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-calm-ink">
                {uploading ? "Lecture du CV…" : "Ajouter mon CV"}
              </span>
              <span className="mt-0.5 flex items-center gap-1.5 text-xs text-calm-tertiary">
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
            className="flex items-start gap-2 rounded-lg border border-calm-warn-line bg-calm-warn-soft px-3 py-2 text-sm text-calm-warn"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            {data.cvError}
          </p>
        ) : null}

        <p className="text-xs leading-relaxed text-calm-tertiary">{CV_NOTICE}</p>
      </div>
    </div>
  )
}
