"use client"

import { useState } from "react"

export function DangerZone() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
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
      className="rounded-2xl border border-rose-500/20 bg-zinc-900 p-8"
    >
      <h2
        id="danger-title"
        className="text-xl font-semibold tracking-tight text-white/80"
      >
        Zone de danger
      </h2>
      <p className="mt-2 text-sm text-zinc-400">
        La suppression de votre compte est irréversible. Toutes vos données seront
        perdues.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm font-medium text-rose-300"
        >
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleDeleteAccount}
        disabled={loading}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-rose-500/40 bg-rose-500/10 px-5 text-sm font-semibold text-rose-300 transition-colors hover:bg-rose-500/20 outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Suppression…" : "Supprimer mon compte"}
      </button>
    </section>
  )
}
