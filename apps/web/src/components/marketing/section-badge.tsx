import React from "react"

interface SectionBadgeProps {
  children: React.ReactNode
  className?: string
}

export default function SectionBadge({
  children, className = "" }: SectionBadgeProps) {
  return (
    <div
      className={`inline-block bg-bronze-50 text-bronze-700 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider ${className}`}
    >
      {children}
    </div>
  )
}
