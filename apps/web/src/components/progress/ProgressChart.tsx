"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface ProgressChartProps {
  data: {
    date: string;
    score: number;
  }[];
  title: string;
  color?: string;
}

export function ProgressChart({
  data,
  title,
  color = "#3B82F6",
}: ProgressChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/50">
        <p className="text-sm font-medium text-slate-400">
          Pas assez de données pour l'analyse.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-80 w-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-sm font-black text-slate-900 uppercase tracking-wider">
        {title}
      </h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.1} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                fontSize: "12px",
                fontWeight: "bold",
              }}
              cursor={{ stroke: color, strokeWidth: 2, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke={color}
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorScore)"
              dot={{ r: 4, fill: color, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
