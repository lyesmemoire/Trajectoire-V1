// @ts-nocheck
import { CandidateProfile } from "../types";
import { JobOfferGraph } from "../profile/JobOfferGraph";

/**
 * Matching Intelligence Core Engine
 * 
 * Responsibilities:
 * - Perform deterministic comparisons between CandidateGraph and JobOfferGraph
 * - Identify matches, gaps, and additional elements
 * - NO reasoning, interpretation, recommendation, or decision-making
 * - NO scoring, potential estimation, or risk detection
 * - ONLY structured comparison with explainability
 */

export interface Explainability {
  source: string;
  proof: string;
  confidence: number;
  explanation: string;
}

export interface SkillComparison {
  name: string;
  category?: string;
  candidateLevel?: number;
  requiredLevel?: number;
  explainability: Explainability;
}

export interface SoftSkillComparison {
  name: string;
  explainability: Explainability;
}

export interface TechnologyComparison {
  frameworks: {
    matched: string[];
    missing: string[];
    additional: string[];
  };
  languages: {
    matched: string[];
    missing: string[];
    additional: string[];
  };
  cloud: {
    matched: string[];
    missing: string[];
    additional: string[];
  };
  devops: {
    matched: string[];
    missing: string[];
    additional: string[];
  };
  databases: {
    matched: string[];
    missing: string[];
    additional: string[];
  };
  tools: {
    matched: string[];
    missing: string[];
    additional: string[];
  };
  allMatched: string[];
  allMissing: string[];
  allAdditional: string[];
}

export interface LanguageComparison {
  language: string;
  level?: string;
  requiredLevel?: string;
  explainability: Explainability;
}

export interface EducationComparison {
  match: boolean;
  candidateLevel?: string;
  requiredLevel?: string;
  candidateDomain?: string;
  requiredDomain?: string;
  explainability: Explainability;
}

export interface CertificationComparison {
  name: string;
  explainability: Explainability;
}

export interface ExperienceComparison {
  candidateYears: number;
  requiredYears?: string;
  candidateSectors: string[];
  requiredSector?: string;
  candidateJobTypes: string[];
  requiredJobType?: string;
  explainability: Explainability;
}

export interface LocationComparison {
  present: boolean;
  compatible: boolean;
  incompatible: boolean;
  candidateLocation?: string;
  requiredLocation?: string;
  explainability: Explainability;
}

export interface AvailabilityComparison {
  compatible: boolean;
  incompatible: boolean;
  explainability: Explainability;
}

export interface MatchingCoreMetadata {
  comparedAt: string;
  candidateGraphId: string;
  jobOfferGraphId: string;
  explainability: Explainability;
}

export interface MatchingCoreOutput {
  hardSkills: {
    matched: SkillComparison[];
    missing: SkillComparison[];
    additional: SkillComparison[];
  };
  softSkills: {
    matched: SoftSkillComparison[];
    missing: SoftSkillComparison[];
    additional: SoftSkillComparison[];
  };
  technologies: TechnologyComparison;
  languages: {
    matched: LanguageComparison[];
    missing: LanguageComparison[];
  };
  education: EducationComparison;
  certifications: {
    matched: CertificationComparison[];
    missing: CertificationComparison[];
  };
  experience: ExperienceComparison;
  location: LocationComparison;
  availability: AvailabilityComparison;
  metadata: MatchingCoreMetadata;
}

export class CareerCopilotMatchingIntelligenceEngine {
  /**
   * Perform deterministic comparison between candidate and job offer
   */
  static compare(
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph
  ): MatchingCoreOutput {
    const comparedAt = new Date(0).toISOString(); // Fixed date for determinism

    return {
      hardSkills: this.compareHardSkills(candidateProfile, jobOfferGraph),
      softSkills: this.compareSoftSkills(candidateProfile, jobOfferGraph),
      technologies: this.compareTechnologies(candidateProfile, jobOfferGraph),
      languages: this.compareLanguages(candidateProfile, jobOfferGraph),
      education: this.compareEducation(candidateProfile, jobOfferGraph),
      certifications: this.compareCertifications(candidateProfile, jobOfferGraph),
      experience: this.compareExperience(candidateProfile, jobOfferGraph),
      location: this.compareLocation(candidateProfile, jobOfferGraph),
      availability: this.compareAvailability(candidateProfile, jobOfferGraph),
      metadata: {
        comparedAt,
        candidateGraphId: candidateProfile.identity.id,
        jobOfferGraphId: jobOfferGraph.id,
        explainability: {
          source: "Matching Intelligence Core",
          proof: "Comparison performed at " + comparedAt,
          confidence: 90,
          explanation: "Structured comparison between CandidateGraph and JobOfferGraph"
        }
      }
    };
  }

  /**
   * Compare hard skills
   */
  private static compareHardSkills(
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph
  ): { matched: SkillComparison[]; missing: SkillComparison[]; additional: SkillComparison[] } {
    const candidateSkills = candidateProfile.skills.hardSkills;
    const jobSkills = jobOfferGraph.hardSkills || [];

    const matched: SkillComparison[] = [];
    const missing: SkillComparison[] = [];
    const additional: SkillComparison[] = [];

    // Find matched and missing skills
    jobSkills.forEach(jobSkill => {
      const candidateSkill = candidateSkills.find(
        cs => cs.name.toLowerCase() === jobSkill.name.toLowerCase()
      );

      if (candidateSkill) {
        matched.push({
          name: jobSkill.name,
          category: jobSkill.category,
          candidateLevel: candidateSkill.level,
          requiredLevel: jobSkill.level ? parseInt(jobSkill.level) : undefined,
          explainability: {
            source: "CandidateGraph.hardSkills, JobOfferGraph.hardSkills",
            proof: `Candidate has ${candidateSkill.name} (level ${candidateSkill.level}), Job requires ${jobSkill.name} (level ${jobSkill.level})`,
            confidence: 90,
            explanation: "Skill present in both candidate and job offer"
          }
        });
      } else {
        missing.push({
          name: jobSkill.name,
          category: jobSkill.category,
          requiredLevel: jobSkill.level ? parseInt(jobSkill.level) : undefined,
          explainability: {
            source: "JobOfferGraph.hardSkills",
            proof: `Job requires ${jobSkill.name} but not found in CandidateGraph.hardSkills`,
            confidence: 90,
            explanation: "Skill required by job but missing from candidate"
          }
        });
      }
    });

    // Find additional skills
    candidateSkills.forEach(candidateSkill => {
      const jobSkill = jobSkills.find(
        js => js.name.toLowerCase() === candidateSkill.name.toLowerCase()
      );

      if (!jobSkill) {
        additional.push({
          name: candidateSkill.name,
          category: undefined,
          candidateLevel: candidateSkill.level,
          explainability: {
            source: "CandidateGraph.hardSkills",
            proof: `Candidate has ${candidateSkill.name} (level ${candidateSkill.level}) but not required by job`,
            confidence: 90,
            explanation: "Skill present in candidate but not required by job"
          }
        });
      }
    });

    return { matched, missing, additional };
  }

  /**
   * Compare soft skills
   */
  private static compareSoftSkills(
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph
  ): { matched: SoftSkillComparison[]; missing: SoftSkillComparison[]; additional: SoftSkillComparison[] } {
    const candidateSkills = candidateProfile.skills.softSkills;
    const jobSkills = jobOfferGraph.softSkills || [];

    const matched: SoftSkillComparison[] = [];
    const missing: SoftSkillComparison[] = [];
    const additional: SoftSkillComparison[] = [];

    // Find matched and missing skills
    jobSkills.forEach(jobSkill => {
      const candidateSkill = candidateSkills.find(
        cs => cs.name.toLowerCase() === jobSkill.name.toLowerCase()
      );

      if (candidateSkill) {
        matched.push({
          name: jobSkill.name,
          explainability: {
            source: "CandidateGraph.softSkills, JobOfferGraph.softSkills",
            proof: `Candidate has ${candidateSkill.name}, Job requires ${jobSkill.name}`,
            confidence: 85,
            explanation: "Soft skill present in both candidate and job offer"
          }
        });
      } else {
        missing.push({
          name: jobSkill.name,
          explainability: {
            source: "JobOfferGraph.softSkills",
            proof: `Job requires ${jobSkill.name} but not found in CandidateGraph.softSkills`,
            confidence: 85,
            explanation: "Soft skill required by job but missing from candidate"
          }
        });
      }
    });

    // Find additional skills
    candidateSkills.forEach(candidateSkill => {
      const jobSkill = jobSkills.find(
        js => js.name.toLowerCase() === candidateSkill.name.toLowerCase()
      );

      if (!jobSkill) {
        additional.push({
          name: candidateSkill.name,
          explainability: {
            source: "CandidateGraph.softSkills",
            proof: `Candidate has ${candidateSkill.name} but not required by job`,
            confidence: 85,
            explanation: "Soft skill present in candidate but not required by job"
          }
        });
      }
    });

    return { matched, missing, additional };
  }

  /**
   * Compare technologies by category
   */
  private static compareTechnologies(
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph
  ): TechnologyComparison {
    const candidateTechs = candidateProfile.skills.hardSkills;
    const jobTechs = jobOfferGraph.technologies || [];

    const candidateTechNames = candidateTechs.map(t => t.name.toLowerCase());
    const jobTechNames = jobTechs.map(t => t.name.toLowerCase());

    const matched = jobTechNames.filter(name => candidateTechNames.includes(name));
    const missing = jobTechNames.filter(name => !candidateTechNames.includes(name));
    const additional = candidateTechNames.filter(name => !jobTechNames.includes(name));

    // Categorize technologies (simplified - in real implementation would use categories)
    const frameworks = { matched: [], missing: [], additional: [] };
    const languages = { matched: [], missing: [], additional: [] };
    const cloud = { matched: [], missing: [], additional: [] };
    const devops = { matched: [], missing: [], additional: [] };
    const databases = { matched: [], missing: [], additional: [] };
    const tools = { matched: [], missing: [], additional: [] };

    return {
      frameworks,
      languages,
      cloud,
      devops,
      databases,
      tools,
      allMatched: matched,
      allMissing: missing,
      allAdditional: additional
    };
  }

  /**
   * Compare languages
   */
  private static compareLanguages(
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph
  ): { matched: LanguageComparison[]; missing: LanguageComparison[] } {
    // Candidate languages would come from CandidateGraph (not in current CandidateProfile)
    // For now, return empty arrays
    const matched: LanguageComparison[] = [];
    const missing: LanguageComparison[] = [];

    const requiredLanguages = jobOfferGraph.expectedLevel?.languages || [];

    requiredLanguages.forEach(lang => {
      missing.push({
        language: lang,
        requiredLevel: "Not specified",
        explainability: {
          source: "JobOfferGraph.expectedLevel.languages",
          proof: `Job requires ${lang} but language comparison not yet implemented`,
          confidence: 50,
          explanation: "Language comparison requires language data from CandidateGraph"
        }
      });
    });

    return { matched, missing };
  }

  /**
   * Compare education
   */
  private static compareEducation(
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph
  ): EducationComparison {
    const requiredLevel = jobOfferGraph.expectedLevel?.degree;
    const requiredDomain = jobOfferGraph.domain?.name;

    // Education data would come from CandidateGraph (not in current CandidateProfile)
    // For now, return basic comparison
    return {
      match: false,
      candidateLevel: "Not specified",
      requiredLevel,
      candidateDomain: "Not specified",
      requiredDomain,
      explainability: {
        source: "JobOfferGraph.expectedLevel, JobOfferGraph.domain",
        proof: "Education comparison requires education data from CandidateGraph",
        confidence: 50,
        explanation: "Education comparison not yet fully implemented"
      }
    };
  }

  /**
   * Compare certifications
   */
  private static compareCertifications(
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph
  ): { matched: CertificationComparison[]; missing: CertificationComparison[] } {
    // Candidate certifications would come from CandidateGraph (not in current CandidateProfile)
    // For now, return empty arrays
    const matched: CertificationComparison[] = [];
    const missing: CertificationComparison[] = [];

    const requiredCertifications = jobOfferGraph.expectedLevel?.certifications || [];

    requiredCertifications.forEach(cert => {
      missing.push({
        name: cert,
        explainability: {
          source: "JobOfferGraph.expectedLevel.certifications",
          proof: `Job requires ${cert} but certification comparison not yet implemented`,
          confidence: 50,
          explanation: "Certification comparison requires certification data from CandidateGraph"
        }
      });
    });

    return { matched, missing };
  }

  /**
   * Compare experience
   */
  private static compareExperience(
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph
  ): ExperienceComparison {
    const candidateYears = candidateProfile.career.yearsOfExperience;
    const requiredYears = jobOfferGraph.expectedLevel?.yearsOfExperience;
    const candidateSectors = [candidateProfile.career.sector];
    const requiredSector = jobOfferGraph.generalInfo?.sector;
    const candidateJobTypes = [candidateProfile.career.currentPosition || "Not specified"];
    const requiredJobType = jobOfferGraph.generalInfo?.title;

    return {
      candidateYears,
      requiredYears,
      candidateSectors,
      requiredSector,
      candidateJobTypes,
      requiredJobType,
      explainability: {
        source: "CandidateGraph.career, JobOfferGraph.expectedLevel, JobOfferGraph.generalInfo",
        proof: `Candidate has ${candidateYears} years experience in ${candidateProfile.career.sector}, Job requires ${requiredYears} years in ${requiredSector}`,
        confidence: 90,
        explanation: "Experience comparison based on years, sector, and job type"
      }
    };
  }

  /**
   * Compare location
   */
  private static compareLocation(
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph
  ): LocationComparison {
    const candidateLocation = "Not specified"; // Would come from CandidateGraph
    const requiredLocation = jobOfferGraph.generalInfo?.location;

    const present = false;
    const compatible = false;
    const incompatible = false;

    return {
      present,
      compatible,
      incompatible,
      candidateLocation,
      requiredLocation,
      explainability: {
        source: "JobOfferGraph.generalInfo.location",
        proof: "Location comparison requires location data from CandidateGraph",
        confidence: 50,
        explanation: "Location comparison not yet fully implemented"
      }
    };
  }

  /**
   * Compare availability
   */
  private static compareAvailability(
    _candidateProfile: CandidateProfile,
    _jobOfferGraph: JobOfferGraph
  ): AvailabilityComparison {
    // Availability data would come from CandidateGraph
    // For now, return basic comparison
    return {
      compatible: true,
      incompatible: false,
      explainability: {
        source: "CandidateGraph (not yet implemented)",
        proof: "Availability comparison requires availability data from CandidateGraph",
        confidence: 50,
        explanation: "Availability comparison not yet fully implemented"
      }
    };
  }
}
