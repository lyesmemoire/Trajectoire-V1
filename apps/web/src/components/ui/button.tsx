import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "premium"
  | "danger"
  | "dark"
  | "dark-ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-calm-accent text-white hover:bg-calm-accent-deep active:bg-calm-accent-deep border border-transparent shadow-subtle",
  secondary:
    "bg-calm-surface text-calm-ink border border-calm-line hover:bg-calm-accent-wash active:bg-calm-accent-soft shadow-subtle",
  outline:
    "bg-transparent text-calm-ink border border-calm-line hover:bg-calm-accent-wash active:bg-calm-accent-soft",
  ghost:
    "bg-transparent text-calm-ink hover:bg-calm-accent-wash active:bg-calm-accent-soft",
  premium:
    "bg-calm-accent text-white hover:bg-calm-accent-deep active:bg-calm-accent-deep border border-transparent shadow-calm",
  // Pas de rouge vif : l'action sensible utilise l'avertissement doux.
  danger:
    "bg-calm-warn text-white hover:bg-calm-warn/90 active:bg-calm-warn/90 border border-transparent shadow-subtle",

  // Anciennes variantes du thème sombre, conservées pour les appelants existants (noms stables) : mêmes rendus
  // que primary et outline.
  dark: [
    "bg-calm-accent text-white border border-transparent",
    "hover:bg-calm-accent-deep",
    "disabled:bg-calm-accent-wash disabled:text-calm-tertiary disabled:cursor-not-allowed",
    "transition-colors duration-150",
  ].join(" "),
  "dark-ghost": [
    "bg-transparent text-calm-ink border border-calm-line",
    "hover:bg-calm-accent-wash",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    "transition-colors duration-150",
  ].join(" "),
};

// Cibles tactiles ≥ 44 px (WCAG 2.5.5).
const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-[44px] px-3.5 text-sm font-medium",
  md: "min-h-[44px] px-4 text-sm font-medium",
  lg: "min-h-[48px] px-5 text-base font-medium",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-calm-accent focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
