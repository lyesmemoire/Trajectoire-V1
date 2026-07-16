import { randomUUID } from "crypto";

export interface Ticket {
  readonly id: string;
  readonly userId: string;
  readonly expiresAt: number;
}

export class TicketService {
  private readonly tickets = new Map<string, Ticket>();
  private readonly TTL_MS = 60 * 1000; // 60 seconds

  generateTicket(userId: string): string {
    const id = randomUUID();
    const expiresAt = Date.now() + this.TTL_MS;
    
    this.tickets.set(id, { id, userId, expiresAt });
    
    // Auto-cleanup
    setTimeout(() => {
      this.tickets.delete(id);
    }, this.TTL_MS).unref();

    return id;
  }

  validateAndConsumeTicket(ticketId: string): string | null {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) return null;

    if (Date.now() > ticket.expiresAt) {
      this.tickets.delete(ticketId);
      return null;
    }

    // Single-use ticket
    this.tickets.delete(ticketId);
    return ticket.userId;
  }
}
