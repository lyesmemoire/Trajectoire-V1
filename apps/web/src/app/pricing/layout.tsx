import Footer from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { darkTokens } from "@/lib/theme/dark-tokens"

// /pricing vit hors du groupe (marketing) : ce groupe est en thème clair
// (navbar, footer). Les tokens sombres partagés basculent Navbar et Footer
// en zinc-950 sans toucher au reste du marketing.
export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={darkTokens}
      className="flex min-h-screen flex-col bg-zinc-950 text-white/80"
    >
      <Navbar />
      <div id="main" className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  )
}
