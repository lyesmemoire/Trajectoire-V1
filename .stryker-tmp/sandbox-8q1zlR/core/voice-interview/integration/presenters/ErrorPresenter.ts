// @ts-nocheck
import type { ApplicationError } from "../../application/types.js";
import type { OutboundErrorMessage } from "../transport/WebSocketMessage.js";
import { mapResultToWsError, type MappedHttpError } from "../middleware/ErrorMappingMiddleware.js";
import { mapResultToHttpError } from "../middleware/ErrorMappingMiddleware.js";

export class ErrorPresenter {
  static toWebSocket(error: ApplicationError, correlationId: string): OutboundErrorMessage {
    const mapped = mapResultToWsError(error, correlationId);
    return {
      type: "ERROR",
      code: mapped.wsCode,
      message: mapped.message,
      correlationId
    };
  }

  static toHttp(error: ApplicationError): MappedHttpError {
    return mapResultToHttpError(error);
  }
}
