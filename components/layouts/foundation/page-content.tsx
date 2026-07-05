"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageContentProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function PageContent({ children, className, size = "default" }: PageContentProps) {
  const sizeStyles = {
    sm: "max-w-4xl",
    default: "max-w-7xl",
    lg: "max-w-[1400px]",
  };

  return (
    <div className={cn("mx-auto px-6", sizeStyles[size], className)}>
      {children}
    </div>
  );
}
