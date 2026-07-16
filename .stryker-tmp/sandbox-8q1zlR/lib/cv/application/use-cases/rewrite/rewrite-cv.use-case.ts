// @ts-nocheck
import { ok, fail, Result } from "@/lib/core/result";
import { UseCase } from "@/lib/core/application/UseCase";
import { UnauthorizedError } from "@/lib/core/result/errors";
import { LLMRewriterGateway } from "../../../ports/gateways/llm-rewriter.gateway";
import { CreditsGateway } from "../../../ports/gateways/credits.gateway";
import { CvRepositoryPort } from "../../../ports/repositories/cv-repository.port";
import { DomainEventPublisher } from "@/lib/core/runtime/event-publisher/DomainEventPublisher";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";

export interface RewriteCvInput {
  cvId?: string;
  action: "improve_experience" | "rewrite_summary" | "generate_metrics";
  content: string;
  context?: string;
}

export class RewriteCvUseCase extends UseCase<RewriteCvInput, string> {
  constructor(
    private readonly rewriter: LLMRewriterGateway,
    private readonly credits: CreditsGateway,
    private readonly repository: CvRepositoryPort,
    private readonly publisher: DomainEventPublisher
  ) {
    super();
  }

  protected async run(input: RewriteCvInput): Promise<Result<string, any>> {
    const userId = RequestContext.userId();
    if (!userId) return fail(new UnauthorizedError("User not authenticated"));

    // 1. Verify credits
    const hasCredits = await this.credits.hasCredits(userId, 1);
    if (hasCredits.isFailure()) return fail(hasCredits.unwrapError());
    if (!hasCredits.unwrap()) {
      return fail(new UnauthorizedError("Insufficient AI credits"));
    }

    // 2. Load Aggregate (if cvId is provided)
    let cv = null;
    if (input.cvId && input.cvId !== "unknown") {
      const cvResult = await this.repository.findById(input.cvId);
      if (cvResult.isSuccess()) {
        cv = cvResult.unwrap();
      }
    }

    // 3. Map Action to instructions
    let instructions = "";
    if (input.action === "improve_experience") {
      instructions = "Améliore cette expérience professionnelle pour la rendre plus percutante et orientée résultats (impact).";
    } else if (input.action === "rewrite_summary") {
      instructions = "Réécris ce résumé de CV (profil) pour le rendre plus professionnel, accrocheur et concis.";
    } else if (input.action === "generate_metrics") {
      instructions = `Génère 3 suggestions de métriques d'impact quantitatives que le candidat pourrait ajouter à son CV, basé sur ce contexte: ${input.context}. Sois très concis, sous forme de liste à puces.`;
    }

    // 4. Rewrite via Gateway
    const rewriteResult = await this.rewriter.rewrite(input.content, instructions);
    if (rewriteResult.isFailure()) {
      if (cv) {
        cv.failRewrite(rewriteResult.unwrapError().message);
        await this.publisher.publishEventsFrom(cv);
      }
      return fail(rewriteResult.unwrapError());
    }
    
    const newText = rewriteResult.unwrap();

    // 5. Update Aggregate and persist if cv exists
    if (cv) {
      cv.rewrite(input.action, newText);
      await this.repository.save(cv);
      await this.publisher.publishEventsFrom(cv);
    }

    // 6. Consume credits
    await this.credits.consume(userId, 1, "cv_optimize");

    return ok(newText);
  }
}
