// @ts-nocheck
import { InterviewOrchestrationContext } from "../../../contexts/interview-orchestration.context";
import { InterviewRepositoryPort } from "../../../../ports/interview-repository.port";
import { DomainEventPublisher } from "@/lib/core/runtime/event-publisher/DomainEventPublisher";
import { Result, ok, fail } from "@/lib/core/result";

export class PersistSessionStep {
  constructor(
    private readonly repository: InterviewRepositoryPort,
    private readonly eventPublisher: DomainEventPublisher
  ) {}

  async execute(context: InterviewOrchestrationContext): Promise<Result<void>> {
    // 1. Enregistrer la réponse et l'analyse dans l'aggregate
    if (context.analysis) {
      context.session.submitAnswer(context.incomingAnswer, context.analysis);
    }

    // 2. Enregistrer la nouvelle question
    if (context.nextQuestion) {
      context.session.addQuestion(context.nextQuestion);
    }

    // 3. Emettre un event global pour la step
    context.session.orchestrateStep(context.isRecoveryTriggered);

    // 4. Persister
    const saveResult = await this.repository.save(context.session);
    if (saveResult.isFailure()) return fail(saveResult.unwrapError());

    // 5. Publier tous les événements du domaine
    await this.eventPublisher.publishEventsFrom(context.session);

    return ok(undefined);
  }
}
