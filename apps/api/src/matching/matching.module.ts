import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import { KnowledgeGraphModule } from '../runtime/kg/kg.module';
import { GraphMatchingService } from '../runtime/kg/graph-matching.service';

@Module({
  imports: [KnowledgeGraphModule],
  controllers: [MatchingController],
  providers: [GraphMatchingService],
  exports: [GraphMatchingService],
})
export class MatchingModule {}
