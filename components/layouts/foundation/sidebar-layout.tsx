"use client";

import * as React from "react";
import { Sidebar, SidebarHeader, SidebarLogo, SidebarContent, SidebarSection, SidebarLink, SidebarFooter } from "@/components/design-system";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/design-system";
import { cn } from "@/lib/utils";

export interface SidebarLayoutProps {
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
  collapsible?: boolean;
  className?: string;
}

export function SidebarLayout({
  children,
  sidebarSections,
  user,
  collapsible = false,
  className,
}: SidebarLayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className={cn("min-h-screen bg-gray-50 flex", className)}>
      <Sidebar className={collapsed ? "w-20" : ""}>
        <SidebarHeader>
          <SidebarLogo href="/dashboard">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                ✦
              </div>
              {!collapsed && (
                <span className="font-semibold text-gray-900">Trajectoire</span>
              )}
            </div>
          </SidebarLogo>
        </SidebarHeader>

        <SidebarContent>
          {sidebarSections?.map((section, index) => (
            <SidebarSection key={index} title={!collapsed ? section.title : undefined}>
              {section.links.map((link) => (
                <SidebarLink
                  key={link.href}
                  href={link.href}
                  icon={link.icon}
                >
                  {!collapsed && link.label}
                </SidebarLink>
              ))}
            </SidebarSection>
          ))}
        </SidebarContent>

        <SidebarFooter>
          {collapsible && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full p-2 rounded-lg hover:bg-gray-100 transition-colors mb-2"
            >
              {collapsed ? "→" : "←"}
            </button>
          )}
          {user && !collapsed && (
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
          )}
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
