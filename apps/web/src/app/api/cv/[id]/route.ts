import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const supabase = await createClient()

  // 1. Check session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const interviewId = resolvedParams.id

  // 2. Fetch interview (ownership enforced implicitly by RLS, but we verify anyway)
  const { data: interview, error } = await supabase
    .from("interviews")
    .select(`
      id,
      user_id,
      cabinet_report,
      cabinet_score,
      percentile_rank,
      report_version
    `)
    .eq("id", interviewId)
    .single()

  if (error || !interview) {
    return NextResponse.json(
      { error: "Report not found" },
      { status: 404 }
    )
  }

  // 3. Enforce ownership explicitly
  if (interview.user_id !== user.id) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    )
  }

  // 4. Check plan
  const { data: usage } = await supabase
    .from("user_usage")
    .select("plan, subscription_status")
    .eq("user_id", user.id)
    .single()

  const isPro =
    usage?.plan === "pro" &&
    usage?.subscription_status === "active"

  if (!interview.cabinet_report) {
    return NextResponse.json(
      { error: "Report not generated yet" },
      { status: 400 }
    )
  }

  // Typecast or assume format from our backend
  const report: any = interview.cabinet_report

  // Map our generated report format to the frontend format
  const impactScore = report.impact_analysis ? (
    report.impact_analysis.quantification_quality_score + 
    report.impact_analysis.business_impact_visibility_score + 
    report.impact_analysis.ownership_signal_strength
  ) / 3 : 0;

  // 5. Shape response strictly
  return NextResponse.json({
    executive_summary: report.market_positioning?.positioning_gap || "Analysis complete.",
    axis_scores: {
      impact: impactScore,
      structural: report.structural_data?.overall_structural_coherence_score || 0,
      alignment: report.strategic_alignment_with_target_role || 0,
      narrative: report.narrative_coherence_score || 0,
    },
    critical_weaknesses: report.critical_weaknesses || [],
    hire_risk_assessment: report.hire_risk_assessment,
    rewrite: isPro ? report.rewrite : null, // GATED strictly backend-side
    cabinet_score: interview.cabinet_score || report.computed_overall_cabinet_score,
    percentile_rank: interview.percentile_rank || report.computed_competitiveness_percentile,
    computed_tier: report.computed_tier || "Competitive",
    metadata: report.metadata,
    isPro,
  })
}
