import { Module } from '@nestjs/common';
import { CopilotController } from './copilot.controller';
import { CopilotService } from './copilot.service';
import { RecruiterCopilotService } from './recruiter-copilot.service';
import { PromptInterpreterService } from './prompt-interpreter.service';
import { ResponseBuilderService } from './response-builder.service';
import { ConversationMemoryService } from './conversation-memory.service';
import { CopilotContextService } from './copilot-context.service';
import { CopilotPersistenceService } from './copilot-persistence.service';
import { KnowledgeGraphModule } from '../runtime/kg/kg.module';
import { SearchModule } from '../search/search.module';
import { MatchingModule } from '../matching/matching.module';
import { CvModule } from '../cv/cv.module';

@Module({
  imports: [KnowledgeGraphModule, SearchModule, MatchingModule, CvModule],
  controllers: [CopilotController],
  providers: [
    CopilotService,
    RecruiterCopilotService,
    PromptInterpreterService,
    ResponseBuilderService,
    ConversationMemoryService,
    CopilotContextService,
    CopilotPersistenceService,
  ],
  exports: [
    CopilotService,
    RecruiterCopilotService,
    PromptInterpreterService,
    ResponseBuilderService,
    ConversationMemoryService,
    CopilotContextService,
    CopilotPersistenceService,
  ],
})
export class CopilotModule {}
