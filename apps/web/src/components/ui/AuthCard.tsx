import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface AuthCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AuthCard({ title, subtitle, icon, children, className }: AuthCardProps) {
  return (
    <div
      className={cn("bg-white rounded-2xl border border-border p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]", className)}
    >
      {/* Heading */}
      <div className="mb-8">
        {icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 bg-brand-primary/10 text-brand-primary"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <h1 className="text-2xl font-bold mb-1 text-ink">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base text-ink-muted">
            {subtitle}
          </p>
        )}
      </div>

      {/* Body */}
      {children}
    </div>
  );
}
