// @ts-nocheck
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarHeader, SidebarLogo, SidebarContent, SidebarSection, SidebarLink, SidebarFooter } from "@/components/design-system";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/design-system";
import { BottomNavigation, type BottomNavigationItem } from "@/components/layouts/foundation";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/design-system";
import { Button } from "@/components/design-system";
import { Menu, Home, FileText, BarChart3, User, Settings, LogOut } from "lucide-react";

export interface MainNavigationProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ label: string; href: string; icon?: any }>;
  }>;
}

export function MainNavigation({ user, sections }: MainNavigationProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const defaultSections = [
    {
      title: "Principal",
      links: [
        { label: "Accueil", href: "/", icon: Home },
        { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
        { label: "Mon CV", href: "/cv", icon: FileText },
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
  ];

  const navigationSections = sections || defaultSections;

  const mobileNavItems: BottomNavigationItem[] = navigationSections
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
            <SidebarLogo href="/">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold">
                  ✦
                </div>
                <span className="font-semibold text-gray-900">Trajectoire</span>
              </div>
            </SidebarLogo>
          </SidebarHeader>

          <SidebarContent>
            {navigationSections.map((section, index) => (
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

      {/* Mobile Menu Drawer */}
      <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 right-4 z-50"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent side="left" className="h-full">
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            {navigationSections.map((section, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">{section.title}</h3>
                <div className="space-y-2">
                  {section.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        pathname === link.href
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.icon && <link.icon className="w-5 h-5" />}
                      <span className="font-medium">{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
