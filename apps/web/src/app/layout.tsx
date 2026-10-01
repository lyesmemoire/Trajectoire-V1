import "./globals.css"
import type { Metadata } from "next"
import { Figtree, Newsreader } from "next/font/google"
import { getScriptNonce, getStyleNonce } from "@/lib/security/csp-nonce"
import { MotionProvider } from "@/components/providers/MotionProvider"

// Design system « Calm » : Figtree pour le texte, Newsreader italique pour les accents (un mot, une courte phrase).
// Servies depuis nos propres fichiers par next/font (pas d'appel à Google à l'exécution, compatible avec la CSP
// `font-src 'self'`).
const figtree = Figtree({ subsets: ["latin", "latin-ext"], display: "swap", variable: "--font-figtree" })
const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  style: ["italic"],
  display: "swap",
  variable: "--font-newsreader",
})

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://trajectoire.app"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Trajectoire – Reprenez le contrôle.",
    template: "%s | Trajectoire",
  },
  description:
    "Préparez vos entretiens d'embauche avec une recruteuse IA et analysez votre CV pour les logiciels de recrutement (ATS).",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Trajectoire – Reprenez le contrôle.",
    description:
      "Simulations d'entretien avec une recruteuse IA, rapport détaillé et analyse de CV pour les logiciels de recrutement.",
    type: "website",
    locale: "fr_FR",
    siteName: "Trajectoire",
    url: SITE_URL,
    // Pas d'image de partage tant que le visuel n'existe pas dans public/ : l'ancienne référence
    // (/og-image.jpg) renvoyait un 404.
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const scriptNonce = await getScriptNonce()
  const styleNonce = await getStyleNonce()

  return (
    <html lang="fr" className={`scroll-smooth ${figtree.variable} ${newsreader.variable}`}>
      <head>
        {/* CSP Nonce - Pass nonces to client via data attributes */}
        <script
          id="csp-nonces"
          data-script-nonce={scriptNonce}
          data-style-nonce={styleNonce}
          nonce={scriptNonce}
          suppressHydrationWarning
        >
          {`window.__CSP_NONCES__ = { script: "${scriptNonce}", style: "${styleNonce}" };`}
        </script>
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        {/* Dans un repère (landmark) : sinon le lien est « hors contenu » pour les lecteurs d'écran. */}
        <nav aria-label="Accès rapide">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-lg z-50"
          >
            Aller au contenu principal
          </a>
        </nav>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
