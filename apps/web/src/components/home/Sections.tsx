import Link from "next/link"
import { Check, X } from "lucide-react"
import { PLANS, type Plan } from "@/lib/plans"
import { canShowLegalNotice } from "@/lib/legal/publisher"
import { Reveal } from "./Reveal"
import { Logo } from "./Logo"
import { FAQ, REASSURANCE, REPORT_EXAMPLE, SHOW_SCHOOLS_LINK, SHOW_TESTIMONIALS, STEPS, TESTIMONIALS } from "./content"

const container = "mx-auto w-full max-w-[1200px] px-5"
const eyebrow = "text-xs font-semibold uppercase tracking-[0.16em] text-calm-accent-deep"
const outlineBtn =
  "tap-target inline-flex w-full items-center justify-center rounded-[14px] border border-calm-accent px-5 text-sm font-semibold text-calm-accent-deep transition-colors hover:bg-calm-accent-wash"
const solidBtn =
  "tap-target inline-flex w-full items-center justify-center rounded-[14px] bg-calm-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-calm-accent-deep"

/** 4. Comment ça marche */
export function HowItWorks() {
  return (
    <section id="comment" aria-labelledby="comment-titre" className="scroll-mt-20">
      <div className={`${container} py-16 min-[900px]:py-20`}>
        <Reveal>
          <p className={eyebrow}>Comment ça marche</p>
          <h2 id="comment-titre" className="mt-3 text-calm-h1 font-semibold text-calm-ink">
            Trois étapes, moins de dix minutes
          </h2>
        </Reveal>
        <ol className="mt-10 grid gap-8 min-[900px]:grid-cols-3 min-[900px]:gap-10">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 0.08} className="border-t border-calm-line pt-6">
                <span className="font-accent block text-[52px] leading-none text-calm-accent" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-calm-h3 font-semibold text-calm-ink">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-calm-secondary">{step.text}</p>
                <p className="mt-3 text-sm font-semibold text-calm-accent-deep">{step.duration}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** 5. Le rapport */
export function ReportSection() {
  return (
    <section aria-labelledby="rapport-titre" className="bg-calm-surface">
      <div className={`${container} grid items-center gap-10 py-16 min-[900px]:grid-cols-2 min-[900px]:gap-14 min-[900px]:py-20`}>
        <Reveal>
          <p className={eyebrow}>Le rapport</p>
          <h2 id="rapport-titre" className="mt-3 text-calm-h1 font-semibold text-calm-ink">
            Un rapport qui vous fait progresser, pas douter
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-calm-secondary">
            Pas de liste de quinze défauts. L’essentiel, formulé avec bienveillance, et de quoi vous améliorer dès
            maintenant.
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="rounded-[28px] border border-calm-line bg-calm-surface p-6 shadow-calm sm:p-8">
            <p className="text-sm font-semibold text-calm-accent-deep">Votre point fort</p>
            <p className="mt-1 text-calm-ink">{REPORT_EXAMPLE.strength}</p>
            <p className="mt-5 text-sm font-semibold text-calm-warn">À travailler en priorité</p>
            <p className="mt-1 text-calm-ink">{REPORT_EXAMPLE.priority}</p>
            <div className="mt-6 rounded-[18px] bg-calm-bg p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-calm-tertiary">Votre réponse</p>
              <p className="mt-1 text-calm-ink">«&nbsp;{REPORT_EXAMPLE.answer}&nbsp;»</p>
            </div>
            <div className="mt-3 rounded-[18px] bg-calm-accent-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-calm-accent-deep">Une version plus claire</p>
              <p className="mt-1 text-calm-ink">«&nbsp;{REPORT_EXAMPLE.clearer}&nbsp;»</p>
            </div>
            <a href="#diagnostic" className={`${outlineBtn} mt-6`}>
              Réessayer cette question
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** 6. Réassurance */
export function Reassurance() {
  return (
    <section aria-labelledby="reassurance-titre" className={`${container} py-16 min-[900px]:py-20`}>
      <Reveal className="rounded-[32px] bg-calm-accent-wash p-6 sm:p-10 min-[900px]:p-14">
        <h2 id="reassurance-titre" className="text-calm-h1 font-semibold text-calm-ink">
          Ici, vous avez le droit de <span className="font-accent text-calm-accent-deep">vous tromper</span>.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-calm-secondary">
          Le stress se travaille comme le reste. Plus vous vous entraînez au calme, plus le jour J ressemble à quelque
          chose que vous connaissez déjà.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 min-[1000px]:grid-cols-4">
          {REASSURANCE.map((item) => (
            <li key={item.title} className="rounded-[20px] border border-calm-line bg-calm-surface p-5">
              <h3 className="font-semibold text-calm-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-calm-secondary">{item.text}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}

/** 7. Témoignages : prêt, masqué (SHOW_TESTIMONIALS = false) tant qu'il n'existe aucun témoignage réel. */
export function Testimonials() {
  if (!SHOW_TESTIMONIALS || TESTIMONIALS.length === 0) return null
  return (
    <section aria-labelledby="temoignages-titre" className={`${container} py-16`}>
      <h2 id="temoignages-titre" className="text-calm-h2 font-semibold text-calm-ink">
        Ils se sont entraînés avec Trajectoire
      </h2>
      <ul className="mt-8 grid gap-4 min-[900px]:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <li key={t.author} className="rounded-[20px] border border-calm-line bg-calm-surface p-6">
            <blockquote className="text-calm-ink">«&nbsp;{t.quote}&nbsp;»</blockquote>
            <p className="mt-4 text-sm font-semibold text-calm-ink">{t.author}</p>
            <p className="text-sm text-calm-secondary">{t.context}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function priceLabel(plan: Plan) {
  if (plan.price === 0) return { amount: "0 €", note: "sans engagement" }
  if (plan.interval === "one_time") return { amount: `${plan.price} €`, note: "paiement unique" }
  return { amount: `${plan.price} €`, note: "par mois" }
}

/** 8. Tarifs : noms, prix et contenus lus dans lib/plans.ts (source de vérité). */
export function PricingSection() {
  const plans = [PLANS.FREE, PLANS.PACK, PLANS.PRO]
  return (
    <section id="tarifs" aria-labelledby="tarifs-titre" className="scroll-mt-20 bg-calm-surface">
      <div className={`${container} py-16 min-[900px]:py-20`}>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="tarifs-titre" className="text-calm-h1 font-semibold text-calm-ink">
            Commencez gratuitement
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-calm-secondary">
            Commencez sans payer, puis choisissez l’offre qui correspond à votre recherche. L’offre Pro est sans
            engagement et résiliable à tout moment.
          </p>
        </Reveal>
        <ul className="mt-10 grid items-stretch gap-5 min-[900px]:grid-cols-3">
          {plans.map((plan) => {
            const { amount, note } = priceLabel(plan)
            const featured = plan.highlighted
            return (
              <li
                key={plan.id}
                className={`relative flex flex-col rounded-[22px] bg-calm-surface p-6 shadow-calm ${
                  featured ? "border-2 border-calm-accent" : "border border-calm-line"
                }`}
              >
                {featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-calm-accent px-3 py-1 text-xs font-semibold text-white">
                    Idéal pour la saison
                  </span>
                )}
                <h3 className="text-lg font-semibold text-calm-ink">{plan.name}</h3>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold text-calm-ink">{amount}</span>
                  <span className="text-sm text-calm-secondary">{note}</span>
                </p>
                {plan.price > 0 && <p className="text-xs text-calm-tertiary">TTC</p>}
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-2 text-calm-ink">
                      {f.included ? (
                        <Check className="mt-0.5 size-4 shrink-0 text-calm-accent" aria-hidden="true" />
                      ) : (
                        <X className="mt-0.5 size-4 shrink-0 text-calm-tertiary" aria-hidden="true" />
                      )}
                      <span className={f.included ? "" : "text-calm-secondary"}>
                        {f.included ? "" : <span className="sr-only">Non inclus : </span>}
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>
                {plan.id === "FREE" ? (
                  <a href="#diagnostic" className={`${outlineBtn} mt-6`}>
                    Obtenir mon diagnostic gratuit
                  </a>
                ) : (
                  <Link href="/pricing" className={`${featured ? solidBtn : outlineBtn} mt-6`}>
                    Choisir {plan.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/** 9. FAQ */
export function FaqSection() {
  return (
    <section aria-labelledby="faq-titre" className={`${container} py-16 min-[900px]:py-20`}>
      <h2 id="faq-titre" className="text-calm-h2 font-semibold text-calm-ink">
        Questions fréquentes
      </h2>
      <div className="mt-8 max-w-3xl divide-y divide-calm-line border-y border-calm-line">
        {FAQ.map((item) => (
          <details key={item.q} className="group py-1">
            <summary className="tap-target flex cursor-pointer list-none items-center justify-between gap-4 py-3 font-medium text-calm-ink">
              {item.q}
              <span aria-hidden="true" className="text-xl text-calm-accent transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="pb-4 leading-relaxed text-calm-secondary">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

/** 10. CTA final */
export function FinalCta() {
  return (
    <section aria-labelledby="cta-titre" className={`${container} pb-16 min-[900px]:pb-20`}>
      <Reveal className="rounded-[32px] bg-calm-accent-soft p-8 text-center sm:p-12">
        <h2 id="cta-titre" className="mx-auto max-w-2xl text-calm-h1 font-semibold text-calm-ink">
          Votre prochain entretien se prépare aujourd’hui.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-calm-secondary">
          Déposez votre CV, découvrez ce qu’un recruteur va vous demander, et entraînez-vous au calme.
        </p>
        <a href="#diagnostic" className={`${solidBtn} mx-auto mt-8 !w-auto px-8`}>
          Obtenir mon diagnostic gratuit
        </a>
        <p className="mt-3 text-sm text-calm-secondary">Gratuit, sans carte bancaire</p>
      </Reveal>
      {SHOW_SCHOOLS_LINK && (
        <p className="mt-6 text-center text-sm text-calm-secondary">
          Vous êtes une école, un CFA ou une université&nbsp;?{" "}
          <Link href="/ecoles" className="font-semibold text-calm-accent-deep underline underline-offset-4">
            Découvrir l’offre établissements
          </Link>
        </p>
      )}
    </section>
  )
}

/** 11. Pied de page */
export function HomeFooter() {
  const item =
    "inline-flex min-h-11 items-center rounded-[14px] px-2 text-sm text-calm-secondary transition-colors hover:text-calm-ink"
  return (
    <footer className="border-t border-calm-line bg-calm-surface">
      <div className={`${container} flex flex-col items-start justify-between gap-6 py-10 min-[900px]:flex-row min-[900px]:items-center`}>
        <Logo />
        <nav aria-label="Pied de page">
          <ul className="flex flex-wrap items-center gap-x-2">
            {SHOW_SCHOOLS_LINK && (
              <li>
                <Link href="/ecoles" className={item}>
                  Écoles et CFA
                </Link>
              </li>
            )}
            {canShowLegalNotice() && (
              <li>
                <Link href="/mentions-legales" className={item}>
                  Mentions légales
                </Link>
              </li>
            )}
            <li>
              <Link href="/privacy" className={item}>
                Confidentialité
              </Link>
            </li>
            <li>
              <Link href="/terms" className={item}>
                CGU
              </Link>
            </li>
            <li>
              <Link href="/contact" className={item}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <p className="text-sm text-calm-secondary">© {new Date().getFullYear()} Trajectoire</p>
      </div>
    </footer>
  )
}
