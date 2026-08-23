// @ts-nocheck
import { createClient } from "@supabase/supabase-js";
import type { InterviewRecord, InterviewRepository } from "./interview-repository.js";
import { envServer } from "../../config/env.js";
import { captureError } from "../../infrastructure/error-telemetry.js";

const supabase = createClient(
  envServer.SUPABASE_URL,
  envServer.SUPABASE_SERVICE_ROLE_KEY,
);

export class SupabaseInterviewRepository implements InterviewRepository {
  async create(record: InterviewRecord): Promise<void> {
    // Note: session_id is no longer inserted here, Postgres generates an UUID.
    // However, if the repository is called directly to create a record and needs
    // to respect an existing sessionId, we'd need to adapt.
    // In our case, session creation happens in routes/interviews.ts and the
    // repository `create` method is currently unused. We keep it updated for completeness.
    const { error } = await supabase.from("interview_sessions").insert({
      id: record.sessionId, // Provided by caller if necessary, or omitted if relying on DB
      user_id: record.userId,
      target_role: record.targetRole ?? null,
      transcript: record.transcript,
      metrics: record.metrics ?? null,
      voice_report: record.score ?? null,
      voice_score: typeof record.score === 'object' && record.score !== null && 'overall' in record.score 
        ? (record.score as unknown).overall 
        : null,
      premium_report: record.premiumReport ?? null,
    });
    if (error) {
      const err = new Error("Database write failed");
      captureError(err, { component: 'supabase', table: 'interview_sessions', operation: 'create', details: error.message });
      console.error(error);
      throw err;
    }
  }

  async update(sessionId: string, partial: Partial<InterviewRecord>): Promise<void> {
    const { error } = await supabase
      .from("interview_sessions")
      .update({
        completed_at: partial.endedAt ? new Date(partial.endedAt).toISOString() : null,
        transcript: partial.transcript,
        metrics: partial.metrics,
        voice_report: partial.score,
        voice_score: partial.score && typeof partial.score === 'object' && 'overall' in partial.score 
          ? (partial.score as unknown).overall 
          : undefined,
        premium_report: partial.premiumReport,
      })
      .eq("id", sessionId);

    if (error) {
      const err = new Error("Database write failed");
      captureError(err, { component: 'supabase', table: 'interview_sessions', operation: 'update', sessionId, details: error.message });
      console.error(error);
      throw err;
    }
  }

  async get(sessionId: string): Promise<InterviewRecord | null> {
    const { data, error } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is 'row not found', acceptable for get
      const err = new Error("Database read failed");
      captureError(err, { component: 'supabase', table: 'interview_sessions', operation: 'get', sessionId, details: error.message });
      console.error(error);
      throw err;
    }

    if (!data) return null;

    return {
      sessionId: data.id,
      userId: data.user_id,
      targetRole: data.target_role,
      startedAt: new Date(data.created_at).getTime(),
      endedAt: data.completed_at ? new Date(data.completed_at).getTime() : undefined,
      transcript: data.transcript,
      metrics: data.metrics,
      score: data.voice_report,
      premiumReport: data.premium_report,
      interview_context: data.interview_context,
    };
  }

  async listByUser(userId: string): Promise<InterviewRecord[]> {
    const { data } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!data) return [];

    return data.map((row) => ({
      sessionId: row.id,
      userId: row.user_id,
      targetRole: row.target_role,
      startedAt: new Date(row.created_at).getTime(),
      endedAt: row.completed_at ? new Date(row.completed_at).getTime() : undefined,
      transcript: row.transcript,
      metrics: row.metrics,
      score: row.voice_report,
      premiumReport: row.premium_report,
    }));
  }
}
