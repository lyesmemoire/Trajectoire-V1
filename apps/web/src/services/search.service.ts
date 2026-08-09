import { RankedResult, RelatedSkills, CareerPath, SimilarityResult } from '@/types/search.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class SearchService {
  async searchCandidates(jobGraph: unknown, candidateGraphs: unknown[]): Promise<RankedResult[]> {
    const response = await fetch(
      `${API_BASE_URL}/search/candidates`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobGraph, candidateGraphs })
      }
    );

    const result = await response.json();
    return result.data;
  }

  async searchJobs(candidateGraph: unknown, jobGraphs: unknown[]): Promise<RankedResult[]> {
    const response = await fetch(
      `${API_BASE_URL}/search/jobs`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateGraph, jobGraphs })
      }
    );

    const result = await response.json();
    return result.data;
  }

  async findSimilarCandidates(targetGraph: unknown, candidateGraphs: unknown[]): Promise<SimilarityResult[]> {
    const response = await fetch(
      `${API_BASE_URL}/search/similar-candidates`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetGraph, candidateGraphs })
      }
    );

    const result = await response.json();
    return result.data;
  }

  async findSimilarJobs(targetGraph: unknown, jobGraphs: unknown[]): Promise<SimilarityResult[]> {
    const response = await fetch(
      `${API_BASE_URL}/search/similar-jobs`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetGraph, jobGraphs })
      }
    );

    const result = await response.json();
    return result.data;
  }

  async buildCareerPath(candidateGraph: unknown, jobGraphs: unknown[]): Promise<CareerPath> {
    const response = await fetch(
      `${API_BASE_URL}/search/career-path`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateGraph, jobGraphs })
      }
    );

    const result = await response.json();
    return result.data;
  }

  async recruiterSearch(query: string, graphs: unknown[], filters?: unknown, facets?: unknown, pagination?: unknown, ranking?: unknown, userId?: string): Promise<unknown> {
    const response = await fetch(
      `${API_BASE_URL}/search/recruiter`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, graphs, filters, facets, pagination, ranking, userId })
      }
    );

    const result = await response.json();
    return result.data;
  }
}

export const searchService = new SearchService();
