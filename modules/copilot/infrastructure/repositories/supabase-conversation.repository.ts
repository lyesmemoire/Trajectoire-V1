import { getServerDb } from "../../../../lib/db/client";
import { Result, ok, fail } from "../../../../lib/core/result";
import { InfrastructureError } from "../../../../lib/core/result/errors";
import { ConversationRepositoryPort } from "../../ports/repositories/conversation-repository.port";
import { Conversation } from "../../domain/entities/conversation.entity";

export class SupabaseConversationRepository implements ConversationRepositoryPort {
  async save(conversation: Conversation): Promise<void> {
    const supabase = await getServerDb();
    
    // Store conversation in Journey data field
    const { error } = await supabase
      .from("journeys")
      .upsert({
        id: conversation.id,
        user_id: conversation.userId,
        current_step: "conversation",
        status: "active",
        data: {
          conversation: conversation
        }
      })
      .eq("id", conversation.id);

    if (error) throw new InfrastructureError(error.message);
  }

  async findById(id: string): Promise<Conversation | null> {
    const supabase = await getServerDb();
    const { data, error } = await supabase
      .from("journeys")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new InfrastructureError(error.message);
    if (!data) return null;

    const journeyData = data.data as any;
    return journeyData.conversation || null;
  }

  async findByUserId(userId: string): Promise<Conversation[]> {
    const supabase = await getServerDb();
    const { data, error } = await supabase
      .from("journeys")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new InfrastructureError(error.message);
    if (!data) return [];

    const conversations: Conversation[] = [];
    
    for (const record of data) {
      const journeyData = record.data as any;
      if (journeyData.conversation) {
        conversations.push(journeyData.conversation);
      }
    }

    return conversations;
  }

  async delete(id: string): Promise<void> {
    const supabase = await getServerDb();
    const { error } = await supabase
      .from("journeys")
      .delete()
      .eq("id", id);

    if (error) throw new InfrastructureError(error.message);
  }

  async update(conversation: Conversation): Promise<void> {
    await this.save(conversation);
  }
}
