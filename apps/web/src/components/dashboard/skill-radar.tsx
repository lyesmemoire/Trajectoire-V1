"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts"

export default function SkillRadar({ data }: { data: any[] }) {
  return (
    <div className="h-[350px] w-full bg-white/70 backdrop-blur-xl rounded-3xl border border-ivoire-200 p-4 shadow-premium">
      <h3 className="text-sm font-black text-ink-400 uppercase tracking-widest mb-4">
        Profil de Compétences
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#E7E2DB" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "#A8A29E", fontSize: 10, fontWeight: 700 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#A67C3D"
            fill="#A67C3D"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
