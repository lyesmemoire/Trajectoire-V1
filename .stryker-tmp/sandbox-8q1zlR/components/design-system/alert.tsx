// @ts-nocheck
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200 text-gray-900",
        success: "bg-green-50 border-green-200 text-green-900",
        warning: "bg-amber-50 border-amber-200 text-amber-900",
        error: "bg-red-50 border-red-200 text-red-900",
        info: "bg-blue-50 border-blue-200 text-blue-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  icon?: LucideIcon;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon: Icon, title, dismissible, onDismiss, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);

    const handleDismiss = () => {
      setIsVisible(false);
      setTimeout(() => onDismiss?.(), 300);
    };

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          alertVariants({ variant }),
          dismissible && "pr-12",
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="shrink-0 mt-0.5">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div className="flex-1 space-y-1">
            {title && (
              <h5 className="font-semibold leading-none tracking-tight">
                {title}
              </h5>
            )}
            <div className="text-sm leading-relaxed">
              {children}
            </div>
          </div>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="shrink-0 rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-current"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

export { Alert, alertVariants };
