import React from "react"
import { Check } from "lucide-react"

interface CheckItemProps {
  children: React.ReactNode
  className?: string
}

export default function CheckItem({
  children, className = "" }: CheckItemProps) {
  return (
    <li
      className={`flex items-center gap-2 text-xs font-bold text-ink-700 ${className}`}
    >
      <Check className="w-4 h-4 text-forest-500 flex-shrink-0" />
      <span>{children}</span>
    </li>
  )
}
