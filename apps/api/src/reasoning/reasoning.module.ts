import { Module } from '@nestjs/common';
import { ReasoningController } from './reasoning.controller';
import { KnowledgeGraphModule } from '../runtime/kg/kg.module';
import { GraphReasoningEngine } from '../runtime/kg/graph-reasoning-engine.service';

@Module({
  imports: [KnowledgeGraphModule],
  controllers: [ReasoningController],
  providers: [GraphReasoningEngine],
  exports: [GraphReasoningEngine],
})
export class ReasoningModule {}
