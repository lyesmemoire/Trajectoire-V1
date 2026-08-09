import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface ExtractedPersonalInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  linkedin?: string | undefined;
  github?: string | undefined;
}

export interface ExtractedExperience {
  id: string;
  title: string;
  company: string;
  location?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  current: boolean;
  description: string;
  technologies: string[];
  methodologies: string[];
}

export interface ExtractedEducation {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  gpa?: string | undefined;
}

export interface ExtractedSkill {
  id: string;
  name: string;
  type: 'technical' | 'soft' | 'methodological';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsExperience?: number;
  verified: boolean;
}

export interface ExtractedCertification {
  id: string;
  name: string;
  issuer: string;
  date?: string | undefined;
  expiryDate?: string | undefined;
  credentialId?: string | undefined;
}

export interface ExtractedLanguage {
  id: string;
  name: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native';
}

export interface ExtractedCompany {
  id: string;
  name: string;
  industry?: string;
  location?: string;
}

export interface ExtractedTechnology {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'platform' | 'database';
}

export interface ExtractedProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate?: string | undefined;
  endDate?: string | undefined;
  url?: string | undefined;
}

export interface ExtractedCV {
  id: string;
  personalInfo: ExtractedPersonalInfo;
  experiences: ExtractedExperience[];
  education: ExtractedEducation[];
  skills: ExtractedSkill[];
  certifications: ExtractedCertification[];
  languages: ExtractedLanguage[];
  companies: ExtractedCompany[];
  technologies: ExtractedTechnology[];
  projects: ExtractedProject[];
  extractionMetadata: {
    extractedAt: Date;
    sourceText: string;
    confidence: number;
  };
}

@Injectable()
export class CvExtractorService {
  /**
   * Extract all entities from CV text in a single pass
   */
  extractFromText(text: string): ExtractedCV {
    const cvId = uuidv4();
    const extractedAt = new Date();

    return {
      id: cvId,
      personalInfo: this.extractPersonalInfo(text),
      experiences: this.extractExperiences(text),
      education: this.extractEducation(text),
      skills: this.extractSkills(text),
      certifications: this.extractCertifications(text),
      languages: this.extractLanguages(text),
      companies: this.extractCompanies(text),
      technologies: this.extractTechnologies(text),
      projects: this.extractProjects(text),
      extractionMetadata: {
        extractedAt,
        sourceText: text,
        confidence: this.calculateOverallConfidence(text),
      },
    };
  }

  private extractPersonalInfo(text: string): ExtractedPersonalInfo {
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = text.match(
      /(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/,
    );
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/);
    const githubMatch = text.match(/github\.com\/[\w-]+/);

    // Extract name from beginning of document (simplified)
    const lines = text.split('\n').filter((l) => l.trim());
    const name = lines[0] || '';

    return {
      id: uuidv4(),
      name,
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      address: this.extractAddress(text),
      linkedin: linkedinMatch ? linkedinMatch[0] : undefined,
      github: githubMatch ? githubMatch[0] : undefined,
    };
  }

  private extractAddress(text: string): string {
    const addressPatterns = [
      /\d+[\s\w]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)[\s\w,]+/i,
      /[\w\s]+,\s*[\w\s]+,\s*\d{5}/i,
    ];
    for (const pattern of addressPatterns) {
      const match = text.match(pattern);
      if (match) return match[0].trim();
    }
    return '';
  }

  private extractExperiences(text: string): ExtractedExperience[] {
    const experiences: ExtractedExperience[] = [];
    const experiencePattern =
      /(?:experience|expériences|work history|professional experience|employment)[:\s]*([^]*?)(?:education|formation|skills|compétences|languages|langues|certifications|$)/i;
    const experienceMatch = text.match(experiencePattern);

    if (experienceMatch && experienceMatch[1]) {
      const experienceText = experienceMatch[1];
      const jobEntries = this.splitExperienceEntries(experienceText);

      jobEntries.forEach((entry) => {
        const experience = this.parseExperienceEntry(entry);
        if (experience) {
          experiences.push(experience);
        }
      });
    }

    return experiences;
  }

  private splitExperienceEntries(text: string): string[] {
    const entries: string[] = [];
    const lines = text.split('\n');
    let currentEntry = '';

    for (const line of lines) {
      if (this.isNewJobEntry(line)) {
        if (currentEntry.trim()) {
          entries.push(currentEntry.trim());
        }
        currentEntry = line;
      } else {
        currentEntry += '\n' + line;
      }
    }

    if (currentEntry.trim()) {
      entries.push(currentEntry.trim());
    }

    return entries;
  }

  private isNewJobEntry(line: string): boolean {
    const jobIndicators = [
      /(?:Manager|Developer|Engineer|Analyst|Director|Specialist|Consultant|Architect|Lead|Senior|Junior)/i,
      /^\d{4}/,
    ];
    return jobIndicators.some((pattern) => pattern.test(line));
  }

  private parseExperienceEntry(entry: string): ExtractedExperience | null {
    const titleMatch = entry.match(
      /([A-Z][^,\n]+(?:Manager|Developer|Engineer|Analyst|Director|Specialist|Consultant|Architect)[^,\n]*)/,
    );
    const companyMatch = entry.match(/(?:at|@|for)\s+([A-Z][^\n,]+)/i);
    const dateMatch = entry.match(
      /(\d{4}|\w+\s+\d{4})\s*[-–to]+\s*(\d{4}|present|current|now)/i,
    );
    const techMatch = entry.match(
      /(?:technologies|tech|stack|tools)[:\s]*([^\n]+)/i,
    );

    if (!titleMatch) return null;

    const startDate = dateMatch ? dateMatch[1] : undefined;
    const endDate =
      dateMatch && dateMatch[2]
        ? dateMatch[2].toLowerCase().includes('present') ||
          dateMatch[2].toLowerCase().includes('current')
          ? undefined
          : dateMatch[2]
        : undefined;
    const current = !endDate;

    return {
      id: uuidv4(),
      title: titleMatch[1]?.trim() || '',
      company: companyMatch?.[1]?.trim() || '',
      location: this.extractLocation(entry) || undefined,
      startDate,
      endDate,
      current,
      description: entry.replace(titleMatch[0], '').trim(),
      technologies: techMatch?.[1] ? this.parseTechnologies(techMatch[1]) : [],
      methodologies: this.extractMethodologies(entry),
    };
  }

  private extractLocation(text: string): string | undefined {
    const locationMatch = text.match(
      /(?:in|at)\s+([A-Z][a-zA-Z\s,]+)(?:,|\s*\d{4})/,
    );
    return locationMatch?.[1]?.trim();
  }

  private parseTechnologies(text: string): string[] {
    const techList = text.split(/[,;•]/).map((t) => t.trim());
    return techList.filter((t) => t.length > 0);
  }

  private extractMethodologies(text: string): string[] {
    const methodologies = [
      'agile',
      'scrum',
      'kanban',
      'waterfall',
      'lean',
      'tdd',
      'bdd',
      'devops',
      'ci/cd',
    ];
    const found: string[] = [];
    const textLower = text.toLowerCase();
    methodologies.forEach((m) => {
      if (textLower.includes(m)) {
        found.push(m);
      }
    });
    return found;
  }

  private extractEducation(text: string): ExtractedEducation[] {
    const education: ExtractedEducation[] = [];
    const educationPattern =
      /(?:education|formation|academic|diploma|degree)[:\s]*([^]*?)(?:experience|expériences|skills|compétences|languages|langues|certifications|$)/i;
    const educationMatch = text.match(educationPattern);

    if (educationMatch && educationMatch[1]) {
      const educationText = educationMatch[1];
      const degreeEntries = this.splitEducationEntries(educationText);

      degreeEntries.forEach((entry) => {
        const edu = this.parseEducationEntry(entry);
        if (edu) {
          education.push(edu);
        }
      });
    }

    return education;
  }

  private splitEducationEntries(text: string): string[] {
    const entries: string[] = [];
    const lines = text.split('\n');
    let currentEntry = '';

    for (const line of lines) {
      if (this.isNewEducationEntry(line)) {
        if (currentEntry.trim()) {
          entries.push(currentEntry.trim());
        }
        currentEntry = line;
      } else {
        currentEntry += '\n' + line;
      }
    }

    if (currentEntry.trim()) {
      entries.push(currentEntry.trim());
    }

    return entries;
  }

  private isNewEducationEntry(line: string): boolean {
    const eduIndicators = [
      /(?:Bachelor|Master|PhD|Doctorate|Licence|Master|Doctorat|Baccalaureate|BTS|DUT|Engineering|Ingénieur|University|Université)/i,
      /^\d{4}/,
    ];
    return eduIndicators.some((pattern) => pattern.test(line));
  }

  private parseEducationEntry(entry: string): ExtractedEducation | null {
    const degreeMatch = entry.match(
      /(?:Bachelor|Master|PhD|Doctorate|Licence|Master|Doctorat|Baccalaureate|BTS|DUT|Engineering|Ingénieur)[^,\n]*/i,
    );
    const institutionMatch = entry.match(
      /(?:at|in|of|de|à|en)\s+([A-Z][^\n,]+)/i,
    );
    const fieldMatch = entry.match(/(?:in|of|de|à)\s+([A-Z][^\n,]+)/i);
    const dateMatch = entry.match(/(\d{4})\s*[-–to]+\s*(\d{4})/);
    const gpaMatch = entry.match(/(?:GPA| Moyenne)[:\s]*([\d.]+)/i);

    if (!degreeMatch) return null;

    return {
      id: uuidv4(),
      degree: degreeMatch[0].trim(),
      field: fieldMatch?.[1]?.trim() || '',
      institution: institutionMatch?.[1]?.trim() || '',
      location: this.extractLocation(entry),
      startDate: dateMatch?.[1],
      endDate: dateMatch?.[2],
      gpa: gpaMatch?.[1],
    };
  }

  private extractSkills(text: string): ExtractedSkill[] {
    const skills: ExtractedSkill[] = [];
    const skillsPattern =
      /(?:skills|compétences|technologies|stack)[:\s]*([^]*?)(?:experience|expériences|education|formation|languages|langues|certifications|interests|intérêts|$)/i;
    const skillsMatch = text.match(skillsPattern);

    if (skillsMatch && skillsMatch[1]) {
      const skillsText = skillsMatch[1];
      const skillList = this.parseSkillList(skillsText);

      skillList.forEach((skillName) => {
        const skill = this.parseSkill(skillName);
        if (skill) {
          skills.push(skill);
        }
      });
    }

    return skills;
  }

  private parseSkillList(text: string): string[] {
    const list = text
      .split(/[,;•\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2);
    return [...new Set(list)];
  }

  private parseSkill(skillName: string): ExtractedSkill | null {
    const skillLower = skillName.toLowerCase();
    let type: 'technical' | 'soft' | 'methodological' = 'technical';
    let level: 'beginner' | 'intermediate' | 'advanced' | 'expert' =
      'intermediate';

    const softSkills = [
      'communication',
      'leadership',
      'teamwork',
      'problem-solving',
      'adaptability',
      'creativity',
    ];
    const methodologies = ['agile', 'scrum', 'kanban', 'lean', 'tdd', 'bdd'];

    if (softSkills.some((s) => skillLower.includes(s))) {
      type = 'soft';
    } else if (methodologies.some((m) => skillLower.includes(m))) {
      type = 'methodological';
    }

    if (skillLower.includes('expert') || skillLower.includes('senior')) {
      level = 'expert';
    } else if (skillLower.includes('advanced') || skillLower.includes('lead')) {
      level = 'advanced';
    } else if (
      skillLower.includes('junior') ||
      skillLower.includes('beginner')
    ) {
      level = 'beginner';
    }

    return {
      id: uuidv4(),
      name: skillName,
      type,
      level,
      verified: false,
    };
  }

  private extractCertifications(text: string): ExtractedCertification[] {
    const certifications: ExtractedCertification[] = [];
    const certPattern =
      /(?:certified|certification|certificat|credential|certificate)[:\s]*([^]*?)(?:experience|expériences|education|formation|skills|compétences|languages|langues|interests|intérêts|$)/i;
    const certMatch = text.match(certPattern);

    if (certMatch && certMatch[1]) {
      const certText = certMatch[1];
      const certList = certText
        .split(/[,;•\n]/)
        .map((c) => c.trim())
        .filter((c) => c.length > 2);

      certList.forEach((certName) => {
        const issuerMatch = certName.match(
          /(?:by|from|de|par)\s+([A-Z][^\n,]+)/i,
        );
        const dateMatch = certName.match(/(\d{4})/);

        certifications.push({
          id: uuidv4(),
          name: certName
            .replace(issuerMatch?.[0] || '', '')
            .replace(dateMatch?.[0] || '', '')
            .trim(),
          issuer: issuerMatch?.[1]?.trim() || '',
          date: dateMatch?.[1],
        });
      });
    }

    return certifications;
  }

  private extractLanguages(text: string): ExtractedLanguage[] {
    const languages: ExtractedLanguage[] = [];
    const languagePattern =
      /(?:languages|langues|language skills)[:\s]*([^]*?)(?:experience|expériences|education|formation|skills|compétences|certifications|interests|intérêts|$)/i;
    const langMatch = text.match(languagePattern);

    if (langMatch && langMatch[1]) {
      const langText = langMatch[1];
      const langList = langText
        .split(/[,;•\n]/)
        .map((l) => l.trim())
        .filter((l) => l.length > 2);

      langList.forEach((langName) => {
        const lang = this.parseLanguage(langName);
        if (lang) {
          languages.push(lang);
        }
      });
    }

    return languages;
  }

  private parseLanguage(langName: string): ExtractedLanguage | null {
    const langLower = langName.toLowerCase();
    const levelMatch = langName.match(
      /(?:\(|\[)\s*([A-C][12]|native|fluent|bilingual|intermediate|beginner)\s*(?:\)|\])/i,
    );

    let level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native' = 'B2';

    if (levelMatch) {
      const levelText = levelMatch[1]?.toLowerCase() || '';
      if (
        levelText === 'native' ||
        levelText === 'fluent' ||
        levelText === 'bilingual'
      ) {
        level = 'native';
      } else if (levelText === 'c1' || levelText === 'c2') {
        level = levelText.toUpperCase() as 'C1' | 'C2';
      } else if (levelText === 'b1' || levelText === 'b2') {
        level = levelText.toUpperCase() as 'B1' | 'B2';
      } else if (levelText === 'a1' || levelText === 'a2') {
        level = levelText.toUpperCase() as 'A1' | 'A2';
      }
    }

    return {
      id: uuidv4(),
      name: langName.replace(levelMatch?.[0] || '', '').trim(),
      level,
    };
  }

  private extractCompanies(text: string): ExtractedCompany[] {
    const companies: ExtractedCompany[] = [];
    const companyPattern =
      /(?:at|@|worked at|worked @)\s+([A-Z][a-zA-Z\s&]+)(?:,|\s|\n)/g;
    let match;

    while ((match = companyPattern.exec(text)) !== null) {
      const companyName = match[1]?.trim();
      if (
        companyName &&
        companyName.length > 2 &&
        !companies.find((c) => c.name === companyName)
      ) {
        companies.push({
          id: uuidv4(),
          name: companyName,
        });
      }
    }

    return companies;
  }

  private extractTechnologies(text: string): ExtractedTechnology[] {
    const technologies: ExtractedTechnology[] = [];
    const techKeywords = [
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
      'react',
      'angular',
      'vue',
      'svelte',
      'next.js',
      'nuxt.js',
      'node.js',
      'django',
      'flask',
      'spring',
      'express',
      'fastapi',
      'docker',
      'kubernetes',
      'aws',
      'azure',
      'gcp',
      'terraform',
      'ansible',
      'postgresql',
      'mysql',
      'mongodb',
      'redis',
      'elasticsearch',
      'git',
      'github',
      'gitlab',
      'jenkins',
      'circleci',
      'travis',
    ];

    const textLower = text.toLowerCase();
    techKeywords.forEach((tech) => {
      if (
        textLower.includes(tech) &&
        !technologies.find((t) => t.name.toLowerCase() === tech)
      ) {
        technologies.push({
          id: uuidv4(),
          name: tech,
          category: this.categorizeTechnology(tech),
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

    if (languages.includes(tech.toLowerCase())) return 'language';
    if (frameworks.includes(tech.toLowerCase())) return 'framework';
    if (databases.includes(tech.toLowerCase())) return 'database';
    if (platforms.includes(tech.toLowerCase())) return 'platform';
    return 'tool';
  }

  private extractProjects(text: string): ExtractedProject[] {
    const projects: ExtractedProject[] = [];
    const projectPattern =
      /(?:project|projects|portfolio)[:\s]*([^]*?)(?:experience|expériences|education|formation|skills|compétences|languages|langues|certifications|interests|intérêts|$)/i;
    const projectMatch = text.match(projectPattern);

    if (projectMatch && projectMatch[1]) {
      const projectText = projectMatch[1];
      const projectEntries = this.splitProjectEntries(projectText);

      projectEntries.forEach((entry) => {
        const project = this.parseProjectEntry(entry);
        if (project) {
          projects.push(project);
        }
      });
    }

    return projects;
  }

  private splitProjectEntries(text: string): string[] {
    const entries: string[] = [];
    const lines = text.split('\n');
    let currentEntry = '';

    for (const line of lines) {
      if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        if (currentEntry.trim()) {
          entries.push(currentEntry.trim());
        }
        currentEntry = line;
      } else {
        currentEntry += '\n' + line;
      }
    }

    if (currentEntry.trim()) {
      entries.push(currentEntry.trim());
    }

    return entries;
  }

  private parseProjectEntry(entry: string): ExtractedProject | null {
    const nameMatch = entry.match(/[-•]\s*([A-Z][^\n]+)/);
    const techMatch = entry.match(/(?:technologies|tech|stack)[:\s]*([^\n]+)/i);
    const urlMatch = entry.match(/(?:url|link|github)[:\s]*([^\s]+)/i);

    if (!nameMatch) return null;

    return {
      id: uuidv4(),
      name: nameMatch[1]?.trim() || '',
      description: entry.replace(nameMatch[0], '').trim(),
      technologies: techMatch?.[1] ? this.parseTechnologies(techMatch[1]) : [],
      url: urlMatch?.[1],
    };
  }

  private calculateOverallConfidence(text: string): number {
    let confidence = 0.5;
    const textLength = text.length;

    if (textLength > 500) confidence += 0.1;
    if (textLength > 1000) confidence += 0.1;
    if (textLength > 2000) confidence += 0.1;

    if (text.includes('@')) confidence += 0.05;
    if (text.match(/\d{3}[- ]?\d{3}[- ]?\d{4}/)) confidence += 0.05;

    return Math.min(confidence, 1.0);
  }
}
