// @ts-nocheck
"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export function AIModelDistribution({ logs }: { logs: any[] }) {
  const dataMap: Record<string, number> = {};
  logs.forEach((l) => {
    dataMap[l.model] = (dataMap[l.model] || 0) + 1;
  });

  const data = Object.entries(dataMap).map(([name, value]) => ({
    name,
    value,
  }));
  const COLORS = ["#3B82F6", "#7C3AED", "#06B6D4", "#EF4444"];

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm h-full">
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
        Model Distribution
      </h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
