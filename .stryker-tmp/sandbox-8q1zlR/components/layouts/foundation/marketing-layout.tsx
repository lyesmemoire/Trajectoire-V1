// @ts-nocheck
"use client";

import * as React from "react";
import { Navbar, NavbarLink, NavbarActions, Footer } from "@/components/design-system";
import { Button } from "@/components/design-system";

export interface MarketingLayoutProps {
  children: React.ReactNode;
  logo?: React.ReactNode;
  navItems?: Array<{ label: string; href: string }>;
  footerColumns?: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }>;
}

export function MarketingLayout({
  children,
  logo,
  navItems = [
    { label: "Fonctionnalités", href: "/features" },
    { label: "Tarifs", href: "/pricing" },
    { label: "Témoignages", href: "/testimonials" },
  ],
  footerColumns,
}: MarketingLayoutProps) {
  const defaultLogo = (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/25">
        ✦
      </div>
      <span className="font-black text-xl tracking-tight text-gray-900">
        Trajectoire
      </span>
    </div>
  );

  const defaultFooterColumns = [
    {
      title: "Produit",
      links: [
        { label: "Fonctionnalités", href: "/features" },
        { label: "Tarifs", href: "/pricing" },
        { label: "Témoignages", href: "/testimonials" },
      ],
    },
    {
      title: "Entreprise",
      links: [
        { label: "À propos", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Carrières", href: "/careers" },
      ],
    },
    {
      title: "Légal",
      links: [
        { label: "Confidentialité", href: "/privacy" },
        { label: "Conditions", href: "/terms" },
        { label: "Sécurité", href: "/security" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar
        logo={logo || defaultLogo}
        navItems={navItems}
        actions={
          <NavbarActions>
            <NavbarLink href="/auth/login">Connexion</NavbarLink>
            <Button variant="primary" asChild>
              <a href="/auth/signup">Essai gratuit →</a>
            </Button>
          </NavbarActions>
        }
      />

      <main className="flex-1">{children}</main>

      <Footer
        logo={logo || defaultLogo}
        columns={footerColumns || defaultFooterColumns}
      />
    </div>
  );
}
