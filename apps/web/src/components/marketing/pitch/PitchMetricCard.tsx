interface PitchMetricCardProps {
  value: string;
  label: string;
  sublabel?: string;
  highlight?: boolean;
}

export default function PitchMetricCard({
  value, label, sublabel, highlight = false }: PitchMetricCardProps) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-xl border p-6 transition-all ${
        highlight
          ? "border-brick-600/50 bg-brick-950/30 shadow-lg shadow-brick-900/20"
          : "border-brick-900/30 bg-black/40"
      }`}
    >
      <span
        className={`text-4xl font-black leading-none ${
          highlight ? "text-brick-400" : "text-white"
        }`}
      >
        {value}
      </span>
      <span className="text-sm font-semibold text-gray-300">{label}</span>
      {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
    </div>
  );
}
