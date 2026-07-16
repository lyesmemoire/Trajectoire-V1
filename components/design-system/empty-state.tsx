"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "muted";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "default",
  className,
}: EmptyStateProps) {
  const variantStyles = {
    default: "bg-surface",
    muted: "bg-gray-50",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 rounded-lg border border-gray-200",
        variantStyles[variant],
        className
      )}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Icon className="h-8 w-8 text-primary" />
        </div>
      )}

      <h3 className="text-xl font-semibold text-text mb-2">{title}</h3>

      {description && (
        <p className="text-text-secondary text-center max-w-md mb-6">
          {description}
        </p>
      )}

      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Une erreur est survenue",
  message = "Veuillez réessayer ou contacter le support.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("text-center py-12 px-6", className)}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-danger-light flex items-center justify-center">
        <span className="text-3xl">⚠️</span>
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Réessayer
        </Button>
      )}
    </div>
  );
}
