"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

// ─────────────────────────────────────────────
// Variants
// ─────────────────────────────────────────────

type ButtonVariant = "primary" | "accent" | "ghost" | "outline" | "dark";
type ButtonSize = "sm" | "md" | "lg" | "xl";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-white hover:bg-brand-primary-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(26,60,52,0.3)]",
  accent:
    "bg-brand-accent text-white hover:bg-brand-accent-hover hover:-translate-y-0.5 hover:shadow-glow-accent",
  ghost:
    "bg-transparent text-brand-primary hover:bg-glass-primary-08",
  outline:
    "bg-transparent text-brand-primary border border-border hover:bg-surface-muted",
  dark:
    "bg-ink text-white hover:bg-ink/90 hover:-translate-y-0.5",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-body-sm gap-1.5",
  md: "px-5 py-3 text-body-sm gap-2",
  lg: "px-7 py-4 text-body gap-2",
  xl: "px-9 py-[18px] text-[17px] gap-2",
};

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

interface LinkButtonProps extends BaseProps {
  href: string;
  external?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

// ─────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      leftIcon,
      rightIcon,
      loading = false,
      disabled,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-semibold rounded-xl",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:shadow-focus-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none",
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          fullWidth && "w-full",
          className
        )}
        {...rest}
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

// ─────────────────────────────────────────────
// LinkButton (pour les <Link> stylés)
// ─────────────────────────────────────────────

export function LinkButton({
  variant = "primary",
  size = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  href,
  external = false,
  onClick,
  children,
  className,
}: LinkButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-semibold rounded-xl",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:shadow-focus-primary",
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    fullWidth && "w-full",
    className
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={onClick}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick}>
      {leftIcon}
      {children}
      {rightIcon}
    </Link>
  );
}

// ─────────────────────────────────────────────
// Spinner interne
// ─────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
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
  );
}
