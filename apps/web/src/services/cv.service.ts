import { UploadResponse, CandidateProfile } from '@/types/recruiter.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class CvService {
  async uploadCv(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/cv/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload CV');
    }

    return response.json();
  }

  async extractKnowledge(text: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/cv/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to extract knowledge');
    }

    return response.json();
  }

  async normalizeKnowledge(knowledge: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/cv/normalize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ knowledge }),
    });

    if (!response.ok) {
      throw new Error('Failed to normalize knowledge');
    }

    return response.json();
  }

  async buildGraph(normalizedKnowledge: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/cv/build-graph`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ normalizedKnowledge }),
    });

    if (!response.ok) {
      throw new Error('Failed to build graph');
    }

    return response.json();
  }

  async generateProfile(graph: any): Promise<CandidateProfile> {
    const response = await fetch(`${API_BASE_URL}/cv/generate-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ graph }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate profile');
    }

    const result = await response.json();
    return result.data;
  }
}

export const cvService = new CvService();
