import { Navbar } from "@/components/design-system";
import { Footer } from "@/components/design-system";
import Link from "next/link";
import { generateMetadata } from "@/components/seo/metadata";
import { WebSiteSchema, OrganizationSchema } from "@/components/seo/json-ld";

export const metadata = generateMetadata({
  title: "Trajectoire - Optimisez votre CV avec l'IA",
  description: "Plateforme d'optimisation de CV propulsée par l'intelligence artificielle. Analysez, optimisez et améliorez votre CV pour maximiser vos chances de réussite.",
  keywords: ["CV", "optimisation", "IA", "ATS", "recrutement", "carrière"],
});

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WebSiteSchema />
      <OrganizationSchema
        name="Trajectoire"
        description="Plateforme d'optimisation de CV propulsée par l'intelligence artificielle."
        sameAs={[
          "https://twitter.com/trajectoire",
          "https://linkedin.com/company/trajectoire",
          "https://facebook.com/trajectoire",
        ]}
      />
      <div className="min-h-screen bg-background text-text">
        <Navbar
          logo={
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-soft">
                T
              </div>
              <span className="font-semibold text-xl tracking-tight">
                Trajectoire
              </span>
            </Link>
          }
          navItems={[
            { label: "Méthode", href: "#methode" },
            { label: "Accompagnement", href: "#accompagnement" },
            { label: "Résultats", href: "#resultats" },
            { label: "Tarifs", href: "#tarifs" },
          ]}
          actions={
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
            >
              Commencer
            </Link>
          }
          variant="default"
        />
        <main>{children}</main>
        <Footer
          logo={
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
                T
              </div>
              <span className="font-semibold text-xl tracking-tight">
                Trajectoire
              </span>
            </Link>
          }
          columns={[
            {
              title: "Produit",
              links: [
                { label: "Méthode", href: "#methode" },
                { label: "Accompagnement", href: "#accompagnement" },
                { label: "Tarifs", href: "#tarifs" },
              ],
            },
            {
              title: "Ressources",
              links: [
                { label: "Blog", href: "/blog" },
                { label: "Guides", href: "/guides" },
                { label: "Études de cas", href: "/cases" },
              ],
            },
            {
              title: "Entreprise",
              links: [
                { label: "À propos", href: "#fondatrice" },
                { label: "Carrières", href: "/careers" },
                { label: "Contact", href: "/contact" },
              ],
            },
          ]}
        />
      </div>
    </>
  );
}
