"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted" | "primary";
  padding?: "none" | "sm" | "default" | "lg" | "xl";
  container?: boolean;
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ className, variant = "default", padding = "default", container = true, children, ...props }, ref) => {
    const variantStyles = {
      default: "bg-background",
      muted: "bg-gray-50",
      primary: "bg-primary text-white",
    };

    const paddingStyles = {
      none: "py-0",
      sm: "py-12",
      default: "py-20",
      lg: "py-28",
      xl: "py-36",
    };

    return (
      <section
        ref={ref}
        className={cn(
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {container ? (
          <div className="max-w-7xl mx-auto px-6">{children}</div>
        ) : (
          children
        )}
      </section>
    );
  }
);
Section.displayName = "Section";

export { Section };
