// @ts-nocheck
"use client";

import * as React from "react";
import { Navbar, NavbarActions } from "@/components/design-system";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/design-system";

export interface TopNavigationProps {
  logo?: React.ReactNode;
  navItems?: Array<{ label: string; href: string }>;
  actions?: React.ReactNode;
  user?: {
    name: string;
    avatar?: string;
  };
  mobileMenu?: React.ReactNode;
}

export function TopNavigation({
  logo,
  navItems = [],
  actions,
  user,
  mobileMenu,
}: TopNavigationProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const defaultLogo = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold">
        ✦
      </div>
      <span className="font-semibold text-gray-900">Trajectoire</span>
    </div>
  );

  return (
    <Navbar
      logo={logo || defaultLogo}
      navItems={navItems}
      actions={
        <NavbarActions>
          {user ? (
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
              <span className="text-sm font-medium text-gray-900 hidden sm:block">
                {user.name}
              </span>
            </div>
          ) : (
            actions
          )}
        </NavbarActions>
      }
      mobileMenu={
        <div className="space-y-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block text-sm font-medium text-gray-600 hover:text-gray-900"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          {mobileMenu}
        </div>
      }
    />
  );
}
