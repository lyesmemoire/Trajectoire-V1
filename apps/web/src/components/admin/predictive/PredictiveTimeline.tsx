"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MOCK_DATA = [
  { name: "Session 1", pressure: 40, recovery: 20, engagement: 80 },
  { name: "Session 2", pressure: 60, recovery: 50, engagement: 75 },
  { name: "Session 3", pressure: 85, recovery: 40, engagement: 90 },
  { name: "Session 4", pressure: 50, recovery: 80, engagement: 85 },
];

export function PredictiveTimeline() {
  return (
    <div className="bg-[#0B1023] rounded-[2.5rem] border border-white/[0.08] p-10 shadow-2xl h-full flex flex-col">
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-10">
        Predictive Emotional Timeline
      </h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MOCK_DATA}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 10, fontWeight: 700 }}
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#050816",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
              }}
              itemStyle={{ fontSize: "10px", fontWeight: "bold" }}
            />
            <Line
              type="monotone"
              dataKey="pressure"
              stroke="#EF4444"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="recovery"
              stroke="#22C55E"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase">
          <div className="w-2 h-2 rounded-full bg-rose-500" /> Tension
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase">
          <div className="w-2 h-2 rounded-full bg-emerald-500" /> Recovery
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase">
          <div className="w-2 h-2 rounded-full bg-blue-500" /> Engagement
        </div>
      </div>
    </div>
  );
}
