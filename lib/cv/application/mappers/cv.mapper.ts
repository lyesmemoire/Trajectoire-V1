import { CvEntity, AtsAnalysisEntity } from "../../domain/entities/cv.entity";
import { CvDTO, AtsAnalysisDTO } from "../dto/cv.dto";

export const CvMapper = {
  toDTO(entity: CvEntity): CvDTO {
    return {
      id: entity.id,
      title: entity.title,
      originalText: entity.originalText,
      optimizedText: entity.optimizedText,
      pdfUrl: entity.pdfUrl,
      createdAt: entity.createdAt.toISOString(),
    };
  },
};

export const AtsAnalysisMapper = {
  toDTO(entity: AtsAnalysisEntity): AtsAnalysisDTO {
    return {
      cvId: entity.cvId,
      scoreBefore: entity.scoreBefore,
      scoreAfter: entity.scoreAfter,
      matchedKeywords: entity.matchedKeywords,
      missingKeywords: entity.missingKeywords,
      strengths: entity.strengths,
      weaknesses: entity.weaknesses,
      recommendations: entity.recommendations,
    };
  },
};
