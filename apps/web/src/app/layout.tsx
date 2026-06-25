import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PostHogProvider } from "@/components/providers/PostHogProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://trajectoire.app"),
  title: {
    default: "Trajectoire – Reprenez le contrôle.",
    template: "%s | Trajectoire",
  },
  description: "Trajectoire aide les cadres et dirigeants à prendre les bonnes décisions avec clarté et confiance.",
  openGraph: {
    title: "Trajectoire – Reprenez le contrôle.",
    description: "Passez de l'intuition à la certitude.",
    type: "website",
    locale: "fr_FR",
    siteName: "Trajectoire",
    url: "https://trajectoire.app",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Trajectoire" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-white text-ink antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-primary text-white px-4 py-2 rounded-lg z-50">Aller au contenu principal</a>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
