type BadgeVariant = 'free' | 'pro' | 'expert'

const styles: Record<BadgeVariant, string> = {
  free: 'bg-ivoire-100 text-ink-600 border border-ivoire-200',
  pro: 'bg-bronze-50 text-bronze-700 border border-bronze-100',
  expert: 'bg-ink-900 text-bronze-400 border border-ink-900',
}

const labels: Record<BadgeVariant, string> = {
  free: 'Free',
  pro: 'Pro',
  expert: 'Expert',
}

export function Badge({ variant }: { variant: BadgeVariant }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1 rounded-full
        text-[11px] font-semibold uppercase tracking-wider
        ${styles[variant]}
      `}
    >
      {variant === 'expert' && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2L12 16.4 5.7 21l2.3-7.2-6-4.6h7.6z" />
        </svg>
      )}
      {labels[variant]}
    </span>
  )
}
