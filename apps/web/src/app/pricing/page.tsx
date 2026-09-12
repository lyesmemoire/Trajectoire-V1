"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Lock, Sparkles } from "lucide-react"

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: string) => {
    setLoading(plan)
    try {
      // In development, skip Stripe and go directly to dashboard
      if (process.env.NODE_ENV === 'development') {
        router.push('/dashboard')
        return
      }

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        console.error('Payment failed')
        router.push('/signup')
      }
    } catch (error) {
      console.error('Payment error:', error)
      router.push('/signup')
    } finally {
      setLoading(null)
    }
  }

  const starterFeatures = [
    "Analyse de CV (ATS)",
    "Score de compatibilité avec les offres",
    "Recommandations de votre profil",
    "Simulateur d'entretien IA",
    "Rapport d'entretien",
    "Suivi de vos opportunités",
  ]

  const proFeatures = [
    "Tout ce qui est inclus dans Starter",
    "Historique complet de vos analyses",
    "Rapports d'entretien avancés",
    "Copilot RH (assistant IA)",
    "Career Memory — profil enrichi",
    "Export de vos données",
  ]

  const expertFeatures = [
    "Tout ce qui est inclus dans Pro",
    "Accès prioritaire aux nouvelles fonctionnalités",
    "Capacité de traitement plus élevée",
    "Adapté aux recherches intensives",
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-5 md:px-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-600 mb-4">
            Tarifs
          </p>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950 leading-tight">
            Choisissez votre niveau<br className="hidden sm:block" /> de préparation.
          </h1>

          <p className="mt-5 text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Des outils adaptés à chaque étape de votre recherche d&apos;emploi.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-5xl px-5 md:px-6">
          <div className="grid md:grid-cols-3 gap-6 items-stretch">

            {/* ── Starter ── */}
            <div className="flex flex-col rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Starter
                </p>
                <p className="mt-2 text-sm text-slate-600 leading-5">
                  Pour démarrer votre préparation.
                </p>

                <div className="mt-6 flex items-end gap-1.5">
                  <span className="text-4xl font-bold tracking-tight text-slate-950">
                    29€
                  </span>
                  <span className="mb-1 text-sm text-slate-400">/ mois</span>
                </div>

                <ul className="mt-7 space-y-3">
                  {starterFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-2">
                <button
                  onClick={() => handleSubscribe('starter')}
                  disabled={loading === 'starter'}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50"
                >
                  {loading === 'starter' ? 'Chargement…' : 'Choisir Starter'}
                </button>
              </div>
            </div>

            {/* ── Pro — Recommandé ── */}
            <div className="relative flex flex-col rounded-[24px] border-2 border-violet-500 bg-white p-7 shadow-[0_8px_40px_rgba(109,84,217,0.14)]">
              {/* Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-md">
                  <Sparkles className="h-3 w-3" />
                  Recommandé
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-500">
                  Pro
                </p>
                <p className="mt-2 text-sm text-slate-600 leading-5">
                  Pour préparer activement vos candidatures.
                </p>

                <div className="mt-6 flex items-end gap-1.5">
                  <span className="text-4xl font-bold tracking-tight text-slate-950">
                    59€
                  </span>
                  <span className="mb-1 text-sm text-slate-400">/ mois</span>
                </div>

                <ul className="mt-7 space-y-3">
                  {proFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-2">
                <button
                  onClick={() => handleSubscribe('pro')}
                  disabled={loading === 'pro'}
                  className="w-full rounded-2xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading === 'pro' ? 'Chargement…' : 'Choisir Pro'}
                </button>
              </div>
            </div>

            {/* ── Expert ── */}
            <div className="flex flex-col rounded-[24px] border border-violet-200 bg-violet-50/60 p-7 shadow-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
                  Expert
                </p>
                <p className="mt-2 text-sm text-slate-600 leading-5">
                  Pour une préparation plus intensive.
                </p>

                <div className="mt-6 flex items-end gap-1.5">
                  <span className="text-4xl font-bold tracking-tight text-slate-950">
                    99€
                  </span>
                  <span className="mb-1 text-sm text-slate-500">/ mois</span>
                </div>

                <ul className="mt-7 space-y-3">
                  {expertFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-2">
                <button
                  onClick={() => handleSubscribe('expert')}
                  disabled={loading === 'expert'}
                  className="w-full rounded-2xl border border-violet-300 bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-sm transition hover:bg-violet-100 disabled:opacity-50"
                >
                  {loading === 'expert' ? 'Chargement…' : 'Choisir Expert'}
                </button>
              </div>
            </div>

          </div>

          {/* Ligne de confiance */}
          <div className="mt-10 flex flex-col items-center gap-2 text-center">
            <p className="flex items-center gap-2 text-xs text-slate-400">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              Paiement sécurisé par Stripe. Vous pouvez gérer votre abonnement depuis votre compte.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
