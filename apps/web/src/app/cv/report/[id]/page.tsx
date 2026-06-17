import { Suspense } from "react"
import CabinetHeader from "@/components/cv/CabinetHeader"
import ExecutiveSummary from "@/components/cv/ExecutiveSummary"
import ScoreBoard from "@/components/cv/ScoreBoard"
import RadarSection from "@/components/cv/RadarSection"
import RiskSection from "@/components/cv/RiskSection"
import RewriteSection from "@/components/cv/RewriteSection"
import TerminalLoading from "@/components/cv/TerminalLoading"

async function getReport(id: string) {
  const res = await fetch(`/api/cv/${id}`, {
    cache: "no-store",
  }).catch(() => null) // Prevent crashing if API is not there yet

  if (!res?.ok) {
    throw new Error("Failed to fetch report - Backend not connected yet")
  }

  return res.json()
}

async function ReportContent({ id }: { id: string }) {
  const data = await getReport(id)

  return (
    <>
      <CabinetHeader meta={data?.metadata} />

      <div className="cabinet-content">
        <ExecutiveSummary summary={data?.executive_summary} score={data?.cabinet_score} />

        <ScoreBoard
          score={data?.cabinet_score || 0}
          percentile={data?.percentile_rank || 0}
          risk={data?.hire_risk_assessment?.risk_level || "low"}
        />

        <RadarSection scores={data?.axis_scores} />

        <RiskSection
          gaps={data?.critical_weaknesses}
        />

        <RewriteSection
          rewrite={data?.rewrite}
          isPro={data?.isPro}
        />
      </div>
    </>
  )
}

export default function ReportPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="cabinet-container">
      <Suspense fallback={<TerminalLoading />}>
        <ReportContent id={params.id} />
      </Suspense>
    </div>
  )
}
