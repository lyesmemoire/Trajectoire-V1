import { Injectable } from '@nestjs/common';

interface Job {
  id: string;
  nom: string;
  synonymes: string[];
  intitulés_usuels: string[];
  intitulés_internationaux: string[];
}

interface Skill {
  id: string;
  nom: string;
  synonymes: string[];
  type: string;
}

@Injectable()
export class NormalizationService {
  // Sample data from KP-001 (Métiers)
  private jobs: Job[] = [
    {
      id: 'MET-001',
      nom: 'Développeur Backend',
      synonymes: [
        'Backend Engineer',
        'Software Engineer Backend',
        'Ingénieur Backend',
        'Développeur Serveur',
      ],
      intitulés_usuels: ['Développeur Backend', 'Backend Developer'],
      intitulés_internationaux: ['Backend Engineer', 'Backend Developer'],
    },
    {
      id: 'MET-002',
      nom: 'Développeur Frontend',
      synonymes: [
        'Frontend Engineer',
        'Software Engineer Frontend',
        'Ingénieur Frontend',
        'Développeur Interface',
      ],
      intitulés_usuels: ['Développeur Frontend', 'Frontend Developer'],
      intitulés_internationaux: ['Frontend Engineer', 'Frontend Developer'],
    },
    {
      id: 'MET-003',
      nom: 'Data Scientist',
      synonymes: ['Scientifique des données', 'Analyste de données avancé'],
      intitulés_usuels: ['Data Scientist', 'Data Science Engineer'],
      intitulés_internationaux: ['Data Scientist'],
    },
    {
      id: 'MET-004',
      nom: 'Ingénieur DevOps',
      synonymes: [
        'DevOps Engineer',
        'Ingénieur des opérations de développement',
      ],
      intitulés_usuels: ['Ingénieur DevOps', 'DevOps Engineer'],
      intitulés_internationaux: ['DevOps Engineer'],
    },
    {
      id: 'MET-005',
      nom: 'Chef de Projet',
      synonymes: [
        'Project Manager',
        'Chef de projet',
        'Gestionnaire de projet',
      ],
      intitulés_usuels: ['Chef de Projet', 'Project Manager'],
      intitulés_internationaux: ['Project Manager'],
    },
  ];

  // Sample data from KP-002 (Compétences)
  private skills: Skill[] = [
    {
      id: 'COMP-001',
      nom: 'Programmation orientée objet',
      synonymes: ['OOP', 'Object-Oriented Programming', 'POO'],
      type: 'Technique',
    },
    {
      id: 'COMP-002',
      nom: 'HTML/CSS',
      synonymes: ['Web markup', 'Styling web'],
      type: 'Technique',
    },
    {
      id: 'COMP-003',
      nom: 'JavaScript',
      synonymes: ['JS', 'ECMAScript'],
      type: 'Technique',
    },
    {
      id: 'COMP-004',
      nom: 'Python',
      synonymes: ['Python programming'],
      type: 'Technique',
    },
    {
      id: 'COMP-005',
      nom: 'Machine Learning',
      synonymes: ['ML', 'Apprentissage automatique'],
      type: 'Technique',
    },
    {
      id: 'COMP-006',
      nom: 'Docker',
      synonymes: ['Containerization', 'Docker containers'],
      type: 'Technique',
    },
    {
      id: 'COMP-007',
      nom: 'Kubernetes',
      synonymes: ['K8s', 'Container orchestration'],
      type: 'Technique',
    },
    {
      id: 'COMP-008',
      nom: 'Gestion de projet',
      synonymes: ['Project Management', 'PM'],
      type: 'Méthodologique',
    },
    {
      id: 'COMP-009',
      nom: 'Communication',
      synonymes: ['Communication skills', 'Communication efficace'],
      type: 'Comportementale',
    },
    {
      id: 'COMP-010',
      nom: 'Leadership',
      synonymes: ['Leadership skills', 'Management'],
      type: 'Comportementale',
    },
  ];

  normalizeJob(jobTitle: string): {
    normalized: string;
    id: string;
    confidence: number;
  } {
    const normalized = jobTitle.toLowerCase().trim();

    // Direct match
    const directMatch = this.jobs.find(
      (job) =>
        job.nom.toLowerCase() === normalized ||
        job.intitulés_usuels.some(
          (title) => title.toLowerCase() === normalized,
        ) ||
        job.intitulés_internationaux.some(
          (title) => title.toLowerCase() === normalized,
        ),
    );

    if (directMatch) {
      return {
        normalized: directMatch.nom,
        id: directMatch.id,
        confidence: 1.0,
      };
    }

    // Synonym match
    const synonymMatch = this.jobs.find((job) =>
      job.synonymes.some((synonym) => synonym.toLowerCase() === normalized),
    );

    if (synonymMatch) {
      return {
        normalized: synonymMatch.nom,
        id: synonymMatch.id,
        confidence: 0.9,
      };
    }

    // Partial match
    const partialMatch = this.jobs.find(
      (job) =>
        job.nom.toLowerCase().includes(normalized) ||
        normalized.includes(job.nom.toLowerCase()) ||
        job.synonymes.some((synonym) =>
          synonym.toLowerCase().includes(normalized),
        ),
    );

    if (partialMatch) {
      return {
        normalized: partialMatch.nom,
        id: partialMatch.id,
        confidence: 0.7,
      };
    }

    // No match
    return {
      normalized: jobTitle,
      id: '',
      confidence: 0.0,
    };
  }

  normalizeSkill(skillName: string): {
    normalized: string;
    id: string;
    confidence: number;
  } {
    const normalized = skillName.toLowerCase().trim();

    // Direct match
    const directMatch = this.skills.find(
      (skill) => skill.nom.toLowerCase() === normalized,
    );

    if (directMatch) {
      return {
        normalized: directMatch.nom,
        id: directMatch.id,
        confidence: 1.0,
      };
    }

    // Synonym match
    const synonymMatch = this.skills.find((skill) =>
      skill.synonymes.some((synonym) => synonym.toLowerCase() === normalized),
    );

    if (synonymMatch) {
      return {
        normalized: synonymMatch.nom,
        id: synonymMatch.id,
        confidence: 0.9,
      };
    }

    // Partial match
    const partialMatch = this.skills.find(
      (skill) =>
        skill.nom.toLowerCase().includes(normalized) ||
        normalized.includes(skill.nom.toLowerCase()) ||
        skill.synonymes.some((synonym) =>
          synonym.toLowerCase().includes(normalized),
        ),
    );

    if (partialMatch) {
      return {
        normalized: partialMatch.nom,
        id: partialMatch.id,
        confidence: 0.7,
      };
    }

    // No match
    return {
      normalized: skillName,
      id: '',
      confidence: 0.0,
    };
  }

  normalizeKnowledge(knowledge: any) {
    // Normalize job titles in experiences
    const normalizedExperiences = knowledge.experiences.map((exp: any) => {
      const normalizedJob = this.normalizeJob(exp.title);
      return {
        ...exp,
        title: normalizedJob.normalized,
        jobId: normalizedJob.id,
        confidence: normalizedJob.confidence,
      };
    });

    // Normalize skills
    const normalizedSkills = knowledge.skills.map((skill: any) => {
      const normalizedSkill = this.normalizeSkill(skill.name);
      return {
        ...skill,
        name: normalizedSkill.normalized,
        skillId: normalizedSkill.id,
        confidence: normalizedSkill.confidence,
      };
    });

    return {
      ...knowledge,
      experiences: normalizedExperiences,
      skills: normalizedSkills,
      normalized: true,
    };
  }
}
