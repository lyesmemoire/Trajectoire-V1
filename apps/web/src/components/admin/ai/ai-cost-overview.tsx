"use client"

interface Props {
  title: string
  value: string | number
  trend: string
  icon: React.ReactNode
  _icon?: React.ReactNode
}

export function AICostOverview({ title, value, trend, icon }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-ivoire-100 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-ivoire-50 text-ink-600 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black text-forest-500 bg-forest-50 px-2 py-0.5 rounded-md border border-forest-100">
          {trend}
        </div>
      </div>
      <div>
        <p className="text-3xl font-black text-ink-900">{value}</p>
        <p className="text-[10px] font-black text-ink-400 uppercase tracking-widest mt-1">
          {title}
        </p>
      </div>
    </div>
  )
}
