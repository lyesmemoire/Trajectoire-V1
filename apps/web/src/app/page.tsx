import type { Metadata } from "next"
import { HomeHeader } from "@/components/home/HomeHeader"
import { Hero } from "@/components/home/Hero"
import {
  ClosingSection,
  ConvictionSection,
  FaqSection,
  ForWhomSection,
  HomeFooter,
  MethodSection,
  PricingSection,
  ReportSection,
  Testimonials,
} from "@/components/home/Sections"
import { HOME_DESCRIPTION } from "@/components/home/content"

const ogImage = "/images/og-home.jpg"

const homeTitle = "Trajectoire – Entraînez-vous face au recruteur qui a lu votre CV"
const homeDescription = HOME_DESCRIPTION

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
 * Homepage (référence : docs/design/homepage-finale-apercu.html) : composant serveur. Client uniquement pour le menu
 * déplié, les segments, le dépôt du CV et l'apparition au défilement. Rien d'animé dans le héros.
 */
export default function HomePage() {
  return (
    <>
      <HomeHeader />
      <main id="main">
        <Hero />
        <MethodSection />
        <ForWhomSection />
        <ReportSection />
        <ConvictionSection />
        <Testimonials />
        <PricingSection />
        <FaqSection />
        <ClosingSection />
      </main>
      <HomeFooter />
    </>
  )
}
