"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

export default function SkillRadar({ data }: { data: any[] }) {
  return (
    <div className="h-[350px] w-full bg-white rounded-3xl border border-slate-100 p-4 shadow-sm">
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
        Profil de Compétences
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#f1f5f9" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
