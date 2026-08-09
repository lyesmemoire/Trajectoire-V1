import { Injectable } from '@nestjs/common';
import { NormalizationService } from '../cv/normalization.service';

interface NormalizedElement {
  rawValue: string;
  normalizedValue: string;
  confidence: number;
  synonyms: string[];
  variants: string[];
  knowledgePackId: string;
}

@Injectable()
export class JobNormalizationService {
  constructor(private readonly normalizationService: NormalizationService) {}

  normalizeJobKnowledge(knowledge: any) {
    // Normalize job title
    const normalizedTitle = this.normalizeJobTitle(knowledge.title);

    // Normalize required skills
    const normalizedRequiredSkills =
      knowledge.requiredSkills?.map((skill: any) =>
        this.normalizeSkill(skill),
      ) || [];

    // Normalize preferred skills
    const normalizedPreferredSkills =
      knowledge.preferredSkills?.map((skill: any) =>
        this.normalizeSkill(skill),
      ) || [];

    // Normalize soft skills
    const normalizedSoftSkills =
      knowledge.softSkills?.map((skill: any) => this.normalizeSkill(skill)) ||
      [];

    // Normalize languages
    const normalizedLanguages =
      knowledge.languages?.map((lang: any) => this.normalizeLanguage(lang)) ||
      [];

    // Normalize certifications
    const normalizedCertifications =
      knowledge.certifications?.map((cert: any) =>
        this.normalizeCertification(cert),
      ) || [];

    // Normalize education level
    const normalizedEducation = this.normalizeEducation(
      knowledge.educationLevel,
    );

    return {
      ...knowledge,
      title: normalizedTitle,
      requiredSkills: normalizedRequiredSkills,
      preferredSkills: normalizedPreferredSkills,
      softSkills: normalizedSoftSkills,
      languages: normalizedLanguages,
      certifications: normalizedCertifications,
      educationLevel: normalizedEducation,
      normalized: true,
    };
  }

  private normalizeJobTitle(title: string): NormalizedElement {
    const normalized = this.normalizationService.normalizeJob(title);
    const jobData = this.getJobData(normalized.id);

    return {
      rawValue: title,
      normalizedValue: normalized.normalized,
      confidence: normalized.confidence,
      synonyms: jobData?.synonymes || [],
      variants: jobData?.intitulés_usuels || [],
      knowledgePackId: normalized.id,
    };
  }

  normalizeSkill(skill: any): NormalizedElement {
    const skillName = typeof skill === 'string' ? skill : skill.name;
    const normalized = this.normalizationService.normalizeSkill(skillName);
    const skillData = this.getSkillData(normalized.id);

    return {
      rawValue: skillName,
      normalizedValue: normalized.normalized,
      confidence: normalized.confidence,
      synonyms: skillData?.synonymes || [],
      variants: [],
      knowledgePackId: normalized.id,
    };
  }

  private normalizeLanguage(lang: any): NormalizedElement {
    const langName = typeof lang === 'string' ? lang : lang.name;
    return {
      rawValue: langName,
      normalizedValue: langName.toLowerCase(),
      confidence: 1.0,
      synonyms: [],
      variants: [],
      knowledgePackId: '',
    };
  }

  private normalizeCertification(cert: any): NormalizedElement {
    const certName = typeof cert === 'string' ? cert : cert.name;
    return {
      rawValue: certName,
      normalizedValue: certName,
      confidence: 1.0,
      synonyms: [],
      variants: [],
      knowledgePackId: '',
    };
  }

  private normalizeEducation(education: string): NormalizedElement {
    if (!education) {
      return {
        rawValue: '',
        normalizedValue: '',
        confidence: 0,
        synonyms: [],
        variants: [],
        knowledgePackId: '',
      };
    }

    const levels = ['Bac', 'Bac+2', 'Bac+3', 'Bac+5', 'Doctorat'];
    const normalized = education.toLowerCase();
    let normalizedValueeducation = education;
    let confidence = 1.0;

    if (normalized.includes('doctorat')) {
      normalizedValueeducation = 'Doctorat';
    } else if (normalized.includes('master') || normalized.includes('bac+5')) {
      normalizedValueeducation = 'Bac+5';
    } else if (normalized.includes('licence') || normalized.includes('bac+3')) {
      normalizedValueeducation = 'Bac+3';
    } else if (
      normalized.includes('bts') ||
      normalized.includes('dut') ||
      normalized.includes('bac+2')
    ) {
      normalizedValueeducation = 'Bac+2';
    } else if (normalized.includes('bac')) {
      normalizedValueeducation = 'Bac';
    } else {
      confidence = 0.5;
    }

    return {
      rawValue: education,
      normalizedValue: normalizedValueeducation,
      confidence,
      synonyms: [],
      variants: levels,
      knowledgePackId: '',
    };
  }

  private getJobData(jobId: string): any {
    // This would fetch from KP-001 in production
    return null;
  }

  private getSkillData(skillId: string): any {
    // This would fetch from KP-002 in production
    return null;
  }
}
