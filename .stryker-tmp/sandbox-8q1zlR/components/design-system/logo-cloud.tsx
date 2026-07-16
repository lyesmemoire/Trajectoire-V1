// @ts-nocheck
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoItem {
  name: string;
  logo: React.ReactNode;
  href?: string;
}

interface LogoCloudProps {
  logos: LogoItem[];
  variant?: "default" | "grayscale";
  columns?: number;
  className?: string;
}

export function LogoCloud({
  logos,
  variant = "default",
  columns = 5,
  className,
}: LogoCloudProps) {
  const gridStyles = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("grid gap-8", gridStyles[columns as keyof typeof gridStyles])}>
        {logos.map((logo, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-center p-6 rounded-lg transition-all duration-200",
              variant === "default" && "bg-surface border border-gray-200 hover:border-gray-300",
              variant === "grayscale" && "bg-surface border border-gray-200 grayscale hover:grayscale-0"
            )}
          >
            {logo.href ? (
              <a href={logo.href} className="flex items-center justify-center">
                {logo.logo}
              </a>
            ) : (
              <div className="flex items-center justify-center">{logo.logo}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
