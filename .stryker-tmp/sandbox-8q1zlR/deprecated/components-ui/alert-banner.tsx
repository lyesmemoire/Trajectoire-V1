// @ts-nocheck
interface AlertBannerProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  onDismiss?: () => void;
}

const ALERT_STYLES = {
  success: {
    container: "bg-emerald-50 border-emerald-200 text-emerald-800",
    icon: "✅",
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon: "❌",
  },
  warning: {
    container: "bg-amber-50 border-amber-200 text-amber-800",
    icon: "⚠️",
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "ℹ️",
  },
};

export function AlertBanner({
  type,
  title,
  message,
  onDismiss,
}: AlertBannerProps) {
  const styles = ALERT_STYLES[type];

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
  );
}
