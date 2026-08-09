import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { NormalizationService } from './normalization.service';
import { CvExtractorService, ExtractedCV } from './cv-extractor.service';
import { GraphPersistenceService } from './graph-persistence.service';
import { CandidateProfileRepository } from './candidate-profile.repository';
import { NodeBuilderService } from '../runtime/kg/node-builder.service';
import { EdgeBuilderService } from '../runtime/kg/edge-builder.service';
import { NodeType, EdgeType } from '../runtime/kg/graph-types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CvService {
  constructor(
    private readonly normalizationService: NormalizationService,
    private readonly cvExtractor: CvExtractorService,
    private readonly graphPersistence: GraphPersistenceService,
    private readonly candidateProfileRepo: CandidateProfileRepository,
    private readonly nodeBuilder: NodeBuilderService,
    private readonly edgeBuilder: EdgeBuilderService,
  ) {}

  async processCv(file: any, userId?: string) {
    const candidateId = uuidv4();

    const text = await this.extractText(file);
    const extractedCV = this.cvExtractor.extractFromText(text);
    const normalizedCV = this.normalizeCV(extractedCV);

    const { nodes, edges } = this.buildGraphFromExtractedData(
      candidateId,
      normalizedCV,
    );

    const persistenceResult = await this.graphPersistence.persistGraph(
      nodes,
      edges,
      {
        sourceDocument: file.filename,
      },
    );

    const stats = await this.candidateProfileRepo.calculateStats(candidateId);

    const profile = await this.candidateProfileRepo.create({
      candidateId,
      personalInfo: normalizedCV.personalInfo,
      graphId: candidateId,
      stats,
      metadata: {
        originalFile: file.filename,
        extractionConfidence: extractedCV.extractionMetadata.confidence,
        userId: userId, // Store userId for ownership tracking
      },
    });

    return {
      candidateId,
      originalFile: file.filename,
      text,
      extractedCV,
      normalizedCV,
      graph: {
        nodes: persistenceResult.nodes,
        edges: persistenceResult.edges,
      },
      profile,
      stats: persistenceResult.stats,
    };
  }

  private async extractText(file: any): Promise<string> {
    const filePath = file.path;

    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = file.mimetype;

    try {
      if (mimeType === 'application/pdf') {
        const data = await pdf(fileBuffer);
        return data.text;
      } else if (
        mimeType ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimeType === 'application/msword'
      ) {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        return result.value;
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (error) {
      throw new Error(`Failed to extract text: ${(error as Error).message}`);
    }
  }

  private normalizeCV(extractedCV: ExtractedCV): ExtractedCV {
    const normalizedExperiences = extractedCV.experiences.map((exp) => {
      const normalizedJob = this.normalizationService.normalizeJob(exp.title);
      return {
        ...exp,
        title: normalizedJob.normalized,
        jobId: normalizedJob.id,
        confidence: normalizedJob.confidence,
      };
    });

    const normalizedSkills = extractedCV.skills.map((skill) => {
      const normalizedSkill = this.normalizationService.normalizeSkill(
        skill.name,
      );
      return {
        ...skill,
        name: normalizedSkill.normalized,
        skillId: normalizedSkill.id,
        confidence: normalizedSkill.confidence,
      };
    });

    return {
      ...extractedCV,
      experiences: normalizedExperiences,
      skills: normalizedSkills,
    };
  }

  private buildGraphFromExtractedData(candidateId: string, cv: ExtractedCV) {
    const nodes: any[] = [];
    const edges: any[] = [];

    const candidateNode = this.nodeBuilder.createCandidate(
      candidateId,
      cv.personalInfo.name || 'Candidate',
      {
        metadata: {
          ...cv.personalInfo,
          candidateId,
        },
        source: 'CV_EXTRACTOR',
      },
    );
    nodes.push(candidateNode);

    cv.experiences.forEach((exp) => {
      const expNode = this.nodeBuilder.createExperience(exp.title, {
        metadata: {
          ...exp,
          candidateId,
        },
        source: 'CV_EXTRACTOR',
      });
      nodes.push(expNode);

      edges.push(
        this.edgeBuilder.createEdge(
          EdgeType.WORKED_AT,
          candidateNode.id,
          expNode.id,
          {
            metadata: {
              startDate: exp.startDate,
              endDate: exp.endDate,
              current: exp.current,
            },
          },
        ),
      );

      if (exp.company) {
        const companyNode = this.nodeBuilder.createCompany(exp.company, {
          source: 'CV_EXTRACTOR',
        });
        nodes.push(companyNode);

        edges.push(this.edgeBuilder.createWorkedAt(expNode.id, companyNode.id));
      }

      exp.technologies.forEach((tech) => {
        const techNode = this.nodeBuilder.createTechnology(tech, {
          source: 'CV_EXTRACTOR',
        });
        nodes.push(techNode);

        edges.push(this.edgeBuilder.createUsesTech(expNode.id, techNode.id));
      });
    });

    cv.education.forEach((edu) => {
      const eduNode = this.nodeBuilder.createEducation(edu.degree, {
        metadata: {
          ...edu,
          candidateId,
        },
        source: 'CV_EXTRACTOR',
      });
      nodes.push(eduNode);

      edges.push(
        this.edgeBuilder.createStudiedAt(candidateNode.id, eduNode.id),
      );

      if (edu.institution) {
        const schoolNode = this.nodeBuilder.createSchool(edu.institution, {
          source: 'CV_EXTRACTOR',
        });
        nodes.push(schoolNode);

        edges.push(this.edgeBuilder.createStudiedAt(eduNode.id, schoolNode.id));
      }
    });

    cv.skills.forEach((skill) => {
      const skillNode = this.nodeBuilder.createSkill(skill.name, {
        metadata: {
          ...skill,
          candidateId,
        },
        source: 'CV_EXTRACTOR',
      });
      nodes.push(skillNode);

      edges.push(
        this.edgeBuilder.createEdge(
          EdgeType.HAS_SKILL,
          candidateNode.id,
          skillNode.id,
          {
            metadata: {
              level: skill.level,
              yearsExperience: skill.yearsExperience,
              verified: skill.verified,
            },
          },
        ),
      );
    });

    cv.certifications.forEach((cert) => {
      const certNode = this.nodeBuilder.createCertification(cert.name, {
        metadata: {
          ...cert,
          candidateId,
        },
        source: 'CV_EXTRACTOR',
      });
      nodes.push(certNode);

      edges.push(
        this.edgeBuilder.createHasCertification(candidateNode.id, certNode.id),
      );
    });

    cv.languages.forEach((lang) => {
      const langNode = this.nodeBuilder.createLanguage(lang.name, {
        metadata: {
          ...lang,
          candidateId,
        },
        source: 'CV_EXTRACTOR',
      });
      nodes.push(langNode);

      edges.push(
        this.edgeBuilder.createHasLanguage(candidateNode.id, langNode.id),
      );
    });

    cv.companies.forEach((company) => {
      const companyNode = this.nodeBuilder.createCompany(company.name, {
        metadata: {
          ...company,
          candidateId,
        },
        source: 'CV_EXTRACTOR',
      });
      nodes.push(companyNode);
    });

    cv.technologies.forEach((tech) => {
      const techNode = this.nodeBuilder.createTechnology(tech.name, {
        metadata: {
          ...tech,
          candidateId,
        },
        source: 'CV_EXTRACTOR',
      });
      nodes.push(techNode);

      edges.push(
        this.edgeBuilder.createHasSkill(candidateNode.id, techNode.id),
      );
    });

    cv.projects.forEach((project) => {
      const projectNode = this.nodeBuilder.createProject(project.name, {
        metadata: {
          ...project,
          candidateId,
        },
        source: 'CV_EXTRACTOR',
      });
      nodes.push(projectNode);

      edges.push(
        this.edgeBuilder.createHasProject(candidateNode.id, projectNode.id),
      );

      project.technologies.forEach((tech) => {
        const techNode = this.nodeBuilder.createTechnology(tech, {
          source: 'CV_EXTRACTOR',
        });
        nodes.push(techNode);

        edges.push(
          this.edgeBuilder.createUsesTech(projectNode.id, techNode.id),
        );
      });
    });

    return { nodes, edges };
  }

  async extractKnowledge(text: string) {
    return this.cvExtractor.extractFromText(text);
  }

  async normalizeKnowledge(knowledge: any) {
    return this.normalizationService.normalizeKnowledge(knowledge);
  }

  async buildGraph(normalizedKnowledge: any) {
    const candidateId = uuidv4();
    const { nodes, edges } = this.buildGraphFromExtractedData(
      candidateId,
      normalizedKnowledge,
    );

    const persistenceResult = await this.graphPersistence.persistGraph(
      nodes,
      edges,
    );

    return {
      id: candidateId,
      nodes: new Map(persistenceResult.nodes.map((n) => [n.id, n])),
      edges: new Map(persistenceResult.edges.map((e) => [e.id, e])),
      metadata: {
        version: '2.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'cv-service',
      },
    };
  }

  async generateProfile(graph: any) {
    const nodesArray = Array.from(graph.nodes?.values() || []);
    const candidateNode = nodesArray.find((n: any) => n.type === 'CANDIDATE');
    const experienceNodes = nodesArray.filter(
      (n: any) => n.type === 'EXPERIENCE',
    );
    const educationNodes = nodesArray.filter(
      (n: any) => n.type === 'EDUCATION',
    );
    const skillNodes = nodesArray.filter((n: any) => n.type === 'SKILL');
    const certificationNodes = nodesArray.filter(
      (n: any) => n.type === 'CERTIFICATION',
    );
    const languageNodes = nodesArray.filter((n: any) => n.type === 'LANGUAGE');

    const profileId = `profile_${Date.now()}`;

    const profileScores = {
      experienceCount: experienceNodes.length,
      educationCount: educationNodes.length,
      skillCount: skillNodes.length,
      certificationCount: certificationNodes.length,
      languageCount: languageNodes.length,
      overallScore: this.calculateOverallScore(
        experienceNodes.length,
        skillNodes.length,
        certificationNodes.length,
      ),
    };

    return {
      profileId,
      candidate: (candidateNode as any)?.metadata || {},
      experiences: experienceNodes.map((n: any) => n.metadata),
      education: educationNodes.map((n: any) => n.metadata),
      skills: skillNodes.map((n: any) => n.metadata),
      certifications: certificationNodes.map((n: any) => n.metadata),
      languages: languageNodes.map((n: any) => n.metadata),
      profileScores,
    };
  }

  private calculateOverallScore(
    expCount: number,
    skillCount: number,
    certCount: number,
  ): number {
    const maxScore = 100;
    const expScore = Math.min(expCount * 10, 30);
    const skillScore = Math.min(skillCount * 5, 50);
    const certScore = Math.min(certCount * 5, 20);
    return expScore + skillScore + certScore;
  }
}
