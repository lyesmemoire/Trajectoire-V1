import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface FormFieldProps {
  label: ReactNode;
  htmlFor?: string;
  error?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  optional?: boolean;
}

export function FormField({
  label,
  htmlFor,
  error,
  description,
  children,
  className,
  optional,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
          {label}
        </label>
        {optional && (
          <span className="text-xs text-ink-muted">Optionnel</span>
        )}
      </div>
      
      {children}
      
      {description && !error && (
        <p className="text-sm text-ink-muted">{description}</p>
      )}
      
      {error && (
        <p className="text-sm text-warning font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
