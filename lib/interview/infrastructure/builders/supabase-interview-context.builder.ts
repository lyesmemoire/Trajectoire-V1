import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import type {
  InterviewContext,
  InterviewInput,
  InterviewLevel,
  InterviewMode,
} from "../../domain/contracts/interview.dto";
import { InterviewError } from "../../domain/contracts/interview.errors";
import type { InterviewContextBuilderPort } from "../../domain/ports/interview-context-builder.port";

const DEFAULT_LEVEL: InterviewLevel = "mid";
const DEFAULT_MODE: InterviewMode = "behavioral";

export class SupabaseInterviewContextBuilder implements InterviewContextBuilderPort {
  async buildContext(userId: string, input: InterviewInput): Promise<InterviewContext> {
    const supabase = await createServerClient();
    const { data: session, error } = await supabase
      .from("interview_sessions")
      .select("id, user_id, job_title, job_description")
      .eq("id", input.sessionId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new InterviewError("Interview context is unavailable", "CONTEXT_UNAVAILABLE");
    }

    const level = input.contextOverrides?.level ?? DEFAULT_LEVEL;
    const mode = input.contextOverrides?.mode ?? DEFAULT_MODE;
    const language = input.contextOverrides?.language ?? "fr";

    return {
      candidate: {
        candidateId: userId,
        targetRole: session?.job_title ?? "Poste cible à préciser",
        yearsOfExperience: 0,
        skills: [],
        summary: null,
      },
      jobOffer: {
        offerId: session?.id ?? null,
        title: session?.job_title ?? "Poste cible à préciser",
        companyName: null,
        requiredSkills: input.contextOverrides?.targetCompetencies ?? [],
        descriptionSummary: session?.job_description ?? null,
      },
      history: input.history.map((message) => ({
        messageId: message.id,
        role: message.role,
        content: message.content,
        createdAtIso: message.createdAtIso,
      })),
      objectives: [
        {
          id: "interview-practice",
          label: "Progresser dans la simulation d'entretien",
          priority: "high",
        },
      ],
      level,
      constraints: {
        language,
        mode,
        level,
        maximumQuestions: input.contextOverrides?.questionLimit ?? 8,
        maximumResponseChars: input.contextOverrides?.responseMaxChars ?? 4000,
        allowFollowUpQuestions: true,
      },
    };
  }
}

