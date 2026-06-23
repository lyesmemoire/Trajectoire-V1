import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "primary" | "accent" | "success" | "warning" | "neutral" | "inverse";
type BadgeSize = "sm" | "md" | "lg";

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  primary: "bg-glass-primary-06 text-brand-primary border border-glass-primary-12",
  accent: "bg-glass-accent-08 text-brand-accent border border-glass-accent-15",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  neutral: "bg-surface-muted text-ink-muted border border-border",
  inverse: "bg-glass-white-08 text-white border border-glass-white-12",
};

const SIZE_STYLES: Record<BadgeSize, string> = {
  sm: "px-2.5 py-1 text-[10px]",
  md: "px-4 py-2 text-xs",
  lg: "px-5 py-2.5 text-body-sm",
};

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  uppercase?: boolean;
  className?: string;
  children: ReactNode;
}

export function Badge({
  variant = "primary",
  size = "md",
  uppercase = false,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        uppercase && "uppercase tracking-widest",
        className
      )}
    >
      {children}
    </span>
  );
}
