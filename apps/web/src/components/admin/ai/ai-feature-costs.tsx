"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function AIFeatureCosts({ logs }: { logs: any[] }) {
  const dataMap: Record<string, number> = {};
  logs.forEach((l) => {
    dataMap[l.feature] = (dataMap[l.feature] || 0) + l.costUsd;
  });

  const data = Object.entries(dataMap).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm h-full">
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
        Cost by Feature (USD)
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#f1f5f9"
            />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index % 2 === 0 ? "#3B82F6" : "#7C3AED"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
