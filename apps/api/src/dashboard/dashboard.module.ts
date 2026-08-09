import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { CopilotModule } from '../copilot/copilot.module';
import { KnowledgeGraphModule } from '../runtime/kg/kg.module';
import { SearchModule } from '../search/search.module';
import { MatchingModule } from '../matching/matching.module';

@Module({
  imports: [
    CopilotModule,
    KnowledgeGraphModule,
    SearchModule,
    MatchingModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
