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
        className="w-full p-4 rounded-xl border border-zinc-700 text-sm text-zinc-50 bg-zinc-900/60 placeholder-zinc-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all duration-300 resize-none "
      />
    </div>
  )
}
