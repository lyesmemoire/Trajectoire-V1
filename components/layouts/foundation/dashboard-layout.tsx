"use client";

import * as React from "react";
import { Sidebar, SidebarHeader, SidebarLogo, SidebarContent, SidebarSection, SidebarLink, SidebarFooter } from "@/components/design-system";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/design-system";
import { Home, User, FileText, BarChart3, Settings, LogOut } from "lucide-react";

export interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarSections?: Array<{
    title: string;
    links: Array<{ label: string; href: string; icon?: any }>;
  }>;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function DashboardLayout({
  children,
  sidebarSections = [
    {
      title: "Principal",
      links: [
        { label: "Tableau de bord", href: "/dashboard", icon: Home },
        { label: "Mon CV", href: "/dashboard/cv", icon: FileText },
        { label: "Simulations", href: "/dashboard/simulations", icon: BarChart3 },
      ],
    },
    {
      title: "Compte",
      links: [
        { label: "Profil", href: "/dashboard/profile", icon: User },
        { label: "Paramètres", href: "/dashboard/settings", icon: Settings },
        { label: "Déconnexion", href: "/auth/logout", icon: LogOut },
      ],
    },
  ],
  user,
}: DashboardLayoutProps) {
  const defaultUser = {
    name: "Utilisateur",
    email: "user@trajectoire.com",
    avatar: undefined as string | undefined,
  };

  const currentUser = user || defaultUser;

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
          {sidebarSections.map((section, index) => (
            <SidebarSection key={index} title={section.title}>
              {section.links.map((link) => (
                <SidebarLink
                  key={link.href}
                  href={link.href}
                  icon={link.icon}
                >
                  {link.label}
                </SidebarLink>
              ))}
            </SidebarSection>
          ))}
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center gap-3">
            <Avatar size="sm">
              {currentUser.avatar ? (
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              ) : (
                <AvatarFallback>
                  {currentUser.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser.email}
              </p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
