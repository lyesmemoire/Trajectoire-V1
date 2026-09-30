"use client"

interface Props {
  value: string
  onChange: (v: string) => void
}

export function JobInput({ value, onChange }: Props) {
  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Collez l'annonce d'emploi ici..."
        rows={4}
        className="w-full p-4 rounded-xl border border-ivoire-300 text-sm text-ink-900 bg-white/80 placeholder-ink-400 focus:outline-none focus:border-bronze-400 focus:ring-1 focus:ring-bronze-400 transition-all duration-300 resize-none shadow-inner shadow-ivoire-100/50"
      />
    </div>
  )
}
