/**
 * Knowledge Graph RH Runtime v2
 * Entity Normalizer Service
 * Normalizes entity labels to canonical forms
 */

import { NodeType } from './graph-types';

export class EntityNormalizerService {
  // Skill aliases mapping
  private readonly skillAliases: Map<string, string> = new Map([
    ['Amazon Web Services', 'AWS'],
    ['Amazon AWS', 'AWS'],
    ['Google Cloud', 'GCP'],
    ['Google Cloud Platform', 'GCP'],
    ['Microsoft Azure', 'Azure'],
    ['MS Azure', 'Azure'],
    ['React.js', 'React'],
    ['ReactJS', 'React'],
    ['React JS', 'React'],
    ['NextJS', 'Next.js'],
    ['Next JS', 'Next.js'],
    ['TypeScript', 'TS'],
    ['Typescript', 'TypeScript'],
    ['Postgres', 'PostgreSQL'],
    ['PG', 'PostgreSQL'],
    ['docker-compose', 'Docker'],
    ['Docker Compose', 'Docker'],
    ['K8s', 'Kubernetes'],
    ['k8s', 'Kubernetes'],
    ['Github Actions', 'CI/CD'],
    ['GitLab CI', 'CI/CD'],
    ['Jenkins', 'CI/CD'],
    ['Product Manager', 'Product Management'],
    ['PM', 'Product Management'],
    ['Chef de Produit', 'Product Management'],
    ['Full Stack Developer', 'Full Stack'],
    ['Frontend Developer', 'Frontend'],
    ['Front-end Developer', 'Frontend'],
    ['Backend Developer', 'Backend'],
    ['Back-end Developer', 'Backend'],
    ['Data Scientist', 'Data Science'],
    ['Machine Learning Engineer', 'ML Engineer'],
    ['DevOps Engineer', 'DevOps'],
    ['Site Reliability Engineer', 'SRE'],
  ]);

  // Company aliases mapping
  private readonly companyAliases: Map<string, string> = new Map([
    ['Google LLC', 'Google'],
    ['Alphabet Inc.', 'Google'],
    ['Meta Platforms', 'Meta'],
    ['Facebook', 'Meta'],
    ['Amazon.com', 'Amazon'],
    ['Microsoft Corporation', 'Microsoft'],
    ['Apple Inc.', 'Apple'],
    ['Netflix Inc.', 'Netflix'],
    ['Tesla Inc.', 'Tesla'],
    ['SpaceX', 'SpaceX'],
  ]);

  // Location aliases mapping
  private readonly locationAliases: Map<string, string> = new Map([
    ['New York City', 'New York'],
    ['NYC', 'New York'],
    ['San Francisco', 'San Francisco'],
    ['SF', 'San Francisco'],
    ['Los Angeles', 'Los Angeles'],
    ['LA', 'Los Angeles'],
    ['London UK', 'London'],
    ['Paris France', 'Paris'],
    ['Berlin Germany', 'Berlin'],
    ['Madrid Spain', 'Madrid'],
  ]);

  // Language aliases mapping
  private readonly languageAliases: Map<string, string> = new Map([
    ['English', 'English'],
    ['Anglais', 'English'],
    ['French', 'French'],
    ['Français', 'French'],
    ['Spanish', 'Spanish'],
    ['Español', 'Spanish'],
    ['German', 'German'],
    ['Deutsch', 'German'],
    ['Italian', 'Italian'],
    ['Italiano', 'Italian'],
    ['Portuguese', 'Portuguese'],
    ['Português', 'Portuguese'],
    ['Chinese', 'Chinese'],
    ['Mandarin', 'Chinese'],
    ['Japanese', 'Japanese'],
    ['Korean', 'Korean'],
    ['Russian', 'Russian'],
  ]);

  // Certification aliases mapping
  private readonly certificationAliases: Map<string, string> = new Map([
    ['AWS Certified Solutions Architect', 'AWS CSA'],
    ['AWS Solutions Architect', 'AWS CSA'],
    ['Google Cloud Professional', 'GCP Professional'],
    ['Azure Solutions Architect', 'Azure SA'],
    ['Certified Kubernetes Administrator', 'CKA'],
    ['Certified Scrum Master', 'CSM'],
    ['Project Management Professional', 'PMP'],
  ]);

  constructor() {}

  /**
   * Normalize a label based on entity type
   */
  normalizeLabel(label: string, type: NodeType): string {
    if (!label) return '';

    const trimmed = label.trim();

    switch (type) {
      case NodeType.SKILL:
      case NodeType.TECHNOLOGY:
      case NodeType.TOOL:
      case NodeType.FRAMEWORK:
      case NodeType.METHODOLOGY:
        return this.normalizeSkill(trimmed);

      case NodeType.COMPANY:
        return this.normalizeCompany(trimmed);

      case NodeType.LOCATION:
        return this.normalizeLocation(trimmed);

      case NodeType.LANGUAGE:
        return this.normalizeLanguage(trimmed);

      case NodeType.CERTIFICATION:
        return this.normalizeCertification(trimmed);

      default:
        return this.normalizeGeneric(trimmed);
    }
  }

  /**
   * Normalize skill/technology label
   */
  private normalizeSkill(label: string): string {
    const lower = label.toLowerCase();

    for (const [alias, canonical] of this.skillAliases.entries()) {
      if (alias.toLowerCase() === lower) {
        return canonical;
      }
    }

    // Generic normalization
    return label
      .replace(/\s+/g, ' ')
      .replace(/\./g, '')
      .replace(/-/g, ' ')
      .trim();
  }

  /**
   * Normalize company label
   */
  private normalizeCompany(label: string): string {
    const lower = label.toLowerCase();

    for (const [alias, canonical] of this.companyAliases.entries()) {
      if (alias.toLowerCase() === lower) {
        return canonical;
      }
    }

    // Remove common suffixes
    return label
      .replace(/\s+(Inc\.?|LLC|Corp\.?|Ltd\.?|GmbH|S\.A\.?)$/i, '')
      .trim();
  }

  /**
   * Normalize location label
   */
  private normalizeLocation(label: string): string {
    const lower = label.toLowerCase();

    for (const [alias, canonical] of this.locationAliases.entries()) {
      if (alias.toLowerCase() === lower) {
        return canonical;
      }
    }

    return label.trim();
  }

  /**
   * Normalize language label
   */
  private normalizeLanguage(label: string): string {
    const lower = label.toLowerCase();

    for (const [alias, canonical] of this.languageAliases.entries()) {
      if (alias.toLowerCase() === lower) {
        return canonical;
      }
    }

    return label.trim();
  }

  /**
   * Normalize certification label
   */
  private normalizeCertification(label: string): string {
    const lower = label.toLowerCase();

    for (const [alias, canonical] of this.certificationAliases.entries()) {
      if (alias.toLowerCase() === lower) {
        return canonical;
      }
    }

    return label.trim();
  }

  /**
   * Generic normalization
   */
  private normalizeGeneric(label: string): string {
    return label.replace(/\s+/g, ' ').trim();
  }

  /**
   * Add a custom alias
   */
  addAlias(type: NodeType, alias: string, canonical: string): void {
    switch (type) {
      case NodeType.SKILL:
      case NodeType.TECHNOLOGY:
      case NodeType.TOOL:
      case NodeType.FRAMEWORK:
      case NodeType.METHODOLOGY:
        this.skillAliases.set(alias, canonical);
        break;
      case NodeType.COMPANY:
        this.companyAliases.set(alias, canonical);
        break;
      case NodeType.LOCATION:
        this.locationAliases.set(alias, canonical);
        break;
      case NodeType.LANGUAGE:
        this.languageAliases.set(alias, canonical);
        break;
      case NodeType.CERTIFICATION:
        this.certificationAliases.set(alias, canonical);
        break;
    }
  }

  /**
   * Batch normalize labels
   */
  batchNormalize(labels: string[], type: NodeType): string[] {
    return labels.map((label) => this.normalizeLabel(label, type));
  }
}
