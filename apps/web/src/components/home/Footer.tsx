"use client";

import Link from "next/link";

const FOOTER_LINKS = {
  Produit: [
    { label: "Méthode", href: "#method" },
    { label: "Résultats", href: "#results" },
    { label: "Tarifs", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Pour les entreprises", href: "/entreprises" },
  ],
  Ressources: [
    { label: "Blog", href: "/blog" },
    { label: "Cas clients", href: "/cas-clients" },
    { label: "Méthode Career DNA", href: "/career-dna" },
    { label: "Guides carrière", href: "/guides" },
    { label: "Newsletter", href: "/newsletter" },
  ],
  Entreprise: [
    { label: "À propos", href: "/about" },
    { label: "Notre équipe", href: "/team" },
    { label: "Recherche & science", href: "/research" },
    { label: "Carrières", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Légal: [
    { label: "CGU", href: "/cgu" },
    { label: "CGV", href: "/cgv" },
    { label: "Politique de confidentialité", href: "/privacy" },
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Cookies", href: "/cookies" },
  ],
};

const SOCIALS = [
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    svg: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
      </svg>
    ),
  },
  {
    href: "https://twitter.com",
    label: "Twitter",
    svg: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "mailto:contact@trajectoire.io",
    label: "Email",
    svg: (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 5L2 7" />
      </svg>
    ),
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative pt-20 lg:pt-24 pb-10"
      style={{
        backgroundColor: "#0A0A0A",
        color: "#FFFFFF",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">

        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-16">

          {/* ── Colonne marque ── */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundColor: "#1A3C34",
                  fontSize: "18px",
                }}
              >
                T
              </div>
              <span
                className="font-bold text-xl tracking-tight"
                style={{ color: "#FFFFFF" }}
              >
                Trajectoire
              </span>
            </Link>

            {/* Pitch */}
            <p
              style={{
                fontSize: "15px",
                lineHeight: "1.65",
                color: "rgba(255,255,255,0.6)",
                maxWidth: "380px",
              }}
            >
              La plateforme d&apos;intelligence décisionnelle de carrière pour
              cadres, managers et dirigeants. Évaluez vos forces, préparez vos
              moments décisifs, prenez le contrôle.
            </p>

            {/* Réseaux */}
            <div className="flex items-center gap-3 mt-2">
              {SOCIALS.map(({ href, label, svg }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#FFFFFF",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#E8501A";
                    e.currentTarget.style.borderColor = "#E8501A";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {svg}
                </a>
              ))}
            </div>

            {/* Newsletter mini */}
            <div
              className="mt-4 p-5 rounded-2xl"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="font-bold mb-2"
                style={{
                  fontSize: "14px",
                  color: "#FFFFFF",
                }}
              >
                📩 Newsletter Trajectoire
              </div>
              <p
                className="mb-4"
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.5,
                }}
              >
                1 décryptage par mois sur les décisions de carrière des cadres.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="vous@entreprise.com"
                  className="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#FFFFFF",
                    fontSize: "13px",
                  }}
                />
                <button
                  className="px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
                  style={{
                    backgroundColor: "#E8501A",
                    color: "#FFFFFF",
                    fontSize: "13px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#D04415";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#E8501A";
                  }}
                >
                  S&apos;abonner
                </button>
              </div>
            </div>
          </div>

          {/* ── Colonnes de liens ── */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category} className="flex flex-col gap-4">
                <div
                  className="font-bold text-xs tracking-widest uppercase"
                  style={{ color: "#E8501A" }}
                >
                  {category}
                </div>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="transition-colors duration-200"
                        style={{
                          fontSize: "14px",
                          color: "rgba(255,255,255,0.65)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#FFFFFF";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color =
                            "rgba(255,255,255,0.65)";
                        }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bandeau légal */}
        <div
          className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            © {currentYear} Trajectoire. Tous droits réservés. Fait avec rigueur en France 🇫🇷
          </p>
          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-2"
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: "#1A7F4B" }}
              />
              Tous les systèmes opérationnels
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              🇫🇷 Hébergement français · RGPD
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
