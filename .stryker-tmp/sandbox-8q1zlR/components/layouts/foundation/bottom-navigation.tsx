// @ts-nocheck
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface BottomNavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
}

export interface BottomNavigationProps {
  items: BottomNavigationItem[];
  className?: string;
}

export function BottomNavigation({ items, className }: BottomNavigationProps) {
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50",
      className
    )}>
      <div className="flex items-center justify-around h-16 px-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1",
                item.active ? "text-blue-700" : "text-gray-500"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
