"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

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
  isOpen, onClose, title, description, children, size = "md", showClose = true }: ModalProps) {
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full bg-white rounded-3xl shadow-2xl transform transition-all",
            "border border-ivoire-200",
            sizes[size],
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {/* Header */}
          {(title || showClose) && (
            <div className="flex items-start justify-between p-6 pb-0">
              <div>
                {title && (
                  <h2
                    id="modal-title"
                    className="text-xl font-serif font-bold text-ink-900"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-sm text-ink-600">{description}</p>
                )}
              </div>
              {showClose && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-ivoire-100 transition-colors text-ink-400 hover:text-ink-600"
                  aria-label="Fermer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
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
  isOpen, onClose, onConfirm, title, message, confirmText = "Confirmer", cancelText = "Annuler", variant = "danger", isLoading = false }: ConfirmModalProps) {
  const variantStyles = {
    danger: "bg-brick-600 hover:bg-brick-700",
    warning: "bg-terracotta-600 hover:bg-terracotta-700",
    info: "bg-ink-900 hover:bg-ink-800",
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-ink-600 mb-6">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 bg-ivoire-100 text-ink-700 font-bold rounded-xl hover:bg-ivoire-200 transition-colors"
          disabled={isLoading}
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={cn(
            "flex-1 py-3 text-white font-bold rounded-xl transition-colors",
            variantStyles[variant],
          )}
          disabled={isLoading}
        >
          {isLoading ? "Chargement..." : confirmText}
        </button>
      </div>
    </Modal>
  )
}
