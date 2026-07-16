import type {
  InterviewDomainEvent,
} from "../contracts/interview.events";
import type {
  InterviewContext,
  InterviewInput,
} from "../contracts/interview.dto";

export interface InterviewEnginePort {
  generateResponseStream(
    input: InterviewInput,
    userId: string,
    context: InterviewContext,
  ): AsyncGenerator<InterviewDomainEvent, void, void>;
}

