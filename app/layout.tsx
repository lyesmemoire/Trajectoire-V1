import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProviderWrapper } from "@/providers/posthog-provider";
import { envServer } from "@/lib/env.server";
import { generateMetadata } from "@/components/seo/metadata";
import { WebSiteSchema, OrganizationSchema } from "@/components/seo/json-ld";

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

export const metadata = generateMetadata({
  title: "Trajectoire — Révélez votre potentiel avant l'entretien.",
  description: "Préparez vos entretiens avec précision et sérénité. Analyse comportementale en temps réel, détection d'incohérence CV/oral, et Career DNA.",
  keywords: ["ATS", "CV", "entretien", "emploi", "IA", "optimisation CV", "simulation entretien", "carrière", "recrutement"],
  canonical: envServer.NEXT_PUBLIC_APP_URL || "https://trajectoire.io",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased bg-background text-text">
        <WebSiteSchema />
        <OrganizationSchema
          name="Trajectoire"
          description="Préparez vos entretiens avec précision et sérénité. Analyse comportementale en temps réel."
          sameAs={[
            "https://twitter.com/trajectoire",
            "https://linkedin.com/company/trajectoire",
            "https://facebook.com/trajectoire",
          ]}
        />
        <PostHogProviderWrapper>{children}</PostHogProviderWrapper>
      </body>
    </html>
  );
}
