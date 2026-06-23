"use client"
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"

export default function RadarSection({ scores }: any) {
  // If scores aren't available yet, provide a fallback to avoid crashing
  const data = [
    { subject: "Impact", A: scores?.impact || 0 },
    { subject: "Structure", A: scores?.structural || 0 },
    { subject: "Alignment", A: scores?.alignment || 0 },
    { subject: "Narrative", A: scores?.narrative || 0 },
  ]

  return (
    <section className="cabinet-section">
      <h2>Evaluation Breakdown</h2>

      <RadarChart width={420} height={400} data={data}>
        <PolarGrid stroke="#2a2f3a" />
        <PolarAngleAxis dataKey="subject" stroke="#aaa" />
        <PolarRadiusAxis angle={30} domain={[0, 10]} />
        <Radar
          name="Score"
          dataKey="A"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.25}
        />
      </RadarChart>
    </section>
  )
}
