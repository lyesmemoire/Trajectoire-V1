import { BaseDomainEvent } from "../../../../lib/core/events/domain/BaseDomainEvent";

export interface ConversationStartedData {
  conversationId: string;
  userId: string;
  title: string;
  timestamp: Date;
}

export class ConversationStarted extends BaseDomainEvent<ConversationStartedData> {
  public readonly type = "ConversationStarted";
  public readonly aggregateId: string;
  public readonly payload: Readonly<ConversationStartedData>;

  constructor(data: ConversationStartedData) {
    super();
    this.aggregateId = data.conversationId;
    this.payload = Object.freeze(data);
  }
}
