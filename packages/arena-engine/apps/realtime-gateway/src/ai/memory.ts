export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export class SessionMemory {
  private history: Message[] = [];

  constructor(private systemPrompt: string) {
    this.history.push({ role: "system", content: systemPrompt });
  }

  addUser(content: string) {
    this.history.push({ role: "user", content });
    this.trim();
  }

  addAssistant(content: string) {
    this.history.push({ role: "assistant", content });
    this.trim();
  }

  getMessages(): Message[] {
    return [...this.history];
  }

  private trim() {
    // Keep the most recent 12 messages (including system).
    if (this.history.length > 12) {
      this.history = this.history.slice(-12);
    }
  }
}
