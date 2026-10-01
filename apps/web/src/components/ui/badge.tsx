import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "free"
  | "pack"
  | "pro"
  | "expert";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: "bg-calm-line-soft text-calm-ink border border-calm-line",
  primary: "bg-calm-accent-soft text-calm-accent-deep border border-calm-accent-line",
  success: "bg-calm-accent-soft text-calm-accent-deep border border-calm-accent-line",
  warning: "bg-calm-warn-soft text-calm-warn border border-calm-warn-line",
  danger: "bg-calm-warn-soft text-calm-warn border border-calm-warn-line",
  info: "bg-calm-accent-soft text-calm-accent-deep border border-calm-accent-line",
  free: "bg-calm-line-soft text-calm-ink border border-calm-line",
  pack: "bg-calm-accent-soft text-calm-accent border border-calm-accent-line",
  pro: "bg-calm-accent-soft text-calm-accent-deep border border-calm-accent-line",
  expert: "bg-calm-surface text-calm-ink border border-transparent shadow-sm",
};

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "neutral", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
