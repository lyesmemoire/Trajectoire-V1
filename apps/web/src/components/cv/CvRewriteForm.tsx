"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { csrfFetch } from "@/lib/security/csrf-client"

type RewriteAction = "rewrite_summary" | "improve_experience"

const ACTIONS: Array<{ value: RewriteAction; label: string; hint: string }> = [
  {
    value: "rewrite_summary",
    label: "Résumé de profil",
    hint: "Collez le paragraphe d'accroche de votre CV.",
  },
  {
    value: "improve_experience",
    label: "Une expérience",
    hint: "Collez la description d'un poste (missions et résultats).",
  },
]

const MIN_LENGTH = 40
const MAX_LENGTH = 6000

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-calm-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg"

type Status = "idle" | "loading" | "done"

/**
 * Réécriture d'un passage du CV, rattachée à l'analyse affichée (`analysisId`). Le texte du CV n'est
 * jamais chargé dans la page (choix de confidentialité de /cv) : l'utilisateur colle le passage voulu.
 * Réservé au Pack et à Pro (l'API répond 403 sinon) ; la réécriture enregistrée apparaît dans
 * « Réécritures » après `router.refresh()`.
 */
export function CvRewriteForm({ analysisId }: { analysisId: string }) {
  const router = useRouter()
  const [action, setAction] = useState<RewriteAction>("rewrite_summary")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)
  const [planRequired, setPlanRequired] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const current = ACTIONS.find((a) => a.value === action) ?? ACTIONS[0]
  const trimmed = content.trim()
  const tooShort = trimmed.length < MIN_LENGTH
  const loading = status === "loading"

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (tooShort || loading) return

    setStatus("loading")
    setError(null)
    setPlanRequired(false)
    setResult(null)
    setCopied(false)

    try {
      const response = await csrfFetch("/api/cv/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, content: trimmed, analysisId }),
      })

      if (response.status === 403) {
        setPlanRequired(true)
        setStatus("idle")
        return
      }
      if (response.status === 402) {
        setError("Crédits insuffisants pour cette réécriture.")
        setStatus("idle")
        return
      }
      if (response.status === 429) {
        setError("Trop de demandes en peu de temps. Patientez quelques minutes puis réessayez.")
        setStatus("idle")
        return
      }

      const payload = (await response.json().catch(() => null)) as { data?: string; error?: string } | null
      if (!response.ok || !payload?.data) {
        setError(payload?.error || "La réécriture a échoué. Réessayez dans un instant.")
        setStatus("idle")
        return
      }

      setResult(payload.data)
      setStatus("done")
      router.refresh()
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau puis réessayez.")
      setStatus("idle")
    }
  }

  async function copy() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
    } catch {
      setError("Copie impossible : sélectionnez le texte manuellement.")
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-calm-ink">Que voulez-vous réécrire ?</legend>
        <div className="flex flex-wrap gap-2" role="radiogroup">
          {ACTIONS.map((a) => (
            <label
              key={a.value}
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-xl border px-4 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-calm-accent ${
                action === a.value
                  ? "border-calm-accent-line bg-calm-accent-soft text-calm-ink"
                  : "border-calm-line bg-calm-accent-wash text-calm-ink hover:bg-calm-accent-wash"
              }`}
            >
              <input
                type="radio"
                name="rewrite-action"
                value={a.value}
                checked={action === a.value}
                onChange={() => setAction(a.value)}
                className="sr-only"
              />
              {a.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="rewrite-content" className="block text-sm font-medium text-calm-ink">
          Texte à réécrire
        </label>
        <textarea
          id="rewrite-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={MAX_LENGTH}
          rows={7}
          placeholder={current.hint}
          aria-describedby="rewrite-help"
          className={`w-full resize-y rounded-xl border border-calm-line bg-calm-bg px-4 py-3 text-sm leading-relaxed text-calm-ink placeholder:text-calm-tertiary ${focusRing}`}
        />
        <p id="rewrite-help" className="flex justify-between gap-4 text-xs text-calm-secondary">
          <span>{current.hint}</span>
          <span aria-live="off">
            {trimmed.length} / {MAX_LENGTH}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={tooShort || loading}
          className={`inline-flex min-h-11 items-center justify-center rounded-xl bg-calm-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-calm-accent disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
        >
          {loading ? "Réécriture en cours…" : "Réécrire"}
        </button>
        {tooShort && trimmed.length > 0 && (
          <span className="text-xs text-calm-secondary">Au moins {MIN_LENGTH} caractères sont nécessaires.</span>
        )}
      </div>

      <div aria-live="polite" className="space-y-3">
        {planRequired && (
          <div role="alert" className="rounded-xl border border-calm-accent-line bg-calm-accent-soft p-4 text-sm text-calm-accent">
            <p className="font-medium">La réécriture est incluse dans le Pack Entretien et dans Pro.</p>
            <Link
              href="/pricing"
              className={`mt-3 inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-calm-accent underline underline-offset-4 ${focusRing}`}
            >
              Voir les formules
            </Link>
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-xl border border-calm-warn-line bg-calm-warn-soft p-4 text-sm text-calm-warn">
            {error}
          </p>
        )}

        {result && (
          <div className="space-y-3 rounded-xl border border-calm-line bg-calm-bg/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-calm-accent">Version réécrite</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-calm-ink">{result}</p>
            <button
              type="button"
              onClick={copy}
              className={`inline-flex min-h-11 items-center rounded-lg border border-calm-line bg-calm-accent-wash px-4 text-sm font-medium text-calm-ink transition-colors hover:bg-calm-accent-soft ${focusRing}`}
            >
              {copied ? "Copié" : "Copier le texte"}
            </button>
          </div>
        )}
      </div>
    </form>
  )
}
