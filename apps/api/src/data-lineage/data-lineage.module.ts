/**
 * Data Lineage Module
 * Module for data lineage tracking across all stages
 */

import { Module } from '@nestjs/common';
import { DataLineageService } from './data-lineage.service';
import { DataLineageRepository } from './data-lineage.repository';
import { DataLineageController } from './data-lineage.controller';

@Module({
  controllers: [DataLineageController],
  providers: [DataLineageService, DataLineageRepository],
  exports: [DataLineageService, DataLineageRepository],
})
export class DataLineageModule {}
