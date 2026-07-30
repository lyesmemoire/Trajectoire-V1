/**
 * World Model Engine
 * Complete representation of the professional world
 */

import {
  Skill,
  Job,
  Company,
  Industry,
  Certification,
  KnowledgeGraph,
  WorldModelQuery,
  WorldModelResult,
  WorldModelConfig,
  defaultWorldModelConfig,
} from "./interfaces/IWorldModelEngine";

// ============================================================================
// WORLD MODEL ENGINE CLASS
// ============================================================================

export class WorldModelEngine {
  private static instance: WorldModelEngine;
  private config: WorldModelConfig;
  private knowledgeGraph: KnowledgeGraph;
  private cache: Map<string, { data: any; timestamp: Date }> = new Map();

  private constructor() {
    this.config = defaultWorldModelConfig;
    this.knowledgeGraph = this.initializeKnowledgeGraph();
  }

  static getInstance(): WorldModelEngine {
    if (!WorldModelEngine.instance) {
      WorldModelEngine.instance = new WorldModelEngine();
    }
    return WorldModelEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<WorldModelConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Initialize knowledge graph
   */
  private initializeKnowledgeGraph(): KnowledgeGraph {
    return {
      nodes: {
        skills: new Map(),
        jobs: new Map(),
        companies: new Map(),
        industries: new Map(),
        certifications: new Map(),
      },
      edges: {
        skillToSkill: new Map(),
        skillToJob: new Map(),
        jobToCompany: new Map(),
        companyToIndustry: new Map(),
        skillToCertification: new Map(),
      },
      lastUpdated: new Date(),
    };
  }

  /**
   * Query world model
   */
  async query(query: WorldModelQuery): Promise<WorldModelResult<any>> {
    const cacheKey = this.generateCacheKey(query);
    
    if (this.config.enableCaching) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        const age = (Date.now() - cached.timestamp.getTime()) / (1000 * 60);
        if (age < this.config.cacheDuration) {
          return {
            success: true,
            data: cached.data,
            confidence: 0.9,
            sources: ["cache"],
            reasoning: "Retrieved from cache",
            timestamp: new Date(),
          };
        }
      }
    }

    let result: WorldModelResult<any>;

    switch (query.type) {
      case "skill":
        result = await this.querySkill(query);
        break;
      case "job":
        result = await this.queryJob(query);
        break;
      case "company":
        result = await this.queryCompany(query);
        break;
      case "industry":
        result = await this.queryIndustry(query);
        break;
      case "certification":
        result = await this.queryCertification(query);
        break;
      case "relation":
        result = await this.queryRelation(query);
        break;
      case "pathway":
        result = await this.queryPathway(query);
        break;
      default:
        result = {
          success: false,
          data: null,
          confidence: 0,
          sources: [],
          reasoning: "Unknown query type",
          timestamp: new Date(),
        };
    }

    if (this.config.enableCaching && result.success) {
      this.cache.set(cacheKey, { data: result.data, timestamp: new Date() });
    }

    return result;
  }

  /**
   * Query skill
   */
  private async querySkill(query: WorldModelQuery): Promise<WorldModelResult<Skill | Skill[]>> {
    const skillId = query.params.id as string;
    const skillName = query.params.name as string;

    if (skillId) {
      const skill = this.knowledgeGraph.nodes.skills.get(skillId);
      if (skill) {
        return {
          success: true,
          data: skill,
          confidence: 1,
          sources: ["knowledge_graph"],
          reasoning: "Skill found by ID",
          timestamp: new Date(),
        };
      }
    }

    if (skillName) {
      const skill = Array.from(this.knowledgeGraph.nodes.skills.values()).find(s => s.name === skillName);
      if (skill) {
        return {
          success: true,
          data: skill,
          confidence: 0.9,
          sources: ["knowledge_graph"],
          reasoning: "Skill found by name",
          timestamp: new Date(),
        };
      }
    }

    // Return all skills if no specific query
    return {
      success: true,
      data: Array.from(this.knowledgeGraph.nodes.skills.values()),
      confidence: 0.8,
      sources: ["knowledge_graph"],
      reasoning: "Returning all skills",
      timestamp: new Date(),
    };
  }

  /**
   * Query job
   */
  private async queryJob(query: WorldModelQuery): Promise<WorldModelResult<any | any[]>> {
    const jobId = query.params.id as string;
    const jobTitle = query.params.title as string;

    if (jobId) {
      const job = this.knowledgeGraph.nodes.jobs.get(jobId);
      if (job) {
        return {
          success: true,
          data: job,
          confidence: 1,
          sources: ["knowledge_graph"],
          reasoning: "any found by ID",
          timestamp: new Date(),
        };
      }
    }

    if (jobTitle) {
      const job = Array.from(this.knowledgeGraph.nodes.jobs.values()).find(j => j.title === jobTitle);
      if (job) {
        return {
          success: true,
          data: job,
          confidence: 0.9,
          sources: ["knowledge_graph"],
          reasoning: "any found by title",
          timestamp: new Date(),
        };
      }
    }

    return {
      success: true,
      data: Array.from(this.knowledgeGraph.nodes.jobs.values()),
      confidence: 0.8,
      sources: ["knowledge_graph"],
      reasoning: "Returning all jobs",
      timestamp: new Date(),
    };
  }

  /**
   * Query company
   */
  private async queryCompany(query: WorldModelQuery): Promise<WorldModelResult<Company | Company[]>> {
    const companyId = query.params.id as string;
    const companyName = query.params.name as string;

    if (companyId) {
      const company = this.knowledgeGraph.nodes.companies.get(companyId);
      if (company) {
        return {
          success: true,
          data: company,
          confidence: 1,
          sources: ["knowledge_graph"],
          reasoning: "Company found by ID",
          timestamp: new Date(),
        };
      }
    }

    if (companyName) {
      const company = Array.from(this.knowledgeGraph.nodes.companies.values()).find(c => c.name === companyName);
      if (company) {
        return {
          success: true,
          data: company,
          confidence: 0.9,
          sources: ["knowledge_graph"],
          reasoning: "Company found by name",
          timestamp: new Date(),
        };
      }
    }

    return {
      success: true,
      data: Array.from(this.knowledgeGraph.nodes.companies.values()),
      confidence: 0.8,
      sources: ["knowledge_graph"],
      reasoning: "Returning all companies",
      timestamp: new Date(),
    };
  }

  /**
   * Query industry
   */
  private async queryIndustry(query: WorldModelQuery): Promise<WorldModelResult<Industry | Industry[]>> {
    const industryId = query.params.id as string;
    const industryName = query.params.name as string;

    if (industryId) {
      const industry = this.knowledgeGraph.nodes.industries.get(industryId);
      if (industry) {
        return {
          success: true,
          data: industry,
          confidence: 1,
          sources: ["knowledge_graph"],
          reasoning: "Industry found by ID",
          timestamp: new Date(),
        };
      }
    }

    if (industryName) {
      const industry = Array.from(this.knowledgeGraph.nodes.industries.values()).find(i => i.name === industryName);
      if (industry) {
        return {
          success: true,
          data: industry,
          confidence: 0.9,
          sources: ["knowledge_graph"],
          reasoning: "Industry found by name",
          timestamp: new Date(),
        };
      }
    }

    return {
      success: true,
      data: Array.from(this.knowledgeGraph.nodes.industries.values()),
      confidence: 0.8,
      sources: ["knowledge_graph"],
      reasoning: "Returning all industries",
      timestamp: new Date(),
    };
  }

  /**
   * Query certification
   */
  private async queryCertification(query: WorldModelQuery): Promise<WorldModelResult<Certification | Certification[]>> {
    const certificationId = query.params.id as string;
    const certificationName = query.params.name as string;

    if (certificationId) {
      const certification = this.knowledgeGraph.nodes.certifications.get(certificationId);
      if (certification) {
        return {
          success: true,
          data: certification,
          confidence: 1,
          sources: ["knowledge_graph"],
          reasoning: "Certification found by ID",
          timestamp: new Date(),
        };
      }
    }

    if (certificationName) {
      const certification = Array.from(this.knowledgeGraph.nodes.certifications.values()).find(c => c.name === certificationName);
      if (certification) {
        return {
          success: true,
          data: certification,
          confidence: 0.9,
          sources: ["knowledge_graph"],
          reasoning: "Certification found by name",
          timestamp: new Date(),
        };
      }
    }

    return {
      success: true,
      data: Array.from(this.knowledgeGraph.nodes.certifications.values()),
      confidence: 0.8,
      sources: ["knowledge_graph"],
      reasoning: "Returning all certifications",
      timestamp: new Date(),
    };
  }

  /**
   * Query relation
   */
  private async queryRelation(query: WorldModelQuery): Promise<WorldModelResult<any>> {
    const fromType = query.params.fromType as string;
    const fromId = query.params.fromId as string;
    const relationType = query.params.relationType as string;

    let relations: any;

    switch (relationType) {
      case "skillToSkill":
        relations = this.knowledgeGraph.edges.skillToSkill.get(fromId) || [];
        break;
      case "skillToJob":
        relations = this.knowledgeGraph.edges.skillToJob.get(fromId) || [];
        break;
      case "jobToCompany":
        relations = this.knowledgeGraph.edges.jobToCompany.get(fromId) || [];
        break;
      case "companyToIndustry":
        relations = this.knowledgeGraph.edges.companyToIndustry.get(fromId) || [];
        break;
      case "skillToCertification":
        relations = this.knowledgeGraph.edges.skillToCertification.get(fromId) || [];
        break;
      default:
        relations = [];
    }

    return {
      success: true,
      data: relations,
      confidence: 0.85,
      sources: ["knowledge_graph"],
      reasoning: `Retrieved ${relationType} relations for ${fromType}:${fromId}`,
      timestamp: new Date(),
    };
  }

  /**
   * Query pathway
   */
  private async queryPathway(query: WorldModelQuery): Promise<WorldModelResult<any>> {
    const fromSkillId = query.params.fromSkillId as string;
    const toJobId = query.params.toJobId as string;

    const pathway = this.calculatePathway(fromSkillId, toJobId);

    return {
      success: true,
      data: pathway,
      confidence: 0.75,
      sources: ["knowledge_graph", "algorithm"],
      reasoning: "Calculated career pathway using skill-job relationships",
      timestamp: new Date(),
    };
  }

  /**
   * Calculate pathway
   */
  private calculatePathway(fromSkillId: string, toJobId: string): any {
    // Simplified pathway calculation
    const fromSkill = this.knowledgeGraph.nodes.skills.get(fromSkillId);
    const toJob = this.knowledgeGraph.nodes.jobs.get(toJobId);

    if (!fromSkill || !toJob) {
      return { error: "Invalid skill or job ID" };
    }

    const missingSkills = toJob.requiredSkills.filter((skillId: any) => skillId !== fromSkillId);
    const relatedSkills = this.knowledgeGraph.edges.skillToSkill.get(fromSkillId) || [];

    return {
      from: fromSkill.name,
      to: toJob.title,
      missingSkills,
      relatedSkills,
      estimatedTime: missingSkills.length * 3, // months
      difficulty: this.calculatePathwayDifficulty(missingSkills.length),
    };
  }

  /**
   * Calculate pathway difficulty
   */
  private calculatePathwayDifficulty(missingSkillsCount: number): "easy" | "medium" | "hard" {
    if (missingSkillsCount <= 2) return "easy";
    if (missingSkillsCount <= 5) return "medium";
    return "hard";
  }

  /**
   * Add skill
   */
  addSkill(skill: Skill): void {
    this.knowledgeGraph.nodes.skills.set(skill.id, skill);
    this.knowledgeGraph.lastUpdated = new Date();
  }

  /**
   * Add job
   */
  addJob(job: any): void {
    this.knowledgeGraph.nodes.jobs.set(job.id, job);
    this.knowledgeGraph.lastUpdated = new Date();
  }

  /**
   * Add company
   */
  addCompany(company: Company): void {
    this.knowledgeGraph.nodes.companies.set(company.id, company);
    this.knowledgeGraph.lastUpdated = new Date();
  }

  /**
   * Add industry
   */
  addIndustry(industry: Industry): void {
    this.knowledgeGraph.nodes.industries.set(industry.id, industry);
    this.knowledgeGraph.lastUpdated = new Date();
  }

  /**
   * Add certification
   */
  addCertification(certification: Certification): void {
    this.knowledgeGraph.nodes.certifications.set(certification.id, certification);
    this.knowledgeGraph.lastUpdated = new Date();
  }

  /**
   * Add relation
   */
  addRelation(fromId: string, toId: string, relationType: string): void {
    switch (relationType) {
      case "skillToSkill":
        {
          const skillRelations = this.knowledgeGraph.edges.skillToSkill.get(fromId) || [];
          if (!skillRelations.includes(toId)) {
            skillRelations.push(toId);
            this.knowledgeGraph.edges.skillToSkill.set(fromId, skillRelations);
          }
        }
        break;
      case "skillToJob":
        {
          const skillJobs = this.knowledgeGraph.edges.skillToJob.get(fromId) || [];
          if (!skillJobs.includes(toId)) {
            skillJobs.push(toId);
            this.knowledgeGraph.edges.skillToJob.set(fromId, skillJobs);
          }
        }
        break;
      case "jobToCompany":
        {
          const jobCompanies = this.knowledgeGraph.edges.jobToCompany.get(fromId) || [];
          if (!jobCompanies.includes(toId)) {
            jobCompanies.push(toId);
            this.knowledgeGraph.edges.jobToCompany.set(fromId, jobCompanies);
          }
        }
        break;
      case "companyToIndustry":
        {
          const companyIndustries = this.knowledgeGraph.edges.companyToIndustry.get(fromId) || [];
          if (!companyIndustries.includes(toId)) {
            companyIndustries.push(toId);
            this.knowledgeGraph.edges.companyToIndustry.set(fromId, companyIndustries);
          }
        }
        break;
      case "skillToCertification":
        {
          const skillCerts = this.knowledgeGraph.edges.skillToCertification.get(fromId) || [];
          if (!skillCerts.includes(toId)) {
            skillCerts.push(toId);
            this.knowledgeGraph.edges.skillToCertification.set(fromId, skillCerts);
          }
        }
        break;
    }
    this.knowledgeGraph.lastUpdated = new Date();
  }

  /**
   * Get knowledge graph
   */
  getKnowledgeGraph(): KnowledgeGraph {
    return this.knowledgeGraph;
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(query: WorldModelQuery): string {
    return `${query.type}_${JSON.stringify(query.params)}`;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalSkills: number;
    totalJobs: number;
    totalCompanies: number;
    totalIndustries: number;
    totalCertifications: number;
    totalEdges: number;
    lastUpdated: Date;
  } {
    return {
      totalSkills: this.knowledgeGraph.nodes.skills.size,
      totalJobs: this.knowledgeGraph.nodes.jobs.size,
      totalCompanies: this.knowledgeGraph.nodes.companies.size,
      totalIndustries: this.knowledgeGraph.nodes.industries.size,
      totalCertifications: this.knowledgeGraph.nodes.certifications.size,
      totalEdges: Object.values(this.knowledgeGraph.edges).reduce((sum, edges) => sum + edges.size, 0),
      lastUpdated: this.knowledgeGraph.lastUpdated,
    };
  }
}

export const worldModelEngine = WorldModelEngine.getInstance();
