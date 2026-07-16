import "server-only";

/* eslint-disable no-restricted-syntax -- composition is the only approved construction root. */
import { InterviewConversationUseCase } from "../application/use-cases/interview-conversation.use-case";
import { SupabaseInterviewContextBuilder } from "../infrastructure/builders/supabase-interview-context.builder";
import { InterviewEngine } from "../infrastructure/engines/interview.engine";
import { MistralInterviewProvider } from "../infrastructure/providers/mistral-interview.provider";

export function createInterviewUseCase(): InterviewConversationUseCase {
  const provider = new MistralInterviewProvider();
  const engine = new InterviewEngine(provider);
  const contextBuilder = new SupabaseInterviewContextBuilder();

  return new InterviewConversationUseCase(contextBuilder, engine);
}
