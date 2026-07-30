"use client"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon = "📭", title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12 px-6", className)}>
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-serif font-bold text-ink-900 mb-2">{title}</h3>
      {description && (
        <p className="text-ink-500 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      {action}
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = "Une erreur est survenue", message = "Veuillez réessayer ou contacter le support.", onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn("text-center py-12 px-6", className)}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brick-50 flex items-center justify-center">
        <span className="text-3xl">⚠️</span>
      </div>
      <h3 className="text-xl font-serif font-bold text-ink-900 mb-2">{title}</h3>
      <p className="text-ink-500 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-ink-900 text-ivoire-50 font-bold rounded-xl hover:bg-ink-800 transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  )
}
