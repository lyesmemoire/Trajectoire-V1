// @ts-nocheck
export type PromptRole = "system" | "user" | "assistant";

export interface PromptMessage {
  role: PromptRole;
  content: string;
}

export class Prompt {
  private constructor(public readonly messages: PromptMessage[]) {}

  public static create(messages: PromptMessage[]): Prompt {
    if (messages.length === 0) {
      throw new Error("Prompt must contain at least one message");
    }
    return new Prompt(messages);
  }

  public static single(content: string, role: PromptRole = "user"): Prompt {
    return Prompt.create([{ role, content }]);
  }
  
  public addMessage(message: PromptMessage): Prompt {
    return new Prompt([...this.messages, message]);
  }
}
