"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen grain-overlay flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="text-center max-w-md">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "rgba(26,60,52,0.1)" }}
          aria-hidden="true"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M6 16h4M22 16h4M16 6v4M16 22v4"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="16" cy="16" r="12"
              stroke="var(--primary)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          </svg>
        </div>

        <p
          className="text-sm font-medium uppercase tracking-widest mb-3"
          style={{ color: "var(--muted)" }}
        >
          Erreur 404
        </p>

        <h1 className="heading-2 mb-4" style={{ color: "var(--text)" }}>
          Page introuvable.
        </h1>

        <p className="text-base leading-relaxed mb-8" style={{ color: "var(--muted)" }}>
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
          Retournez au tableau de bord pour continuer.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{ backgroundColor: "var(--primary)", color: "white" }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = "var(--primary-hover)";
              el.style.transform       = "translateY(-1px)";
              el.style.boxShadow       = "0 8px 24px rgba(26,60,52,0.25)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = "var(--primary)";
              el.style.transform       = "translateY(0)";
              el.style.boxShadow       = "none";
            }}
          >
            Tableau de bord
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-all duration-200"
            style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "white" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
            }}
          >
            Accueil
          </Link>
        </div>

        <p className="text-xs mt-8" style={{ color: "var(--muted)", opacity: 0.6 }}>
          Trajectoire · Career Decision Intelligence Platform
        </p>
      </div>
    </div>
  );
}
