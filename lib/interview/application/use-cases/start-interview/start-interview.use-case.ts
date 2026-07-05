import { UseCase } from "@/lib/core/application/UseCase";
import { InterviewRepositoryPort } from "../../../ports/interview-repository.port";
import { Persona } from "../../../domain/value-objects/persona.vo";
import { InterviewSessionAggregate } from "../../../domain/aggregates/interview-session.aggregate";
import { IdGenerator } from "@/lib/core/id/IdGenerator";
import { Result, ok, fail } from "@/lib/core/result";
import { DomainEventPublisher } from "@/lib/core/runtime/event-publisher/DomainEventPublisher";
import { ApplicationError } from "@/lib/core/errors";
import { Clock } from "@/lib/core/clock/Clock";

export interface StartInterviewCommand {
  userId: string;
  jobTitle: string;
  jobDescription?: string;
  cvId?: string;
  candidateSummary?: string;
}

export class StartInterviewUseCase extends UseCase<StartInterviewCommand, string> {
  constructor(
    private readonly interviewRepository: InterviewRepositoryPort,
    private readonly eventPublisher: DomainEventPublisher,
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock
  ) {
    super();
  }

  protected async run(command: StartInterviewCommand): Promise<Result<string>> {
    // 1. Vérifier qu'il n'y a pas d'entretien actif
    const activeResult = await this.interviewRepository.findActiveByUserId(command.userId);
    if (activeResult.isFailure()) return fail(activeResult.unwrapError());
    
    if (activeResult.unwrap() !== null) {
      return fail(new ApplicationError("An interview is already active for this user.", "INTERVIEW_ALREADY_ACTIVE"));
    }

    // 2. Créer le Persona initial
    const persona = Persona.create({
      id: "recruiter_standard",
      type: "direct",
      instructions: "You are a professional recruiter. Keep your questions precise."
    });

    // 3. Créer l'Aggregate
    const sessionId = this.idGenerator.generate();
    const session = InterviewSessionAggregate.create(
      sessionId,
      command.userId,
      command.jobTitle,
      persona,
      this.clock,
      command.jobDescription,
      command.cvId,
      command.candidateSummary
    );

    // 4. Persister
    const saveResult = await this.interviewRepository.save(session);
    if (saveResult.isFailure()) return fail(saveResult.unwrapError());

    // 5. Publier les événements
    await this.eventPublisher.publishEventsFrom(session);

    return ok(sessionId);
  }
}
