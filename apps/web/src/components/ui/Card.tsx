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
  default: "bg-calm-surface text-calm-ink border border-calm-line",
  standard: "bg-calm-surface text-calm-ink border border-calm-line",
  editorial: "bg-calm-accent-wash text-calm-ink border border-transparent",
  interactive:
    "bg-calm-surface text-calm-ink border border-calm-line transition-colors duration-150 hover:border-calm-accent-line hover:bg-calm-accent-wash cursor-pointer",
  selected:
    "bg-calm-accent-soft text-calm-ink border-2 border-calm-accent",
  highlight:
    "bg-calm-surface text-calm-ink border border-calm-accent-line shadow-[0_2px_20px_-6px_rgba(31,42,55,0.35)]",
  ai:
    "bg-calm-surface text-calm-ink border border-calm-accent-line shadow-[0_2px_20px_-6px_rgba(31,42,55,0.35)]",
  success:
    "bg-calm-surface text-calm-ink border border-calm-accent-line",
  warning:
    "bg-calm-surface text-calm-ink border border-calm-warn-line",
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
      "text-base font-semibold leading-snug tracking-tight text-calm-ink font-sans",
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
    className={cn("text-sm text-calm-secondary", className)}
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
