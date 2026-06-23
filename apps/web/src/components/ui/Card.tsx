import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardVariant = "default" | "elevated" | "muted" | "dark" | "primary" | "accent";

const VARIANT_STYLES: Record<CardVariant, string> = {
  default: "bg-white border border-border",
  elevated: "bg-white border border-border shadow-card hover:shadow-elevated transition-shadow duration-300",
  muted: "bg-surface-muted border border-border",
  dark: "bg-brand-primary text-white",
  primary: "bg-brand-primary text-white",
  accent: "bg-brand-accent text-white",
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  children: ReactNode;
}

const PADDING_STYLES = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-10",
};

export function Card({
  variant = "default",
  padding = "md",
  hover = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        VARIANT_STYLES[variant],
        PADDING_STYLES[padding],
        hover && "transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
