import { MatchingResponse, MatchingReport, KnowledgeGraph } from '@/types/recruiter.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class MatchingService {
  async calculateScore(candidateGraph: KnowledgeGraph, jobGraph: KnowledgeGraph): Promise<unknown> {
    const response = await fetch(
      `${API_BASE_URL}/matching/calculate-score`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateGraph, jobGraph })
      }
    );

    return response.json();
  }

  async explainMatch(candidateGraph: KnowledgeGraph, jobGraph: KnowledgeGraph): Promise<unknown> {
    const response = await fetch(
      `${API_BASE_URL}/matching/explain`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateGraph, jobGraph })
      }
    );

    return response.json();
  }

  async getReport(candidateGraph: KnowledgeGraph, jobGraph: KnowledgeGraph): Promise<MatchingReport> {
    const response = await fetch(
      `${API_BASE_URL}/matching/report`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateGraph, jobGraph })
      }
    );

    const result: MatchingResponse = await response.json();
    return result.data;
  }
}

export const matchingService = new MatchingService();
