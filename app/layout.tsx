import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProviderWrapper } from "@/providers/posthog-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://studioentretien.fr",
  ),
  title: {
    default: "StudioEntretien — Entraîne-toi. Progresse. Réussis.",
    template: "%s | StudioEntretien",
  },
  description:
    "Simule des entretiens d'embauche réalistes avec l'IA et progresse à chaque session. 1 session Premium offerte à l'inscription.",
  keywords: [
    "ATS",
    "CV",
    "entretien",
    "emploi",
    "IA",
    "optimisation CV",
    "simulation entretien",
    "carrière",
    "recrutement",
  ],
  authors: [{ name: "StudioEntretien" }],
  creator: "StudioEntretien",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://studioentretien.fr",
    siteName: "StudioEntretien",
    title: "StudioEntretien — Entraîne-toi. Progresse. Réussis.",
    description:
      "Simule des entretiens réalistes avec l'IA. 1 session Premium offerte.",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudioEntretien",
    description: "Simule des entretiens réalistes avec l'IA et progresse.",
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
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased bg-[#0b0f14] text-[#e5e7eb]">
        <PostHogProviderWrapper>{children}</PostHogProviderWrapper>
      </body>
    </html>
  );
}
