import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200",
          "bg-background text-ink",
          "border border-border",
          "focus-visible:border-brand-primary focus-visible:ring-4 focus-visible:ring-brand-primary/10",
          error && "border-warning focus-visible:border-warning focus-visible:ring-warning/10",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
