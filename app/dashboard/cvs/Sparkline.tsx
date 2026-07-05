"use client"

import {
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts"

interface SparklineProps {
  data: { score: number }[]
  color?: string
}

export function Sparkline({ data, color = "#6366f1" }: SparklineProps) {
  if (!data || data.length < 3) return null

  return (
    <div className="h-10 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="score"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
