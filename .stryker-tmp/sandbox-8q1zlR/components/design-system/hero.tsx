// @ts-nocheck
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

const heroVariants = cva(
  "relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-gray-50 to-white",
        dark: "bg-gray-900 text-white",
        image: "bg-cover bg-center bg-no-repeat",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface HeroProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof heroVariants> {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  align?: "left" | "center" | "right";
}

export function Hero({
  variant = "default",
  title,
  subtitle,
  description,
  image,
  actions,
  badge,
  align = "left",
  className,
  style,
  ...props
}: HeroProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const contentAlignClasses = {
    left: "items-start",
    center: "items-center",
    right: "items-end",
  };

  return (
    <section
      className={cn(
        heroVariants({ variant }),
        "min-h-[600px] flex items-center",
        className
      )}
      style={{
        ...style,
        ...(variant === "image" && image ? { backgroundImage: `url(${image})` } : {}),
      }}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div
          className={cn(
            "flex flex-col gap-6 max-w-3xl",
            contentAlignClasses[align]
          )}
        >
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {badge}
            </motion.div>
          )}

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm font-semibold text-blue-700 uppercase tracking-wider"
            >
              {subtitle}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight",
              alignClasses[align]
            )}
          >
            {title}
          </motion.h1>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={cn(
                "text-lg text-gray-600 max-w-2xl",
                alignClasses[align]
              )}
            >
              {description}
            </motion.p>
          )}

          {actions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex gap-4 pt-4"
            >
              {actions}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export interface HeroBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  children: React.ReactNode;
}

export function HeroBadge({ icon: Icon, children, className, ...props }: HeroBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </div>
  );
}

export interface HeroActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function HeroActions({ className, children, ...props }: HeroActionsProps) {
  return (
    <div className={cn("flex gap-4 pt-4", className)} {...props}>
      {children}
    </div>
  );
}
