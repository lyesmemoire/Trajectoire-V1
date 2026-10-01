import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Tokens sémantiques : clair sur le marketing (:root), sombre dans (app)
          // où le layout redéfinit --surface / --foreground / --border.
          "flex h-11 w-full rounded-lg border bg-surface px-3.5 py-2 text-sm text-foreground transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-calm-accent-line focus-visible:border-calm-accent disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-danger focus-visible:ring-danger/20 focus-visible:border-danger" : "border-border hover:border-foreground-muted/40",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
