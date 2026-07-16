// @ts-nocheck
import { SILEvent } from "./sil-events";

export interface EventQueryService {
  getSessionEvents(
    tenantId: string,
    sessionId: string
  ): Promise<SILEvent[]>;

  getEventRange(
    tenantId: string,
    sessionId: string,
    from: number,
    to: number
  ): Promise<SILEvent[]>;

  getLastEvent(
    tenantId: string,
    sessionId: string
  ): Promise<SILEvent | null>;
}
