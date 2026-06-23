import { notFound, redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { ReportPageClient } from "@/components/interview/ReportPageClient";

interface ReportPageProps {
  params: { id: string };
}

export default async function ReportPage({ params }: ReportPageProps) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  // Charge la session avec ses réponses
  const { data: session } = await supabaseAdmin
    .from("interview_sessions")
    .select("id, analysis, interview_context, job_description, questions, updated_at")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!session) notFound();

  // Charge les réponses individuelles
  const { data: responses } = await supabaseAdmin
    .from("interview_responses")
    .select("question_index, question_text, transcription, score")
    .eq("session_id", params.id)
    .order("question_index");

  let finalReport = session.analysis;

  // Si le rapport n'existe pas encore → on le génère via l'API
  if (!finalReport) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/interview/generate-report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: params.id }),
          cache: "no-store",
        }
      );
      if (res.ok) finalReport = await res.json();
    } catch (err) {
      console.error("[ReportPage] Error generating report:", err);
    }
  }

  if (!finalReport) notFound();

  return (
    <div className="min-h-screen bg-slate-950">
      <ReportPageClient
        sessionId={params.id}
        report={finalReport}
        responses={responses ?? []}
      />
    </div>
  );
}
