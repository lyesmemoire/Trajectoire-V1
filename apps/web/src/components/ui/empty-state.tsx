"use client"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: React.ReactNode | string
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon = "📭",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-6 text-center", className)}>
      {typeof icon === "string" ? (
        <div className="mb-4 text-5xl">{icon}</div>
      ) : (
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-surface-muted text-foreground-muted">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-foreground-muted mb-6 max-w-sm">{description}</p>
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
  title = "Une erreur est survenue",
  message = "Veuillez réessayer ou contacter le support.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-6 text-center", className)}>
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-danger/8 text-danger">
        <span className="text-2xl" aria-hidden>⚠️</span>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-foreground-muted mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-foreground/90 active:scale-[0.98]"
        >
          Réessayer
        </button>
      )}
    </div>
  )
}
