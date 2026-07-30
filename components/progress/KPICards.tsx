import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: number;
  diff: number;
}

export function KPICard({ title, value, _diff }: KPICardProps) {
  const isPositive = diff > 0;
  const isNegative = diff < 0;
  const isNeutral = diff === 0;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <span className="text-sm font-medium text-gray-500">{title}</span>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900">{value}</span>

        <div
          className={`flex items-center text-sm font-semibold ${
            isPositive
              ? "text-emerald-600"
              : isNegative
                ? "text-rose-600"
                : "text-gray-400"
          }`}
        >
          {isPositive && <ArrowUpRight className="mr-0.5 h-4 w-4" />}
          {isNegative && <ArrowDownRight className="mr-0.5 h-4 w-4" />}
          {isNeutral && <Minus className="mr-0.5 h-4 w-4" />}
          {Math.abs(diff)}
        </div>
      </div>
    </div>
  );
}
