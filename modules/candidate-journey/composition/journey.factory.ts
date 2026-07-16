import { JourneyUseCase } from "../application/use-cases/journey.use-case";
import { CandidateJourneyWorkflow } from "../application/workflows/candidate-journey.workflow";
import { SupabaseJourneyRepository } from "../infrastructure/repositories/supabase-journey-repository";
import { SystemClock } from "../../../lib/core/clock/Clock";
import { UuidGenerator } from "../../../lib/core/id/IdGenerator";
import { DomainEventPublisher } from "../../../lib/core/runtime/event-publisher/DomainEventPublisher";
import { EventDispatcher } from "../../../lib/core/runtime/event-dispatcher/EventDispatcher";
import { UploadCvUseCase } from "../../../lib/cv/application/use-cases/upload/upload-cv.use-case";
import { UpdateCareerProfileUseCase } from "../../../lib/career/application/use-cases/update-career-profile/update-career-profile.use-case";
import { UploadJobOfferUseCase } from "../../../lib/jobs/application/use-cases/upload/upload-job-offer.use-case";
import { MistralAtsAnalysisAdapter } from "../../../lib/cv/infrastructure/adapters/mistral-ats-analysis.adapter";
import { RewriteCvUseCase } from "../../../lib/cv/application/use-cases/rewrite/rewrite-cv.use-case";
import { StartInterviewUseCase } from "../../../lib/interview/application/use-cases/start-interview/start-interview.use-case";
import { InterviewConversationUseCase } from "../../../lib/interview/application/use-cases/interview-conversation.use-case";
import { SupabaseCvRepository } from "../../../lib/cv/infrastructure/repositories/supabase-cv.repository";
import { PrismaInterviewRepository } from "../../../lib/interview/infrastructure/repositories/prisma-interview.repository";
import { prisma } from "../../../lib/prisma";
import { SupabaseStorageAdapter } from "../../../lib/cv/infrastructure/adapters/supabase-storage.adapter";
import { PdfParserAdapter } from "../../../lib/cv/infrastructure/adapters/pdf-parser.adapter";
import { MistralAdapter } from "../../../lib/cv/infrastructure/adapters/mistral.adapter";
import { BillingCreditsGateway } from "../../../lib/cv/infrastructure/adapters/billing-credits.gateway";
import { LocalCommandBus } from "../../../lib/core/runtime/command-bus/CommandBus";
import { LocalQueryBus } from "../../../lib/core/runtime/query-bus/QueryBus";
import { PrismaCareerRepository } from "../../../lib/career/infrastructure/repositories/prisma-career.repository";
import { PrismaPredictionRepository } from "../../../lib/career/infrastructure/repositories/prisma-prediction.repository";
import { LoadCareerProfileStep } from "../../../lib/career/application/use-cases/update-career-profile/steps/load-career-profile.step";
import { PersistCareerStep } from "../../../lib/career/application/use-cases/update-career-profile/steps/persist-career.step";
import { PrismaAtsRepository } from "../../../lib/cv/infrastructure/repositories/prisma-ats.repository";
import { PrismaProfileExtractionRepository } from "../../../lib/cv/infrastructure/repositories/prisma-profile-extraction.repository";
import { PrismaOptimizedCvRepository } from "../../../lib/cv/infrastructure/repositories/prisma-optimized-cv.repository";
import { PrismaInterviewReportRepository } from "../../../lib/interview/infrastructure/repositories/prisma-interview-report.repository";
import { SupabaseInterviewContextBuilder } from "../../../lib/interview/infrastructure/builders/supabase-interview-context.builder";
import { InterviewEngine } from "../../../lib/interview/infrastructure/engines/interview.engine";
import { MistralInterviewProvider } from "../../../lib/interview/infrastructure/providers/mistral-interview.provider";
import { PrismaJobOfferRepository } from "../../../lib/jobs/infrastructure/repositories/prisma-job-offer.repository";

// Factory for creating JourneyUseCase with all dependencies
// This is a simplified version - in production, use a proper DI container
export function createJourneyUseCase(): JourneyUseCase {
  const clock = new SystemClock();
  const idGenerator = new UuidGenerator();
  const eventDispatcher = new EventDispatcher();
  const eventPublisher = new DomainEventPublisher(eventDispatcher);
  
  const journeyRepository = new SupabaseJourneyRepository(clock);
  const cvRepository = new SupabaseCvRepository(clock);
  const interviewRepository = new PrismaInterviewRepository(prisma, clock);
  const careerRepository = new PrismaCareerRepository(prisma, clock);
  const predictionRepository = new PrismaPredictionRepository(prisma);
  const atsRepository = new PrismaAtsRepository();
  const profileExtractionRepository = new PrismaProfileExtractionRepository();
  const optimizedCvRepository = new PrismaOptimizedCvRepository();
  const interviewReportRepository = new PrismaInterviewReportRepository();

  const storageAdapter = new SupabaseStorageAdapter();
  const documentParser = new PdfParserAdapter();
  const llmRewriter = new MistralAdapter();
  const commandBus = new LocalCommandBus();
  const queryBus = new LocalQueryBus();
  const creditsGateway = new BillingCreditsGateway(commandBus, queryBus);

  const uploadCvUseCase = new UploadCvUseCase(
    storageAdapter,
    documentParser,
    cvRepository,
    eventPublisher,
    idGenerator,
    clock
  );

  const loadCareerProfileStep = new LoadCareerProfileStep(
    careerRepository,
    idGenerator,
    clock
  );

  const persistCareerStep = new PersistCareerStep(
    careerRepository,
    predictionRepository
  );

  const updateCareerProfileUseCase = new UpdateCareerProfileUseCase(
    [loadCareerProfileStep, persistCareerStep],
    eventPublisher
  );

  const uploadJobOfferUseCase = new UploadJobOfferUseCase(
    eventPublisher,
    idGenerator,
    clock,
    new PrismaJobOfferRepository(clock)
  );

  const atsAnalysisGateway = new MistralAtsAnalysisAdapter();

  const rewriteCvUseCase = new RewriteCvUseCase(
    llmRewriter,
    creditsGateway,
    cvRepository,
    eventPublisher
  );

  const startInterviewUseCase = new StartInterviewUseCase(
    interviewRepository,
    eventPublisher,
    idGenerator,
    clock
  );

  // Create interview conversation use case for voice interview
  const mistralProvider = new MistralInterviewProvider();
  const interviewEngine = new InterviewEngine(mistralProvider);
  const contextBuilder = new SupabaseInterviewContextBuilder();
  const interviewConversationUseCase = new InterviewConversationUseCase(
    contextBuilder,
    interviewEngine
  );

  const workflow = new CandidateJourneyWorkflow(
    uploadCvUseCase,
    updateCareerProfileUseCase,
    uploadJobOfferUseCase,
    atsAnalysisGateway,
    rewriteCvUseCase,
    startInterviewUseCase,
    atsRepository,
    profileExtractionRepository,
    optimizedCvRepository,
    interviewReportRepository,
    interviewConversationUseCase,
    interviewRepository
  );

  return new JourneyUseCase(
    journeyRepository,
    workflow,
    eventPublisher,
    idGenerator,
    clock,
    cvRepository,
    interviewRepository
  );
}
