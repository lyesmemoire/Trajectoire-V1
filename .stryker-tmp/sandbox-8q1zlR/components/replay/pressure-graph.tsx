// @ts-nocheck
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface Props {
  data: { time: number; level: number }[];
  events: any[];
}

export function PressureGraph({ data, events }: Props) {
  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-64 w-full bg-slate-900 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="grid-graph"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 30 0 L 0 0 0 30"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-graph)" />
        </svg>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest">
            Courbe de Tension Psychologique
          </h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] font-bold text-slate-400">
                Pression
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400">
                Peaks
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPressure" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#1e293b"
              />
              <XAxis
                dataKey="time"
                tickFormatter={formatTime}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#475569", fontSize: 10, fontWeight: 700 }}
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                }}
                itemStyle={{ color: "#3b82f6", fontWeight: "bold" }}
                labelStyle={{ color: "#64748b" }}
                labelFormatter={(label) => formatTime(Number(label))}
              />
              <Area
                type="monotone"
                dataKey="level"
                stroke="#3B82F6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPressure)"
              />
              {events.map((evt, i) => (
                <ReferenceLine
                  key={i}
                  x={evt.timestamp}
                  stroke={evt.type === "interruption" ? "#F43F5E" : "#8B5CF6"}
                  strokeDasharray="3 3"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
