import { Conversation } from "../../domain/entities/conversation.entity";

export interface ConversationRepositoryPort {
  save(conversation: Conversation): Promise<void>;
  findById(id: string): Promise<Conversation | null>;
  findByUserId(userId: string): Promise<Conversation[]>;
  delete(id: string): Promise<void>;
  update(conversation: Conversation): Promise<void>;
}
