import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { NormalizationService } from './normalization.service';
import { CvExtractorService } from './cv-extractor.service';
import { GraphPersistenceService } from './graph-persistence.service';
import { CandidateProfileRepository } from './candidate-profile.repository';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { KnowledgeGraphModule } from '../runtime/kg/kg.module';

@Module({
  imports: [
    KnowledgeGraphModule,
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'cv'),
        filename: (req: any, file: any, cb: any) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `cv-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error('Invalid file type. Only PDF and DOCX are allowed.'),
            false,
          );
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  ],
  controllers: [CvController],
  providers: [
    CvService,
    NormalizationService,
    CvExtractorService,
    GraphPersistenceService,
    CandidateProfileRepository,
  ],
  exports: [
    CvService,
    NormalizationService,
    CvExtractorService,
    GraphPersistenceService,
    CandidateProfileRepository,
  ],
})
export class CvModule {}
