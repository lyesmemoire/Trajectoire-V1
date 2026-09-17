import * as React from "react";
import { cn } from "@/lib/utils";

export type CardVariant =
  | "default"
  | "standard"
  | "editorial"
  | "interactive"
  | "selected"
  | "highlight"
  | "ai"
  | "success"
  | "warning";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white text-foreground border border-border/80 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]",
  standard: "bg-white text-foreground border border-border/80 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]",
  editorial: "bg-surface-muted text-foreground border border-transparent shadow-none",
  interactive:
    "bg-white text-foreground border border-border/80 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] transition-all duration-150 hover:border-slate-300 hover:shadow-sm cursor-pointer",
  selected:
    "bg-violet-50/20 text-foreground border-2 border-primary shadow-[0_1px_2px_0_rgba(124,58,237,0.06)]",
  highlight:
    "bg-white text-foreground border border-primary/30 shadow-[0_2px_8px_-2px_rgba(124,58,237,0.08)]",
  ai:
    "bg-white text-foreground border border-primary/30 shadow-[0_2px_8px_-2px_rgba(124,58,237,0.08)]",
  success:
    "bg-white text-foreground border border-emerald-200 shadow-[0_1px_2px_0_rgba(16,185,129,0.04)]",
  warning:
    "bg-white text-foreground border border-amber-200 shadow-[0_1px_2px_0_rgba(245,158,11,0.04)]",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("rounded-xl", variantStyles[variant], className)}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-5 md:p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-base font-semibold leading-snug tracking-tight text-foreground font-sans",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-foreground-muted", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
