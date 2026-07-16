/**
 * OptimizeQuestionOrderResponse DTO
 *
 * Response DTO for optimizing question order.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY data transfer object definition.
 */

export interface OptimizeQuestionOrderResponse {
  planId: string;
  optimizedQuestionIds: string[];
  strategy: string;
  optimizedAt: Date;
}
