// @ts-nocheck
import React from "react";

interface SectionBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionBadge({
  children,
  className = "",
}: SectionBadgeProps) {
  return (
    <div
      className={`inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider ${className}`}
    >
      {children}
    </div>
  );
}
