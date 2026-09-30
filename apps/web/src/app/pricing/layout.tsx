import Footer from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"

// /pricing est une page du site public : thème clair (décision du 2026-10-02), comme le groupe (marketing).
// Elle vit hors du groupe car elle est aussi atteinte depuis l'espace connecté (lien « Abonnement »).
export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <div id="main" className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  )
}
