// @ts-nocheck
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/design-system";
import { LucideIcon } from "lucide-react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: React.ReactNode;
  backButton?: boolean;
  icon?: LucideIcon;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  description,
  actions,
  backButton = false,
  icon: Icon,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {backButton && (
            <Button variant="ghost" size="sm" className="mb-4">
              ← Retour
            </Button>
          )}
          <div className="flex items-center gap-3 mb-2">
            {Icon && (
              <div className="p-2 rounded-lg bg-blue-50">
                <Icon className="w-5 h-5 text-blue-700" />
              </div>
            )}
            {subtitle && (
              <p className="text-sm font-medium text-blue-700 uppercase tracking-wider">
                {subtitle}
              </p>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {description && (
            <p className="text-gray-600 max-w-2xl">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
