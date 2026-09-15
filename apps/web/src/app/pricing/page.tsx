"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronDown } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface FAQItem {
  q: string
  a: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
  { n: "01", label: "Votre CV + l\u2019offre ciblée" },
  { n: "02", label: "Vos risques identifiés" },
  { n: "03", label: "Simulation personnalisée" },
  { n: "04", label: "Analyse réponse par réponse" },
  { n: "05", label: "Retravail ciblé" },
]

const PACK_FEATURES = [
  "Analyse de votre CV face à l\u2019offre réelle",
  "Identification de vos forces et points de vigilance",
  "5 simulations personnalisées",
  "Questions adaptées au poste visé",
  "Rapport détaillé après chaque entretien",
  "Analyse réponse par réponse",
  "Replay de vos réponses vocales",
  "Retravail de vos points faibles",
]

const FREE_FEATURES = [
  "1 simulation découverte",
  "Préparation personnalisée",
  "Questions adaptées au poste",
]

const PRO_FEATURES = [
  "20 simulations par mois",
  "Préparation pour plusieurs opportunités",
  "Rapport après chaque simulation",
  "Suivi de votre progression",
]

const PRIORITIES = [
  "Démontrer votre impact avec des résultats mesurables",
  "Clarifier votre rôle personnel dans les projets d\u2019équipe",
  "Prouver votre maîtrise des compétences clés du poste",
]

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "Le Pack Entretien est-il un abonnement\u00a0?",
    a: "Non. Vous payez 29\u00a0€ une seule fois pour 5 simulations. Aucun renouvellement automatique, aucun abonnement caché.",
  },
  {
    q: "Mes 5 simulations expirent-elles à la fin du mois\u00a0?",
    a: "Non. Le Pack Entretien n\u2019est pas mensuel. Vos simulations restent disponibles jusqu\u2019à ce que vous les utilisiez.",
  },
  {
    q: "Que se passe-t-il lorsque j\u2019ai utilisé mes 5 simulations\u00a0?",
    a: "Vous pourrez choisir l\u2019offre adaptée à la suite de votre préparation — continuer en Pro si vous êtes en recherche active, ou simplement vous arrêter si l\u2019entretien est passé.",
  },
  {
    q: "Quelle différence avec Pro\u00a0?",
    a: "Le Pack Entretien est conçu pour préparer un entretien précis avec un budget maîtrisé. Pro est fait pour les candidats en recherche active qui enchaînent plusieurs opportunités et ont besoin de simulations en continu.",
  },
]

// ─── FAQ Accordion Item ────────────────────────────────────────────────────────

function FAQAccordion({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen] = useState(false)
  const id = `faq-${index}`

  return (
    <div className="border-b border-ivoire-200 last:border-0">
      <button
        id={`${id}-trigger`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 py-6 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-sm"
      >
        <span className="text-base font-medium text-ink-900 leading-snug group-hover:text-primary-700 transition-colors duration-200">
          {item.q}
        </span>
        <ChevronDown
          className={`shrink-0 mt-0.5 h-4 w-4 text-ink-400 transition-transform duration-300 ease-premium ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        className={`overflow-hidden transition-all duration-300 ease-premium ${
          open ? "max-h-48 pb-6" : "max-h-0"
        }`}
      >
        <p className="text-sm text-ink-600 leading-relaxed">{item.a}</p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(priceId)
      setError(null)
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      })
      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else if (response.status === 401) {
        // Rediriger vers l'inscription si non connecté au lieu d'afficher une erreur
        router.push("/signup")
      } else {
        const data = await response.json()
        setError(data.error || "Une erreur est survenue lors du paiement.")
      }
    } catch {
      setError("Impossible de se connecter au service de paiement.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div
      className="min-h-screen bg-ivoire-50"
      style={{ colorScheme: "light" }}
    >
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.22em] text-primary-600">
            Préparation d&apos;entretien par IA
          </p>

          <h1 className="font-serif text-[2.6rem] leading-[1.12] tracking-tight text-ink-900 md:text-[4rem]">
            Un entretien peut changer
            <br />
            votre carrière.
            <br />
            <span className="text-primary-600">Préparez-le comme tel.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-ink-600 leading-relaxed md:text-xl">
            Trajectoire analyse votre CV et l&apos;offre que vous visez, identifie
            les points qui peuvent vous coûter le poste, puis vous entraîne
            précisément là où cela compte.
          </p>

          {error && (
            <div
              role="alert"
              className="mx-auto mt-8 max-w-md rounded-xl border border-brick-100 bg-brick-50 p-4 text-sm text-brick-600"
            >
              {error}
            </div>
          )}

          <p className="mt-10 text-[11px] font-medium tracking-wide text-ink-500">
            Paiement sécurisé · Sans engagement · Données privées
          </p>
        </div>
      </section>

      {/* ── PARCOURS ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white border-y border-ivoire-200">
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-primary-600">
            La méthode
          </p>
          <h2 className="mb-16 text-center font-serif text-3xl tracking-tight text-ink-900 md:text-[2.5rem]">
            Ce n&apos;est pas un chatbot d&apos;entretien.
            <br />
            <span className="text-ink-500">
              C&apos;est une préparation à cet entretien.
            </span>
          </h2>

          <ol className="relative" aria-label="Parcours Trajectoire">
            {/* Ligne de connexion horizontale (desktop) */}
            <div
              className="absolute left-[2.1rem] right-[2.1rem] top-[2.1rem] hidden h-px bg-ivoire-200 md:block"
              aria-hidden="true"
            />
            {/* Ligne de connexion verticale (mobile) */}
            <div
              className="absolute left-[2.1rem] top-[2.1rem] bottom-[2.1rem] block w-px bg-ivoire-200 md:hidden"
              aria-hidden="true"
            />

            <div className="flex flex-col md:flex-row gap-8 md:gap-4 md:justify-between">
              {STEPS.map((step) => (
                <div
                  key={step.n}
                  className="relative flex flex-row md:flex-col items-start md:items-center gap-6 md:gap-5 py-2 md:py-0 group md:flex-1"
                >
                  {/* number dot */}
                  <div
                    className="relative z-10 flex h-[4.2rem] w-[4.2rem] shrink-0 items-center justify-center rounded-full border border-ivoire-200 bg-white shadow-premium transition-shadow duration-200 group-hover:shadow-premium-lg"
                    aria-hidden="true"
                  >
                    <span className="text-[10px] font-bold tracking-widest text-primary-600">
                      {step.n}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center min-h-[4.2rem] md:min-h-0 md:text-center mt-1 md:mt-0">
                    <p className="text-base font-medium text-ink-900 leading-snug md:text-lg">
                      {step.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ol>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-primary-600">
            Formules
          </p>
          <h2 className="mb-16 text-center font-serif text-3xl tracking-tight text-ink-900 md:text-5xl">
            Choisissez votre niveau de préparation.
          </h2>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-start">

            {/* ── 1. Découverte ── */}
            <div className="flex flex-col rounded-[2rem] border border-ivoire-200 bg-white p-8 md:p-10 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-500 mb-6">
                Découverte
              </p>
              <div className="mb-5">
                <span className="font-serif text-5xl font-bold tracking-tight text-ink-900">
                  0&thinsp;€
                </span>
              </div>
              <p className="mb-8 text-base text-ink-600 leading-relaxed">
                Découvrez Trajectoire et testez votre premier entretien.
              </p>

              <ul className="mb-10 flex flex-col gap-4" aria-label="Fonctionnalités Découverte">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
                    <span className="text-base text-ink-700 leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-2">
                <button
                  id="btn-decouverte"
                  onClick={() => router.push("/signup")}
                  className="w-full rounded-xl border border-ivoire-200 bg-ivoire-50 px-5 py-4 text-base font-semibold text-ink-700 shadow-premium-inset transition-all duration-200 hover:border-ink-200 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                >
                  Tester gratuitement
                </button>
              </div>
            </div>

            {/* ── 2. Pack Entretien — signature ── */}
            <div className="relative z-10 flex flex-col rounded-[2rem] bg-ink-800 p-8 md:p-12 shadow-premium-lg ring-2 ring-primary-600 ring-offset-0 md:scale-105">
              {/* badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-600 px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-md">
                  LE PLUS CHOISI
                </span>
              </div>

              <p className="mt-2 mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-400">
                Pack Entretien
              </p>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-serif text-6xl font-bold tracking-tight text-white">
                  29&thinsp;€
                </span>
              </div>
              <p className="mb-5 text-sm font-medium text-ink-400 uppercase tracking-wide">
                paiement unique
              </p>

              <p className="mb-8 text-base font-semibold text-white leading-snug">
                Préparez l&apos;entretien qui compte.
              </p>

              <ul className="mb-10 flex flex-col gap-4" aria-label="Fonctionnalités Pack Entretien">
                {PACK_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-primary-400" aria-hidden="true" />
                    <span className="text-base text-ivoire-100 leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-2">
                <button
                  id="btn-pack-entretien"
                  onClick={() => handleSubscribe("interview_pack")}
                  disabled={loading !== null}
                  className="w-full flex flex-col items-center gap-1 rounded-xl bg-primary-600 px-6 py-5 shadow-lg shadow-primary-700/20 transition-all duration-200 hover:bg-primary-700 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-800 disabled:opacity-60 disabled:hover:bg-primary-600 disabled:active:scale-100"
                >
                  <span className="text-base font-bold text-white">
                    {loading === "interview_pack"
                      ? "Redirection\u2026"
                      : "Préparer mon entretien\u2002\u2013\u200229\u00a0€"}
                  </span>
                  <span className="text-[11px] font-medium text-primary-200 uppercase tracking-wider">
                    Paiement unique · Aucun abonnement
                  </span>
                </button>
              </div>
            </div>

            {/* ── 3. Pro ── */}
            <div className="flex flex-col rounded-[2rem] border border-ivoire-200 bg-white p-8 md:p-10 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-500 mb-6">
                Pro
              </p>
              <div className="flex items-baseline gap-2 mb-5">
                <span className="font-serif text-5xl font-bold tracking-tight text-ink-900">
                  39&thinsp;€
                </span>
                <span className="text-base text-ink-500 font-medium">/ mois</span>
              </div>
              <p className="mb-8 text-base text-ink-600 leading-relaxed">
                Pour préparer plusieurs opportunités et progresser entretien
                après entretien.
              </p>

              <ul className="mb-10 flex flex-col gap-4" aria-label="Fonctionnalités Pro">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
                    <span className="text-base text-ink-700 leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-2">
                <button
                  id="btn-pro"
                  onClick={() => handleSubscribe("pro")}
                  disabled={loading !== null}
                  className="w-full rounded-xl border border-ivoire-200 bg-ivoire-50 px-5 py-4 text-base font-semibold text-ink-700 shadow-premium-inset transition-all duration-200 hover:border-ink-200 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50"
                >
                  {loading === "pro" ? "Redirection\u2026" : "Passer Pro"}
                </button>
              </div>
            </div>

          </div>

          {/* Quelle formule choisir */}
          <div className="mt-16 grid md:grid-cols-3 gap-5 text-center">
            <div className="rounded-2xl bg-white border border-ivoire-200 p-6">
              <p className="text-sm text-ink-500 mb-2 leading-relaxed">
                Je veux découvrir Trajectoire
              </p>
              <p className="text-base font-semibold text-ink-900">→ Découverte</p>
            </div>
            <div className="rounded-2xl bg-primary-50 border border-primary-100 p-6">
              <p className="text-sm text-primary-700 mb-2 leading-relaxed">
                J&apos;ai un entretien important à préparer
              </p>
              <p className="text-base font-semibold text-primary-900">→ Pack Entretien</p>
            </div>
            <div className="rounded-2xl bg-white border border-ivoire-200 p-6">
              <p className="text-sm text-ink-500 mb-2 leading-relaxed">
                Je suis activement en recherche avec plusieurs entretiens
              </p>
              <p className="text-base font-semibold text-ink-900">→ Pro</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIFFÉRENCIATION ───────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white border-y border-ivoire-200">
        <div className="mx-auto max-w-5xl px-6">
          <div className="md:grid md:grid-cols-2 md:gap-24 md:items-center">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-primary-600">
                Pourquoi Trajectoire
              </p>
              <h2 className="font-serif text-3xl tracking-tight text-ink-900 leading-[1.15] md:text-5xl">
                Vous ne préparez pas
                <br />
                un entretien générique.
              </h2>
              <p className="mt-6 text-lg text-ink-600 leading-relaxed md:text-xl">
                Trajectoire utilise votre CV et l&apos;offre réelle que vous ciblez
                pour concentrer votre préparation sur les compétences, preuves
                et points de vigilance qui comptent vraiment.
              </p>
            </div>

            {/* flow diagram */}
            <div
              className="mt-12 md:mt-0 flex flex-col gap-4"
              aria-label="Parcours de préparation Trajectoire"
            >
              {[
                { label: "CV + offre", sub: "Votre point de départ" },
                { label: "Risques", sub: "Identifiés automatiquement" },
                { label: "Simulation", sub: "Adaptée à CET entretien" },
                { label: "Rapport", sub: "Réponse par réponse" },
                { label: "Retravail", sub: "Sur vos vrais points faibles" },
              ].map((item, i, arr) => (
                <div key={item.label}>
                  <div className="flex items-center gap-5 rounded-2xl border border-ivoire-200 bg-ivoire-50 px-6 py-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-ivoire-200 shadow-premium">
                      <span className="text-[11px] font-bold text-primary-600">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-ink-900">{item.label}</p>
                      <p className="text-sm text-ink-500 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex justify-center my-1" aria-hidden="true">
                      <svg width="14" height="16" viewBox="0 0 12 14" fill="none">
                        <path d="M6 0v10M2 7l4 4 4-4" stroke="#DDD6FE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PREUVE PRODUIT ────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-ivoire-50">
        <div className="mx-auto max-w-4xl px-6">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-primary-600">
            Exemple d&apos;interface
          </p>
          <h2 className="mb-4 text-center font-serif text-3xl tracking-tight text-ink-900 md:text-4xl">
            Ce que Trajectoire identifie pour vous.
          </h2>
          <p className="mb-12 text-center text-base text-ink-500">
            Exemple représentatif — vos priorités seront dérivées de votre CV et de l&apos;offre réelle.
          </p>

          {/* mock UI card */}
          <div className="rounded-2xl border border-ivoire-200 bg-white shadow-premium overflow-hidden">
            <div className="border-b border-ivoire-200 bg-ivoire-50 px-6 md:px-8 py-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-500">
                Vos priorités pour cet entretien
              </p>
            </div>
            <div className="divide-y divide-ivoire-100">
              {PRIORITIES.map((p, i) => (
                <div key={i} className="flex items-start gap-5 px-6 md:px-8 py-6">
                  <span className="shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-[11px] font-bold text-primary-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-base text-ink-700 leading-snug">{p}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-ivoire-200 bg-ivoire-50 px-6 md:px-8 py-5">
              <p className="text-sm text-ink-500 leading-relaxed">
                La simulation Trajectoire insiste ensuite précisément sur ces
                points — question par question.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white border-t border-ivoire-200">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-primary-600">
            FAQ
          </p>
          <h2 className="mb-12 text-center font-serif text-3xl tracking-tight text-ink-900 md:text-4xl">
            Questions fréquentes
          </h2>

          <div role="list">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} role="listitem">
                <FAQAccordion item={item} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 bg-ink-800">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-3xl tracking-tight text-white md:text-5xl leading-tight">
            Votre prochain entretien mérite
            <br />
            une vraie préparation.
          </h2>
          <p className="mt-6 text-lg text-ink-400 leading-relaxed md:text-xl">
            Commencez gratuitement. Passez au Pack quand vous en avez besoin.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="btn-cta-pack"
              onClick={() => handleSubscribe("interview_pack")}
              disabled={loading !== null}
              className="w-full sm:w-auto rounded-xl bg-primary-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary-700/30 transition-all duration-200 hover:bg-primary-700 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-800 disabled:opacity-60"
            >
              {loading === "interview_pack" ? "Redirection\u2026" : "Pack Entretien\u2002\u2013\u200229\u00a0€"}
            </button>
            <button
              id="btn-cta-free"
              onClick={() => router.push("/signup")}
              className="w-full sm:w-auto rounded-xl border border-ink-600 bg-transparent px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:border-ink-400 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-800"
            >
              Tester gratuitement
            </button>
          </div>
          <p className="mt-8 text-[11px] font-medium tracking-wide text-ink-500">
            Paiement sécurisé · Sans engagement · Données privées
          </p>
        </div>
      </section>

    </div>
  )
}
