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
  default: "bg-zinc-900 text-white/80 border border-white/[0.08]",
  standard: "bg-zinc-900 text-white/80 border border-white/[0.08]",
  editorial: "bg-white/[0.03] text-white/80 border border-transparent",
  interactive:
    "bg-zinc-900 text-white/80 border border-white/[0.08] transition-colors duration-150 hover:border-white/[0.16] hover:bg-zinc-800/70 cursor-pointer",
  selected:
    "bg-indigo-500/10 text-white/80 border-2 border-indigo-500",
  highlight:
    "bg-zinc-900 text-white/80 border border-indigo-400/30 shadow-[0_2px_20px_-6px_rgba(99,102,241,0.35)]",
  ai:
    "bg-zinc-900 text-white/80 border border-indigo-400/30 shadow-[0_2px_20px_-6px_rgba(99,102,241,0.35)]",
  success:
    "bg-zinc-900 text-white/80 border border-emerald-400/25",
  warning:
    "bg-zinc-900 text-white/80 border border-amber-400/25",
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
      "text-base font-semibold leading-snug tracking-tight text-white/80 font-sans",
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
    className={cn("text-sm text-white/50", className)}
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
