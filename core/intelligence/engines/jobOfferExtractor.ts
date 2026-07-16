/**
 * Job Offer Extractor Engine
 * 
 * Responsibility: Extract structured job offer data from job description text
 * 
 * This engine transforms raw job offer text into structured data for JobOfferGraph,
 * including general information, missions, responsibilities, hard skills, soft skills,
 * technologies, seniority, expected level, domain, prioritization, implicit criteria,
 * ATS keywords, difficulty, and company culture.
 * All extracted data includes explainability (source, proof, confidence, explanation).
 * 
 * Constraints:
 * - Deterministic: Same input always produces same output
 * - No new architectural components
 * - Reuses existing structures
 * - All data includes explainability
 * - NO matching, NO recommendations, NO interview preparation
 * - Answers only: "What exactly does this company seek?"
 */

export interface JobOfferExtractionInput {
  jobOfferText: string;
  jobOfferId: string;
  userId: string;
}

export interface Explainability {
  source: string;           // Where the data comes from (e.g., "Job description, line 15")
  proof: string;            // Direct quote or reference from job offer
  confidence: number;      // 0-100 confidence score
  explanation: string;     // Why this extraction was made
}

// 1. General Information
export interface GeneralInfo {
  title?: string;
  company?: string;
  sector?: string;
  location?: string;
  contractType?: string;
  remoteWork?: string;
  salary?: string;
  hierarchyLevel?: string;
  explainability: Explainability;
}

// 2. Missions
export interface Mission {
  description: string;
  importance: "critical" | "high" | "medium" | "low";
  estimatedFrequency?: string;
  context?: string;
  explainability: Explainability;
}

// 3. Responsibilities
export interface Responsibility {
  type: "operational" | "technical" | "functional" | "managerial";
  description: string;
  explainability: Explainability;
}

// 4. Hard Skills
export interface HardSkill {
  category: "languages" | "frameworks" | "databases" | "cloud" | "devops" | "cybersecurity" | "architecture" | "tools" | "methodologies";
  name: string;
  level?: string;
  explainability: Explainability;
}

// 5. Soft Skills (only if explicitly present)
export interface SoftSkill {
  name: string;
  explainability: Explainability;
}

// 6. Technologies (normalized list)
export interface Technology {
  name: string;
  explainability: Explainability;
}

// 7. Seniority
export interface Seniority {
  level: "Junior" | "Intermediate" | "Senior" | "Lead" | "Principal" | "Architect";
  explainability: Explainability;
}

// 8. Expected Level
export interface ExpectedLevel {
  yearsOfExperience?: string;
  degree?: string;
  certifications?: string[];
  languages?: string[];
  explainability: Explainability;
}

// 9. Domain
export interface Domain {
  name: string;
  explainability: Explainability;
}

// 10. Prioritization
export interface Requirement {
  description: string;
  priority: "essential" | "strongly_desired" | "bonus";
  justification: string;
  explainability: Explainability;
}

// 11. Implicit Criteria (only when clearly supported by multiple elements)
export interface ImplicitCriterion {
  name: string;
  proofs: string[];
  justification: string;
  confidence: number;
  explainability: Explainability;
}

// 12. ATS Keywords
export interface ATSKeywords {
  jobs: string[];
  skills: string[];
  technologies: string[];
  certifications: string[];
  domains: string[];
  methods: string[];
  explainability: Explainability;
}

// 13. Difficulty
export interface Difficulty {
  technicalComplexity: number; // 0-100
  businessComplexity: number; // 0-100
  expectedAutonomy: number; // 0-100
  versatility: number; // 0-100
  responsibility: number; // 0-100
  explainability: Explainability;
}

// 14. Company Culture
export interface CompanyCulture {
  innovation?: boolean;
  collaboration?: boolean;
  excellence?: boolean;
  autonomy?: boolean;
  diversity?: boolean;
  quality?: boolean;
  agility?: boolean;
  explainability: Explainability;
}

export interface JobOfferExtractionOutput {
  // General Information
  generalInfo: GeneralInfo;
  
  // Missions
  missions: Mission[];
  
  // Responsibilities
  responsibilities: Responsibility[];
  
  // Hard Skills
  hardSkills: HardSkill[];
  
  // Soft Skills
  softSkills: SoftSkill[];
  
  // Technologies
  technologies: Technology[];
  
  // Seniority
  seniority: Seniority;
  
  // Expected Level
  expectedLevel: ExpectedLevel;
  
  // Domain
  domain: Domain;
  
  // Prioritization
  requirements: Requirement[];
  
  // Implicit Criteria
  implicitCriteria: ImplicitCriterion[];
  
  // ATS Keywords
  atsKeywords: ATSKeywords;
  
  // Difficulty
  difficulty: Difficulty;
  
  // Company Culture
  companyCulture: CompanyCulture;
  
  // Metadata
  metadata: {
    jobOfferId: string;
    userId: string;
    extractedAt: Date;
    version: string;
    confidence: number;
  };
}

export class JobOfferExtractorEngine {
  /**
   * Extract structured job offer data from job description text
   * 
   * This is a deterministic function: same input always produces same output
   */
  static extract(input: JobOfferExtractionInput): JobOfferExtractionOutput {
    const lines = input.jobOfferText.split('\n');
    
    return {
      generalInfo: this.extractGeneralInfo(lines),
      missions: this.extractMissions(lines),
      responsibilities: this.extractResponsibilities(lines),
      hardSkills: this.extractHardSkills(lines),
      softSkills: this.extractSoftSkills(lines),
      technologies: this.extractTechnologies(lines),
      seniority: this.extractSeniority(lines),
      expectedLevel: this.extractExpectedLevel(lines),
      domain: this.extractDomain(lines),
      requirements: this.extractRequirements(lines),
      implicitCriteria: this.extractImplicitCriteria(lines),
      atsKeywords: this.extractATSKeywords(lines),
      difficulty: this.assessDifficulty(lines),
      companyCulture: this.extractCompanyCulture(lines),
      metadata: {
        jobOfferId: input.jobOfferId,
        userId: input.userId,
        extractedAt: new Date(0), // Fixed date for determinism (epoch)
        version: "1.0",
        confidence: this.calculateOverallConfidence(lines),
      },
    };
  }
  
  /**
   * Extract general information
   */
  private static extractGeneralInfo(lines: string[]): GeneralInfo {
    const text = lines.join(' ');
    const title = this.extractTitle(lines);
    const company = this.extractCompany(lines);
    const sector = this.extractSector(lines);
    const location = this.extractLocation(lines);
    const contractType = this.extractContractType(lines);
    const remoteWork = this.extractRemoteWork(lines);
    const salary = this.extractSalary(lines);
    const hierarchyLevel = this.extractHierarchyLevel(lines);
    
    return {
      title,
      company,
      sector,
      location,
      contractType,
      remoteWork,
      salary,
      hierarchyLevel,
      explainability: {
        source: "Job description header",
        proof: lines.slice(0, 5).join(' | '),
        confidence: 75,
        explanation: "Extracted from header lines using pattern matching",
      },
    };
  }
  
  /**
   * Extract missions
   */
  private static extractMissions(lines: string[]): Mission[] {
    const missions: Mission[] = [];
    const missionKeywords = ['mission', 'responsabilités', 'rôle', 'role', 'responsibilities', 'what you will do', 'vos missions'];
    
    let inMissionSection = false;
    for (const line of lines) {
      const lowerLine = line.toLowerCase().trim();
      
      if (missionKeywords.some(k => lowerLine.includes(k))) {
        inMissionSection = true;
        continue;
      }
      
      if (inMissionSection && line.trim() && (line.trim().startsWith('•') || line.trim().startsWith('-') || /^\d+\./.test(line.trim()))) {
        const description = line.trim().replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '');
        const importance = this.determineImportance(description);
        
        missions.push({
          description,
          importance,
          explainability: {
            source: "Missions section",
            proof: line,
            confidence: 70,
            explanation: "Extracted from missions section with importance classification",
          },
        });
      }
      
      // End of section if empty line after content
      if (inMissionSection && !line.trim() && missions.length > 0) {
        inMissionSection = false;
      }
    }
    
    return missions;
  }
  
  /**
   * Extract responsibilities
   */
  private static extractResponsibilities(lines: string[]): Responsibility[] {
    const responsibilities: Responsibility[] = [];
    const text = lines.join(' ').toLowerCase();
    
    // Operational responsibilities
    const operationalKeywords = ['manage', 'gérer', 'execute', 'exécuter', 'implement', 'implémenter', 'operate', 'opérer'];
    // Technical responsibilities
    const technicalKeywords = ['develop', 'développer', 'design', 'concevoir', 'architect', 'architecturer', 'code', 'coder'];
    // Functional responsibilities
    const functionalKeywords = ['analyze', 'analyser', 'report', 'rapporter', 'coordinate', 'coordonner'];
    // Managerial responsibilities
    const managerialKeywords = ['lead', 'diriger', 'manage team', 'gérer équipe', 'supervise', 'superviser', 'mentor', 'mentorer'];
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase().trim();
      if (!lowerLine || !lowerLine.startsWith('•') && !lowerLine.startsWith('-') && !/^\d+\./.test(lowerLine)) continue;
      
      const description = line.trim().replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '');
      
      if (operationalKeywords.some(k => lowerLine.includes(k))) {
        responsibilities.push({
          type: "operational",
          description,
          explainability: {
            source: "Job description",
            proof: line,
            confidence: 75,
            explanation: "Classified as operational based on keyword matching",
          },
        });
      } else if (technicalKeywords.some(k => lowerLine.includes(k))) {
        responsibilities.push({
          type: "technical",
          description,
          explainability: {
            source: "Job description",
            proof: line,
            confidence: 75,
            explanation: "Classified as technical based on keyword matching",
          },
        });
      } else if (functionalKeywords.some(k => lowerLine.includes(k))) {
        responsibilities.push({
          type: "functional",
          description,
          explainability: {
            source: "Job description",
            proof: line,
            confidence: 75,
            explanation: "Classified as functional based on keyword matching",
          },
        });
      } else if (managerialKeywords.some(k => lowerLine.includes(k))) {
        responsibilities.push({
          type: "managerial",
          description,
          explainability: {
            source: "Job description",
            proof: line,
            confidence: 75,
            explanation: "Classified as managerial based on keyword matching",
          },
        });
      }
    }
    
    return responsibilities;
  }
  
  /**
   * Extract hard skills
   */
  private static extractHardSkills(lines: string[]): HardSkill[] {
    const skills: HardSkill[] = [];
    const text = lines.join(' ').toLowerCase();
    
    const skillCategories = {
      languages: ['javascript', 'typescript', 'python', 'java', 'c#', 'c++', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin'],
      frameworks: ['react', 'angular', 'vue', 'svelte', 'next', 'nuxt', 'express', 'django', 'flask', 'spring', 'laravel', '.net'],
      databases: ['sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'oracle', 'redis', 'elasticsearch', 'cassandra'],
      cloud: ['aws', 'azure', 'gcp', 'google cloud', 'heroku', 'digitalocean', 'alibaba cloud'],
      devops: ['docker', 'kubernetes', 'jenkins', 'gitlab', 'github actions', 'terraform', 'ansible', 'ci/cd'],
      cybersecurity: ['security', 'encryption', 'authentication', 'authorization', 'owasp', 'penetration testing'],
      architecture: ['microservices', 'monolith', 'serverless', 'event-driven', 'cqrs', 'event sourcing'],
      tools: ['git', 'jira', 'confluence', 'slack', 'vs code', 'intellij', 'vim', 'emacs'],
      methodologies: ['agile', 'scrum', 'kanban', 'lean', 'waterfall', 'tdd', 'bdd', 'devops'],
    };
    
    for (const [category, keywords] of Object.entries(skillCategories)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          skills.push({
            category: category as HardSkill['category'],
            name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
            explainability: {
              source: "Job description",
              proof: this.findProof(lines, [keyword]),
              confidence: 80,
              explanation: "Extracted using keyword matching",
            },
          });
        }
      }
    }
    
    return skills;
  }
  
  /**
   * Extract soft skills (only if explicitly present)
   */
  private static extractSoftSkills(lines: string[]): SoftSkill[] {
    const softSkills: SoftSkill[] = [];
    const text = lines.join(' ').toLowerCase();
    
    const softSkillKeywords = [
      'communication', 'autonomie', 'autonomy', 'leadership', 'organisation', 'organization',
      'curiosité', 'curiosity', 'esprit d\'équipe', 'teamwork', 'résolution de problèmes', 'problem solving',
      'adaptabilité', 'adaptability'
    ];
    
    for (const keyword of softSkillKeywords) {
      if (text.includes(keyword)) {
        softSkills.push({
          name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
          explainability: {
            source: "Job description",
            proof: this.findProof(lines, [keyword]),
            confidence: 65,
            explanation: "Explicitly mentioned in job description",
          },
        });
      }
    }
    
    return softSkills;
  }
  
  /**
   * Extract technologies (normalized list)
   */
  private static extractTechnologies(lines: string[]): Technology[] {
    const technologies: Technology[] = [];
    const text = lines.join(' ').toLowerCase();
    
    const techList = [
      'javascript', 'typescript', 'react', 'angular', 'vue', 'node.js', 'laravel', 'docker',
      'aws', 'azure', 'kubernetes', 'postgresql', 'mongodb', 'redis', 'graphql', 'rest',
      'git', 'github', 'gitlab', 'jenkins', 'terraform', 'ansible', 'linux', 'windows',
      'macos', 'ios', 'android', 'swift', 'kotlin', 'python', 'java', 'c#', '.net', 'go'
    ];
    
    for (const tech of techList) {
      if (text.includes(tech)) {
        technologies.push({
          name: tech.charAt(0).toUpperCase() + tech.slice(1),
          explainability: {
            source: "Job description",
            proof: this.findProof(lines, [tech]),
            confidence: 85,
            explanation: "Technology explicitly mentioned",
          },
        });
      }
    }
    
    return technologies;
  }
  
  /**
   * Extract seniority level
   */
  private static extractSeniority(lines: string[]): Seniority {
    const seniorityKeywords = {
      Junior: ['junior', 'assistant', 'intern', 'stagiaire', 'débutant', 'entry level', '0-2 years'],
      Intermediate: ['intermediate', 'mid-level', '2-5 years', '3-5 ans', 'confirmed'],
      Senior: ['senior', '5+ years', '5+ ans', 'experienced', 'expérimenté'],
      Lead: ['lead', 'team lead', 'chef d\'équipe', 'technical lead'],
      Principal: ['principal', 'staff', 'principal engineer'],
      Architect: ['architect', 'architecte', 'technical architect', 'solution architect'],
    };
    
    const text = lines.join(' ').toLowerCase();
    
    for (const [level, keywords] of Object.entries(seniorityKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return {
            level: level as Seniority['level'],
            explainability: {
              source: "Job description",
              proof: this.findProof(lines, [keyword]),
              confidence: 85,
              explanation: `Seniority level determined by keyword "${keyword}"`,
            },
          };
        }
      }
    }
    
    // Default to Intermediate if not specified
    return {
      level: "Intermediate",
      explainability: {
        source: "Default value",
        proof: "No seniority specified",
        confidence: 30,
        explanation: "Default seniority level when not explicitly specified",
      },
    };
  }
  
  /**
   * Extract expected level
   */
  private static extractExpectedLevel(lines: string[]): ExpectedLevel {
    const text = lines.join(' ');
    
    const yearsMatch = text.match(/(\d+)\+?\s*(?:years|ans)/i);
    const yearsOfExperience = yearsMatch ? `${yearsMatch[1]}+ years` : undefined;
    
    const degreeKeywords = ['bachelor', 'master', 'phd', 'doctorate', 'licence', 'master', 'doctorat', 'bac+5', 'bac+3'];
    let degree: string | undefined;
    for (const keyword of degreeKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        degree = keyword.charAt(0).toUpperCase() + keyword.slice(1);
        break;
      }
    }
    
    const certifications = this.extractCertifications(lines);
    const languages = this.extractRequiredLanguages(lines);
    
    return {
      yearsOfExperience,
      degree,
      certifications,
      languages,
      explainability: {
        source: "Job description",
        proof: text.substring(0, 200),
        confidence: 70,
        explanation: "Extracted from job description requirements section",
      },
    };
  }
  
  /**
   * Extract domain
   */
  private static extractDomain(lines: string[]): Domain {
    const domainKeywords = {
      Finance: ['finance', 'banking', 'banque', 'fintech', 'assurance', 'insurance'],
      Health: ['health', 'santé', 'medical', 'pharmaceutical', 'pharmaceutique', 'biotech'],
      Industry: ['industry', 'industrielle', 'manufacturing', 'production'],
      Ecommerce: ['e-commerce', 'ecommerce', 'retail', 'commerce'],
      SaaS: ['saas', 'software', 'logiciel', 'b2b'],
      Public: ['public', 'government', 'gouvernement', 'administration'],
      Education: ['education', 'éducation', 'edtech', 'learning'],
      Consulting: ['consulting', 'conseil', 'cabinet'],
    };
    
    const text = lines.join(' ').toLowerCase();
    
    for (const [domain, keywords] of Object.entries(domainKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return {
            name: domain,
            explainability: {
              source: "Job description",
              proof: this.findProof(lines, [keyword]),
              confidence: 75,
              explanation: `Domain identified by keyword "${keyword}"`,
            },
          };
        }
      }
    }
    
    return {
      name: "Technology",
      explainability: {
        source: "Default value",
        proof: "No specific domain identified",
        confidence: 40,
        explanation: "Default domain when not explicitly specified",
      },
    };
  }
  
  /**
   * Extract requirements with prioritization
   */
  private static extractRequirements(lines: string[]): Requirement[] {
    const requirements: Requirement[] = [];
    const text = lines.join(' ').toLowerCase();
    
    const essentialKeywords = ['must', 'required', 'mandatory', 'essential', 'obligatoire', 'requis', 'impératif', 'required'];
    const stronglyDesiredKeywords = ['preferred', 'préféré', 'desired', 'souhaité', 'strongly', 'fortement'];
    const bonusKeywords = ['nice to have', 'plus', 'bonus', 'advantage', 'atout'];
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase().trim();
      if (!lowerLine || !lowerLine.startsWith('•') && !lowerLine.startsWith('-') && !/^\d+\./.test(lowerLine)) continue;
      
      const description = line.trim().replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '');
      
      if (essentialKeywords.some(k => lowerLine.includes(k))) {
        requirements.push({
          description,
          priority: "essential",
          justification: "Marked as required/mandatory in job description",
          explainability: {
            source: "Job description",
            proof: line,
            confidence: 90,
            explanation: "Classified as essential based on explicit requirement keywords",
          },
        });
      } else if (stronglyDesiredKeywords.some(k => lowerLine.includes(k))) {
        requirements.push({
          description,
          priority: "strongly_desired",
          justification: "Marked as preferred/desired in job description",
          explainability: {
            source: "Job description",
            proof: line,
            confidence: 80,
            explanation: "Classified as strongly desired based on preference keywords",
          },
        });
      } else if (bonusKeywords.some(k => lowerLine.includes(k))) {
        requirements.push({
          description,
          priority: "bonus",
          justification: "Marked as nice to have in job description",
          explainability: {
            source: "Job description",
            proof: line,
            confidence: 70,
            explanation: "Classified as bonus based on nice-to-have keywords",
          },
        });
      }
    }
    
    return requirements;
  }
  
  /**
   * Extract implicit criteria (only when clearly supported by multiple elements)
   */
  private static extractImplicitCriteria(lines: string[]): ImplicitCriterion[] {
    const implicitCriteria: ImplicitCriterion[] = [];
    const text = lines.join(' ').toLowerCase();
    
    // Autonomy - requires multiple indicators
    const autonomyIndicators = ['autonomous', 'autonome', 'independently', 'indépendamment', 'self-starter', 'self-motivated'];
    if (autonomyIndicators.filter(i => text.includes(i)).length >= 2) {
      implicitCriteria.push({
        name: "Autonomy",
        proofs: autonomyIndicators.filter(i => text.includes(i)).map(i => this.findProof(lines, [i])),
        justification: "Multiple indicators of autonomy found in job description",
        confidence: 75,
        explainability: {
          source: "Job description",
          proof: autonomyIndicators.filter(i => text.includes(i)).join(', '),
          confidence: 75,
          explanation: "Implicit criterion deduced from multiple supporting elements",
        },
      });
    }
    
    // Decision-making - requires multiple indicators
    const decisionIndicators = ['decision', 'décision', 'choose', 'choisir', 'determine', 'déterminer'];
    if (decisionIndicators.filter(i => text.includes(i)).length >= 2) {
      implicitCriteria.push({
        name: "Decision-making capacity",
        proofs: decisionIndicators.filter(i => text.includes(i)).map(i => this.findProof(lines, [i])),
        justification: "Multiple indicators of decision-making found in job description",
        confidence: 70,
        explainability: {
          source: "Job description",
          proof: decisionIndicators.filter(i => text.includes(i)).join(', '),
          confidence: 70,
          explanation: "Implicit criterion deduced from multiple supporting elements",
        },
      });
    }
    
    return implicitCriteria;
  }
  
  /**
   * Extract ATS keywords
   */
  private static extractATSKeywords(lines: string[]): ATSKeywords {
    const text = lines.join(' ').toLowerCase();
    
    const jobs = this.extractJobTitles(lines);
    const skills = this.extractAllSkills(lines);
    const technologies = this.extractTechnologies(lines).map(t => t.name);
    const certifications = this.extractCertifications(lines);
    const domains = [this.extractDomain(lines).name];
    const methods = ['agile', 'scrum', 'kanban', 'tdd', 'bdd'].filter(m => text.includes(m));
    
    return {
      jobs,
      skills,
      technologies,
      certifications,
      domains,
      methods,
      explainability: {
        source: "Full job description",
        proof: "Keyword extraction from all sections",
        confidence: 70,
        explanation: "Extracted using keyword matching and frequency analysis",
      },
    };
  }
  
  /**
   * Assess difficulty
   */
  private static assessDifficulty(lines: string[]): Difficulty {
    const text = lines.join(' ').toLowerCase();
    const seniority = this.extractSeniority(lines);
    
    let technicalComplexity = 50;
    let businessComplexity = 50;
    let expectedAutonomy = 50;
    let versatility = 50;
    let responsibility = 50;
    
    // Technical complexity indicators
    const technicalKeywords = ['architecture', 'system design', 'scalability', 'performance', 'optimization'];
    technicalKeywords.forEach(k => { if (text.includes(k)) technicalComplexity += 10; });
    
    // Business complexity indicators
    const businessKeywords = ['stakeholder', 'client', 'business', 'strategy', 'revenue'];
    businessKeywords.forEach(k => { if (text.includes(k)) businessComplexity += 10; });
    
    // Autonomy indicators
    const autonomyKeywords = ['autonomous', 'independently', 'self-starter'];
    autonomyKeywords.forEach(k => { if (text.includes(k)) expectedAutonomy += 15; });
    
    // Versatility indicators
    const versatilityKeywords = ['multiple', 'various', 'diverse', 'cross-functional'];
    versatilityKeywords.forEach(k => { if (text.includes(k)) versatility += 10; });
    
    // Responsibility indicators
    const responsibilityKeywords = ['lead', 'manage', 'own', 'responsible for', 'accountable'];
    responsibilityKeywords.forEach(k => { if (text.includes(k)) responsibility += 15; });
    
    // Adjust based on seniority
    const seniorityLevels = { Junior: 0, Intermediate: 20, Senior: 40, Lead: 60, Principal: 80, Architect: 90 };
    const seniorityBonus = seniorityLevels[seniority.level] || 20;
    
    expectedAutonomy = Math.min(100, expectedAutonomy + seniorityBonus);
    responsibility = Math.min(100, responsibility + seniorityBonus);
    
    return {
      technicalComplexity: Math.min(100, technicalComplexity),
      businessComplexity: Math.min(100, businessComplexity),
      expectedAutonomy: Math.min(100, expectedAutonomy),
      versatility: Math.min(100, versatility),
      responsibility: Math.min(100, responsibility),
      explainability: {
        source: "Job description analysis",
        proof: text.substring(0, 200),
        confidence: 65,
        explanation: "Difficulty assessed based on keyword analysis and seniority level",
      },
    };
  }
  
  /**
   * Extract company culture
   */
  private static extractCompanyCulture(lines: string[]): CompanyCulture {
    const text = lines.join(' ').toLowerCase();
    
    return {
      innovation: text.includes('innovation') || text.includes('innovative'),
      collaboration: text.includes('collaboration') || text.includes('team'),
      excellence: text.includes('excellence') || text.includes('quality'),
      autonomy: text.includes('autonomy') || text.includes('autonomous'),
      diversity: text.includes('diversity') || text.includes('inclusive'),
      quality: text.includes('quality') || text.includes('excellence'),
      agility: text.includes('agility') || text.includes('agile'),
      explainability: {
        source: "Job description",
        proof: text.substring(0, 200),
        confidence: 60,
        explanation: "Culture elements extracted from explicit mentions in job description",
      },
    };
  }
  
  // Helper methods
  
  private static extractTitle(lines: string[]): string | undefined {
    for (const line of lines.slice(0, 10)) {
      if (line.trim() && line.length < 100 && !line.includes('@') && !line.includes('http')) {
        const words = line.trim().split(' ');
        if (words.length >= 2 && words.length <= 6) {
          return line.trim();
        }
      }
    }
    return undefined;
  }
  
  private static extractCompany(lines: string[]): string | undefined {
    const companyKeywords = ['at', 'chez', 'company', 'entreprise'];
    for (const line of lines.slice(0, 10)) {
      for (const keyword of companyKeywords) {
        if (line.toLowerCase().includes(keyword)) {
          const parts = line.split(keyword);
          if (parts.length > 1 && parts[1]) {
            return parts[1].trim();
          }
        }
      }
    }
    return undefined;
  }
  
  private static extractSector(lines: string[]): string | undefined {
    const sectorKeywords = ['tech', 'finance', 'health', 'retail', 'manufacturing', 'education', 'consulting'];
    const text = lines.join(' ').toLowerCase();
    for (const keyword of sectorKeywords) {
      if (text.includes(keyword)) {
        return keyword.charAt(0).toUpperCase() + keyword.slice(1);
      }
    }
    return undefined;
  }
  
  private static extractLocation(lines: string[]): string | undefined {
    const locationKeywords = ['location', 'lieu', 'based', 'basé', 'remote', 'télétravail'];
    for (const line of lines.slice(0, 15)) {
      for (const keyword of locationKeywords) {
        if (line.toLowerCase().includes(keyword)) {
          return line.trim();
        }
      }
    }
    return undefined;
  }
  
  private static extractContractType(lines: string[]): string | undefined {
    const contractKeywords = ['full-time', 'cdi', 'part-time', 'cdd', 'contract', 'freelance', 'permanent'];
    const text = lines.join(' ').toLowerCase();
    for (const keyword of contractKeywords) {
      if (text.includes(keyword)) {
        return keyword.charAt(0).toUpperCase() + keyword.slice(1);
      }
    }
    return undefined;
  }
  
  private static extractRemoteWork(lines: string[]): string | undefined {
    const remoteKeywords = ['remote', 'télétravail', 'hybrid', 'hybride', 'on-site', 'présentiel'];
    const text = lines.join(' ').toLowerCase();
    for (const keyword of remoteKeywords) {
      if (text.includes(keyword)) {
        return keyword.charAt(0).toUpperCase() + keyword.slice(1);
      }
    }
    return undefined;
  }
  
  private static extractSalary(lines: string[]): string | undefined {
    const salaryKeywords = ['salary', 'salaire', '€', '$', 'k', 'year', 'an'];
    for (const line of lines.slice(0, 20)) {
      if (salaryKeywords.some(k => line.toLowerCase().includes(k))) {
        return line.trim();
      }
    }
    return undefined;
  }
  
  private static extractHierarchyLevel(lines: string[]): string | undefined {
    const hierarchyKeywords = ['manager', 'director', 'vp', 'head', 'chief', 'lead', 'senior', 'junior'];
    const text = lines.join(' ').toLowerCase();
    for (const keyword of hierarchyKeywords) {
      if (text.includes(keyword)) {
        return keyword.charAt(0).toUpperCase() + keyword.slice(1);
      }
    }
    return undefined;
  }
  
  private static determineImportance(description: string): Mission['importance'] {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('critical') || lowerDesc.includes('essential') || lowerDesc.includes('key')) {
      return "critical";
    }
    if (lowerDesc.includes('important') || lowerDesc.includes('primary') || lowerDesc.includes('main')) {
      return "high";
    }
    if (lowerDesc.includes('support') || lowerDesc.includes('assist') || lowerDesc.includes('help')) {
      return "low";
    }
    return "medium";
  }
  
  private static extractCertifications(lines: string[]): string[] {
    const certifications: string[] = [];
    const certKeywords = ['aws', 'azure', 'gcp', 'pmp', 'scrum', 'prince2', 'itil', 'cfa', 'cpa'];
    const text = lines.join(' ').toLowerCase();
    for (const keyword of certKeywords) {
      if (text.includes(keyword)) {
        certifications.push(keyword.toUpperCase());
      }
    }
    return certifications;
  }
  
  private static extractRequiredLanguages(lines: string[]): string[] {
    const languages: string[] = [];
    const langKeywords = ['english', 'french', 'spanish', 'german', 'italian', 'chinese', 'japanese'];
    const text = lines.join(' ').toLowerCase();
    for (const keyword of langKeywords) {
      if (text.includes(keyword)) {
        languages.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    }
    return languages;
  }
  
  private static extractJobTitles(lines: string[]): string[] {
    const titles: string[] = [];
    const titleKeywords = ['engineer', 'developer', 'manager', 'director', 'analyst', 'consultant', 'architect'];
    const text = lines.join(' ').toLowerCase();
    for (const keyword of titleKeywords) {
      if (text.includes(keyword)) {
        titles.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    }
    return titles;
  }
  
  private static extractAllSkills(lines: string[]): string[] {
    const skills: string[] = [];
    const skillKeywords = ['javascript', 'python', 'java', 'react', 'angular', 'docker', 'aws', 'sql', 'git'];
    const text = lines.join(' ').toLowerCase();
    for (const keyword of skillKeywords) {
      if (text.includes(keyword)) {
        skills.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    }
    return skills;
  }
  
  private static findProof(lines: string[], keywords: string[]): string {
    for (const line of lines) {
      for (const keyword of keywords) {
        if (line.toLowerCase().includes(keyword)) {
          return line.trim();
        }
      }
    }
    return 'Not found';
  }
  
  private static calculateOverallConfidence(lines: string[]): number {
    let confidence = 50;
    const text = lines.join(' ').toLowerCase();
    
    // Boost confidence if key sections exist
    if (text.includes('mission') || text.includes('responsibility')) confidence += 15;
    if (text.includes('skill') || text.includes('requirement')) confidence += 10;
    if (text.includes('experience') || text.includes('qualification')) confidence += 10;
    
    // Reduce confidence if sections are missing
    if (!text.includes('mission') && !text.includes('responsibility')) confidence -= 10;
    
    return Math.min(100, Math.max(0, confidence));
  }
}
