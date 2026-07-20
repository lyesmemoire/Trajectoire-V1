/**
 * Message Domain Entity
 * Represents a message in an interview session
 * Contains business logic and validation
 */

import { AppError, ErrorCode } from "@/core/errors";

export type MessageRole = "user" | "assistant";

export interface MessageProps {
  id?: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  createdAt?: Date;
  version?: number;
}

export class Message {
  public readonly id: string;
  public readonly sessionId: string;
  public readonly role: MessageRole;
  public readonly content: string;
  public readonly createdAt: Date;
  public version: number;

  constructor(props: MessageProps) {
    this.validateProps(props);

    this.id = props.id || this.generateId();
    this.sessionId = props.sessionId;
    this.role = props.role;
    this.content = props.content;
    this.createdAt = props.createdAt || new Date();
    this.version = props.version || 1;
  }

  private validateProps(props: MessageProps): void {
    if (!props.sessionId) {
      throw new AppError("Session ID is required", ErrorCode.VALIDATION_ERROR, 400);
    }
    if (!["user", "assistant"].includes(props.role)) {
      throw new AppError("Invalid message role", ErrorCode.VALIDATION_ERROR, 400);
    }
    if (!props.content || props.content.trim().length === 0) {
      throw new AppError("Message content is required", ErrorCode.VALIDATION_ERROR, 400);
    }
    if (props.content.length > 5000) {
      throw new AppError("Message content too long (max 5000 characters)", ErrorCode.VALIDATION_ERROR, 400);
    }
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  /**
   * Check if message is from user
   */
  isFromUser(): boolean {
    return this.role === "user";
  }

  /**
   * Check if message is from assistant
   */
  isFromAssistant(): boolean {
    return this.role === "assistant";
  }

  /**
   * Convert to plain object for persistence
   */
  toPersistence(): any {
    return {
      id: this.id,
      session_id: this.sessionId,
      role: this.role,
      content: this.content,
      created_at: this.createdAt.toISOString(),
      version: this.version,
    };
  }

  /**
   * Create from persistence
   */
  static fromPersistence(data: any): Message {
    return new Message({
      id: data.id,
      sessionId: data.session_id,
      role: data.role,
      content: data.content,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      version: data.version || 1,
    });
  }
}
