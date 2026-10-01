"use client"

import { ReactNode, useEffect } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  showClose?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showClose = true,
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-calm-ink/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full bg-calm-surface text-calm-ink rounded-2xl shadow-2xl shadow-calm-ink/10 border border-calm-line",
            sizes[size],
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {/* Header */}
          {(title || showClose) && (
            <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-0">
              <div className="min-w-0">
                {title && (
                  <h2
                    id="modal-title"
                    className="text-base font-semibold text-calm-ink leading-snug"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-sm text-calm-secondary">{description}</p>
                )}
              </div>
              {showClose && (
                <button
                  onClick={onClose}
                  className="shrink-0 rounded-lg p-1.5 text-calm-secondary transition-colors hover:bg-calm-accent-wash hover:text-calm-ink outline-none focus-visible:ring-2 focus-visible:ring-calm-accent-line"
                  aria-label="Fermer"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

// ── Confirm Modal ──────────────────────────────────────────────────────────

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "warning" | "info"
  isLoading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  const confirmStyles = {
    danger: "bg-danger text-white hover:bg-calm-warn",
    warning: "bg-warning text-white hover:bg-calm-warn",
    info: "bg-calm-accent text-white hover:bg-calm-accent-deep",
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-calm-secondary mb-5">{message}</p>
      <div className="flex gap-2.5">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 bg-calm-accent-wash text-calm-ink text-sm font-medium rounded-lg hover:bg-calm-accent-soft transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={cn(
            "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50",
            confirmStyles[variant],
          )}
          disabled={isLoading}
        >
          {isLoading ? "Chargement…" : confirmText}
        </button>
      </div>
    </Modal>
  )
}
