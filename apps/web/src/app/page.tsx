import type { Metadata } from "next"
import { HomeHeader } from "@/components/home/HomeHeader"
import { AlexandraStrip, HeroProductCard } from "@/components/home/Hero"
import { SegmentsSection } from "@/components/home/SegmentsSection"
import {
  FaqSection,
  FinalCta,
  HomeFooter,
  HowItWorks,
  PricingSection,
  Reassurance,
  ReportSection,
  Testimonials,
} from "@/components/home/Sections"
import { CvPreviewForm } from "@/components/marketing/CvPreviewForm"

const ogImage = "/images/og-home.jpg"

const homeTitle = "Trajectoire – Entraînez-vous face au recruteur qui a lu votre CV"
const homeDescription =
  "Alexandra, votre recruteuse d’entraînement, vous pose les vraies questions de l’offre que vous visez. À voix haute, sans jugement, puis un rapport clair pour progresser. Diagnostic gratuit."

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
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Trajectoire : préparez sereinement votre entretien" }],
  },
  twitter: { card: "summary_large_image", title: homeTitle, description: homeDescription, images: [ogImage] },
}

/**
 * Homepage V3 (docs/design/homepage-v3-brief.md) : composant serveur. Client uniquement pour le menu mobile, les
 * segments, le dépôt du CV et l'apparition au défilement. Pas de photo : la colonne de droite est la carte produit.
 */
export default function HomePage() {
  return (
    <>
      <HomeHeader />
      <main id="main">
        <section aria-labelledby="hero-titre" className="mx-auto w-full max-w-[1200px] px-5 pb-16 pt-10 min-[900px]:pb-20 min-[900px]:pt-16">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-start gap-10 min-[900px]:gap-14">
            <div className="flex flex-col gap-6">
              <h1 id="hero-titre" className="text-[clamp(36px,5.6vw,60px)] font-semibold leading-[1.08] tracking-[-0.02em] text-calm-ink">
                Entraînez-vous face au recruteur qui a{" "}
                <span className="font-accent text-calm-accent-deep">lu votre CV</span>.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-calm-secondary">
                Alexandra, votre recruteuse d’entraînement, vous pose les vraies questions de l’offre que vous visez. À voix
                haute, sans jugement, puis un rapport clair pour progresser.
              </p>
              <AlexandraStrip />
              <div id="diagnostic" className="scroll-mt-24">
                <CvPreviewForm />
              </div>
            </div>
            <HeroProductCard />
          </div>
        </section>

        <SegmentsSection />
        <HowItWorks />
        <ReportSection />
        <Reassurance />
        <Testimonials />
        <PricingSection />
        <FaqSection />
        <FinalCta />
      </main>
      <HomeFooter />
    </>
  )
}
