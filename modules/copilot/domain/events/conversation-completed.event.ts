import { BaseDomainEvent } from "../../../../lib/core/events/domain/BaseDomainEvent";

export interface ConversationCompletedData {
  conversationId: string;
  userId: string;
  messageCount: number;
  duration: number;
  timestamp: Date;
}

export class ConversationCompleted extends BaseDomainEvent<ConversationCompletedData> {
  public readonly type = "ConversationCompleted";
  public readonly aggregateId: string;
  public readonly payload: Readonly<ConversationCompletedData>;

  constructor(data: ConversationCompletedData) {
    super();
    this.aggregateId = data.conversationId;
    this.payload = Object.freeze(data);
  }
}
