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
  | "pro"
  | "expert";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: "bg-slate-100 text-slate-700 border border-slate-200/80",
  primary: "bg-violet-50 text-violet-700 border border-violet-200/60",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  warning: "bg-amber-50 text-amber-700 border border-amber-200/60",
  danger: "bg-rose-50 text-rose-700 border border-rose-200/60",
  info: "bg-sky-50 text-sky-700 border border-sky-200/60",
  free: "bg-slate-100 text-slate-700 border border-slate-200/80",
  pro: "bg-violet-50 text-violet-700 border border-violet-200/60",
  expert: "bg-slate-900 text-white border border-transparent shadow-sm",
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
