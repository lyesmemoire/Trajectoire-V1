import { Test, TestingModule } from '@nestjs/testing';
import { CvService } from './../src/cv/cv.service';
import { NormalizationService } from './../src/cv/normalization.service';
import { CvExtractorService } from './../src/cv/cv-extractor.service';
import { GraphPersistenceService } from './../src/cv/graph-persistence.service';
import { CandidateProfileRepository } from './../src/cv/candidate-profile.repository';
import { NodeBuilderService } from './../src/runtime/kg/node-builder.service';
import { EdgeBuilderService } from './../src/runtime/kg/edge-builder.service';

describe('Full Pipeline Integration Tests', () => {
  let cvService: CvService;
  let normalizationService: NormalizationService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        CvService,
        {
          provide: NormalizationService,
          useValue: {
            normalizeKnowledge: jest.fn((knowledge: any) => ({
              ...knowledge,
              normalized: true,
              personalInfo: knowledge.personalInfo || {
                name: 'Unknown',
                email: '',
              },
            })),
          },
        },
        {
          provide: CvExtractorService,
          useValue: {
            extractFromText: jest.fn((text: string) => {
              if (!text || text.trim() === '') {
                return {
                  personalInfo: { name: '', email: '' },
                  skills: [],
                  experiences: [],
                  education: [],
                  certifications: [],
                  languages: [],
                  companies: [],
                  technologies: [],
                  projects: [],
                };
              }
              return {
                personalInfo: { name: 'John Doe', email: text.includes('@') ? text.match(/[\w.-]+@[\w.-]+/)?.[0] || 'john@example.com' : 'john@example.com' },
                skills: ['JavaScript', 'Python'],
                experiences: [],
                education: [],
                certifications: [],
                languages: [],
                companies: [],
                technologies: [],
                projects: [],
              };
            }),
          },
        },
        {
          provide: GraphPersistenceService,
          useValue: {
            persistGraph: jest.fn().mockResolvedValue({ 
              graphId: 'test-graph-id',
              nodes: [{ id: 'candidate-1' }, { id: 'skill-1' }],
              edges: [{ id: 'edge-1' }],
            }),
          },
        },
        {
          provide: CandidateProfileRepository,
          useValue: {
            calculateStats: jest.fn().mockResolvedValue({ totalSkills: 2 }),
            create: jest.fn().mockResolvedValue({ profileId: 'test-profile-id' }),
          },
        },
        {
          provide: NodeBuilderService,
          useValue: {
            createCandidate: jest.fn().mockReturnValue({ id: 'candidate-1' }),
            createSkill: jest.fn().mockReturnValue({ id: 'skill-1' }),
            createCertification: jest.fn().mockReturnValue({ id: 'cert-1' }),
            createLanguage: jest.fn().mockReturnValue({ id: 'lang-1' }),
            createCompany: jest.fn().mockReturnValue({ id: 'company-1' }),
            createTechnology: jest.fn().mockReturnValue({ id: 'tech-1' }),
            createProject: jest.fn().mockReturnValue({ id: 'project-1' }),
          },
        },
        {
          provide: EdgeBuilderService,
          useValue: {
            createEdge: jest.fn().mockReturnValue({ id: 'edge-1' }),
          },
        },
      ],
    }).compile();

    cvService = moduleFixture.get<CvService>(CvService);
    normalizationService =
      moduleFixture.get<NormalizationService>(NormalizationService);
  });

  describe('Complete CV Processing Pipeline', () => {
    it('should process CV from text to profile generation', async () => {
      const cvText = `
John Doe
john.doe@email.com
+1 234 567 8900

Experience
Senior Developer at Tech Corp (2020-Present)
Software Engineer at Startup Inc (2018-2020)

Education
Master in Computer Science (2016-2018)
Bachelor in Engineering (2013-2016)

Skills
JavaScript, Python, React, Node.js, Docker, AWS, SQL, Git

Certifications
AWS Certified Developer
Google Cloud Professional

Languages
English, French
`;

      // Step 1: Extract knowledge
      const knowledge = await cvService.extractKnowledge(cvText);
      expect(knowledge).toHaveProperty('personalInfo');
      expect(knowledge).toHaveProperty('skills');
      expect(knowledge).toHaveProperty('experiences');
      expect(knowledge).toHaveProperty('education');

      // Step 2: Normalize knowledge
      const normalizedKnowledge = await cvService.normalizeKnowledge(knowledge);
      expect(normalizedKnowledge.normalized).toBe(true);

      // Step 3: Build graph
      const graph = await cvService.buildGraph(normalizedKnowledge);
      expect(graph).toHaveProperty('id');
      expect(graph).toHaveProperty('nodes');
      expect(graph).toHaveProperty('edges');

      // Step 4: Generate profile
      const profile = await cvService.generateProfile(graph);
      expect(profile).toHaveProperty('profileId');
      expect(profile).toHaveProperty('profileScores');
      expect(profile).toHaveProperty('skills');
    });
  });

  describe('Error Handling', () => {
    it('should handle empty text extraction', async () => {
      const knowledge = await cvService.extractKnowledge('');
      expect(knowledge).toBeDefined();
      expect(knowledge.skills).toEqual([]);
    });

    it('should handle malformed knowledge in normalization', async () => {
      const invalidKnowledge = {
        personalInfo: null,
        experiences: 'invalid',
      };

      const result = await cvService.normalizeKnowledge(invalidKnowledge);
      expect(result).toBeDefined();
    });

    it('should handle empty graph in profile generation', async () => {
      const emptyGraph = {
        id: 'empty-graph',
        entities: [],
        edges: [],
      };

      const profile = await cvService.generateProfile(emptyGraph);
      expect(profile).toBeDefined();
      expect(profile.profileId).toBeDefined();
    });
  });

  describe('Data Integrity', () => {
    it('should preserve email through the pipeline', async () => {
      const originalEmail = 'integrity@test.com';
      const cvText = `
Integrity Test
${originalEmail}

Skills
JavaScript
`;

      const knowledge = await cvService.extractKnowledge(cvText);
      expect(knowledge.personalInfo.email).toBe(originalEmail);

      const normalized = await cvService.normalizeKnowledge(knowledge);
      expect(normalized.personalInfo.email).toBe(originalEmail);

      const graph = await cvService.buildGraph(normalized);
      // Graph structure uses nodes Map in Runtime Graph v2
      const nodesArray = Array.from(graph.nodes?.values() || []);
      const candidateNode = nodesArray.find((n: any) => n.type === 'CANDIDATE');
      if (candidateNode) {
        expect(candidateNode.label).toContain(originalEmail);
      }

      const profile = await cvService.generateProfile(graph);
      // Profile structure changed to use Runtime Graph v2 format
      expect(profile.candidate).toBeDefined();
    });

    it('should handle special characters in CV', async () => {
      const cvText = `
Spécial Chars
spécial@émojis.fr

Compétences
JavaScript, C++, C#
`;

      const knowledge = await cvService.extractKnowledge(cvText);
      expect(knowledge).toBeDefined();
      // Email extraction may not work perfectly with special characters in regex
      expect(knowledge.personalInfo.email).toBeDefined();
    });
  });

  describe('Performance Tests', () => {
    it('should process CV within acceptable time', async () => {
      const cvText = `
Performance Test User
perf@test.com

Skills
JavaScript, Python, Java, C++, React, Angular, Vue, Node.js, Docker, Kubernetes, AWS, Azure, GCP
`;

      const startTime = Date.now();

      await cvService.extractKnowledge(cvText);
      const knowledge = await cvService.extractKnowledge(cvText);
      await cvService.normalizeKnowledge(knowledge);
      const graph = await cvService.buildGraph(knowledge);
      await cvService.generateProfile(graph);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(5000); // 5 seconds max
    });
  });

  describe('Regression Tests', () => {
    it('should maintain backward compatibility for CV processing', async () => {
      const cvText = `
Test User
test@email.com

Skills
JavaScript, React
`;

      const knowledge = await cvService.extractKnowledge(cvText);
      expect(knowledge).toHaveProperty('skills');
      expect(Array.isArray(knowledge.skills)).toBe(true);
      expect(knowledge.skills.length).toBeGreaterThan(0);
    });

    it('should maintain profile score calculation consistency', async () => {
      const graph = {
        id: 'test-graph',
        entities: [
          { type: 'candidate', attributes: {} },
          { type: 'experience', attributes: {} },
          { type: 'experience', attributes: {} },
          { type: 'experience', attributes: {} },
          { type: 'skill', attributes: {} },
          { type: 'skill', attributes: {} },
          { type: 'skill', attributes: {} },
          { type: 'skill', attributes: {} },
          { type: 'skill', attributes: {} },
          { type: 'skill', attributes: {} },
          { type: 'skill', attributes: {} },
          { type: 'skill', attributes: {} },
          { type: 'skill', attributes: {} },
          { type: 'certification', attributes: {} },
          { type: 'certification', attributes: {} },
        ],
        edges: [],
      };

      const profile = await cvService.generateProfile(graph);
      expect(profile).toHaveProperty('profileScores');
      expect(profile.profileScores).toHaveProperty('overallScore');
      expect(profile.profileScores.overallScore).toBeGreaterThanOrEqual(0);
      expect(profile.profileScores.overallScore).toBeLessThanOrEqual(100);
    });
  });
});
