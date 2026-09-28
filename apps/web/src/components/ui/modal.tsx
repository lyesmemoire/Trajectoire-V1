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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full bg-zinc-900 text-white/80 rounded-2xl shadow-2xl shadow-black/50 border border-white/[0.08]",
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
                    className="text-base font-semibold text-white/80 leading-snug"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-sm text-white/50">{description}</p>
                )}
              </div>
              {showClose && (
                <button
                  onClick={onClose}
                  className="shrink-0 rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white/80 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
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
    danger: "bg-danger text-white hover:bg-red-600",
    warning: "bg-warning text-white hover:bg-amber-600",
    info: "bg-indigo-500 text-white hover:bg-indigo-400",
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-white/50 mb-5">{message}</p>
      <div className="flex gap-2.5">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 bg-white/[0.06] text-white/80 text-sm font-medium rounded-lg hover:bg-white/[0.1] transition-colors disabled:opacity-50"
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
