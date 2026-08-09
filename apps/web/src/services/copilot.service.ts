import { CopilotResponse } from '@/types/copilot.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class CopilotService {
  async processMessage(sessionId: string, message: string): Promise<CopilotResponse> {
    const response = await fetch(`${API_BASE_URL}/copilot/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId, message }),
    });

    if (!response.ok) {
      throw new Error('Failed to process message');
    }

    const result = await response.json();
    return result.data;
  }

  async getConversationHistory(sessionId: string) {
    const response = await fetch(`${API_BASE_URL}/copilot/history/${sessionId}`);

    if (!response.ok) {
      throw new Error('Failed to get conversation history');
    }

    const result = await response.json();
    return result.data;
  }

  async clearConversation(sessionId: string) {
    const response = await fetch(`${API_BASE_URL}/copilot/conversation/${sessionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to clear conversation');
    }

    return response.json();
  }

  async getAllSessions() {
    const response = await fetch(`${API_BASE_URL}/copilot/sessions`);

    if (!response.ok) {
      throw new Error('Failed to get sessions');
    }

    const result = await response.json();
    return result.data;
  }
}

export const copilotService = new CopilotService();
