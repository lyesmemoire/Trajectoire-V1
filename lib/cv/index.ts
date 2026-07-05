/**
 * CV Domain — Public API
 */

export { CvModule } from "./CvModule";

// ─── Ports ────────────────────────────────────
export type { CvRepositoryPort } from "./ports/repositories/cv-repository.port";
export type { AtsAnalysisGateway } from "./ports/gateways/ats-analysis.gateway";
export type { CreditsGateway } from "./ports/gateways/credits.gateway";
export type { CvStorageGateway } from "./ports/gateways/cv-storage.gateway";
export type { DocumentParserGateway } from "./ports/gateways/document-parser.gateway";
export type { LLMRewriterGateway } from "./ports/gateways/llm-rewriter.gateway";

// ─── DTOs (structures de sortie) ─────────────────────────────────
export type { CvDTO, AtsAnalysisDTO } from "./application/dto/cv.dto";

// ─── Domain Events ───────────────────────────────────────────────
export {
  CvUploaded,
  CvParsed,
  CvAnalyzed,
  AnalysisFailed,
  CvRewritten,
  RewriteFailed,
  CvExported,
  CvDeleted
} from "./domain/events/cv-events";
