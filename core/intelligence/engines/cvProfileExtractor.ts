/**
 * CV Profile Extractor Engine
 * 
 * Responsibility: Extract structured candidate profile data from CV text
 * 
 * This engine transforms raw CV text into structured data for CandidateGraph,
 * including experiences, skills, education, achievements, and implicit skills.
 * All extracted data includes explainability (source, proof, confidence, explanation).
 * 
 * Constraints:
 * - Deterministic: Same input always produces same output
 * - No new architectural components
 * - Reuses existing CandidateGraph structure
 * - All data includes explainability
 */

export interface CVExtractionInput {
  cvText: string;
  cvId: string;
  userId: string;
}

export interface Explainability {
  source: string;           // Where the data comes from (e.g., "Experience section, line 15")
  proof: string;            // Direct quote or reference from CV
  confidence: number;      // 0-100 confidence score
  explanation: string;     // Why this extraction was made
}

export interface ExperienceWithProof {
  company: string;
  sector?: string;
  position: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  missions?: string[];
  responsibilities?: string[];
  achievements?: string[];
  measurableResults?: string[];
  technologies?: string[];
  tools?: string[];
  management?: {
    teamSize?: number;
    budget?: string;
    level?: string;
  };
  explainability: Explainability;
}

export interface SkillWithProof {
  name: string;
  category: "hard" | "soft" | "framework" | "technology" | "cloud" | "method" | "tool" | "language";
  level: number;           // 0-100
  confidence: number;
  lastAssessed: Date;
  demonstratedIn?: string[];  // Experiences where this skill is demonstrated
  explainability: Explainability;
}

export interface EducationWithProof {
  degree: string;
  institution: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  year?: number;
  specialization?: string;
  explainability: Explainability;
}

export interface CertificationWithProof {
  name: string;
  issuer?: string;
  date?: string;
  expiryDate?: string;
  explainability: Explainability;
}

export interface LanguageWithProof {
  name: string;
  level: string;
  proof?: string;
  explainability: Explainability;
}

export interface ProjectWithProof {
  context: string;
  role: string;
  technologies: string[];
  results: string[];
  demonstratedSkills: string[];
  explainability: Explainability;
}

export interface AchievementWithProof {
  description: string;
  experience?: string;
  skill?: string;
  proof: string;
  explainability: Explainability;
}

export interface ImplicitSkillWithProof {
  name: string;
  category: "management" | "leadership" | "communication" | "negotiation" | "architecture" | "mentorship" | "crisis_management";
  confidence: number;
  demonstratedIn: string[];
  explainability: Explainability;
}

export interface CareerEvolution {
  promotions: Array<{
    from: string;
    to: string;
    company: string;
    date?: string;
    explainability: Explainability;
  }>;
  progressions: Array<{
    description: string;
    explainability: Explainability;
  }>;
  responsibilityChanges: Array<{
    description: string;
    explainability: Explainability;
  }>;
  sectorChanges: Array<{
    from: string;
    to: string;
    explainability: Explainability;
  }>;
}

export interface Inconsistency {
  type: "gap" | "overlap" | "unusual_duration" | "frequent_changes";
  description: string;
  severity: "low" | "medium" | "high";
  explainability: Explainability;
}

export interface ATSKeywords {
  technologies: string[];
  jobTitles: string[];
  certifications: string[];
  sectors: string[];
  skills: string[];
  explainability: Explainability;
}

export interface StrengthWithProof {
  description: string;
  demonstratedIn: string[];
  proof: string;
  explainability: Explainability;
}

export interface VigilanceZone {
  type: "under_demonstrated_skill" | "short_experience" | "frequent_changes" | "unproven_skill";
  description: string;
  severity: "low" | "medium" | "high";
  explainability: Explainability;
}

// REMOVED: ProbableInterviewQuestion - violates single responsibility (interview preparation is not CV extraction)

export interface CVExtractionOutput {
  // Personal info
  personalInfo: {
    name?: string;
    title?: string;
    location?: string;
    availability?: string;
    yearsOfExperience?: number;
    explainability: Explainability;
  };
  
  // Experiences
  experiences: ExperienceWithProof[];
  
  // Skills
  skills: SkillWithProof[];
  
  // Education
  education: EducationWithProof[];
  
  // Certifications
  certifications: CertificationWithProof[];
  
  // Languages
  languages: LanguageWithProof[];
  
  // Projects
  projects: ProjectWithProof[];
  
  // Achievements
  achievements: AchievementWithProof[];
  
  // Implicit skills
  implicitSkills: ImplicitSkillWithProof[];
  
  // Career evolution
  careerEvolution: CareerEvolution;
  
  // Inconsistencies
  inconsistencies: Inconsistency[];
  
  // ATS keywords
  atsKeywords: ATSKeywords;
  
  // Strengths
  strengths: StrengthWithProof[];
  
  // Vigilance zones
  vigilanceZones: VigilanceZone[];
  
  // REMOVED: probableInterviewQuestions - violates single responsibility (interview preparation is not CV extraction)
  
  // Metadata
  metadata: {
    cvId: string;
    userId: string;
    extractedAt: Date;
    version: string;
    confidence: number;
  };
}

export class CVProfileExtractorEngine {
  /**
   * Extract structured profile from CV text
   * 
   * This is a deterministic function: same input always produces same output
   */
  static extract(input: CVExtractionInput): CVExtractionOutput {
    const lines = input.cvText.split('\n');
    const sections = this.identifySections(lines);
    
    return {
      personalInfo: this.extractPersonalInfo(lines, sections),
      experiences: this.extractExperiences(lines, sections),
      skills: this.extractSkills(lines, sections),
      education: this.extractEducation(lines, sections),
      certifications: this.extractCertifications(lines, sections),
      languages: this.extractLanguages(lines, sections),
      projects: this.extractProjects(lines, sections),
      achievements: this.extractAchievements(lines, sections),
      implicitSkills: this.extractImplicitSkills(lines, sections),
      careerEvolution: this.analyzeCareerEvolution(lines, sections),
      inconsistencies: this.detectInconsistencies(lines, sections),
      atsKeywords: this.extractATSKeywords(lines, sections),
      strengths: this.identifyStrengths(lines, sections),
      vigilanceZones: this.identifyVigilanceZones(lines, sections),
      // REMOVED: probableInterviewQuestions - violates single responsibility (interview preparation is not CV extraction)
      metadata: {
        cvId: input.cvId,
        userId: input.userId,
        extractedAt: new Date(0), // Fixed date for determinism (epoch)
        version: "1.0",
        confidence: this.calculateOverallConfidence(lines, sections),
      },
    };
  }
  
  /**
   * Identify sections in CV (deterministic)
   */
  private static identifySections(lines: string[]): Record<string, { start: number; end: number }> {
    const sections: Record<string, { start: number; end: number }> = {};
    const sectionKeywords = {
      experience: ['experience', 'work experience', 'professional experience', 'employment', 'work history'],
      education: ['education', 'academic', 'qualifications', 'training'],
      skills: ['skills', 'competencies', 'technologies', 'technical skills'],
      projects: ['projects', 'portfolio', 'key projects'],
      certifications: ['certifications', 'certificates', 'credentials'],
      languages: ['languages', 'language proficiency'],
      achievements: ['achievements', 'accomplishments', 'key achievements'],
    };
    
    let currentSection = 'header';
    let sectionStart = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]?.toLowerCase().trim();
      if (!line) continue;
      
      // Check if this line starts a new section
      for (const [section, keywords] of Object.entries(sectionKeywords)) {
        if (keywords.some(keyword => line.startsWith(keyword) || line === keyword)) {
          // Save previous section
          if (currentSection !== 'header') {
            sections[currentSection] = { start: sectionStart, end: i - 1 };
          }
          // Start new section
          currentSection = section;
          sectionStart = i + 1;
          break;
        }
      }
    }
    
    // Save last section
    if (currentSection !== 'header') {
      sections[currentSection] = { start: sectionStart, end: lines.length - 1 };
    }
    
    return sections;
  }
  
  /**
   * Extract personal information
   */
  private static extractPersonalInfo(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): CVExtractionOutput['personalInfo'] {
    const headerLines = lines.slice(0, sections.experience?.start || 10);
    const name = this.extractName(headerLines);
    const title = this.extractTitle(headerLines);
    const location = this.extractLocation(headerLines);
    
    return {
      name,
      title,
      location,
      availability: undefined, // Not typically in CV
      yearsOfExperience: this.calculateYearsOfExperience(lines, sections),
      explainability: {
        source: "Header section",
        proof: headerLines.slice(0, 3).join(' | '),
        confidence: name ? 80 : 50,
        explanation: "Extracted from header lines using pattern matching",
      },
    };
  }
  
  /**
   * Extract experiences
   */
  private static extractExperiences(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): ExperienceWithProof[] {
    const experiences: ExperienceWithProof[] = [];
    const expSection = sections.experience;
    
    if (!expSection) return experiences;
    
    const expLines = lines.slice(expSection.start, expSection.end + 1);
    const experienceBlocks = this.splitExperienceBlocks(expLines);
    
    for (const block of experienceBlocks) {
      const experience = this.parseExperienceBlock(block);
      if (experience) {
        experiences.push(experience);
      }
    }
    
    return experiences;
  }
  
  /**
   * Extract skills
   */
  private static extractSkills(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): SkillWithProof[] {
    const skills: SkillWithProof[] = [];
    const skillsSection = sections.skills;
    
    if (!skillsSection) {
      // Try to extract from experiences if no skills section
      return this.extractSkillsFromExperiences(lines, sections);
    }
    
    const skillsLines = lines.slice(skillsSection.start, skillsSection.end + 1);
    const skillCategories = this.identifySkillCategories(skillsLines);
    
    for (const [category, categoryLines] of Object.entries(skillCategories)) {
      const categorySkills = this.parseSkillsFromLines(categoryLines, category);
      skills.push(...categorySkills);
    }
    
    return skills;
  }
  
  /**
   * Extract education
   */
  private static extractEducation(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): EducationWithProof[] {
    const education: EducationWithProof[] = [];
    const eduSection = sections.education;
    
    if (!eduSection) return education;
    
    const eduLines = lines.slice(eduSection.start, eduSection.end + 1);
    const educationBlocks = this.splitEducationBlocks(eduLines);
    
    for (const block of educationBlocks) {
      const edu = this.parseEducationBlock(block);
      if (edu) {
        education.push(edu);
      }
    }
    
    return education;
  }
  
  /**
   * Extract certifications
   */
  private static extractCertifications(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): CertificationWithProof[] {
    const certifications: CertificationWithProof[] = [];
    const certSection = sections.certifications;
    
    if (!certSection) return certifications;
    
    const certLines = lines.slice(certSection.start, certSection.end + 1);
    
    for (const line of certLines) {
      if (line.trim()) {
        certifications.push({
          name: line.trim(),
          explainability: {
            source: "Certifications section",
            proof: line,
            confidence: 90,
            explanation: "Extracted directly from certifications section",
          },
        });
      }
    }
    
    return certifications;
  }
  
  /**
   * Extract languages
   */
  private static extractLanguages(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): LanguageWithProof[] {
    const languages: LanguageWithProof[] = [];
    const langSection = sections.languages;
    
    if (!langSection) {
      // Try to extract from header or skills
      return this.extractLanguagesFromOtherSections(lines, sections);
    }
    
    const langLines = lines.slice(langSection.start, langSection.end + 1);
    
    for (const line of langLines) {
      const langMatch = line.match(/^([a-zA-Z\s]+):\s*(.+)$/i);
      if (langMatch) {
        languages.push({
          name: langMatch[1]?.trim() || '',
          level: langMatch[2]?.trim() || '',
          explainability: {
            source: "Languages section",
            proof: line,
            confidence: 85,
            explanation: "Extracted using pattern 'Language: Level'",
          },
        });
      }
    }
    
    return languages;
  }
  
  /**
   * Extract projects
   */
  private static extractProjects(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): ProjectWithProof[] {
    const projects: ProjectWithProof[] = [];
    const projSection = sections.projects;
    
    if (!projSection) return projects;
    
    const projLines = lines.slice(projSection.start, projSection.end + 1);
    const projectBlocks = this.splitProjectBlocks(projLines);
    
    for (const block of projectBlocks) {
      const project = this.parseProjectBlock(block);
      if (project) {
        projects.push(project);
      }
    }
    
    return projects;
  }
  
  /**
   * Extract achievements
   */
  private static extractAchievements(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): AchievementWithProof[] {
    const achievements: AchievementWithProof[] = [];
    
    // Extract from achievements section if exists
    const achSection = sections.achievements;
    if (achSection) {
      const achLines = lines.slice(achSection.start, achSection.end + 1);
      for (const line of achLines) {
        if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
          achievements.push({
            description: line.trim().substring(1).trim(),
            proof: line,
            explainability: {
              source: "Achievements section",
              proof: line,
              confidence: 75,
              explanation: "Extracted from bullet points in achievements section",
            },
          });
        }
      }
    }
    
    // Extract from experience bullets
    const expSection = sections.experience;
    if (expSection) {
      const expLines = lines.slice(expSection.start, expSection.end + 1);
      for (const line of expLines) {
        const achievement = this.extractAchievementFromLine(line);
        if (achievement) {
          achievements.push(achievement);
        }
      }
    }
    
    return achievements;
  }
  
  /**
   * Extract implicit skills (deduced from experience)
   */
  private static extractImplicitSkills(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): ImplicitSkillWithProof[] {
    const implicitSkills: ImplicitSkillWithProof[] = [];
    const expSection = sections.experience;
    
    if (!expSection) return implicitSkills;
    
    const expLines = lines.slice(expSection.start, expSection.end + 1);
    const text = expLines.join(' ').toLowerCase();
    
    // Management indicators
    if (text.includes('managed') || text.includes('led team') || text.includes('team lead')) {
      implicitSkills.push({
        name: 'Team Management',
        category: 'management',
        confidence: 70,
        demonstratedIn: ['Experience section'],
        explainability: {
          source: "Experience section",
          proof: this.findProof(expLines, ['managed', 'led team', 'team lead']),
          confidence: 70,
          explanation: "Deduced from management-related keywords",
        },
      });
    }
    
    // Leadership indicators
    if (text.includes('leadership') || text.includes('headed') || text.includes('directed')) {
      implicitSkills.push({
        name: 'Leadership',
        category: 'leadership',
        confidence: 75,
        demonstratedIn: ['Experience section'],
        explainability: {
          source: "Experience section",
          proof: this.findProof(expLines, ['leadership', 'headed', 'directed']),
          confidence: 75,
          explanation: "Deduced from leadership-related keywords",
        },
      });
    }
    
    // Communication indicators
    if (text.includes('presented') || text.includes('negotiated') || text.includes('collaborated')) {
      implicitSkills.push({
        name: 'Communication',
        category: 'communication',
        confidence: 65,
        demonstratedIn: ['Experience section'],
        explainability: {
          source: "Experience section",
          proof: this.findProof(expLines, ['presented', 'negotiated', 'collaborated']),
          confidence: 65,
          explanation: "Deduced from communication-related keywords",
        },
      });
    }
    
    // Architecture indicators
    if (text.includes('architected') || text.includes('designed system') || text.includes('technical design')) {
      implicitSkills.push({
        name: 'System Architecture',
        category: 'architecture',
        confidence: 70,
        demonstratedIn: ['Experience section'],
        explainability: {
          source: "Experience section",
          proof: this.findProof(expLines, ['architected', 'designed system', 'technical design']),
          confidence: 70,
          explanation: "Deduced from architecture-related keywords",
        },
      });
    }
    
    // Mentorship indicators
    if (text.includes('mentored') || text.includes('coached') || text.includes('trained')) {
      implicitSkills.push({
        name: 'Mentorship',
        category: 'mentorship',
        confidence: 70,
        demonstratedIn: ['Experience section'],
        explainability: {
          source: "Experience section",
          proof: this.findProof(expLines, ['mentored', 'coached', 'trained']),
          confidence: 70,
          explanation: "Deduced from mentorship-related keywords",
        },
      });
    }
    
    return implicitSkills;
  }
  
  /**
   * Analyze career evolution
   */
  private static analyzeCareerEvolution(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): CareerEvolution {
    const evolution: CareerEvolution = {
      promotions: [],
      progressions: [],
      responsibilityChanges: [],
      sectorChanges: [],
    };
    
    const expSection = sections.experience;
    if (!expSection) return evolution;
    
    const expLines = lines.slice(expSection.start, expSection.end + 1);
    const experiences = this.extractExperiences(lines, sections);
    
    // Detect promotions (title changes within same company)
    for (let i = 1; i < experiences.length; i++) {
      const prev = experiences[i - 1];
      const curr = experiences[i];
      
      if (!prev || !curr) continue;
      
      if (prev.company === curr.company && prev.position !== curr.position) {
        evolution.promotions.push({
          from: prev.position,
          to: curr.position,
          company: prev.company,
          explainability: {
            source: "Experience section",
            proof: `${prev.company}: ${prev.position} → ${curr.position}`,
            confidence: 80,
            explanation: "Detected title change within same company",
          },
        });
      }
    }
    
    return evolution;
  }
  
  /**
   * Detect inconsistencies
   */
  private static detectInconsistencies(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): Inconsistency[] {
    const inconsistencies: Inconsistency[] = [];
    const experiences = this.extractExperiences(lines, sections);
    
    // Detect gaps
    for (let i = 1; i < experiences.length; i++) {
      const prev = experiences[i - 1];
      const curr = experiences[i];
      
      if (!prev || !curr) continue;
      
      if (prev.endDate && curr.startDate) {
        const prevEnd = new Date(prev.endDate);
        const currStart = new Date(curr.startDate);
        const gapMonths = (currStart.getTime() - prevEnd.getTime()) / (1000 * 60 * 60 * 24 * 30);
        
        if (gapMonths > 6) {
          inconsistencies.push({
            type: "gap",
            description: `Gap of ${Math.round(gapMonths)} months between ${prev.company} and ${curr.company}`,
            severity: gapMonths > 12 ? "high" : "medium",
            explainability: {
              source: "Experience section",
              proof: `${prev.endDate} → ${curr.startDate}`,
              confidence: 90,
              explanation: "Calculated gap between end date and start date",
            },
          });
        }
      }
    }
    
    // Detect frequent changes
    const jobChanges = experiences.length;
    if (jobChanges > 5 && experiences.length > 0) {
      const yearsSpan = this.calculateYearsOfExperience(lines, sections) || 1;
      const changesPerYear = jobChanges / yearsSpan;
      
      if (changesPerYear > 1) {
        inconsistencies.push({
          type: "frequent_changes",
          description: `${jobChanges} positions in ${Math.round(yearsSpan)} years`,
          severity: "medium",
          explainability: {
            source: "Experience section",
            proof: `${jobChanges} positions found`,
            confidence: 85,
            explanation: "Calculated job change frequency",
          },
        });
      }
    }
    
    return inconsistencies;
  }
  
  /**
   * Extract ATS keywords
   */
  private static extractATSKeywords(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): ATSKeywords {
    const text = lines.join(' ').toLowerCase();
    const skills = this.extractSkills(lines, sections);
    
    const technologies = skills
      .filter(s => ['technology', 'framework', 'cloud', 'tool'].includes(s.category))
      .map(s => s.name);
    
    const atsKeywords: ATSKeywords = {
      technologies: Array.from(new Set(technologies)),
      jobTitles: this.extractJobTitles(lines, sections),
      certifications: this.extractCertifications(lines, sections).map(c => c.name),
      sectors: this.extractSectors(lines, sections),
      skills: skills.map(s => s.name),
      explainability: {
        source: "Full CV text",
        proof: "Keyword extraction from all sections",
        confidence: 70,
        explanation: "Extracted using keyword matching and frequency analysis",
      },
    };
    
    return atsKeywords;
  }
  
  /**
   * Identify strengths (demonstrated achievements)
   */
  private static identifyStrengths(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): StrengthWithProof[] {
    const strengths: StrengthWithProof[] = [];
    const achievements = this.extractAchievements(lines, sections);
    
    // Convert achievements with measurable results to strengths
    for (const achievement of achievements) {
      if (this.hasMeasurableResult(achievement.description)) {
        strengths.push({
          description: achievement.description,
          demonstratedIn: achievement.experience ? [achievement.experience] : [],
          proof: achievement.proof,
          explainability: {
            source: "Achievements section",
            proof: achievement.proof,
            confidence: 80,
            explanation: "Identified as strength due to measurable result",
          },
        });
      }
    }
    
    return strengths;
  }
  
  /**
   * Identify vigilance zones
   */
  private static identifyVigilanceZones(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): VigilanceZone[] {
    const vigilanceZones: VigilanceZone[] = [];
    const inconsistencies = this.detectInconsistencies(lines, sections);
    const experiences = this.extractExperiences(lines, sections);
    
    // Convert inconsistencies to vigilance zones
    for (const inconsistency of inconsistencies) {
      if (inconsistency.type === "gap" || inconsistency.type === "frequent_changes") {
        vigilanceZones.push({
          type: inconsistency.type === "gap" ? "short_experience" : "frequent_changes",
          description: inconsistency.description,
          severity: inconsistency.severity,
          explainability: inconsistency.explainability,
        });
      }
    }
    
    // Detect short experiences
    for (const exp of experiences) {
      if (exp.duration && exp.duration.includes('month') && !exp.duration.includes('year')) {
        const months = parseInt(exp.duration) || 0;
        if (months < 6) {
          vigilanceZones.push({
            type: "short_experience",
            description: `Short experience at ${exp.company} (${exp.duration})`,
            severity: "medium",
            explainability: {
              source: "Experience section",
              proof: `${exp.company}: ${exp.duration}`,
              confidence: 85,
              explanation: "Experience duration less than 6 months",
            },
          });
        }
      }
    }
    
    return vigilanceZones;
  }
  
  // REMOVED: generateProbableQuestions - violates single responsibility (interview preparation is not CV extraction)
  
  /**
   * Calculate overall confidence
   */
  private static calculateOverallConfidence(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): number {
    let confidence = 50;
    
    // Boost confidence if key sections exist
    if (sections.experience) confidence += 15;
    if (sections.education) confidence += 10;
    if (sections.skills) confidence += 10;
    
    // Reduce confidence if sections are missing
    if (!sections.experience) confidence -= 10;
    
    return Math.min(100, Math.max(0, confidence));
  }
  
  // Helper methods
  
  private static extractName(lines: string[]): string | undefined {
    for (const line of lines.slice(0, 5)) {
      if (line.trim() && !line.includes('@') && !line.includes('http')) {
        const words = line.trim().split(' ');
        if (words.length >= 2 && words.length <= 4) {
          return line.trim();
        }
      }
    }
    return undefined;
  }
  
  private static extractTitle(lines: string[]): string | undefined {
    for (const line of lines.slice(0, 5)) {
      const titleKeywords = ['engineer', 'developer', 'manager', 'director', 'analyst', 'consultant', 'specialist', 'lead', 'architect'];
      const lowerLine = line.toLowerCase();
      if (titleKeywords.some(keyword => lowerLine.includes(keyword))) {
        return line.trim();
      }
    }
    return undefined;
  }
  
  private static extractLocation(lines: string[]): string | undefined {
    for (const line of lines.slice(0, 5)) {
      const locationMatch = line.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?,\s*[A-Z]{2})/);
      if (locationMatch) {
        return locationMatch[1];
      }
    }
    return undefined;
  }
  
  private static calculateYearsOfExperience(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): number | undefined {
    const experiences = this.extractExperiences(lines, sections);
    if (experiences.length === 0) return undefined;
    
    let totalMonths = 0;
    for (const exp of experiences) {
      if (exp.startDate && exp.endDate) {
        const start = new Date(exp.startDate);
        const end = new Date(exp.endDate);
        totalMonths += (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
      }
    }
    
    return Math.round(totalMonths / 12);
  }
  
  private static splitExperienceBlocks(lines: string[]): string[][] {
    const blocks: string[][] = [];
    let currentBlock: string[] = [];
    
    for (const line of lines) {
      // New experience block starts with company name (capitalized, no bullet)
      if (line.trim() && !line.trim().startsWith('•') && !line.trim().startsWith('-') && /^[A-Z]/.test(line.trim())) {
        if (currentBlock.length > 0) {
          blocks.push(currentBlock);
        }
        currentBlock = [line];
      } else {
        currentBlock.push(line);
      }
    }
    
    if (currentBlock.length > 0) {
      blocks.push(currentBlock);
    }
    
    return blocks;
  }
  
  private static parseExperienceBlock(block: string[]): ExperienceWithProof | null {
    if (block.length === 0) return null;
    
    const firstLine = block[0];
    if (!firstLine) return null;
    
    const companyMatch = firstLine.match(/^([A-Z][^,]+(?:\s+[A-Z][^,]+)*)/);
    const company = companyMatch?.[1]?.trim() || 'Unknown Company';
    
    const positionMatch = firstLine.match(/(?:at|@|-|–)\s*(.+)$/i);
    const position = positionMatch?.[1]?.trim() || 'Unknown Position';
    
    const dateMatch = firstLine.match(/(\d{4})\s*[-–]\s*(\d{4}|present|now)/i);
    const startDate = dateMatch?.[1];
    const endDate = dateMatch?.[2] ? (dateMatch[2].toLowerCase() === 'present' || dateMatch[2].toLowerCase() === 'now' ? 'Present' : dateMatch[2]) : undefined;
    
    const bullets = block.slice(1).filter(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*'));
    const achievements = bullets.filter(b => this.hasMeasurableResult(b)).map(b => b.trim().substring(1).trim());
    const responsibilities = bullets.filter(b => !this.hasMeasurableResult(b)).map(b => b.trim().substring(1).trim());
    
    return {
      company,
      position,
      startDate,
      endDate,
      duration: this.calculateDuration(startDate, endDate),
      responsibilities,
      achievements,
      measurableResults: achievements,
      explainability: {
        source: "Experience section",
        proof: firstLine,
        confidence: 75,
        explanation: "Parsed using pattern matching for company, position, and dates",
      },
    };
  }
  
  private static calculateDuration(startDate?: string, endDate?: string): string | undefined {
    if (!startDate || !endDate) return undefined;
    
    const start = new Date(startDate);
    const end = endDate === 'Present' ? new Date(0) : new Date(endDate); // Fixed date for determinism
    const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (months >= 12) {
      return `${Math.round(months / 12)} years`;
    }
    return `${Math.round(months)} months`;
  }
  
  private static hasMeasurableResult(text: string): boolean {
    const measurableIndicators = ['%', '$', '€', '£', 'increased', 'decreased', 'reduced', 'improved', 'saved', 'generated', 'delivered'];
    return measurableIndicators.some(indicator => text.toLowerCase().includes(indicator));
  }
  
  private static identifySkillCategories(lines: string[]): Record<string, string[]> {
    const categories: Record<string, string[]> = {
      hard: [],
      soft: [],
      frameworks: [],
      technologies: [],
      cloud: [],
      methods: [],
      tools: [],
      languages: [],
    };
    
    let currentCategory = 'hard';
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase().trim();
      
      if (lowerLine.includes('hard skills') || lowerLine.includes('technical')) {
        currentCategory = 'hard';
      } else if (lowerLine.includes('soft skills')) {
        currentCategory = 'soft';
      } else if (lowerLine.includes('frameworks')) {
        currentCategory = 'frameworks';
      } else if (lowerLine.includes('cloud')) {
        currentCategory = 'cloud';
      } else if (lowerLine.includes('methods') || lowerLine.includes('methodologies')) {
        currentCategory = 'methods';
      } else if (lowerLine.includes('tools')) {
        currentCategory = 'tools';
      } else if (lowerLine.includes('languages')) {
        currentCategory = 'languages';
      } else if (line.trim() && !line.trim().startsWith('•') && !line.trim().startsWith('-')) {
        currentCategory = 'hard'; // Default
      } else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        (categories[currentCategory] ??= []).push(line.trim().substring(1).trim());
      }
    }
    
    return categories;
  }
  
  private static parseSkillsFromLines(lines: string[], category: string): SkillWithProof[] {
    const skills: SkillWithProof[] = [];
    
    for (const line of lines) {
      if (line.trim()) {
        skills.push({
          name: line.trim(),
          category: category as "hard" | "soft" | "framework" | "technology" | "cloud" | "method" | "tool" | "language",
          level: 70, // Default level
          confidence: 70,
          lastAssessed: new Date(),
          explainability: {
            source: "Skills section",
            proof: line,
            confidence: 70,
            explanation: "Extracted from skills section",
          },
        });
      }
    }
    
    return skills;
  }
  
  private static extractSkillsFromExperiences(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): SkillWithProof[] {
    const skills: SkillWithProof[] = [];
    const expSection = sections.experience;
    
    if (!expSection) return skills;
    
    const expLines = lines.slice(expSection.start, expSection.end + 1);
    const text = expLines.join(' ');
    
    // Common technology keywords
    const techKeywords = [
      'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue', 'node',
      'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'docker', 'kubernetes', 'aws',
      'azure', 'gcp', 'git', 'agile', 'scrum', 'rest', 'graphql', 'api', 'microservices',
    ];
    
    for (const keyword of techKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        skills.push({
          name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
          category: 'technology',
          level: 70,
          confidence: 60,
          lastAssessed: new Date(),
          explainability: {
            source: "Experience section",
            proof: this.findProof(expLines, [keyword]),
            confidence: 60,
            explanation: "Extracted from experience text using keyword matching",
          },
        });
      }
    }
    
    return skills;
  }
  
  private static splitEducationBlocks(lines: string[]): string[][] {
    const blocks: string[][] = [];
    let currentBlock: string[] = [];
    
    for (const line of lines) {
      if (line.trim() && !line.trim().startsWith('•') && /^[A-Z]/.test(line.trim())) {
        if (currentBlock.length > 0) {
          blocks.push(currentBlock);
        }
        currentBlock = [line];
      } else {
        currentBlock.push(line);
      }
    }
    
    if (currentBlock.length > 0) {
      blocks.push(currentBlock);
    }
    
    return blocks;
  }
  
  private static parseEducationBlock(block: string[]): EducationWithProof | null {
    if (block.length === 0) return null;
    
    const firstLine = block[0];
    if (!firstLine) return null;
    
    const degreeMatch = firstLine.match(/(Bachelor|Master|PhD|Doctorate|MBA|BSc|MSc|B\.A\.|M\.A\.)/i);
    const degree = degreeMatch ? degreeMatch[1] : 'Degree';
    
    const institutionMatch = firstLine.match(/(?:at|in|of|from)\s+([A-Z][^,]+)/i);
    const institution = institutionMatch?.[1]?.trim() || 'Unknown Institution';
    
    const dateMatch = firstLine.match(/(\d{4})/);
    const year = dateMatch?.[1] ? parseInt(dateMatch[1]) : undefined;
    
    return {
      degree: degree || 'Degree',
      institution,
      year,
      explainability: {
        source: "Education section",
        proof: firstLine,
        confidence: 75,
        explanation: "Parsed using pattern matching for degree and institution",
      },
    };
  }
  
  private static extractLanguagesFromOtherSections(
    lines: string[],
    sections: Record<string, { start: number; end: number }>
  ): LanguageWithProof[] {
    const languages: LanguageWithProof[] = [];
    const text = lines.join(' ').toLowerCase();
    
    const languageKeywords = {
      'english': 'Fluent',
      'french': 'Fluent',
      'spanish': 'Intermediate',
      'german': 'Intermediate',
      'italian': 'Basic',
    };
    
    for (const [lang, level] of Object.entries(languageKeywords)) {
      if (text.includes(lang)) {
        languages.push({
          name: lang.charAt(0).toUpperCase() + lang.slice(1),
          level,
          explainability: {
            source: "Full CV text",
            proof: this.findProof(lines, [lang]),
            confidence: 50,
            explanation: "Extracted using keyword matching",
          },
        });
      }
    }
    
    return languages;
  }
  
  private static splitProjectBlocks(lines: string[]): string[][] {
    const blocks: string[][] = [];
    let currentBlock: string[] = [];
    
    for (const line of lines) {
      if (line.trim() && !line.trim().startsWith('•') && /^[A-Z]/.test(line.trim())) {
        if (currentBlock.length > 0) {
          blocks.push(currentBlock);
        }
        currentBlock = [line];
      } else {
        currentBlock.push(line);
      }
    }
    
    if (currentBlock.length > 0) {
      blocks.push(currentBlock);
    }
    
    return blocks;
  }
  
  private static parseProjectBlock(block: string[]): ProjectWithProof | null {
    if (block.length === 0) return null;
    
    const firstLine = block[0];
    if (!firstLine) return null;
    
    const bullets = block.slice(1).filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'));
    
    return {
      context: firstLine.trim(),
      role: 'Contributor',
      technologies: this.extractTechnologiesFromText(block.join(' ')),
      results: bullets.map(b => b.trim().substring(1).trim()),
      demonstratedSkills: [],
      explainability: {
        source: "Projects section",
        proof: firstLine,
        confidence: 65,
        explanation: "Parsed using pattern matching",
      },
    };
  }
  
  private static extractTechnologiesFromText(text: string): string[] {
    const techKeywords = ['react', 'angular', 'vue', 'node', 'python', 'java', 'javascript', 'typescript', 'sql', 'docker', 'aws', 'azure'];
    const found: string[] = [];
    
    for (const keyword of techKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        found.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    }
    
    return Array.from(new Set(found));
  }
  
  private static extractAchievementFromLine(line: string): AchievementWithProof | null {
    if (this.hasMeasurableResult(line)) {
      const description = line.trim().substring(1).trim();
      return {
        description,
        proof: line,
        explainability: {
          source: "Experience section",
          proof: line,
          confidence: 75,
          explanation: "Identified as achievement due to measurable result",
        },
      };
    }
    return null;
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
  
  private static extractJobTitles(lines: string[], sections: Record<string, { start: number; end: number }>): string[] {
    const titles: string[] = [];
    const expSection = sections.experience;
    
    if (!expSection) return titles;
    
    const expLines = lines.slice(expSection.start, expSection.end + 1);
    const titleKeywords = ['engineer', 'developer', 'manager', 'director', 'analyst', 'consultant', 'specialist', 'lead', 'architect'];
    
    for (const line of expLines) {
      for (const keyword of titleKeywords) {
        if (line.toLowerCase().includes(keyword)) {
          const trimmed = line.trim();
          if (trimmed) {
            titles.push(trimmed);
          }
          break;
        }
      }
    }
    
    return Array.from(new Set(titles));
  }
  
  private static extractSectors(lines: string[], sections: Record<string, { start: number; end: number }>): string[] {
    const sectors: string[] = [];
    const text = lines.join(' ').toLowerCase();
    
    const sectorKeywords = ['finance', 'healthcare', 'technology', 'retail', 'manufacturing', 'education', 'government', 'consulting'];
    
    for (const keyword of sectorKeywords) {
      if (text.includes(keyword)) {
        sectors.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    }
    
    return Array.from(new Set(sectors));
  }
}
