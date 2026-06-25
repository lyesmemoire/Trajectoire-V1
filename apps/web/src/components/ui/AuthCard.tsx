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
      className={cn(
        "bg-white rounded-3xl border border-border p-8 lg:p-10 shadow-elevated",
        className
      )}
    >
      {/* Heading */}
      <div className="mb-8">
        {icon && (
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-brand-primary text-white shadow-glow-primary"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <h1 className="text-3xl font-bold mb-3 text-ink leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-ink-muted leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Body */}
      {children}
    </div>
  );
}
