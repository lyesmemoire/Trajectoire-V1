/**
 * Authenticates with the backend to obtain an ephemeral ticket.
 * POST /voice/session → { ticket: string }
 */

import type { TicketResponse } from "../types/protocol.js";
import { ConnectionError } from "../errors/ConnectionError.js";

export class TicketAuthenticator {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(baseUrl: string, timeoutMs: number = 10_000) {
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
  }

  async requestTicket(authToken: string): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}/voice/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw ConnectionError.ticketFailed(`HTTP ${response.status}: ${response.statusText}`);
      }

      const body = (await response.json()) as TicketResponse;

      if (!body.ticket || typeof body.ticket !== "string") {
        throw ConnectionError.ticketFailed("Invalid ticket response body");
      }

      return body.ticket;
    } catch (error: unknown) {
      if (error instanceof ConnectionError) {
        throw error;
      }
      if (error instanceof DOMException && error.name === "AbortError") {
        throw ConnectionError.timeout(this.timeoutMs);
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      throw ConnectionError.ticketFailed(message);
    } finally {
      clearTimeout(timer);
    }
  }
}
