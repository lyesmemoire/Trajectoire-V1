"use client";

import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <svg
      className={cn("animate-spin text-blue-600", sizes[size], className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = "Chargement..." }: PageLoaderProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col">
      <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
        <Spinner size="lg" className="text-white" />
      </div>
      <p className="text-slate-600 font-medium">{message}</p>
    </div>
  );
}
