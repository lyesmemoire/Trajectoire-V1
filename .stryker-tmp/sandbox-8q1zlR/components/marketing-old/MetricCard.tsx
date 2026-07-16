// @ts-nocheck
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
}

export default function MetricCard({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
}: MetricCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {/* Icône */}
      <div className="rounded-full bg-red-900/30 p-3 ring-1 ring-red-800/50 transition-transform hover:scale-110">
        <Icon className="h-6 w-6 text-red-400" />
      </div>

      {/* Valeur */}
      <p className="text-3xl font-bold text-white">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>

      {/* Label */}
      <p className="text-sm text-gray-400">{label}</p>

      {/* Sous-titre optionnel */}
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}

      {/* Tendance optionnelle */}
      {trend && (
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            trend.positive !== false
              ? "bg-green-900/30 text-green-400"
              : "bg-red-900/30 text-red-400"
          }`}
        >
          <span>{trend.positive !== false ? "↗" : "↘"}</span>
          <span>
            {trend.value > 0 ? "+" : ""}
            {trend.value}% {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}
