/**
 * Graph Module
 * Handles GraphController with authentication
 */

import { Module } from '@nestjs/common';
import { GraphController } from './graph.controller';
import { KnowledgeGraphModule } from './kg.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [KnowledgeGraphModule, AuthModule],
  controllers: [GraphController],
})
export class GraphModule {}
