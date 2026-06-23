import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, SITE_TAGLINE } from "./constants";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Préparez vos décisions de carrière avec confiance`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Plateforme d'évaluation comportementale et de préparation aux moments professionnels à fort enjeu. Diagnostic, simulation, feedback personnalisé pour cadres et managers.",
  keywords: [
    "career assessment platform",
    "interview preparation",
    "executive coaching technology",
    "professional development",
    "behavioral intelligence",
    "leadership development",
    "career transition",
    "internal mobility",
    "executive readiness",
    "préparation entretien",
    "bilan compétences",
    "coaching carrière",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Évaluez vos forces comportementales, simulez vos entretiens, prenez vos décisions de carrière avec confiance et méthode.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Career Decision Intelligence Platform`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Préparez vos décisions de carrière`,
    description:
      "Évaluation comportementale et préparation aux moments professionnels à fort enjeu.",
    images: [`${SITE_URL}/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-token",
  },
};
