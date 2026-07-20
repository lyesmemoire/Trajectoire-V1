import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Fetch session data
  const { data: session, error: sessionError } = await supabase
    .from("interview_sessions")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "Session introuvable" }, { status: 404 });
  }

  // Check if session is completed
  if (session.status === "completed") {
    const { data: report } = await supabase
      .from("reports")
      .select("id")
      .eq("session_id", id)
      .single();

    if (report) {
      return NextResponse.json({ 
        redirect: `/report/${report.id}` 
      }, { status: 200 });
    }
  }

  // Fetch messages
  const { data: messages, error: messagesError } = await supabase
    .from("interview_messages")
    .select("*")
    .eq("session_id", id)
    .order("created_at", { ascending: true });

  if (messagesError) {
    return NextResponse.json({ error: "Erreur lors du chargement des messages" }, { status: 500 });
  }

  return NextResponse.json({
    session,
    messages: messages || [],
  });
}
