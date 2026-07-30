"use client"

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

interface ProgressChartProps {
  data: {
    date: string
    score: number
  }[]
  title: string
  color?: string
}

export function ProgressChart({
  data, title, color = "#A67C3D" }: ProgressChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-ivoire-200 bg-ivoire-50/50">
        <p className="text-sm font-medium text-ink-400">
          Pas assez de données pour l'analyse.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-80 w-full flex-col rounded-3xl border border-ivoire-200 bg-white/70 backdrop-blur-xl p-6 shadow-premium">
      <h3 className="mb-6 text-sm font-serif font-black text-ink-900 uppercase tracking-wider">
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
              stroke="#E7E2DB"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#A8A29E", fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#A8A29E", fontSize: 10, fontWeight: 700 }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #E7E2DB",
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
  )
}
