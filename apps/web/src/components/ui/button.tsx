import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "premium" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-violet-700 active:bg-violet-800 border border-transparent shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
  secondary:
    "bg-white text-foreground border border-border hover:bg-slate-50 active:bg-slate-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]",
  outline:
    "bg-transparent text-foreground border border-border hover:bg-slate-50 active:bg-slate-100",
  ghost:
    "bg-transparent text-foreground hover:bg-slate-100/80 active:bg-slate-200/60",
  premium:
    "bg-primary text-white hover:bg-violet-700 active:bg-violet-800 border border-transparent shadow-[0_2px_8px_-1px_rgba(124,58,237,0.25)]",
  danger:
    "bg-danger text-white hover:bg-red-600 active:bg-red-700 border border-transparent shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs font-medium",
  md: "h-10 px-4 text-sm font-medium",
  lg: "h-11 px-5 text-sm font-medium",
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
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
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
