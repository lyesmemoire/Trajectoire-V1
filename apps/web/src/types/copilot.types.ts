export interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
  reasoning?: string[];
}

export interface CopilotResponse {
  message: string;
  reasoning: string[];
  sources: string[];
  confidence: number;
  data: unknown;
  suggestedQuestions: string[];
}
