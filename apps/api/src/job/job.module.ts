import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { JobNormalizationService } from './job-normalization.service';
import { JobExtractorService } from './job-extractor.service';
import { GraphPersistenceService } from '../cv/graph-persistence.service';
import { NodeBuilderService } from '../runtime/kg/node-builder.service';
import { EdgeBuilderService } from '../runtime/kg/edge-builder.service';
import { GraphSearchService } from '../runtime/kg/graph-search.service';
import { GraphMatchingService } from '../runtime/kg/graph-matching.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { CvModule } from '../cv/cv.module';
import { KnowledgeGraphModule } from '../runtime/kg/kg.module';

@Module({
  imports: [
    CvModule,
    KnowledgeGraphModule,
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'job'),
        filename: (req: any, file: any, cb: any) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `job-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req: any, file: any, cb: any) => {
        const allowedMimes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
          'text/plain',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error(
              'Invalid file type. Only PDF, DOCX, and TXT are allowed.',
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  ],
  controllers: [JobController],
  providers: [
    JobService,
    JobNormalizationService,
    JobExtractorService,
    GraphPersistenceService,
    NodeBuilderService,
    EdgeBuilderService,
    GraphSearchService,
    GraphMatchingService,
  ],
  exports: [JobService, JobNormalizationService, JobExtractorService],
})
export class JobModule {}
