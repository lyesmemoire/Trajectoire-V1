"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Méthode", href: "#method" },
  { label: "Résultats", href: "#results" },
  { label: "Tarifs", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy (lien actif selon section visible)
  useEffect(() => {
    const sections = NAV_LINKS.map((l) =>
      document.querySelector(l.href)
    ).filter(Boolean) as Element[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection("#" + entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled
          ? "rgba(255,255,255,0.92)"
          : "rgba(255,255,255,0.98)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: scrolled
          ? "1px solid #E2E8E4"
          : "1px solid rgba(226,232,228,0.5)",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.04)" : "none",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: "#1A3C34", fontSize: "17px" }}
            >
              T
            </div>
            <span
              className="font-bold text-lg tracking-tight"
              style={{ color: "#0A0A0A" }}
            >
              Trajectoire
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.querySelector(link.href);
                    if (target) {
                      const headerHeight = 80;
                      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                      window.scrollTo({ top: targetPosition, behavior: "smooth" });
                    }
                  }}
                  className="relative text-sm font-medium transition-colors duration-200 cursor-pointer"
                  style={{
                    color: isActive ? "#1A3C34" : "#4A4A4A",
                    fontWeight: isActive ? 600 : 500,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#1A3C34";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#4A4A4A";
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: "#E8501A" }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* CTA desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "#1A3C34" }}
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center font-semibold rounded-xl transition-all duration-200"
              style={{
                backgroundColor: "#1A3C34",
                color: "white",
                padding: "10px 20px",
                fontSize: "14px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#142E28";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1A3C34";
              }}
            >
              Essai gratuit
            </Link>
          </div>

          {/* Burger mobile */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X size={24} style={{ color: "#0A0A0A" }} />
            ) : (
              <Menu size={24} style={{ color: "#0A0A0A" }} />
            )}
          </button>
        </div>

        {/* Menu mobile */}
        {mobileOpen && (
          <div
            className="lg:hidden py-6 border-t"
            style={{ borderColor: "#E2E8E4" }}
          >
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium py-2 cursor-pointer"
                  style={{ color: "#0A0A0A" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    const target = document.querySelector(link.href);
                    if (target) {
                      const headerHeight = 80;
                      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                      setTimeout(() => {
                        window.scrollTo({ top: targetPosition, behavior: "smooth" });
                      }, 50);
                    }
                  }}
                >
                  {link.label}
                </a>
              ))}
              <div
                className="flex flex-col gap-3 pt-4 border-t mt-2"
                style={{ borderColor: "#E2E8E4" }}
              >
                <Link
                  href="/login"
                  className="text-base font-medium py-2"
                  style={{ color: "#1A3C34" }}
                >
                  Se connecter
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center font-semibold rounded-xl"
                  style={{
                    backgroundColor: "#1A3C34",
                    color: "white",
                    padding: "12px 20px",
                    fontSize: "15px",
                  }}
                >
                  Essai gratuit
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
