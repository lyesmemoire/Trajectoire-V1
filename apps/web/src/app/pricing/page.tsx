"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import { Check, ChevronDown, X } from "lucide-react"
import { PLANS, type Plan, type PlanId } from "@/lib/plans"

// Aucun prix ni aucune limite n'est écrit ici : tout vient de lib/plans.ts.
// Seuls les textes éditoriaux (accroches, FAQ) vivent dans ce fichier, et ils
// interpolent les valeurs du plan.

// ─── Données éditoriales ──────────────────────────────────────────────────────

const PLAN_ORDER: PlanId[] = ["FREE", "PACK", "PRO"]

const TAGLINES: Record<PlanId, { audience: string; pitch: string }> = {
  FREE: {
    audience: "Je découvre Trajectoire",
    pitch: "Testez la qualité de l'analyse sur votre CV, sans carte bancaire.",
  },
  PACK: {
    audience: "J'ai un entretien important à préparer",
    pitch: "Préparez l'entretien qui compte, avec un budget maîtrisé.",
  },
  PRO: {
    audience: "Je suis en recherche active",
    pitch: "Enchaînez les simulations pour tous vos entretiens, sans limite.",
  },
}

const CTA_LABELS: Record<PlanId, string> = {
  FREE: "Analyser mon CV gratuitement",
  PACK: "Préparer mon entretien",
  PRO: "Passer Pro",
}

const STEPS = [
  { n: "01", label: "Votre CV + l’offre ciblée" },
  { n: "02", label: "Vos risques identifiés" },
  { n: "03", label: "Simulation personnalisée" },
  { n: "04", label: "Analyse réponse par réponse" },
  { n: "05", label: "Retravail ciblé" },
]

const PRIORITIES = [
  "Démontrer votre impact avec des résultats mesurables",
  "Clarifier votre rôle personnel dans les projets d’équipe",
  "Prouver votre maîtrise des compétences clés du poste",
]

// ─── Formatage ────────────────────────────────────────────────────────────────

function formatPrice(plan: Plan): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: plan.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(plan.price)
}

function intervalLabel(plan: Plan): string {
  if (plan.interval === "month") return "/ mois"
  if (plan.interval === "one_time") return "paiement unique"
  return "sans engagement"
}

function reassurance(plan: Plan): string {
  if (plan.interval === "month") return "Paiement immédiat · Résiliable à tout moment"
  if (plan.interval === "one_time") return "Paiement unique · Aucun abonnement"
  return "Sans carte bancaire"
}

function buildFaq() {
  const { PACK, PRO, FREE } = PLANS
  const packSims = PACK.simulationLimit ?? 0
  const packMonths = PACK.simulationExpiry?.months ?? 0
  return [
    {
      q: `Le ${PACK.name} est-il un abonnement ?`,
      a: `Non. Vous payez ${formatPrice(PACK)} TTC une seule fois pour ${packSims} simulations, valables ${packMonths} mois. Aucun renouvellement automatique.`,
    },
    {
      q: `Que se passe-t-il au bout de ${packMonths} mois ?`,
      a: `Les simulations non utilisées expirent et votre compte repasse au plan ${FREE.name}. Vous pouvez reprendre un Pack pour un nouvel entretien, ou passer Pro si vous êtes en recherche active.`,
    },
    {
      q: "Quelle différence entre le Pack et Pro ?",
      a: `Le ${PACK.name} sert à préparer un entretien précis. Pro (${formatPrice(PRO)} TTC par mois) offre des simulations illimitées à ceux qui enchaînent plusieurs opportunités.`,
    },
    {
      q: "Puis-je résilier Pro à tout moment ?",
      a: "Oui. L’abonnement se gère depuis votre espace, via le portail de paiement sécurisé. Aucune période minimale d’engagement.",
    },
    {
      q: "Que contient l’analyse de CV gratuite ?",
      a: `Un aperçu : votre score ATS et jusqu’à ${FREE.cvPreviewRemarksMax ?? 3} remarques. L’analyse complète, avec le détail et les recommandations, est incluse dans le Pack et dans Pro.`,
    },
    {
      q: "Les prix sont-ils TTC ?",
      a: "Oui, tous les prix affichés sont TTC. Le paiement est traité par Stripe.",
    },
  ]
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQAccordion({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  const id = `faq-${index}`

  return (
    <div className="border-b border-zinc-800 last:border-0">
      <button
        id={`${id}-trigger`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-start justify-between gap-4 rounded-sm py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      >
        <span className="text-base font-medium leading-snug text-white/80 transition-colors group-hover:text-indigo-300">
          {q}
        </span>
        <ChevronDown
          className={`mt-0.5 h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-trigger`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-zinc-400">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Carte de plan ────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  index,
  loading,
  onSelect,
}: {
  plan: Plan
  index: number
  loading: PlanId | null
  onSelect: (id: PlanId) => void
}) {
  const highlighted = plan.highlighted
  const { audience, pitch } = TAGLINES[plan.id]
  const busy = loading === plan.id

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className={`relative flex flex-col rounded-3xl p-8 md:p-10 ${
        highlighted
          ? "border border-indigo-500/60 bg-zinc-900 shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-500/40 md:-my-4 md:py-14"
          : "border border-zinc-800 bg-zinc-900/60"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
          Le plus choisi
        </span>
      )}

      <p
        className={`text-[11px] font-bold uppercase tracking-[0.2em] ${
          highlighted ? "text-indigo-300" : "text-zinc-500"
        }`}
      >
        {plan.name}
      </p>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-5xl font-semibold tracking-tight text-white">
          {formatPrice(plan)}
        </span>
        <span className="text-sm font-medium text-zinc-400">
          {intervalLabel(plan)}
        </span>
      </div>
      {plan.price > 0 && (
        <p className="mt-1 text-xs text-zinc-500">TTC</p>
      )}

      <p className="mt-6 text-sm font-medium text-zinc-300">{audience}</p>
      <p className="mt-1 text-sm leading-relaxed text-zinc-400">{pitch}</p>

      <ul
        className="mb-10 mt-8 flex flex-col gap-3.5"
        aria-label={`Fonctionnalités ${plan.name}`}
      >
        {plan.features.map((feature) => (
          <li key={feature.label} className="flex items-start gap-3">
            {feature.included ? (
              <Check
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  highlighted ? "text-indigo-400" : "text-zinc-400"
                }`}
                aria-hidden="true"
              />
            ) : (
              <X className="mt-0.5 h-4 w-4 shrink-0 text-zinc-700" aria-hidden="true" />
            )}
            <span
              className={`text-sm leading-relaxed ${
                feature.included ? "text-zinc-200" : "text-zinc-600"
              }`}
            >
              {feature.label}
              {!feature.included && (
                <span className="sr-only"> (non inclus)</span>
              )}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <button
          id={`btn-plan-${plan.id.toLowerCase()}`}
          onClick={() => onSelect(plan.id)}
          disabled={loading !== null}
          className={`flex w-full flex-col items-center gap-1 rounded-xl px-5 py-4 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 ${
            highlighted
              ? "bg-indigo-600 text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] hover:bg-indigo-700"
              : "border border-zinc-700 bg-zinc-800 text-white/80 hover:bg-zinc-700"
          }`}
        >
          <span>{busy ? "Redirection…" : CTA_LABELS[plan.id]}</span>
          <span
            className={`text-[10px] font-medium uppercase tracking-wider ${
              highlighted ? "text-indigo-200" : "text-zinc-500"
            }`}
          >
            {reassurance(plan)}
          </span>
        </button>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<PlanId | null>(null)
  const [error, setError] = useState<string | null>(null)
  const faq = buildFaq()
  const pack = PLANS.PACK

  const handleSelect = async (planId: PlanId) => {
    if (planId === "FREE") {
      router.push("/signup")
      return
    }

    try {
      setLoading(planId)
      setError(null)
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
        return
      }

      if (response.status === 401) {
        // Non connecté : on passe par l'inscription plutôt que d'afficher une erreur.
        router.push("/signup")
        return
      }

      const data = await response.json().catch(() => null)
      setError(data?.error || "Une erreur est survenue lors du paiement.")
    } catch {
      setError("Impossible de se connecter au service de paiement.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      {/* ── HERO ── */}
      <section className="pb-16 pt-24 md:pb-24 md:pt-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-400"
          >
            Préparation d&apos;entretien par IA
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[2.6rem] font-semibold leading-[1.1] tracking-tight text-white md:text-[4rem]"
          >
            Un entretien peut changer
            <br />
            votre carrière.
            <br />
            <span className="text-indigo-400">Préparez-le comme tel.</span>
          </motion.h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl">
            Trajectoire analyse votre CV et l&apos;offre que vous visez, identifie
            les points qui peuvent vous coûter le poste, puis vous entraîne
            précisément là où cela compte.
          </p>

          {error && (
            <div
              role="alert"
              className="mx-auto mt-8 max-w-md rounded-xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm font-medium text-rose-300"
            >
              {error}
            </div>
          )}
        </div>
      </section>

      {/* ── FORMULES ── */}
      <section className="pb-20 md:pb-28" aria-labelledby="formules-title">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-400">
            Formules
          </p>
          <h2
            id="formules-title"
            className="mb-16 text-center text-3xl font-semibold tracking-tight text-white md:text-5xl"
          >
            Choisissez votre niveau de préparation.
          </h2>

          <div className="grid items-stretch gap-6 md:grid-cols-3 md:gap-8">
            {PLAN_ORDER.map((id, index) => (
              <PlanCard
                key={id}
                plan={PLANS[id]}
                index={index}
                loading={loading}
                onSelect={handleSelect}
              />
            ))}
          </div>

          <p className="mt-10 text-center text-[11px] font-medium tracking-wide text-zinc-500">
            Prix TTC · Paiement sécurisé par Stripe · Données privées
          </p>
        </div>
      </section>

      {/* ── MÉTHODE ── */}
      <section className="border-y border-zinc-800 bg-zinc-900/40 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-400">
            La méthode
          </p>
          <h2 className="mb-14 text-center text-3xl font-semibold tracking-tight text-white md:text-[2.5rem]">
            Ce n&apos;est pas un chatbot d&apos;entretien.
            <br />
            <span className="text-zinc-500">
              C&apos;est une préparation à cet entretien.
            </span>
          </h2>

          <ol
            className="grid gap-4 md:grid-cols-5"
            aria-label="Parcours Trajectoire"
          >
            {STEPS.map((step, i) => (
              <motion.li
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 md:flex-col md:items-start md:gap-3"
              >
                <span className="text-[11px] font-bold tracking-widest text-indigo-400">
                  {step.n}
                </span>
                <span className="text-sm font-medium leading-snug text-zinc-200">
                  {step.label}
                </span>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── PREUVE PRODUIT ── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-400">
            Exemple d&apos;interface
          </p>
          <h2 className="mb-4 text-center text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Ce que Trajectoire identifie pour vous.
          </h2>
          <p className="mb-12 text-center text-base text-zinc-500">
            Exemple représentatif — vos priorités seront dérivées de votre CV et
            de l&apos;offre réelle.
          </p>

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="border-b border-zinc-800 px-6 py-5 md:px-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                Vos priorités pour cet entretien
              </p>
            </div>
            <div className="divide-y divide-zinc-800">
              {PRIORITIES.map((priority, i) => (
                <div key={priority} className="flex items-start gap-5 px-6 py-6 md:px-8">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-[11px] font-bold text-indigo-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-base leading-snug text-zinc-200">{priority}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-800 px-6 py-5 md:px-8">
              <p className="text-sm leading-relaxed text-zinc-500">
                La simulation Trajectoire insiste ensuite précisément sur ces
                points — question par question.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-zinc-800 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-400">
            FAQ
          </p>
          <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Questions fréquentes
          </h2>

          <div role="list">
            {faq.map((item, i) => (
              <div key={item.q} role="listitem">
                <FAQAccordion q={item.q} a={item.a} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="border-t border-zinc-800 bg-zinc-900/40 py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            Votre prochain entretien mérite
            <br />
            une vraie préparation.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-zinc-400 md:text-xl">
            Commencez gratuitement. Passez au Pack quand vous en avez besoin.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              id="btn-cta-pack"
              onClick={() => handleSelect("PACK")}
              disabled={loading !== null}
              className="w-full rounded-xl bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] transition-colors hover:bg-indigo-700 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading === "PACK"
                ? "Redirection…"
                : `${pack.name} – ${formatPrice(pack)}`}
            </button>
            <button
              id="btn-cta-free"
              onClick={() => handleSelect("FREE")}
              className="w-full rounded-xl border border-zinc-700 bg-transparent px-8 py-4 text-base font-semibold text-white/80 transition-colors hover:bg-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 sm:w-auto"
            >
              Analyser mon CV gratuitement
            </button>
          </div>
        </div>
      </section>
    </MotionConfig>
  )
}
