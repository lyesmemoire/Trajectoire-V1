"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface SectionNavigationItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

export interface SectionNavigationProps {
  items: SectionNavigationItem[];
  activeId?: string;
  onSectionChange?: (id: string) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function SectionNavigation({
  items,
  activeId,
  onSectionChange,
  orientation = "horizontal",
  className,
}: SectionNavigationProps) {
  const pathname = usePathname();
  
  // Use pathname as fallback for activeId
  const currentActive = activeId || pathname;

  const isHorizontal = orientation === "horizontal";

  return (
    <nav
      className={cn(
        "flex gap-1",
        isHorizontal ? "flex-row border-b border-gray-200" : "flex-col",
        className
      )}
      aria-label="Section navigation"
    >
      {items.map((item) => {
        const isActive = currentActive === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onSectionChange?.(item.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
              isHorizontal
                ? "border-b-2 -mb-px"
                : "rounded-lg",
              isActive
                ? "text-blue-700 bg-blue-50 border-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
