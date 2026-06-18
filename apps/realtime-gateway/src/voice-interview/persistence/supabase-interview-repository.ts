import { createClient } from "@supabase/supabase-js";
import type { InterviewRecord, InterviewRepository } from "./interview-repository.js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export class SupabaseInterviewRepository implements InterviewRepository {
  async create(record: InterviewRecord): Promise<void> {
    const { error } = await supabase.from("interviews").insert({
      session_id: record.sessionId,
      user_id: record.userId,
      target_role: record.targetRole ?? null,
      started_at: record.startedAt,
      ended_at: record.endedAt ?? null,
      transcript: record.transcript,
      metrics: record.metrics ?? null,
      score: record.score ?? null,
      premium_report: record.premiumReport ?? null,
    });
    if (error) {
      console.error(error);
      throw new Error("Database write failed");
    }
  }

  async update(sessionId: string, partial: Partial<InterviewRecord>): Promise<void> {
    const { error } = await supabase
      .from("interviews")
      .update({
        ended_at: partial.endedAt,
        transcript: partial.transcript,
        metrics: partial.metrics,
        score: partial.score,
        premium_report: partial.premiumReport,
      })
      .eq("session_id", sessionId);

    if (error) {
      console.error(error);
      throw new Error("Database write failed");
    }
  }

  async get(sessionId: string): Promise<InterviewRecord | null> {
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is 'row not found', acceptable for get
      console.error(error);
      throw new Error("Database read failed");
    }

    if (!data) return null;

    return {
      sessionId: data.session_id,
      userId: data.user_id,
      targetRole: data.target_role,
      startedAt: data.started_at,
      endedAt: data.ended_at,
      transcript: data.transcript,
      metrics: data.metrics,
      score: data.score,
      premiumReport: data.premium_report,
      interview_context: data.interview_context,
    };
  }

  async listByUser(userId: string): Promise<InterviewRecord[]> {
    const { data } = await supabase
      .from("interviews")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!data) return [];

    return data.map((row) => ({
      sessionId: row.session_id,
      userId: row.user_id,
      targetRole: row.target_role,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      transcript: row.transcript,
      metrics: row.metrics,
      score: row.score,
      premiumReport: row.premium_report,
    }));
  }
}
