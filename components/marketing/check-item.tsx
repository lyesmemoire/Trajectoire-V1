import React from "react";
import { Check } from "lucide-react";

interface CheckItemProps {
  children: React.ReactNode;
  className?: string;
}

export default function CheckItem({
  children, className = "", _}: CheckItemProps) {
  return (
    <li
      className={`flex items-center gap-2 text-xs font-bold text-slate-700 ${className}`}
    >
      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}
