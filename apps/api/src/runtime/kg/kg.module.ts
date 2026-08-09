/**
 * Knowledge Graph RH Runtime v2
 * Knowledge Graph Module
 * Exports all KG services and types
 */

import { Module } from '@nestjs/common';
import { KnowledgeGraphService } from './kg.service';
import { EntityNormalizerService } from './entity-normalizer.service';
import { NodeBuilderService } from './node-builder.service';
import { EdgeBuilderService } from './edge-builder.service';
import { GraphValidatorService } from './graph-validator.service';
import { GraphSerializerService } from './graph-serializer.service';
import { GraphQueryService } from './graph-query.service';
import { GraphTraversalService } from './graph-traversal.service';
import { GraphStatisticsService } from './graph-statistics.service';
import { GraphRepository } from './graph-repository.service';
import { GraphQueryEngine } from './graph-query-engine.service';
import { GraphAnalyticsService } from './graph-analytics.service';
import { GraphReasoningEngine } from './graph-reasoning-engine.service';
import { PrismaService } from './prisma.service';
import { RollbackService } from '../../resilience/rollback.service';

@Module({
  providers: [
    PrismaService,
    RollbackService,
    GraphRepository,
    EntityNormalizerService,
    NodeBuilderService,
    EdgeBuilderService,
    GraphValidatorService,
    GraphSerializerService,
    GraphQueryService,
    GraphTraversalService,
    GraphStatisticsService,
    GraphQueryEngine,
    GraphAnalyticsService,
    GraphReasoningEngine,
    {
      provide: KnowledgeGraphService,
      useFactory: (
        nodeBuilder: NodeBuilderService,
        edgeBuilder: EdgeBuilderService,
        graphValidator: GraphValidatorService,
        graphSerializer: GraphSerializerService,
        graphQuery: GraphQueryService,
        graphTraversal: GraphTraversalService,
        graphStatistics: GraphStatisticsService,
      ) =>
        new KnowledgeGraphService(
          nodeBuilder,
          edgeBuilder,
          graphValidator,
          graphSerializer,
          graphQuery,
          graphTraversal,
          graphStatistics,
        ),
      inject: [
        NodeBuilderService,
        EdgeBuilderService,
        GraphValidatorService,
        GraphSerializerService,
        GraphQueryService,
        GraphTraversalService,
        GraphStatisticsService,
      ],
    },
  ],
  exports: [
    KnowledgeGraphService,
    PrismaService,
    GraphRepository,
    EntityNormalizerService,
    NodeBuilderService,
    EdgeBuilderService,
    GraphValidatorService,
    GraphSerializerService,
    GraphQueryService,
    GraphTraversalService,
    GraphStatisticsService,
    GraphQueryEngine,
    GraphAnalyticsService,
    GraphReasoningEngine,
  ],
})
export class KnowledgeGraphModule {}

// Re-export types for convenience
export * from './graph-types';
