"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";

interface CTAProps {
  title: string;
  description: string;
  primaryCTA: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
  variant?: "default" | "primary" | "muted";
  align?: "left" | "center" | "right";
  className?: string;
}

export function CTA({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  variant = "default",
  align = "center",
  className,
}: CTAProps) {
  const variantStyles = {
    default: "bg-background",
    primary: "bg-primary text-white",
    muted: "bg-gray-50",
  };

  const alignStyles = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div
      className={cn(
        "rounded-lg p-12",
        variantStyles[variant],
        alignStyles[align],
        className
      )}
    >
      <h2 className="text-3xl font-semibold mb-4">{title}</h2>
      <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
        {description}
      </p>
      <div className={cn("flex gap-4", align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start")}>
        <Button asChild size="lg" variant={variant === "primary" ? "secondary" : "primary"}>
          <a href={primaryCTA.href}>
            <span className="flex items-center gap-2">
              {primaryCTA.label}
              <ArrowRight className="h-5 w-5" />
            </span>
          </a>
        </Button>
        {secondaryCTA && (
          <Button asChild variant="outline" size="lg">
            <a href={secondaryCTA.href}>{secondaryCTA.label}</a>
          </Button>
        )}
      </div>
    </div>
  );
}
