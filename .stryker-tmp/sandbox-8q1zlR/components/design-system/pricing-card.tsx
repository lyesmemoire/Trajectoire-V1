// @ts-nocheck
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";

const pricingCardVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "border-gray-200",
        featured: "border-blue-700 shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof pricingCardVariants> {
  title: string;
  description?: string;
  price: string;
  period?: string;
  features: Array<{ text: string; included: boolean }>;
  cta?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PricingCard({
  variant = "default",
  title,
  description,
  price,
  period,
  features = [],
  cta,
  badge,
  className,
  ...props
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col",
        pricingCardVariants({ variant }),
        variant === "featured" && "border-2 border-blue-700",
        className
      )}
      {...props}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          {badge}
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className="flex-1">
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">{price}</span>
            {period && <span className="text-gray-500">{period}</span>}
          </div>
        </div>

        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div
                className={cn(
                  "mt-0.5 flex-shrink-0",
                  feature.included ? "text-green-600" : "text-gray-300"
                )}
              >
                <Check className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  "text-sm",
                  feature.included ? "text-gray-700" : "text-gray-400"
                )}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        {cta || (
          <Button
            variant={variant === "featured" ? "default" : "secondary"}
            className="w-full"
          >
            Commencer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export interface PricingFeatureProps extends React.HTMLAttributes<HTMLLIElement> {
  included: boolean;
  children: React.ReactNode;
}

export function PricingFeature({ included, children, className, ...props }: PricingFeatureProps) {
  return (
    <li className={cn("flex items-start gap-3", className)} {...props}>
      <div className={cn("mt-0.5 flex-shrink-0", included ? "text-green-600" : "text-gray-300")}>
        <Check className="h-5 w-5" />
      </div>
      <span className={cn("text-sm", included ? "text-gray-700" : "text-gray-400")}>
        {children}
      </span>
    </li>
  );
}

export interface PricingBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PricingBadge({ className, children, ...props }: PricingBadgeProps) {
  return (
    <div
      className={cn(
        "px-4 py-1 rounded-full bg-blue-700 text-white text-sm font-medium",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
