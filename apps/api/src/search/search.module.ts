import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { KnowledgeGraphModule } from '../runtime/kg/kg.module';
import { MatchingModule } from '../matching/matching.module';
import { GraphSearchService } from '../runtime/kg/graph-search.service';
import { RecruiterSearchService } from './recruiter-search.service';

@Module({
  imports: [KnowledgeGraphModule, MatchingModule],
  controllers: [SearchController],
  providers: [GraphSearchService, RecruiterSearchService],
  exports: [GraphSearchService, RecruiterSearchService],
})
export class SearchModule {}
