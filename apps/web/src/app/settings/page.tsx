"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)

  const handleStripePortal = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/customer-portal", {
        method: "POST",
      })
      const { url } = await res.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Erreur portail Stripe:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
      })

      if (res.ok) {
        window.location.href = "/"
      } else {
        const { error } = await res.json()
        alert(error || "Erreur lors de la suppression du compte")
      }
    } catch (error) {
      console.error("Erreur suppression compte:", error)
      alert("Erreur lors de la suppression du compte")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-ivoire-50 min-h-screen text-ink-900 pt-16 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-ink-900 mb-4">
          Paramètres
        </h1>
        <p className="text-lg text-ink-600 mb-10">
          Gérez votre compte et votre abonnement.
        </p>

        <div className="space-y-6">
          {/* Section Abonnement */}
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl border border-ivoire-200 shadow-premium">
            <h2 className="text-xl font-serif font-semibold text-ink-900 mb-4">
              Abonnement
            </h2>
            <p className="text-ink-600 mb-6">
              Gérez votre abonnement et vos paiements via le portail Stripe.
            </p>
            <Button
              onClick={handleStripePortal}
              disabled={loading}
              size="md"
            >
              {loading ? "Chargement..." : "Gérer l'abonnement"}
            </Button>
          </div>

          {/* Section Compte */}
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl border border-ivoire-200 shadow-premium">
            <h2 className="text-xl font-serif font-semibold text-ink-900 mb-4">
              Danger Zone
            </h2>
            <p className="text-ink-600 mb-6">
              La suppression de votre compte est irréversible. Toutes vos données seront perdues.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="px-6 py-3 bg-brick-600 text-white rounded-xl hover:bg-brick-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Chargement..." : "Supprimer mon compte"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
