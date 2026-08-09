import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface ExtractedJobInfo {
  id: string;
  title: string;
  jobFamily: string;
  seniority: string;
  description: string;
  location: string;
  remoteWork: boolean;
  contractType: string;
  availability: string;
  salary: string;
  benefits: string[];
  sector: string;
  team: string;
}

export interface ExtractedSkill {
  id: string;
  name: string;
  type: 'required' | 'preferred' | 'soft';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsExperience?: number;
}

export interface ExtractedExperience {
  id: string;
  yearsRequired: number;
  description: string;
}

export interface ExtractedEducation {
  id: string;
  level: string;
  field: string;
  certifications: string[];
}

export interface ExtractedLanguage {
  id: string;
  name: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native';
  required: boolean;
}

export interface ExtractedCompany {
  id: string;
  name: string;
  industry: string;
  location: string;
}

export interface ExtractedTechnology {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'platform' | 'database';
  required: boolean;
}

export interface ExtractedTool {
  id: string;
  name: string;
  required: boolean;
}

export interface ExtractedMethodology {
  id: string;
  name: string;
  required: boolean;
}

export interface ExtractedResponsibility {
  id: string;
  description: string;
}

export interface ExtractedMission {
  id: string;
  description: string;
}

export interface ExtractedSalary {
  id: string;
  min: number;
  max: number;
  currency: string;
  period: 'hourly' | 'monthly' | 'yearly';
}

export interface ExtractedContract {
  id: string;
  type: 'CDI' | 'CDD' | 'Freelance' | 'Contractor' | 'Intern' | 'Stage';
  duration?: string;
}

export interface ExtractedRemote {
  id: string;
  allowed: boolean;
  policy: 'full' | 'partial' | 'hybrid' | 'none';
  daysPerWeek: number;
}

export interface ExtractedJob {
  id: string;
  jobInfo: ExtractedJobInfo;
  requiredSkills: ExtractedSkill[];
  preferredSkills: ExtractedSkill[];
  softSkills: ExtractedSkill[];
  languages: ExtractedLanguage[];
  education: ExtractedEducation[];
  experience: ExtractedExperience[];
  companies: ExtractedCompany[];
  technologies: ExtractedTechnology[];
  tools: ExtractedTool[];
  methodologies: ExtractedMethodology[];
  responsibilities: ExtractedResponsibility[];
  missions: ExtractedMission[];
  salary: ExtractedSalary;
  contract: ExtractedContract;
  remote: ExtractedRemote;
  extractionMetadata: {
    extractedAt: Date;
    sourceText: string;
    confidence: number;
  };
}

@Injectable()
export class JobExtractorService {
  /**
   * Extract all entities from job description text in a single pass
   */
  extractFromText(text: string): ExtractedJob {
    const jobId = uuidv4();
    const extractedAt = new Date();

    return {
      id: jobId,
      jobInfo: this.extractJobInfo(text),
      requiredSkills: this.extractSkills(text, 'required'),
      preferredSkills: this.extractSkills(text, 'preferred'),
      softSkills: this.extractSkills(text, 'soft'),
      languages: this.extractLanguages(text),
      education: this.extractEducation(text),
      experience: this.extractExperience(text),
      companies: this.extractCompanies(text),
      technologies: this.extractTechnologies(text),
      tools: this.extractTools(text),
      methodologies: this.extractMethodologies(text),
      responsibilities: this.extractResponsibilities(text),
      missions: this.extractMissions(text),
      salary: this.extractSalary(text),
      contract: this.extractContract(text),
      remote: this.extractRemote(text),
      extractionMetadata: {
        extractedAt,
        sourceText: text,
        confidence: this.calculateOverallConfidence(text),
      },
    };
  }

  private extractJobInfo(text: string): ExtractedJobInfo {
    return {
      id: uuidv4(),
      title: this.extractTitle(text),
      jobFamily: this.extractJobFamily(text),
      seniority: this.extractSeniority(text),
      description: this.extractDescription(text),
      location: this.extractLocation(text),
      remoteWork: this.extractRemoteWork(text),
      contractType: this.extractContractType(text),
      availability: this.extractAvailability(text),
      salary: this.extractSalaryText(text),
      benefits: this.extractBenefits(text),
      sector: this.extractSector(text),
      team: this.extractTeam(text),
    };
  }

  private extractTitle(text: string): string {
    const patterns = [
      /(?:poste|position|job|titre|title)[:\s]*([^\n]+)/i,
      /(?:développeur|developer|engineer|manager|analyst|consultant|director)[^\n]*/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1]?.trim() || match[0]?.trim() || '';
      }
    }
    return '';
  }

  private extractJobFamily(text: string): string {
    const patterns = [/(?:famille|family|domaine|domain)[:\s]*([^\n]+)/i];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1]?.trim() || '';
      }
    }
    return '';
  }

  private extractSeniority(text: string): string {
    const patterns = [
      /(?:junior|senior|lead|principal|expert|intern|stagiaire)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    return '';
  }

  private extractDescription(text: string): string {
    const patterns = [
      /(?:description|descriptif|about the role|overview)[:\s]*([^]*?)(?:responsabilités|responsibilities|compétences|skills)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return '';
  }

  private extractLocation(text: string): string {
    const pattern = /(?:localisation|location|lieu|ville|city)[:\s]*([^\n]+)/i;
    const match = text.match(pattern);
    return match && match[1] ? match[1].trim() : '';
  }

  private extractRemoteWork(text: string): boolean {
    const pattern = /(?:télétravail|remote|home office|work from home)/i;
    return pattern.test(text);
  }

  private extractContractType(text: string): string {
    const patterns = [/(?:cdi|cdd|freelance|contractor|intern|stage)/i];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[0]) {
        return match[0];
      }
    }
    return '';
  }

  private extractAvailability(text: string): string {
    const pattern = /(?:disponibilité|availability|start date)[:\s]*([^\n]+)/i;
    const match = text.match(pattern);
    return match && match[1] ? match[1].trim() : '';
  }

  private extractSalaryText(text: string): string {
    const pattern = /(?:salaire|salary|rénumération)[:\s]*([^\n]+)/i;
    const match = text.match(pattern);
    return match && match[1] ? match[1].trim() : '';
  }

  private extractBenefits(text: string): string[] {
    const benefits: string[] = [];
    const sectionPattern =
      /(?:avantages|benefits|perks)[:\s]*([^]*?)(?:responsabilités|$)/i;
    const sectionMatch = text.match(sectionPattern);

    if (sectionMatch && sectionMatch[1]) {
      const sectionText = sectionMatch[1];
      const benefitPattern =
        /(?:mutuelle|insurance|congés|vacation|bonus|prime|ticket restaurant|lunch voucher)/gi;
      const matches = sectionText.match(benefitPattern) || [];
      benefits.push(...matches);
    }

    return [...new Set(benefits)];
  }

  private extractSector(text: string): string {
    const pattern = /(?:secteur|sector|industrie|industry)[:\s]*([^\n]+)/i;
    const match = text.match(pattern);
    return match && match[1] ? match[1].trim() : '';
  }

  private extractTeam(text: string): string {
    const pattern = /(?:équipe|team|équipe size|team size)[:\s]*([^\n]+)/i;
    const match = text.match(pattern);
    return match && match[1] ? match[1].trim() : '';
  }

  private extractSkills(
    text: string,
    type: 'required' | 'preferred' | 'soft',
  ): ExtractedSkill[] {
    const skills: ExtractedSkill[] = [];
    let sectionPattern: RegExp;

    if (type === 'required') {
      sectionPattern =
        /(?:compétences requises|required skills|skills required)[:\s]*([^]*?)(?:compétences souhaitées|preferred skills|soft skills|$)/i;
    } else if (type === 'preferred') {
      sectionPattern =
        /(?:compétences souhaitées|preferred skills|nice to have)[:\s]*([^]*?)(?:soft skills|$)/i;
    } else {
      sectionPattern =
        /(?:soft skills|compétences comportementales)[:\s]*([^]*?)(?:languages|langues|$)/i;
    }

    const sectionMatch = text.match(sectionPattern);

    if (sectionMatch && sectionMatch[1]) {
      const sectionText = sectionMatch[1];
      const skillPattern =
        /(?:javascript|python|java|c\+\+|c#|typescript|react|angular|vue|node\.js|django|flask|spring|docker|kubernetes|aws|azure|gcp|sql|nosql|mongodb|postgresql|mysql|git|agile|scrum|communication|leadership|teamwork|adaptability)/gi;
      const matches = sectionText.match(skillPattern) || [];

      matches.forEach((skillName) => {
        skills.push({
          id: uuidv4(),
          name: skillName,
          type,
          level: this.determineSkillLevel(skillName, sectionText),
        });
      });
    }

    return skills;
  }

  private determineSkillLevel(
    skillName: string,
    context: string,
  ): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    const contextLower = context.toLowerCase();
    if (contextLower.includes('expert') || contextLower.includes('senior')) {
      return 'expert';
    } else if (
      contextLower.includes('advanced') ||
      contextLower.includes('lead')
    ) {
      return 'advanced';
    } else if (
      contextLower.includes('junior') ||
      contextLower.includes('beginner')
    ) {
      return 'beginner';
    }
    return 'intermediate';
  }

  private extractLanguages(text: string): ExtractedLanguage[] {
    const languages: ExtractedLanguage[] = [];
    const sectionPattern =
      /(?:languages|langues|language skills)[:\s]*([^]*?)(?:education|formation|$)/i;
    const sectionMatch = text.match(sectionPattern);

    if (sectionMatch && sectionMatch[1]) {
      const sectionText = sectionMatch[1];
      const pattern =
        /(?:english|french|spanish|german|italian|portuguese|chinese|japanese|anglais|français|espagnol|allemand|italien|portugais|chinois|japonais)/gi;
      const matches = sectionText.match(pattern) || [];

      matches.forEach((langName) => {
        const required =
          sectionText.toLowerCase().includes('required') ||
          sectionText.toLowerCase().includes('requis');
        languages.push({
          id: uuidv4(),
          name: langName,
          level: this.determineLanguageLevel(sectionText),
          required,
        });
      });
    }

    return languages;
  }

  private determineLanguageLevel(
    text: string,
  ): 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native' {
    const textLower = text.toLowerCase();
    if (textLower.includes('native') || textLower.includes('bilingual')) {
      return 'native';
    } else if (textLower.includes('c1') || textLower.includes('c2')) {
      return textLower.includes('c1') ? 'C1' : 'C2';
    } else if (textLower.includes('b1') || textLower.includes('b2')) {
      return textLower.includes('b1') ? 'B1' : 'B2';
    } else if (textLower.includes('a1') || textLower.includes('a2')) {
      return textLower.includes('a1') ? 'A1' : 'A2';
    }
    return 'B2';
  }

  private extractEducation(text: string): ExtractedEducation[] {
    const education: ExtractedEducation[] = [];
    const sectionPattern =
      /(?:education|formation|diploma|degree)[:\s]*([^]*?)(?:experience|expériences|$)/i;
    const sectionMatch = text.match(sectionPattern);

    if (sectionMatch && sectionMatch[1]) {
      const sectionText = sectionMatch[1];
      const level = this.extractEducationLevel(sectionText);
      const certifications = this.extractCertifications(sectionText);

      education.push({
        id: uuidv4(),
        level,
        field: this.extractField(sectionText),
        certifications,
      });
    }

    return education;
  }

  private extractEducationLevel(text: string): string {
    const patterns = [
      /(?:bac|baccalauréat|bts|dut|licence|master|doctorat|phd|bachelor|master's|doctorate)/gi,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[0]) {
        return match[0];
      }
    }
    return '';
  }

  private extractField(text: string): string {
    const pattern = /(?:in|de|à|en)\s+([^\n]+)/i;
    const match = text.match(pattern);
    return match?.[1]?.trim() || '';
  }

  private extractCertifications(text: string): string[] {
    const certifications: string[] = [];
    const pattern = /(?:certified|certification|certificat)[^,\n]*/gi;
    const matches = text.match(pattern) || [];
    certifications.push(...matches);

    return [...new Set(certifications)];
  }

  private extractExperience(text: string): ExtractedExperience[] {
    const experience: ExtractedExperience[] = [];
    const years = this.extractExperienceYears(text);
    const description = this.extractExperienceDescription(text);

    experience.push({
      id: uuidv4(),
      yearsRequired: years,
      description,
    });

    return experience;
  }

  private extractExperienceYears(text: string): number {
    const pattern = /(?:(\d+)\s*(?:ans|years|années))/i;
    const match = text.match(pattern);
    return match && match[1] ? parseInt(match[1]) : 0;
  }

  private extractExperienceDescription(text: string): string {
    const sectionPattern =
      /(?:experience|expériences|professional experience)[:\s]*([^]*?)(?:education|formation|$)/i;
    const sectionMatch = text.match(sectionPattern);

    if (sectionMatch && sectionMatch[1]) {
      return sectionMatch[1].trim();
    }

    return '';
  }

  private extractCompanies(text: string): ExtractedCompany[] {
    const companies: ExtractedCompany[] = [];
    const pattern = /(?:at|@|chez|company|société)[:\s]*([A-Z][a-zA-Z\s&]+)/gi;
    const matches = text.match(pattern) || [];

    matches.forEach((match) => {
      const companyName = match
        .replace(/(?:at|@|chez|company|société)[:\s]*/gi, '')
        .trim();
      if (companyName && !companies.find((c) => c.name === companyName)) {
        companies.push({
          id: uuidv4(),
          name: companyName,
          industry: this.extractSector(text),
          location: this.extractLocation(text),
        });
      }
    });

    return companies;
  }

  private extractTechnologies(text: string): ExtractedTechnology[] {
    const technologies: ExtractedTechnology[] = [];
    const pattern =
      /(?:javascript|python|java|c\+\+|c#|typescript|react|angular|vue|node\.js|django|flask|spring|docker|kubernetes|aws|azure|gcp|sql|nosql|mongodb|postgresql|mysql)/gi;
    const matches = text.match(pattern) || [];

    const requiredSection = /(?:compétences requises|required skills)/i.test(
      text,
    );

    matches.forEach((techName) => {
      if (
        !technologies.find(
          (t) => t.name.toLowerCase() === techName.toLowerCase(),
        )
      ) {
        technologies.push({
          id: uuidv4(),
          name: techName,
          category: this.categorizeTechnology(techName),
          required: requiredSection,
        });
      }
    });

    return technologies;
  }

  private categorizeTechnology(
    tech: string,
  ): 'language' | 'framework' | 'tool' | 'platform' | 'database' {
    const languages = [
      'javascript',
      'typescript',
      'python',
      'java',
      'c++',
      'c#',
      'go',
      'rust',
      'php',
      'ruby',
    ];
    const frameworks = [
      'react',
      'angular',
      'vue',
      'svelte',
      'django',
      'flask',
      'spring',
      'express',
      'fastapi',
    ];
    const databases = [
      'postgresql',
      'mysql',
      'mongodb',
      'redis',
      'elasticsearch',
    ];
    const platforms = ['aws', 'azure', 'gcp', 'kubernetes'];
    const techLower = tech.toLowerCase();

    if (languages.includes(techLower)) return 'language';
    if (frameworks.includes(techLower)) return 'framework';
    if (databases.includes(techLower)) return 'database';
    if (platforms.includes(techLower)) return 'platform';
    return 'tool';
  }

  private extractTools(text: string): ExtractedTool[] {
    const tools: ExtractedTool[] = [];
    const pattern =
      /(?:git|jira|confluence|slack|vs code|visual studio|intellij|eclipse|jenkins|github|gitlab|bitbucket)/gi;
    const matches = text.match(pattern) || [];

    const requiredSection = /(?:compétences requises|required skills)/i.test(
      text,
    );

    matches.forEach((toolName) => {
      if (!tools.find((t) => t.name.toLowerCase() === toolName.toLowerCase())) {
        tools.push({
          id: uuidv4(),
          name: toolName,
          required: requiredSection,
        });
      }
    });

    return tools;
  }

  private extractMethodologies(text: string): ExtractedMethodology[] {
    const methodologies: ExtractedMethodology[] = [];
    const pattern =
      /(?:agile|scrum|kanban|lean|waterfall|devops|tdd|bdd|ci\/cd)/gi;
    const matches = text.match(pattern) || [];

    const requiredSection = /(?:compétences requises|required skills)/i.test(
      text,
    );

    matches.forEach((methodName) => {
      if (
        !methodologies.find(
          (m) => m.name.toLowerCase() === methodName.toLowerCase(),
        )
      ) {
        methodologies.push({
          id: uuidv4(),
          name: methodName,
          required: requiredSection,
        });
      }
    });

    return methodologies;
  }

  private extractResponsibilities(text: string): ExtractedResponsibility[] {
    const responsibilities: ExtractedResponsibility[] = [];
    const sectionPattern =
      /(?:responsabilités|responsibilities)[:\s]*([^]*?)(?:missions|tasks|$)/i;
    const sectionMatch = text.match(sectionPattern);

    if (sectionMatch && sectionMatch[1]) {
      const sectionText = sectionMatch[1];
      const lines = sectionText
        .split('\n')
        .filter((line) => line.trim().length > 0);

      lines.forEach((line) => {
        responsibilities.push({
          id: uuidv4(),
          description: line.trim(),
        });
      });
    }

    return responsibilities;
  }

  private extractMissions(text: string): ExtractedMission[] {
    const missions: ExtractedMission[] = [];
    const sectionPattern =
      /(?:missions|tasks|objectives)[:\s]*([^]*?)(?:compétences|skills|$)/i;
    const sectionMatch = text.match(sectionPattern);

    if (sectionMatch && sectionMatch[1]) {
      const sectionText = sectionMatch[1];
      const lines = sectionText
        .split('\n')
        .filter((line) => line.trim().length > 0);

      lines.forEach((line) => {
        missions.push({
          id: uuidv4(),
          description: line.trim(),
        });
      });
    }

    return missions;
  }

  private extractSalary(text: string): ExtractedSalary {
    const pattern = /(?:salaire|salary|rénumération)[:\s]*([^\n]+)/i;
    const match = text.match(pattern);

    if (match && match[1]) {
      const salaryText = match[1];
      const numbers = salaryText.match(/(\d+(?:,\d+)?)/g);

      if (numbers && numbers.length >= 1) {
        const min = parseInt(numbers[0]?.replace(',', '.') || '0');
        const max =
          numbers.length > 1 && numbers[1]
            ? parseInt(numbers[1].replace(',', '.'))
            : min;

        let currency = 'EUR';
        if (
          salaryText.includes('$') ||
          salaryText.toLowerCase().includes('usd')
        ) {
          currency = 'USD';
        } else if (
          salaryText.includes('£') ||
          salaryText.toLowerCase().includes('gbp')
        ) {
          currency = 'GBP';
        }

        let period: 'hourly' | 'monthly' | 'yearly' = 'yearly';
        if (
          salaryText.toLowerCase().includes('/hour') ||
          salaryText.toLowerCase().includes('/heure')
        ) {
          period = 'hourly';
        } else if (
          salaryText.toLowerCase().includes('/month') ||
          salaryText.toLowerCase().includes('/mois')
        ) {
          period = 'monthly';
        }

        return {
          id: uuidv4(),
          min,
          max,
          currency,
          period,
        };
      }
    }

    return {
      id: uuidv4(),
      min: 0,
      max: 0,
      currency: 'EUR',
      period: 'yearly',
    };
  }

  private extractContract(text: string): ExtractedContract {
    const patterns = [/(?:cdi|cdd|freelance|contractor|intern|stage)/i];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[0]) {
        const typeMap: Record<string, ExtractedContract['type']> = {
          cdi: 'CDI',
          cdd: 'CDD',
          freelance: 'Freelance',
          contractor: 'Contractor',
          intern: 'Intern',
          stage: 'Stage',
        };

        const type = typeMap[match[0].toLowerCase()] || 'CDI';

        return {
          id: uuidv4(),
          type,
        };
      }
    }

    return {
      id: uuidv4(),
      type: 'CDI',
    };
  }

  private extractRemote(text: string): ExtractedRemote {
    const remoteWork = this.extractRemoteWork(text);

    if (!remoteWork) {
      return {
        id: uuidv4(),
        allowed: false,
        policy: 'none',
        daysPerWeek: 0,
      };
    }

    let policy: 'full' | 'partial' | 'hybrid' | 'none' = 'partial';
    if (
      text.toLowerCase().includes('full remote') ||
      text.toLowerCase().includes('100% remote')
    ) {
      policy = 'full';
    } else if (text.toLowerCase().includes('hybrid')) {
      policy = 'hybrid';
    }

    const daysMatch = text.match(/(\d+)\s*(?:days?|jours?)/i);
    const daysPerWeek = daysMatch?.[1] ? parseInt(daysMatch[1]) : 0;

    return {
      id: uuidv4(),
      allowed: true,
      policy,
      daysPerWeek,
    };
  }

  private calculateOverallConfidence(text: string): number {
    let confidence = 0.5;
    const textLength = text.length;

    if (textLength > 500) confidence += 0.1;
    if (textLength > 1000) confidence += 0.1;
    if (textLength > 2000) confidence += 0.1;

    if (text.includes('salaire') || text.includes('salary')) confidence += 0.05;
    if (text.includes('compétences') || text.includes('skills'))
      confidence += 0.05;
    if (text.includes('responsabilités') || text.includes('responsibilities'))
      confidence += 0.05;

    return Math.min(confidence, 1.0);
  }
}
