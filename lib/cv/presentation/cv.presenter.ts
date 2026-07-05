import { Presenter } from "@/lib/core/presentation/Presenter";
import { CVAggregate } from "../domain/aggregates/cv.aggregate";

export class CvPresenter implements Presenter<CVAggregate, any> {
  present(result: CVAggregate): any {
    return {
      id: result.id,
      userId: result.userId,
      title: result.originalText?.substring(0, 50) || "Sans titre",
      originalText: result.originalText,
      optimizedText: result.optimizedText,
      atsScore: result.props.atsScore,
      metadata: result.props.metadata,
      pdfUrl: result.props.pdfUrl,
      createdAt: result.props.createdAt,
      updatedAt: result.props.updatedAt,
    };
  }
}
