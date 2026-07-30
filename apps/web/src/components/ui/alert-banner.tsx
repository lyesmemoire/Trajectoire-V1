interface AlertBannerProps {
  type: "success" | "error" | "warning" | "info"
  title: string
  message?: string
  onDismiss?: () => void
}

const ALERT_STYLES = {
  success: {
    container: "bg-forest-50 border-forest-100 text-forest-600",
    icon: "✅",
  },
  error: {
    container: "bg-brick-50 border-brick-100 text-brick-600",
    icon: "❌",
  },
  warning: {
    container: "bg-terracotta-50 border-terracotta-100 text-terracotta-600",
    icon: "⚠️",
  },
  info: {
    container: "bg-ivoire-100 border-ivoire-200 text-ink-600",
    icon: "ℹ️",
  },
}

export function AlertBanner({
  type, title, message, onDismiss }: AlertBannerProps) {
  const styles = ALERT_STYLES[type]

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 ${styles.container}`}
    >
      <span className="text-lg leading-none">{styles.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{title}</p>
        {message && <p className="mt-0.5 text-sm opacity-80">{message}</p>}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 text-lg leading-none opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Fermer"
        >
          ×
        </button>
      )}
    </div>
  )
}
