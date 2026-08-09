import { Injectable } from '@nestjs/common';

export interface Intent {
  type:
    | 'search_candidates'
    | 'search_jobs'
    | 'compare'
    | 'explain_score'
    | 'propose_training'
    | 'propose_evolution'
    | 'generate_profile'
    | 'unknown';
  entities: {
    skills?: string[];
    seniority?: string;
    jobTitle?: string;
    candidateId?: string;
    jobId?: string;
    constraint?: string;
    condition?: string;
  };
  confidence: number;
}

@Injectable()
export class PromptInterpreterService {
  interpret(prompt: string): Intent {
    const lowerPrompt = prompt.toLowerCase();

    // Search candidates
    if (
      this.matchesPattern(lowerPrompt, [
        'trouve',
        'cherche',
        'recherche',
        'candidat',
        'profil',
      ])
    ) {
      const entities: any = {};
      const skills = this.extractSkills(lowerPrompt);
      if (skills.length > 0) entities.skills = skills;

      const seniority = this.extractSeniority(lowerPrompt);
      if (seniority) entities.seniority = seniority;

      const jobTitle = this.extractJobTitle(lowerPrompt);
      if (jobTitle) entities.jobTitle = jobTitle;

      return {
        type: 'search_candidates',
        entities,
        confidence: 0.9,
      };
    }

    // Search jobs
    if (
      this.matchesPattern(lowerPrompt, [
        'trouve',
        'cherche',
        'recherche',
        'poste',
        'job',
        'métier',
      ])
    ) {
      const entities: any = {};
      const skills = this.extractSkills(lowerPrompt);
      if (skills.length > 0) entities.skills = skills;

      const seniority = this.extractSeniority(lowerPrompt);
      if (seniority) entities.seniority = seniority;

      return {
        type: 'search_jobs',
        entities,
        confidence: 0.9,
      };
    }

    // Compare
    if (
      this.matchesPattern(lowerPrompt, [
        'compare',
        'différence',
        'versus',
        'contre',
      ])
    ) {
      return {
        type: 'compare',
        entities: {},
        confidence: 0.85,
      };
    }

    // Explain score
    if (
      this.matchesPattern(lowerPrompt, [
        'pourquoi',
        'explique',
        'score',
        'pourcentage',
        '%',
      ])
    ) {
      const entities: any = {};
      const candidateId = this.extractCandidateId(lowerPrompt);
      if (candidateId) entities.candidateId = candidateId;

      return {
        type: 'explain_score',
        entities,
        confidence: 0.95,
      };
    }

    // Propose training
    if (
      this.matchesPattern(lowerPrompt, [
        'formation',
        'apprendre',
        'monter en compétence',
        'training',
      ])
    ) {
      const entities: any = {};
      const candidateId = this.extractCandidateId(lowerPrompt);
      if (candidateId) entities.candidateId = candidateId;

      return {
        type: 'propose_training',
        entities,
        confidence: 0.9,
      };
    }

    // Propose evolution
    if (
      this.matchesPattern(lowerPrompt, [
        'évolution',
        'carrière',
        'avenir',
        'progresser',
        'devient',
      ])
    ) {
      const entities: any = {};
      const candidateId = this.extractCandidateId(lowerPrompt);
      if (candidateId) entities.candidateId = candidateId;

      const jobTitle = this.extractJobTitle(lowerPrompt);
      if (jobTitle) entities.jobTitle = jobTitle;

      return {
        type: 'propose_evolution',
        entities,
        confidence: 0.9,
      };
    }

    // Constraint/condition modification
    if (
      this.matchesPattern(lowerPrompt, [
        'si',
        'retire',
        'enlève',
        'ajoute',
        'assouplis',
        'relaxe',
      ])
    ) {
      const entities: any = {};
      const skills = this.extractSkills(lowerPrompt);
      if (skills.length > 0) entities.skills = skills;

      const constraint = this.extractConstraint(lowerPrompt);
      if (constraint) entities.constraint = constraint;

      const condition = this.extractCondition(lowerPrompt);
      if (condition) entities.condition = condition;

      return {
        type: 'search_candidates',
        entities,
        confidence: 0.85,
      };
    }

    // Default
    return {
      type: 'unknown',
      entities: {},
      confidence: 0.5,
    };
  }

  private matchesPattern(prompt: string, keywords: string[]): boolean {
    return keywords.some((keyword) => prompt.includes(keyword));
  }

  private extractSkills(prompt: string): string[] {
    const skillKeywords = [
      'javascript',
      'python',
      'java',
      'react',
      'angular',
      'vue',
      'node.js',
      'docker',
      'kubernetes',
      'aws',
      'azure',
      'gcp',
      'sql',
      'nosql',
      'mongodb',
      'postgresql',
      'git',
      'agile',
      'scrum',
      'devops',
      'ci/cd',
      'typescript',
      'spring',
      'django',
      'flask',
      'spark',
      'kafka',
      'data engineer',
      'data scientist',
      'machine learning',
      'ai',
      'cloud',
      'architecte',
      'senior',
      'junior',
    ];

    const foundSkills = skillKeywords.filter((skill) => prompt.includes(skill));
    return [...new Set(foundSkills)];
  }

  private extractSeniority(prompt: string): string | undefined {
    if (prompt.includes('senior') || prompt.includes('expert')) return 'senior';
    if (prompt.includes('junior') || prompt.includes('débutant'))
      return 'junior';
    if (prompt.includes('lead') || prompt.includes('principal')) return 'lead';
    return undefined;
  }

  private extractJobTitle(prompt: string): string | undefined {
    const jobTitles = [
      'data engineer',
      'data scientist',
      'devops',
      'architecte cloud',
      'développeur',
      'ingénieur logiciel',
      'full stack',
      'backend',
      'frontend',
      'architecte logiciel',
    ];

    for (const title of jobTitles) {
      if (prompt.includes(title)) {
        return title;
      }
    }
    return undefined;
  }

  private extractCandidateId(prompt: string): string | undefined {
    const match = prompt.match(/(?:candidat|profil)\s*[:\s]*([a-zA-Z0-9_-]+)/i);
    return match ? match[1] : undefined;
  }

  private extractConstraint(prompt: string): string | undefined {
    if (prompt.includes('retire') || prompt.includes('enlève')) {
      const match = prompt.match(/(?:retire|enlève)\s+([a-zA-Z0-9_-]+)/i);
      return match ? match[1] : undefined;
    }
    return undefined;
  }

  private extractCondition(prompt: string): string | undefined {
    if (
      prompt.includes('si') ||
      prompt.includes('assouplis') ||
      prompt.includes('relaxe')
    ) {
      const match = prompt.match(/(?:si|assouplis|relaxe)\s+([a-zA-Z0-9_-]+)/i);
      return match ? match[1] : undefined;
    }
    return undefined;
  }
}
