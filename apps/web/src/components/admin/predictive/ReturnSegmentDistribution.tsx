"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface Props {
  data: {
    high: number
    medium: number
    low: number
  }
}

export function ReturnSegmentDistribution({ data }: Props) {
  const chartData = [
    { name: "HIGH", value: data.high, color: "#3B82F6" },
    { name: "MEDIUM", value: data.medium, color: "#F59E0B" },
    { name: "LOW", value: data.low, color: "#EF4444" },
  ]

  return (
    <div className="bg-[#0B1023] rounded-[2.5rem] border border-white/[0.08] p-8 space-y-6 shadow-2xl h-full flex flex-col">
      <h3 className="text-sm font-black text-ink-400 uppercase tracking-widest">
        Return Segment Distribution
      </h3>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#050816",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between gap-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px] font-black text-ink-400">
                {item.name}
              </span>
            </div>
            <p className="text-sm font-black text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
