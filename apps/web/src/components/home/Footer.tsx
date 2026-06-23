"use client";

import Link from "next/link";
import { Linkedin, Twitter, Mail } from "lucide-react";
import { Container } from "@/components/ui";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";



const FOOTER_LINKS = {
  Produit: [
    { label: "Fonctionnalités", href: "#features" },
    { label: "Méthode", href: "#method" },
    { label: "Résultats", href: "#results" },
    { label: "Tarifs", href: "#pricing" },
    { label: "Pour les entreprises", href: "/entreprises" },
  ],
  Entreprise: [
    { label: "À propos", href: "/about" },
    { label: "Cas clients", href: "/cas-clients" },
    { label: "Recherche & science", href: "/research" },
    { label: "Contact", href: "/contact" },
  ],
  Légal: [
    { label: "CGU", href: "/cgu" },
    { label: "CGV", href: "/cgv" },
    { label: "Confidentialité", href: "/privacy" },
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Cookies", href: "/cookies" },
  ],
} as const;

const SOCIALS = [
  {
    href: "https://linkedin.com/company/trajectoire", // À remplacer par la vraie URL
    label: "LinkedIn",
    icon: Linkedin,
    external: true,
  },
  {
    href: "https://twitter.com/trajectoire", // À remplacer par la vraie URL
    label: "Twitter",
    icon: Twitter,
    external: true,
  },
  {
    href: "mailto:contact@trajectoire.io",
    label: "Email",
    icon: Mail,
    external: false,
  },
] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-20 lg:pt-24 pb-10 bg-ink text-white border-t border-white/10">
      <Container>
        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-16">

          {/* ── Colonne marque ── */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white bg-brand-primary text-lg transition-transform duration-300 group-hover:scale-105">
                T
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Trajectoire
              </span>
            </Link>

            {/* Pitch */}
            <p className="text-body-sm leading-relaxed text-white/60 max-w-[380px]">
              La plateforme d&apos;intelligence décisionnelle de carrière pour
              cadres, managers et dirigeants. Évaluez vos forces, préparez vos
              moments décisifs, prenez le contrôle.
            </p>

            {/* Réseaux */}
            <div className="flex items-center gap-3 mt-2">
              {SOCIALS.map(({ href, label, icon: Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  onClick={() => {
                    trackEvent(ANALYTICS_EVENTS.SOCIAL_CLICKED, {
                      platform: label,
                    });
                  }}
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-white transition-all duration-200 hover:bg-brand-accent hover:border-brand-accent hover:-translate-y-0.5"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Colonnes de liens ── */}
          <nav
            className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8"
            aria-label="Liens du pied de page"
          >
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category} className="flex flex-col gap-4">
                <div className="font-bold text-xs tracking-widest uppercase text-brand-accent">
                  {category}
                </div>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-body-sm text-white/60 hover:text-white transition-colors duration-200"
                        onClick={() => {
                          trackEvent(ANALYTICS_EVENTS.FOOTER_CTA_CLICKED, {
                            label: link.label,
                            category,
                          });
                        }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bandeau légal */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-caption text-white/50">
            © {currentYear} Trajectoire. Tous droits réservés. Fait avec rigueur en France 🇫🇷
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-caption text-white/50">
              <span
                className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"
                aria-hidden="true"
              />
              Tous les systèmes opérationnels
            </div>
            <div className="text-caption text-white/50">
              🇫🇷 Hébergement français · RGPD
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
