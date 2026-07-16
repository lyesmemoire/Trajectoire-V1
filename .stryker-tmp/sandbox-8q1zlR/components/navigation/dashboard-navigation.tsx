// @ts-nocheck
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarHeader, SidebarLogo, SidebarContent, SidebarSection, SidebarLink, SidebarFooter } from "@/components/design-system";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/design-system";
import { BottomNavigation, type BottomNavigationItem } from "@/components/layouts/foundation";
import { Home, FileText, BarChart3, Settings, CreditCard, FileCheck, Download, LogOut } from "lucide-react";

export interface DashboardNavigationProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function DashboardNavigation({ user }: DashboardNavigationProps) {
  const pathname = usePathname();

  const sections = [
    {
      title: "Principal",
      links: [
        { label: "Tableau de bord", href: "/dashboard", icon: Home },
        { label: "Mes CVs", href: "/dashboard/cvs", icon: FileText },
        { label: "Simulations", href: "/dashboard/optimize", icon: BarChart3 },
      ],
    },
    {
      title: "Outils",
      links: [
        { label: "ATS Checker", href: "/dashboard/ats", icon: FileCheck },
        { label: "Export", href: "/dashboard/export", icon: Download },
        { label: "Facturation", href: "/dashboard/billing", icon: CreditCard },
      ],
    },
    {
      title: "Compte",
      links: [
        { label: "Paramètres", href: "/dashboard/settings", icon: Settings },
        { label: "Déconnexion", href: "/auth/logout", icon: LogOut },
      ],
    },
  ];

  const mobileNavItems: BottomNavigationItem[] = sections
    .flatMap(section => section.links)
    .slice(0, 5)
    .map(link => ({
      label: link.label,
      href: link.href,
      icon: link.icon,
      active: pathname === link.href,
    }));

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar>
          <SidebarHeader>
            <SidebarLogo href="/dashboard">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold">
                  ✦
                </div>
                <span className="font-semibold text-gray-900">Trajectoire</span>
              </div>
            </SidebarLogo>
          </SidebarHeader>

          <SidebarContent>
            {sections.map((section, index) => (
              <SidebarSection key={index} title={section.title}>
                {section.links.map((link) => (
                  <SidebarLink
                    key={link.href}
                    href={link.href}
                    icon={link.icon}
                    active={pathname === link.href}
                  >
                    {link.label}
                  </SidebarLink>
                ))}
              </SidebarSection>
            ))}
          </SidebarContent>

          {user && (
            <SidebarFooter>
              <div className="flex items-center gap-3">
                <Avatar size="sm">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback>
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </SidebarFooter>
          )}
        </Sidebar>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <BottomNavigation items={mobileNavItems} />
      </div>
    </>
  );
}
