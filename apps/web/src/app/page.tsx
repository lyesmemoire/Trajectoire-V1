import type { Metadata } from "next"
import Image from "next/image"
import { Lock } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { CvPreviewForm } from "@/components/marketing/CvPreviewForm"

const heroImage = "/images/hero-professional.jpg"
const ogImage = "/images/og-home.jpg"

const homeTitle = "Trajectoire – Préparez sereinement votre entretien"
const homeDescription =
  "Entraînez-vous à l’entretien d’embauche avec une recruteuse IA et analysez votre CV pour les logiciels de recrutement. Diagnostic gratuit, sans engagement."

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    type: "website",
    locale: "fr_FR",
    siteName: "Trajectoire",
    url: "/",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Trajectoire : préparez sereinement votre entretien",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: [ogImage],
  },
}

/**
 * Page d'accueil : composant serveur (rendu sans hydratation). Seul le dépôt du CV, interactif, est un
 * composant client (`CvPreviewForm`).
 */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main
        id="main"
        className="relative min-h-[calc(100dvh-73px)] bg-calm-bg text-calm-ink"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 500px at 18% 12%, rgba(47,107,94,0.07), transparent 60%)," +
              "radial-gradient(700px 450px at 85% 10%, rgba(185,211,200,0.25), transparent 55%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 pt-6 pb-14 lg:pt-20 lg:pb-16">
          <div className="mx-auto w-full max-w-[1120px]">
            <div className="grid gap-8 lg:grid-cols-[repeat(2,minmax(0,540px))] lg:items-start lg:justify-center lg:gap-12">
              {/* ─────────────────────────────
                  COLONNE GAUCHE
              ───────────────────────────── */}
              <section className="flex w-full flex-col items-start gap-5">
                <div className="flex max-w-[500px] flex-col items-start">
                  <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-calm-accent-deep">
                    <span className="h-1.5 w-1.5 rounded-full bg-calm-accent" />
                    Intelligence de candidature
                  </div>

                  <h1 className="font-sans text-calm-display font-semibold text-calm-ink">
                    Préparez sereinement
                    <br />
                    votre <span className="font-accent text-calm-accent">entretien</span>
                  </h1>
                </div>

                {/* secondaire (≥ 4,5:1) : ratio ≥ 4,5:1 même sur le halo du héros */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-calm-secondary">
                  <span className="inline-flex items-center gap-2">
                    <Lock className="h-4 w-4" aria-hidden="true" />
                    Confidentiel
                  </span>

                  <span aria-hidden="true" className="opacity-60">
                    •
                  </span>

                  <span>Résultat immédiat</span>

                  <span aria-hidden="true" className="opacity-60">
                    •
                  </span>

                  <span>Sans engagement</span>
                </div>

                {/* Formulaire principal (seule partie interactive de la page) */}
                <CvPreviewForm />

                {/* Réassurance */}
                <div className="mb-2 mt-3 flex w-full items-center justify-start">
                  <div className="inline-flex items-center gap-3 rounded-full border border-calm-line bg-calm-accent-line px-5 py-2 shadow-premium backdrop-blur lg:border-calm-line">
                    <div className="flex -space-x-2" aria-hidden="true">
                      {["A", "M", "S", "L"].map((initial) => (
                        <span
                          key={initial}
                          className="flex size-8 items-center justify-center rounded-full border-2 border-calm-bg bg-calm-surface text-xs font-semibold text-calm-ink shadow-sm"
                        >
                          {initial}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm leading-snug text-calm-secondary">
                      Conçu pour des profils{" "}
                      <span className="font-semibold text-calm-ink">
                        juniors, seniors
                      </span>{" "}
                      et en{" "}
                      <span className="font-semibold text-calm-ink">
                        reconversion
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </section>

              {/* ─────────────────────────────
                  IMAGE HERO
              ───────────────────────────── */}
              <aside className="relative w-full overflow-hidden rounded-3xl border border-calm-line bg-calm-surface shadow-premium lg:mt-8 lg:border-calm-line">
                <div className="relative h-[340px] w-full overflow-hidden sm:h-[420px] lg:h-[620px]">
                  <Image
                    src={heroImage}
                    alt="Préparation d’entretien dans un contexte professionnel"
                    fill
                    // Image la plus grande de l'écran (LCP sur ordinateur) : 540 px de large dès 1024 px
                    // (deux colonnes), sinon toute la largeur. Un « 100vw » explicite permet à Next de
                    // n'émettre que des largeurs utiles dans le srcset.
                    sizes="(min-width: 1024px) 540px, 100vw"
                    className="hero-photo-motion object-cover object-center"
                    priority
                    fetchPriority="high"
                  />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
