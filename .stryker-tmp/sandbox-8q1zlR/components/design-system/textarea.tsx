// @ts-nocheck
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: "default" | "elevated";
  resize?: "none" | "vertical" | "horizontal" | "both";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, error, hint, variant = "default", resize = "vertical", ...props },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text mb-2">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          className={cn(
            "w-full min-h-[120px] px-4 py-3 rounded-lg border transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "placeholder:text-text-muted",
            variant === "default" && "bg-surface border-gray-200",
            variant === "elevated" && "bg-surface border-gray-200 shadow-soft",
            error
              ? "border-error focus:ring-error/20 focus:border-error"
              : "focus:border-primary",
            resize === "none" && "resize-none",
            resize === "vertical" && "resize-y",
            resize === "horizontal" && "resize-x",
            resize === "both" && "resize",
            className
          )}
          {...props}
        />

        {error && (
          <p className="mt-2 text-sm text-error font-medium">{error}</p>
        )}

        {hint && !error && (
          <p className="mt-2 text-sm text-text-secondary">{hint}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
