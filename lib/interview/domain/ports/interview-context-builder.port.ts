import type {
  InterviewContext,
  InterviewInput,
} from "../contracts/interview.dto";

export interface InterviewContextBuilderPort {
  buildContext(userId: string, input: InterviewInput): Promise<InterviewContext>;
}

