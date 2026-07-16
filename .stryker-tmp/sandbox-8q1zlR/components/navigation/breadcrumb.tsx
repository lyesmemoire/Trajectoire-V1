// @ts-nocheck
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: any;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  homeHref?: string;
  className?: string;
}

export function Breadcrumb({ items, homeHref = "/", className }: BreadcrumbProps) {
  const pathname = usePathname();
  
  // Auto-generate items from pathname if not provided
  const autoItems = React.useMemo(() => {
    if (items) return items;
    
    const pathSegments = pathname.split('/').filter(Boolean);
    const generatedItems: BreadcrumbItem[] = [];
    
    pathSegments.forEach((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
      generatedItems.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href,
      });
    });
    
    return generatedItems;
  }, [pathname, items]);

  const breadcrumbItems = [
    { label: "Accueil", href: homeHref, icon: Home },
    ...autoItems,
  ];

  return (
    <nav className={cn("flex items-center text-sm text-gray-600", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const Icon = item.icon;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              )}
              {isLast ? (
                <span className="font-medium text-gray-900">{item.label}</span>
              ) : (
                <Link
                  href={item.href || "#"}
                  className="flex items-center hover:text-gray-900 transition-colors"
                >
                  {Icon && <Icon className="w-4 h-4 mr-1" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
