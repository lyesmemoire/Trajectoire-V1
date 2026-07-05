"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageFooterProps {
  children: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

export function PageFooter({ children, className, sticky = false }: PageFooterProps) {
  return (
    <footer
      className={cn(
        "mt-auto border-t border-gray-200 bg-white py-6",
        sticky && "sticky bottom-0",
        className
      )}
    >
      <div className="px-6">{children}</div>
    </footer>
  );
}
