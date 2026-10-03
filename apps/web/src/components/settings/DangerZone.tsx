"use client"

import { useState } from "react"

export function DangerZone() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
      )
    ) {
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/account/delete", { method: "POST" })

      if (res.ok) {
        window.location.href = "/"
        return
      }

      // Format d'erreur de l'API : { error: { code, message } }
      const data = await res.json().catch(() => null)
      const apiMessage =
        typeof data?.error === "string" ? data.error : data?.error?.message
      setError(apiMessage || "Erreur lors de la suppression du compte.")
    } catch {
      setError("Erreur lors de la suppression du compte.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      aria-labelledby="danger-title"
      className="rounded-2xl border border-calm-warn-line bg-calm-surface p-8"
    >
      <h2
        id="danger-title"
        className="font-sans text-xl font-semibold tracking-tight text-calm-ink"
      >
        Zone de danger
      </h2>
      <p className="mt-2 text-sm text-calm-secondary">
        La suppression de votre compte est irréversible. Toutes vos données seront
        perdues.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-calm-warn-line bg-calm-warn-soft p-4 text-sm font-medium text-calm-warn"
        >
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleDeleteAccount}
        disabled={loading}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-calm-warn-line bg-calm-warn-soft px-5 text-sm font-semibold text-calm-warn transition-colors hover:bg-calm-warn-soft outline-none focus-visible:ring-2 focus-visible:ring-calm-warn-line focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Suppression…" : "Supprimer mon compte"}
      </button>
    </section>
  )
}
