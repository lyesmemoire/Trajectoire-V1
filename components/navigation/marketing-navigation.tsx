"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Navbar, NavbarLink, NavbarActions } from "@/components/design-system";
import { Button } from "@/components/design-system";
import { BottomNavigation, type BottomNavigationItem } from "@/components/layouts/foundation";
import { Home, Sparkles, DollarSign, MessageSquare } from "lucide-react";

export interface MarketingNavigationProps {
  logo?: React.ReactNode;
  actions?: React.ReactNode;
}

export function MarketingNavigation({ logo, actions }: MarketingNavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Fonctionnalités", href: "/features", icon: Sparkles },
    { label: "Tarifs", href: "/pricing", icon: DollarSign },
    { label: "Témoignages", href: "/testimonials", icon: MessageSquare },
  ];

  const defaultLogo = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold">
        ✦
      </div>
      <span className="font-semibold text-gray-900">Trajectoire</span>
    </div>
  );

  const defaultActions = (
    <div className="flex items-center gap-3">
      <NavbarLink href="/auth/login">Connexion</NavbarLink>
      <Button variant="primary" size="sm" asChild>
        <a href="/auth/signup">Essai gratuit</a>
      </Button>
    </div>
  );

  const mobileNavItems: BottomNavigationItem[] = [
    { label: "Accueil", href: "/", icon: Home, active: pathname === "/" },
    ...navItems.map(link => ({
      label: link.label,
      href: link.href,
      icon: link.icon,
      active: pathname === link.href,
    })),
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar
          logo={logo || defaultLogo}
          navItems={navItems}
          actions={<NavbarActions>{actions || defaultActions}</NavbarActions>}
        />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <BottomNavigation items={mobileNavItems} />
      </div>
    </>
  );
}
