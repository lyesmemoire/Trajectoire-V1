"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Sparkles, Lock, ArrowRight, FileText, BrainCircuit, MessageSquare, BarChart, RefreshCw } from "lucide-react"

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(priceId)
      setError(null)
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        const data = await response.json()
        setError(data.error || 'Une erreur est survenue lors du paiement.')
      }
    } catch (err) {
      console.error('Payment error:', err)
      setError('Impossible de se connecter au service de paiement.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-violet-100 selection:text-violet-900">

      {/* ── HERO ── */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="mx-auto max-w-5xl px-5 md:px-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 mb-6">
            PRÉPARATION D&apos;ENTRETIEN PAR IA
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
            Un entretien peut changer votre carrière.<br className="hidden sm:block" /> Préparez-le comme tel.
          </h1>

          <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Trajectoire analyse votre CV et l&apos;offre que vous visez, identifie vos points faibles et vous entraîne sur les questions qui comptent vraiment.
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            <span>Paiement sécurisé</span>
            <span className="mx-1.5 opacity-50">·</span>
            <span>Sans engagement</span>
            <span className="mx-1.5 opacity-50">·</span>
            <span>Vos données restent privées</span>
          </div>

          {error && (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 max-w-md mx-auto">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* ── CARDS ── */}
      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-5 md:px-6">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-start">

            {/* 1. DÉCOUVERTE */}
            <div className="order-2 md:order-1 flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-4">
                  DÉCOUVERTE
                </p>
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-950">
                    0 €
                  </span>
                </div>
                <p className="mt-4 text-sm font-medium text-slate-950">
                  Découvrez Trajectoire et testez votre première simulation.
                </p>

                <ul className="mt-8 space-y-4">
                  {[
                    "1 simulation découverte",
                    "Préparation personnalisée",
                    "Questions adaptées au poste",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <span className="text-sm text-slate-600 leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <button
                  onClick={() => router.push('/signup')}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
                >
                  Tester gratuitement
                </button>
              </div>
            </div>

            {/* 2. PACK ENTRETIEN (HERO) */}
            <div className="order-1 md:order-2 relative flex flex-col rounded-[28px] border-2 border-violet-500 bg-white p-8 shadow-[0_20px_60px_-15px_rgba(109,84,217,0.15)] md:-mt-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  LE PLUS CHOISI
                </span>
              </div>

              <div>
                <p className="text-2xl font-bold tracking-tight text-slate-950 mb-4">
                  Pack Entretien
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-tight text-violet-600">
                    29 €
                  </span>
                  <span className="text-sm font-medium text-slate-500">paiement unique</span>
                </div>
                <p className="mt-4 text-sm font-bold text-slate-900">
                  Préparez l&apos;entretien qui compte.
                </p>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Pour un entretien précis, Trajectoire analyse votre CV et l&apos;offre, identifie les points qui peuvent vous fragiliser et vous permet de vous entraîner jusqu&apos;à être prêt.
                </p>

                <ul className="mt-8 space-y-4">
                  {[
                    "Analyse de votre CV face à l'offre",
                    "Identification de vos forces et points faibles",
                    "5 simulations personnalisées",
                    "Questions adaptées au poste visé",
                    "Rapport après chaque entretien",
                    "Retravail de vos points faibles",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                      <span className="text-sm font-medium text-slate-700 leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <button
                  onClick={() => handleSubscribe('interview_pack')}
                  disabled={loading !== null}
                  className="w-full flex flex-col items-center justify-center gap-1 rounded-2xl bg-violet-600 px-5 py-4 shadow-lg shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-70 disabled:hover:bg-violet-600 disabled:active:scale-100"
                >
                  <span className="text-sm font-bold text-white">
                    {loading === 'interview_pack' ? 'Redirection...' : 'Préparer mon entretien – 29 €'}
                  </span>
                  <span className="text-[10px] font-medium text-violet-200 uppercase tracking-wider">
                    Paiement unique · Aucun abonnement
                  </span>
                </button>
              </div>
            </div>

            {/* 3. PRO */}
            <div className="order-3 md:order-3 flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-4">
                  RECHERCHE ACTIVE
                </p>
                <p className="text-xl font-bold tracking-tight text-slate-950 mb-4">
                  Pro
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-950">
                    39 €
                  </span>
                  <span className="text-sm font-medium text-slate-500">/ mois</span>
                </div>
                <p className="mt-4 text-sm font-medium text-slate-950">
                  Pour préparer plusieurs opportunités et progresser entretien après entretien.
                </p>

                <ul className="mt-8 space-y-4">
                  {[
                    "20 simulations par mois",
                    "Préparation pour plusieurs opportunités",
                    "Rapports de simulation",
                    "Suivi de votre progression",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
                      <span className="text-sm text-slate-600 leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <button
                  onClick={() => handleSubscribe('pro')}
                  disabled={loading !== null}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading === 'pro' ? 'Redirection...' : 'Passer Pro'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── QUELLE FORMULE CHOISIR ? ── */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-4xl px-5 md:px-6">
          <h2 className="text-2xl font-bold text-center text-slate-950 mb-12">Quelle formule choisir ?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50">
              <p className="text-sm font-medium text-slate-600 mb-3">Je veux découvrir Trajectoire</p>
              <ArrowRight className="h-5 w-5 text-slate-300 mb-3" />
              <span className="text-sm font-bold text-slate-900">Découverte</span>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-violet-50">
              <p className="text-sm font-medium text-violet-700 mb-3">J&apos;ai un entretien important à préparer</p>
              <ArrowRight className="h-5 w-5 text-violet-300 mb-3" />
              <span className="text-sm font-bold text-violet-900">Pack Entretien</span>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50">
              <p className="text-sm font-medium text-slate-600 mb-3">Je suis activement en recherche et j&apos;ai plusieurs entretiens</p>
              <ArrowRight className="h-5 w-5 text-slate-300 mb-3" />
              <span className="text-sm font-bold text-slate-900">Pro</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION VALEUR ── */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 md:px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-950 mb-6">Vous ne préparez pas un entretien générique.</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-16">
            Trajectoire utilise votre CV et l&apos;offre que vous ciblez pour personnaliser votre préparation autour de votre expérience, du poste et des points qui méritent réellement d&apos;être travaillés.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm mb-3">
                <FileText className="h-6 w-6 text-slate-500" />
              </div>
              <span className="text-xs font-bold text-slate-700">CV + offre</span>
            </div>
            <ArrowRight className="hidden md:block h-5 w-5 text-slate-300" />
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm mb-3">
                <BrainCircuit className="h-6 w-6 text-slate-500" />
              </div>
              <span className="text-xs font-bold text-slate-700">Analyse</span>
            </div>
            <ArrowRight className="hidden md:block h-5 w-5 text-slate-300" />
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-xl bg-white border border-violet-200 flex items-center justify-center shadow-sm mb-3">
                <MessageSquare className="h-6 w-6 text-violet-600" />
              </div>
              <span className="text-xs font-bold text-violet-700">Simulation personnalisée</span>
            </div>
            <ArrowRight className="hidden md:block h-5 w-5 text-slate-300" />
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm mb-3">
                <BarChart className="h-6 w-6 text-slate-500" />
              </div>
              <span className="text-xs font-bold text-slate-700">Rapport</span>
            </div>
            <ArrowRight className="hidden md:block h-5 w-5 text-slate-300" />
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm mb-3">
                <RefreshCw className="h-6 w-6 text-slate-500" />
              </div>
              <span className="text-xs font-bold text-slate-700">Retravail</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-3xl px-5 md:px-6">
          <h2 className="text-2xl font-bold text-center text-slate-950 mb-12">Questions fréquentes</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-base font-bold text-slate-900">Le Pack Entretien est-il un abonnement ?</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Non. Vous payez 29 € une seule fois pour 5 simulations.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Mes 5 simulations expirent-elles à la fin du mois ?</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Non. Le Pack Entretien ne se renouvelle pas mensuellement.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Que se passe-t-il lorsque j&apos;ai utilisé mes 5 simulations ?</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Vous pourrez choisir l&apos;offre adaptée à la suite de votre préparation.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Quelle différence avec Pro ?</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Le Pack est conçu pour préparer un entretien précis. Pro est destiné aux candidats en recherche active avec plusieurs opportunités.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
