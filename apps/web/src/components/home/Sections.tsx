import Link from "next/link"
import { PLANS, type Plan } from "@/lib/plans"
import { canShowLegalNotice } from "@/lib/legal/publisher"
import { Reveal } from "./Reveal"
import { Logo } from "./Logo"
import { SegmentPicker } from "./SegmentsSection"
import { btn, eyebrow, h2Big, idx } from "./styles"
import {
  CLOSING,
  CONVICTION,
  FAQ,
  FAQ_INDEX,
  FEATURED_PLAN_BADGE,
  FOOTER_TAGLINE,
  FOR_WHOM,
  FREE_PLAN_EXTRAS,
  METHOD,
  PRICING_HEAD,
  PRICING_INTRO,
  PURCHASE_ENABLED,
  PURCHASE_SOON_LABEL,
  REASSURANCE,
  REPORT_EXAMPLE,
  REPORT_INTRO,
  SHOW_SCHOOLS_LINK,
  SHOW_TESTIMONIALS,
  STEPS,
  TESTIMONIALS,
} from "./content"

/** Deux colonnes : repère à gauche, contenu à droite (1 colonne sous 980 px). */
const split = "grid grid-cols-[1fr_1.8fr] gap-[8%] max-[980px]:grid-cols-1 max-[980px]:gap-6"

/** 3. La méthode */
export function MethodSection() {
  return (
    <section
      id="methode"
      aria-labelledby="methode-titre"
      className="home-wrap border-t border-calm-line pb-[clamp(56px,7vw,96px)] pt-[clamp(72px,9vw,130px)]"
    >
      <Reveal>
        <div className={split}>
          <div className={idx}>{METHOD.index}</div>
          <div>
            <h2 id="methode-titre" className={h2Big}>
              {METHOD.title} <em>{METHOD.accent}</em>
            </h2>
            <p className="mb-0 mt-7 max-w-[470px] text-lg leading-[1.6] text-calm-secondary">{METHOD.text}</p>
          </div>
        </div>
        <ol className="m-0 mt-[clamp(48px,6vw,80px)] grid list-none grid-cols-3 gap-10 p-0 max-[980px]:grid-cols-1">
          {STEPS.map((step) => (
            <li key={step.title} className="flex flex-col gap-2.5 border-t border-calm-rule pt-[22px]">
              <span className={idx}>{step.kicker}</span>
              <h3 className="m-0 text-[30px] leading-[1.05] tracking-[-0.03em]">{step.title}</h3>
              <p className="m-0 text-calm-secondary">{step.text}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  )
}

/** 4. Pour qui : bloc accent à gauche, segments et questions à droite (sans arrondi). */
export function ForWhomSection() {
  return (
    <section id="pour-qui" aria-label="Pour qui" className="home-wrap grid grid-cols-2 gap-[18px] max-[980px]:grid-cols-1">
      <article className="flex min-h-[400px] flex-col items-start bg-calm-accent p-[clamp(24px,3vw,36px)] text-calm-on-accent">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-calm-on-accent-mark">{FOR_WHOM.index}</span>
        <h2 className="mb-[18px] mt-auto max-w-[470px] text-[clamp(36px,4.2vw,58px)] leading-[0.96] text-white">
          {FOR_WHOM.title}
        </h2>
        <p className="m-0 max-w-[400px] text-calm-on-accent-2">{FOR_WHOM.text}</p>
      </article>
      <SegmentPicker />
    </section>
  )
}

/** 5. Le rapport */
export function ReportSection() {
  return (
    <section aria-labelledby="rapport-titre" className="home-wrap py-[clamp(72px,9vw,130px)]">
      <Reveal>
        <div className="grid grid-cols-[1fr_1.35fr] items-start gap-[8%] max-[980px]:grid-cols-1 max-[980px]:gap-6">
          <div className="flex flex-col gap-[22px]">
            <div className={idx}>{REPORT_INTRO.index}</div>
            <h2 id="rapport-titre" className="text-[clamp(36px,4.2vw,58px)] leading-[0.96]">
              {REPORT_INTRO.title} <em>{REPORT_INTRO.accent}</em>
            </h2>
            <p className="m-0 text-[17px] text-calm-secondary">{REPORT_INTRO.text}</p>
          </div>
          <div className="rounded-[6px] border border-calm-line p-[clamp(22px,3vw,34px)] shadow-report">
            <div className="border-b border-calm-line pb-5">
              <span className={idx}>Votre point fort</span>
              <p className="mb-0 mt-2 font-serif text-[28px] font-medium leading-[1.1] tracking-[-0.02em]">{REPORT_EXAMPLE.strength}</p>
            </div>
            <div className="border-b border-calm-line py-5">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-calm-warn">À travailler en priorité</span>
              <p className="mb-0 mt-2 font-serif text-[28px] font-medium leading-[1.1] tracking-[-0.02em]">{REPORT_EXAMPLE.priority}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-5 max-[980px]:grid-cols-1">
              <div>
                <span className="text-[13px] font-bold text-calm-secondary">Votre réponse</span>
                <p className="mb-0 mt-1.5 text-calm-secondary">«&nbsp;{REPORT_EXAMPLE.answer}&nbsp;»</p>
              </div>
              <div>
                <span className="text-[13px] font-bold text-calm-accent">Une version plus claire</span>
                <p className="mb-0 mt-1.5">«&nbsp;{REPORT_EXAMPLE.clearer}&nbsp;»</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/** 6. Notre conviction (fond alterné) */
export function ConvictionSection() {
  return (
    <section aria-labelledby="conviction-titre" className="bg-calm-alt">
      <div className="home-wrap py-[clamp(64px,8vw,110px)]">
        <Reveal>
          <p className={`${eyebrow} mb-[22px]`}>
            <i aria-hidden="true" className="inline-block h-px w-6 bg-current" />
            {CONVICTION.eyebrow}
          </p>
          <h2 id="conviction-titre" className={`max-w-[900px] ${h2Big}`}>
            {CONVICTION.title} <em>{CONVICTION.accent}</em>
          </h2>
          <p className="mb-0 mt-[26px] max-w-[520px] text-lg leading-[1.6] text-calm-secondary">{CONVICTION.text}</p>
          <ul className="m-0 mt-[clamp(40px,5vw,64px)] grid list-none grid-cols-4 gap-8 p-0 max-[980px]:grid-cols-2 max-[520px]:grid-cols-1">
            {REASSURANCE.map((item) => (
              <li key={item.title} className="border-t border-calm-rule pt-[18px]">
                <h3 className="mb-1.5 mt-0 font-sans text-[17px] font-semibold tracking-normal">{item.title}</h3>
                <p className="m-0 text-[15px] text-calm-secondary">{item.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

/** Témoignages : prêt, masqué (SHOW_TESTIMONIALS = false) tant qu'il n'existe aucun témoignage réel. */
export function Testimonials() {
  if (!SHOW_TESTIMONIALS || TESTIMONIALS.length === 0) return null
  return (
    <section aria-labelledby="temoignages-titre" className="home-wrap py-16">
      <h2 id="temoignages-titre" className="text-[clamp(32px,4vw,48px)]">
        Ils se sont entraînés avec Trajectoire
      </h2>
      <ul className="m-0 mt-8 grid list-none grid-cols-3 gap-5 p-0 max-[980px]:grid-cols-1">
        {TESTIMONIALS.map((t) => (
          <li key={t.author} className="border-t border-calm-rule pt-5">
            <blockquote className="m-0 font-serif text-2xl">«&nbsp;{t.quote}&nbsp;»</blockquote>
            <p className="mb-0 mt-4 text-sm font-semibold">{t.author}</p>
            <p className="m-0 text-sm text-calm-secondary">{t.context}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Prix par simulation d'un pack à paiement unique (ex. 29 € pour 5 simulations : 5,80 €). */
function perSimulation(plan: Plan): string | null {
  if (plan.interval !== "one_time" || !plan.simulationLimit) return null
  const unit = (plan.price / plan.simulationLimit).toFixed(2).replace(".", ",")
  return `soit ${unit} € par simulation`
}

function priceLabel(plan: Plan): { amount: string; note: string } {
  const unit = perSimulation(plan)
  if (plan.price === 0) return { amount: "0 €", note: "sans carte bancaire" }
  if (plan.interval === "one_time") return { amount: `${plan.price} €`, note: `paiement unique, TTC${unit ? ` · ${unit}` : ""}` }
  return { amount: `${plan.price} €`, note: "par mois, TTC · résiliable à tout moment" }
}

/** Typographie française des libellés de lib/plans.ts : apostrophe droite → ’, espace insécable avant « 3 remarques ». */
const typo = (label: string) => label.replace(/'/g, "’").replace(/(\d) (remarques|mois)/g, "$1 $2")

/** 7. Tarifs : noms, prix et contenus lus dans lib/plans.ts (source de vérité). */
export function PricingSection() {
  const plans = [PLANS.FREE, PLANS.PACK, PLANS.PRO]
  return (
    <section id="tarifs" aria-labelledby="tarifs-titre" className="home-wrap pt-[clamp(72px,9vw,130px)]">
      <Reveal>
        <div className={`${split} mb-[clamp(36px,4vw,56px)]`}>
          <div className={idx}>{PRICING_HEAD.index}</div>
          <div>
            <h2 id="tarifs-titre" className={h2Big}>
              {PRICING_HEAD.title} <em>{PRICING_HEAD.accent}</em>
            </h2>
            <p className="mb-0 mt-[22px] max-w-[520px] text-lg leading-[1.6] text-calm-secondary">{PRICING_INTRO}</p>
          </div>
        </div>
        <ul className="m-0 grid list-none grid-cols-3 gap-[18px] p-0 max-[980px]:grid-cols-1">
          {plans.map((plan) => {
            const { amount, note } = priceLabel(plan)
            const featured = plan.highlighted
            // Seuls les avantages inclus sont listés : pas de lignes « non inclus » sur la homepage.
            const labels = [
              ...plan.features.filter((f) => f.included).map((f) => f.label),
              ...(plan.id === "FREE" ? FREE_PLAN_EXTRAS : []),
            ]
            const outline =
              "mt-auto rounded-[4px] border border-calm-accent px-[18px] py-3.5 text-center font-semibold text-calm-accent no-underline transition-colors hover:bg-calm-accent hover:text-white"
            return (
              <li
                key={plan.id}
                className={`flex flex-col gap-4 p-8 ${featured ? "bg-calm-accent text-calm-on-accent" : "bg-calm-alt"}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3
                    className={`m-0 font-sans ${idx} tracking-[0.12em] ${featured ? "!text-calm-on-accent-mark" : ""}`}
                  >
                    {plan.name}
                  </h3>
                  {featured && (
                    <span className="rounded-[3px] bg-white px-2.5 py-[3px] text-xs font-bold text-calm-accent">
                      {FEATURED_PLAN_BADGE}
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-serif text-[64px] font-medium leading-[0.9] tracking-[-0.04em]">{amount}</span>
                  <div className={`mt-2 text-sm ${featured ? "text-calm-on-accent-2" : "text-calm-secondary"}`}>{note}</div>
                </div>
                <ul
                  className={`m-0 flex list-none flex-col gap-2 p-0 text-[15px] ${
                    featured ? "text-calm-on-accent-2" : "text-calm-secondary"
                  }`}
                >
                  {labels.map((label) => (
                    <li key={label}>{typo(label)}</li>
                  ))}
                </ul>
                {plan.id === "FREE" ? (
                  <a href="#diagnostic" className={outline}>
                    Obtenir mon diagnostic gratuit
                  </a>
                ) : PURCHASE_ENABLED ? (
                  <Link
                    href="/pricing"
                    className={
                      featured
                        ? "mt-auto rounded-[4px] bg-white px-[18px] py-[15px] text-center font-semibold text-calm-ink no-underline"
                        : outline
                    }
                  >
                    Choisir {plan.id === "PRO" ? plan.name : `le ${plan.name}`}
                  </Link>
                ) : (
                  <p
                    className={`m-0 mt-auto rounded-[4px] border border-dashed px-[18px] py-3.5 text-center font-semibold ${
                      featured ? "border-calm-on-accent-mark text-calm-on-accent" : "border-calm-field text-calm-secondary"
                    }`}
                  >
                    {PURCHASE_SOON_LABEL}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      </Reveal>
    </section>
  )
}

/** 8. FAQ */
export function FaqSection() {
  return (
    <section aria-labelledby="faq-titre" className="home-wrap pt-[clamp(72px,9vw,130px)]">
      <div className={split}>
        <h2 id="faq-titre" className={`${idx} m-0 font-sans tracking-[0.12em]`}>
          {FAQ_INDEX}
        </h2>
        <div className="border-t border-calm-rule">
          {FAQ.map((item) => (
            <details key={item.q} className="group border-b border-calm-line py-5">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-serif text-[27px] font-medium leading-[1.1] tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden="true" className="font-sans text-2xl font-normal text-calm-accent transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mb-0 mt-3 max-w-[620px] text-calm-secondary">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/** 9. Fin */
export function ClosingSection() {
  return (
    <section
      aria-labelledby="fin-titre"
      className="home-wrap pb-[clamp(88px,11vw,160px)] pt-[clamp(96px,12vw,180px)] text-center"
    >
      <Reveal>
        <p className={`${eyebrow} mb-6 justify-center`}>
          <i aria-hidden="true" className="inline-block h-px w-6 bg-current" />
          {CLOSING.eyebrow}
        </p>
        <h2 id="fin-titre" className="mb-10 text-[clamp(60px,10vw,140px)] leading-[0.9]">
          {CLOSING.title} <em>{CLOSING.accent}</em>
        </h2>
        <a href="#diagnostic" className={`${btn} min-h-14 px-[26px] text-base`}>
          Obtenir mon diagnostic gratuit
          <span aria-hidden="true" className="text-xl font-normal">
            →
          </span>
        </a>
        <p className="mb-0 mt-3.5 text-sm text-calm-secondary">{CLOSING.note}</p>
        {SHOW_SCHOOLS_LINK && (
          <p className="mt-6 text-sm text-calm-secondary">
            Vous êtes une école, un CFA ou une université&nbsp;?{" "}
            <Link href="/ecoles" className="font-semibold text-calm-accent underline underline-offset-4">
              Découvrir l’offre établissements
            </Link>
          </p>
        )}
      </Reveal>
    </section>
  )
}

/** 10. Pied de page */
export function HomeFooter() {
  const item =
    "inline-flex min-h-11 min-w-11 items-center justify-center text-[13px] text-calm-secondary no-underline transition-colors hover:text-calm-accent"
  return (
    <footer className="home-wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-3.5 border-t border-calm-line pb-7 pt-[22px] text-[13px] text-calm-secondary max-[520px]:flex-col max-[520px]:items-start">
      <Logo size="footer" />
      <span>{FOOTER_TAGLINE}</span>
      <nav aria-label="Liens du pied de page" className="flex flex-wrap gap-x-5">
        {SHOW_SCHOOLS_LINK && (
          <Link href="/ecoles" className={item}>
            Écoles et CFA
          </Link>
        )}
        {canShowLegalNotice() && (
          <Link href="/mentions-legales" className={item}>
            Mentions légales
          </Link>
        )}
        <Link href="/privacy" className={item}>
          Confidentialité
        </Link>
        <Link href="/terms" className={item}>
          CGU
        </Link>
        <Link href="/contact" className={item}>
          Contact
        </Link>
      </nav>
      <span>© {new Date().getFullYear()} Trajectoire</span>
    </footer>
  )
}
