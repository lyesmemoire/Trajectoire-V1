"use client"

import { Zap } from "lucide-react"

interface Props {
  level: number;           // 0-100
  insufficient?: boolean;  // true = not enough real data
}

export function PressureMeter({ level, insufficient = false }: Props) {
  if (insufficient) {
    return (
      <div className="flex flex-col gap-2 w-full max-w-[200px]">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Tension
          </span>
          <span className="text-[10px] font-medium text-[var(--text-secondary)]">
            —
          </span>
        </div>
        <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
          <div className="h-full w-0 bg-[var(--primary)]" />
        </div>
        <p className="text-[9px] text-center text-[var(--text-secondary)]">
          Données insuffisantes
        </p>
      </div>
    )
  }

  const getColor = (val: number) => {
    if (val > 75) return "bg-[var(--warning)]"
    if (val > 45) return "bg-[var(--primary)]"
    return "bg-[var(--primary)]"
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-[200px]">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-1">
          <Zap className="w-3 h-3" />
          Tension
        </span>
        <span className="text-[10px] font-medium text-[var(--text-primary)]">
          {level}%
        </span>
      </div>

      <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${getColor(level)}`}
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  )
}
