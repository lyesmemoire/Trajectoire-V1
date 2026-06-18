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
    process.env.NEXT_PUBLIC_APP_URL || "https://trajectoire.io",
  ),
  title: {
    default: "Trajectoire — Révélez votre potentiel avant l'entretien.",
    template: "%s | Trajectoire",
  },
  description:
    "Simulez des entretiens sous pression avec l'IA. Analyse comportementale en temps réel, détection d'incohérence CV/oral, et Career DNA.",
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
  authors: [{ name: "Trajectoire" }],
  creator: "Trajectoire",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://trajectoire.io",
    siteName: "Trajectoire",
    title: "Trajectoire — Révélez votre potentiel avant l'entretien.",
    description:
      "Simulez des entretiens sous pression avec l'IA. Analyse comportementale en temps réel.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trajectoire",
    description: "Simulez des entretiens sous pression avec l'IA. Analyse comportementale en temps réel.",
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
