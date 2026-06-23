"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { LinkButton, Container } from "@/components/ui";

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

  // Scroll-spy
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
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Smooth scroll vers section avec offset header
  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-glass",
        scrolled
          ? "bg-white/92 border-b border-border shadow-soft"
          : "bg-white/98 border-b border-border-subtle"
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white bg-brand-primary text-[17px] transition-transform duration-300 group-hover:scale-105">
              T
            </div>
            <span className="font-bold text-lg tracking-tight text-ink">
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
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    "relative text-body-sm transition-colors duration-200 cursor-pointer",
                    isActive
                      ? "text-brand-primary font-semibold"
                      : "text-ink-muted font-medium hover:text-brand-primary"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-brand-accent" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* CTA desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="text-body-sm font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
            >
              Se connecter
            </Link>
            <LinkButton href="/signup" variant="primary" size="sm">
              Essai gratuit
            </LinkButton>
          </div>

          {/* Burger mobile */}
          <button
            className="lg:hidden p-2 text-ink"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu mobile */}
        {mobileOpen && (
          <div className="lg:hidden py-6 border-t border-border">
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-body font-medium py-2 text-ink"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border mt-2">
                <Link
                  href="/login"
                  className="text-body font-medium py-2 text-brand-primary"
                >
                  Se connecter
                </Link>
                <LinkButton href="/signup" variant="primary" fullWidth>
                  Essai gratuit
                </LinkButton>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
