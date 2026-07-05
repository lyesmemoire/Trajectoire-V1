import { PlatformEvent } from "../../events/base.event";

export interface OutboxRepository {
  save(event: PlatformEvent): Promise<void>;
  fetchUnprocessed(limit: number): Promise<PlatformEvent[]>;
  markAsProcessed(eventId: string): Promise<void>;
  markAsFailed(eventId: string, error: string): Promise<void>;
  moveToDeadLetter(eventId: string, error: string): Promise<void>;
}
