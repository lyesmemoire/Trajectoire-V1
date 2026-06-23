import { notFound, redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { InterviewSimulationClient } from "./InterviewSimulationClient";
import { createChildLogger } from "@/lib/logger";

const log = createChildLogger({ component: "interview-session-page" });

async function getInterviewSession(id: string) {
  const { data, error } = await supabaseAdmin
    .from("interview_sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function InterviewSessionPage({
  params
}: {
  params: { id: string }
}) {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/login");
  }

  const session = await getInterviewSession(params.id);

  if (!session || session.user_id !== user.id) {
    log.warn({ event: "interview_session_not_found_or_unauthorized", sessionId: params.id, userId: user.id });
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/50">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </div>
            <h1 className="text-sm font-black tracking-widest uppercase">Simulation Recruteur</h1>
          </div>
          <div className="text-xs font-bold text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            Poste visé : <span className="text-white">{session.job_title}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <InterviewSimulationClient session={session} />
      </main>
    </div>
  );
}
