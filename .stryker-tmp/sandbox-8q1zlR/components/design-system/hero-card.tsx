// @ts-nocheck
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";

interface HeroCardProps {
  title: string;
  description: string;
  primaryCTA?: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
  badge?: string;
  className?: string;
}

export function HeroCard({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  badge,
  className,
}: HeroCardProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />
      
      <div className="relative">
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              {badge}
            </span>
          </div>
        )}

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-text mb-6">
          {title}
        </h1>

        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mb-8 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          {primaryCTA && (
            <Button asChild size="lg">
              <a href={primaryCTA.href}>
                <span className="flex items-center gap-2">
                  {primaryCTA.label}
                  <ArrowRight className="h-5 w-5" />
                </span>
              </a>
            </Button>
          )}

          {secondaryCTA && (
            <Button asChild variant="outline" size="lg">
              <a href={secondaryCTA.href}>{secondaryCTA.label}</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
