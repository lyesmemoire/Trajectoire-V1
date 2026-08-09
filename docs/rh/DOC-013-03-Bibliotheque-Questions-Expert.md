# DOC-013-03 : Bibliothèque Questions Expert

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la Bibliothèque de Questions Expert pour MVP-013 Interview Intelligence. Cette bibliothèque classifiée et intelligente fournit des questions d'entretien de niveau grand cabinet mondial, avec des métadonnées détaillées pour chaque question.

---

## 2. Principe Fondateur

La Bibliothèque de Questions Expert n'est pas une simple liste de questions. Pour chaque question, le moteur sait pourquoi elle est posée, ce qu'une bonne réponse contient, ce qu'une mauvaise réponse révèle, les signaux de manipulation à détecter, les relances si la réponse est évasive, et les variantes selon le profil.

---

## 3. Classification des Questions

### 3.1 Par Technique d'Entretien

| Technique | Description | Exemple |
|-----------|-------------|---------|
| STAR | Situation / Tâche / Action / Résultat | "Parlez-moi d'une situation où vous avez..." |
| Situationnel | Comment réagiriez-vous si... | "Comment réagiriez-vous si un client mécontent..." |
| Comportemental | Donnez-moi un exemple où... | "Donnez-moi un exemple où vous avez géré un conflit" |
| Projectif | Qu'est-ce que vos anciens collègues diraient | "Si je contactais vos anciens collègues..." |
| Déstabilisateur | Question inconfortable ciblée | "Quelle est votre plus grande faiblesse ?" |
| Paradoxal | Question paradoxale | "Quelle est votre plus grande faiblesse qui est aussi votre force ?" |
| Métaphorique | Si vous étiez un outil... | "Si vous étiez un outil, lequel seriez-vous ?" |

### 3.2 Par Dimension Évaluée

| Dimension | Description | Exemple |
|-----------|-------------|---------|
| Compétences techniques | Évaluation des compétences techniques | "Comment avez-vous implémenté X ?" |
| Expériences passées | Évaluation des expériences passées | "Parlez-moi de votre expérience chez X" |
| Comportements sous pression | Évaluation sous pression | "Comment avez-vous géré cette crise ?" |
| Valeurs et motivations | Évaluation des valeurs et motivations | "Qu'est-ce qui vous motive ?" |
| Leadership et influence | Évaluation du leadership | "Comment avez-vous motivé votre équipe ?" |
| Adaptabilité et apprentissage | Évaluation de l'adaptabilité | "Comment avez-vous appris X ?" |
| Intelligence émotionnelle | Évaluation de l'IE | "Comment avez-vous géré ce conflit ?" |
| Ambition et projection | Évaluation de l'ambition | "Où vous voyez-vous dans 5 ans ?" |
| Culture fit | Évaluation de l'adéquation culturelle | "Quel environnement de travail préférez-vous ?" |
| Intégrité et éthique professionnelle | Évaluation de l'intégrité | "Comment avez-vous géré cette situation éthique ?" |

### 3.3 Par Niveau de Candidat

| Niveau | Description | Exemple |
|--------|-------------|---------|
| Junior (0-3 ans) | Candidats juniors | "Comment avez-vous appris X ?" |
| Confirmé (3-7 ans) | Candidats confirmés | "Comment avez-vous géré X ?" |
| Senior (7-15 ans) | Candidats seniors | "Comment avez-vous dirigé X ?" |
| Expert / Dirigeant (15+ ans) | Candidats experts/dirigeants | "Comment avez-vous transformé X ?" |

### 3.4 Par Contexte de Poste

| Contexte | Description | Exemple |
|----------|-------------|---------|
| Management d'équipe | Postes de management | "Comment avez-vous géré votre équipe ?" |
| Expertise technique | Postes techniques | "Comment avez-vous résolu X ?" |
| Relation client | Postes relation client | "Comment avez-vous géré ce client ?" |
| Gestion de projet | Postes gestion de projet | "Comment avez-vous géré ce projet ?" |
| Innovation et créativité | Postes innovation | "Comment avez-vous innové ?" |
| Gestion de crise | Postes gestion de crise | "Comment avez-vous géré cette crise ?" |

---

## 4. Structure de Données (TypeScript)

```typescript
interface ExpertQuestion {
  questionId: string;
  question: string;
  
  technique: 'star' | 'situational' | 'behavioral' | 'projective' | 'destabilizer' | 'paradoxical' | 'metaphorical';
  dimension: 'technical_skills' | 'past_experiences' | 'behavior_under_pressure' | 'values_and_motivations' | 'leadership_and_influence' | 'adaptability_and_learning' | 'emotional_intelligence' | 'ambition_and_projection' | 'culture_fit' | 'integrity_and_ethics';
  candidateLevel: 'junior' | 'intermediate' | 'senior' | 'expert_executive';
  jobContext: 'team_management' | 'technical_expertise' | 'client_relationship' | 'project_management' | 'innovation_and_creativity' | 'crisis_management' | 'general';
  
  intelligence: {
    whyAsked: string;
    whatGoodAnswerContains: string[];
    whatBadAnswerReveals: string[];
    manipulationSignalsToDetect: string[];
    followUpIfEvasive: string[];
    variantsByProfile: {
      profileType: string;
      variant: string;
    }[];
  };
  
  metadata: {
    createdBy: string;
    createdAt: Date;
    lastUpdated: Date;
    lastUpdatedBy: string;
    usageCount: number;
    successRate: number;
  };
}
```

---

## 5. Exemples de Questions Expert

### 5.1 Question STAR - Compétences Techniques

```typescript
const starTechnicalQuestion: ExpertQuestion = {
  questionId: 'Q-STAR-TECH-001',
  question: 'Parlez-moi d\'un projet technique complexe que vous avez mené de bout en bout. Quelle était la situation, quelles étaient vos tâches, quelles actions avez-vous entreprises et quels résultats avez-vous obtenus ?',
  
  technique: 'star',
  dimension: 'technical_skills',
  candidateLevel: 'intermediate',
  jobContext: 'technical_expertise',
  
  intelligence: {
    whyAsked: 'Évaluer la capacité à structurer une réponse technique et à communiquer sur un projet complexe',
    whatGoodAnswerContains: [
      'Description claire de la situation',
      'Identification précise des tâches',
      'Actions spécifiques et personnelles (pas "on a fait")',
      'Résultats chiffrés et mesurables',
      'Réflexion sur les leçons apprises'
    ],
    whatBadAnswerReveals: [
      'Réponse vague ou générale',
      'Dilution de la responsabilité (usage du "on")',
      'Absence de résultats chiffrés',
      'Incapacité à structurer la réponse',
      'Manque de profondeur technique'
    ],
    manipulationSignalsToDetect: [
      'Réponse trop parfaite et répétée',
      'Exagération des résultats',
      'Attribution indue de succès',
      'Évitement des difficultés rencontrées'
    ],
    followUpIfEvasive: [
      'Quelles difficultés avez-vous rencontrées et comment les avez-vous surmontées ?',
      'Quelle a été votre contribution personnelle exacte ?',
      'Quels résultats chiffrés pouvez-vous me donner ?'
    ],
    variantsByProfile: [
      {
        profileType: 'junior',
        variant: 'Parlez-moi d\'un projet technique sur lequel vous avez travaillé récemment. Quel était votre rôle et qu\'avez-vous appris ?'
      },
      {
        profileType: 'senior',
        variant: 'Parlez-moi d\'un projet technique complexe que vous avez dirigé. Comment avez-vous géré les risques et les décisions techniques ?'
      },
      {
        profileType: 'expert_executive',
        variant: 'Parlez-moi d\'une transformation technique majeure que vous avez menée. Comment avez-vous aligné les aspects techniques et business ?'
      }
    ]
  },
  
  metadata: {
    createdBy: 'system',
    createdAt: new Date('2026-08-03'),
    lastUpdated: new Date('2026-08-03'),
    lastUpdatedBy: 'system',
    usageCount: 0,
    successRate: 0
  }
};
```

### 5.2 Question Situationnel - Comportements sous Pression

```typescript
const situationalPressureQuestion: ExpertQuestion = {
  questionId: 'Q-SIT-PRESS-001',
  question: 'Imaginez que vous êtes en charge d\'un projet critique avec un délai serré. À 48 heures de la livraison, un membre clé de votre équipe tombe malade et ne peut plus travailler. Comment réagiriez-vous ?',
  
  technique: 'situational',
  dimension: 'behavior_under_pressure',
  candidateLevel: 'intermediate',
  jobContext: 'project_management',
  
  intelligence: {
    whyAsked: 'Évaluer la capacité à gérer l\'imprévu et à prendre des décisions sous pression',
    whatGoodAnswerContains: [
      'Analyse rapide de la situation',
      'Priorisation des tâches critiques',
      'Communication transparente avec les parties prenantes',
      'Plan d\'action concret et réaliste',
      'Gestion de l\'équipe et du stress'
    ],
    whatBadAnswerReveals: [
      'Panique ou réaction excessive',
      'Refus d\'accepter la réalité',
      'Absence de plan d\'action',
      'Blame game (recherche de coupables)',
      'Promesses irréalistes'
    ],
    manipulationSignalsToDetect: [
      'Réponse trop théorique sans exemples concrets',
      'Évitement de mentionner les difficultés',
      'Surconfiance non justifiée'
    ],
    followUpIfEvasive: [
      'Quelles sont les 3 premières actions que vous prendriez ?',
      'Comment communiqueriez-vous avec le client ?',
      'Comment géreriez-vous l\'équipe dans cette situation ?'
    ],
    variantsByProfile: [
      {
        profileType: 'junior',
        variant: 'Si vous avez un délai serré et que vous bloquez sur un problème technique, comment réagiriez-vous ?'
      },
      {
        profileType: 'senior',
        variant: 'Imaginez que vous gérez un projet critique. Une crise majeure survient 48 heures avant la livraison. Comment la géreriez-vous ?'
      },
      {
        profileType: 'expert_executive',
        variant: 'Imaginez que vous dirigez une organisation. Une crise majeure survient menaçant la réputation de l\'entreprise. Comment la géreriez-vous ?'
      }
    ]
  },
  
  metadata: {
    createdBy: 'system',
    createdAt: new Date('2026-08-03'),
    lastUpdated: new Date('2026-08-03'),
    lastUpdatedBy: 'system',
    usageCount: 0,
    successRate: 0
  }
};
```

### 5.3 Question Comportemental - Leadership et Influence

```typescript
const behavioralLeadershipQuestion: ExpertQuestion = {
  questionId: 'Q-BEH-LEAD-001',
  question: 'Donnez-moi un exemple où vous avez dû motiver une équipe démoralisée après un échec ou un revers. Comment avez-vous procédé et quels résultats avez-vous obtenus ?',
  
  technique: 'behavioral',
  dimension: 'leadership_and_influence',
  candidateLevel: 'senior',
  jobContext: 'team_management',
  
  intelligence: {
    whyAsked: 'Évaluer la capacité à leadership et à résilience face à l\'adversité',
    whatGoodAnswerContains: [
      'Reconnaissance de l\'échec sans blâmer',
      'Empathie envers l\'équipe',
      'Communication transparente et honnête',
      'Plan de redressement concret',
      'Résultats tangibles de la motivation'
    ],
    whatBadAnswerReveals: [
      'Blame game (recherche de coupables)',
      'Minimisation de l\'échec',
      'Absence d\'empathie',
      'Approche autoritaire ou punitive',
      'Incapacité à admettre ses propres erreurs'
    ],
    manipulationSignalsToDetect: [
      'Réponse trop parfaite sans difficultés',
      'Attribution exclusive du succès',
      'Évitement de mentionner l\'échec'
    ],
    followUpIfEvasive: [
      'Quelles étaient les causes de l\'échec ?',
      'Comment avez-vous communiqué avec l\'équipe ?',
      'Qu\'avez-vous appris de cette expérience ?'
    ],
    variantsByProfile: [
      {
        profileType: 'intermediate',
        variant: 'Donnez-moi un exemple où vous avez dû collaborer avec une personne difficile. Comment avez-vous géré la situation ?'
      },
      {
        profileType: 'senior',
        variant: 'Donnez-moi un exemple où vous avez dû motiver une équipe après un échec. Comment avez-vous procédé ?'
      },
      {
        profileType: 'expert_executive',
        variant: 'Donnez-moi un exemple où vous avez dû transformer une culture d\'entreprise ou redresser une organisation en difficulté. Comment avez-vous procédé ?'
      }
    ]
  },
  
  metadata: {
    createdBy: 'system',
    createdAt: new Date('2026-08-03'),
    lastUpdated: new Date('2026-08-03'),
    lastUpdatedBy: 'system',
    usageCount: 0,
    successRate: 0
  }
};
```

### 5.4 Question Projective - Valeurs et Motivations

```typescript
const projectiveValuesQuestion: ExpertQuestion = {
  questionId: 'Q-PROJ-VAL-001',
  question: 'Si je contactais vos anciens collègues ou managers, quel seraient les 3 adjectifs qu\'ils utiliseraient pour vous décrire ? Pourquoi ces adjectifs ?',
  
  technique: 'projective',
  dimension: 'values_and_motivations',
  candidateLevel: 'intermediate',
  jobContext: 'general',
  
  intelligence: {
    whyAsked: 'Évaluer la conscience de soi et l\'alignement entre la perception de soi et celle des autres',
    whatGoodAnswerContains: [
      'Adjectifs cohérents avec le profil',
      'Explications honnêtes et nuancées',
      'Reconnaissance des points faibles',
      'Alignement avec les valeurs du poste',
      'Preuves ou exemples pour chaque adjectif'
    ],
    whatBadAnswerReveals: [
      'Adjectifs trop génériques ou clichés',
      'Incohérence avec le profil',
      'Refus de reconnaître les points faibles',
      'Surconfiance ou arrogance',
      'Absence d\'exemples concrets'
    ],
    manipulationSignalsToDetect: [
      'Adjectifs trop parfaits (travaillé, ponctuel, etc.)',
      'Évitement de mentionner les aspects négatifs',
      'Réponse préparée mot pour mot'
    ],
    followUpIfEvasive: [
      'Pourquoi pensez-vous qu\'ils utiliseraient cet adjectif ?',
      'Quel adjectif vous surprendrait le plus ?',
      'Quel adjectif aimeriez-vous qu\'ils utilisent mais ne le font pas ?'
    ],
    variantsByProfile: [
      {
        profileType: 'junior',
        variant: 'Si je demandais à vos professeurs ou formateurs de vous décrire en 3 mots, quels seraient-ils ?'
      },
      {
        profileType: 'intermediate',
        variant: 'Si je contactais vos anciens collègues, quels seraient les 3 adjectifs qu\'ils utiliseraient pour vous décrire ?'
      },
      {
        profileType: 'senior',
        variant: 'Si je contactais vos anciens collaborateurs et managers, quels seraient les 3 adjectifs qu\'ils utiliseraient pour vous décrire ?'
      }
    ]
  },
  
  metadata: {
    createdBy: 'system',
    createdAt: new Date('2026-08-03'),
    lastUpdated: new Date('2026-08-03'),
    lastUpdatedBy: 'system',
    usageCount: 0,
    successRate: 0
  }
};
```

### 5.5 Question Déstabilisateur - Intégrité et Éthique Professionnelle

```typescript
const destabilizerIntegrityQuestion: ExpertQuestion = {
  questionId: 'Q-DEST-INT-001',
  question: 'Parlez-moi d\'une situation où vous avez dû faire un choix éthique difficile, peut-être même aller à l\'encontre de ce que votre manager ou votre entreprise souhaitait. Comment avez-vous procédé et quelles ont été les conséquences ?',
  
  technique: 'destabilizer',
  dimension: 'integrity_and_ethics',
  candidateLevel: 'senior',
  jobContext: 'general',
  
  intelligence: {
    whyAsked: 'Évaluer l\'intégrité et la capacité à prendre des décisions éthiques sous pression',
    whatGoodAnswerContains: [
      'Reconnaissance du dilemme éthique',
      'Réflexion sur les valeurs en jeu',
      'Décision alignée avec les principes éthiques',
      'Communication honnête avec les parties prenantes',
      'Acceptation des conséquences'
    ],
    whatBadAnswerReveals: [
      'Évitement de mentionner un vrai dilemme',
      'Justification de comportements contraires à l\'éthique',
      'Blame game (recherche de coupables)',
      'Minimisation de l'importance éthique',
      'Absence de réflexion sur les valeurs'
    ],
    manipulationSignalsToDetect: [
      'Réponse trop théorique sans exemple concret',
      'Évitement de mentionner les conséquences',
      'Justification de comportements contraires à l'éthique'
    ],
    followUpIfEvasive: [
      'Quelles étaient les options possibles ?',
      'Pourquoi avez-vous choisi cette option ?',
      'Quelles ont été les conséquences de votre décision ?'
    ],
    variantsByProfile: [
      {
        profileType: 'intermediate',
        variant: 'Parlez-moi d\'une situation où vous avez dû faire un choix difficile entre deux options également valides. Comment avez-vous procédé ?'
      },
      {
        profileType: 'senior',
        variant: 'Parlez-moi d\'une situation où vous avez dû faire un choix éthique difficile, peut-être aller à l\'encontre de ce que votre manager souhaitait. Comment avez-vous procédé ?'
      },
      {
        profileType: 'expert_executive',
        variant: 'Parlez-moi d\'une situation où vous avez dû prendre une décision éthique majeure avec des conséquences significatives pour l\'entreprise. Comment avez-vous procédé ?'
      }
    ]
  },
  
  metadata: {
    createdBy: 'system',
    createdAt: new Date('2026-08-03'),
    lastUpdated: new Date('2026-08-03'),
    lastUpdatedBy: 'system',
    usageCount: 0,
    successRate: 0
  }
};
```

---

## 6. Recherche et Filtrage

### 6.1 Recherche par Critères

```typescript
async function searchQuestions(filters: QuestionFilters): Promise<ExpertQuestion[]> {
  let questions = await getAllQuestions();
  
  // Filtrage par technique
  if (filters.technique) {
    questions = questions.filter(q => filters.technique.includes(q.technique));
  }
  
  // Filtrage par dimension
  if (filters.dimension) {
    questions = questions.filter(q => filters.dimension.includes(q.dimension));
  }
  
  // Filtrage par niveau de candidat
  if (filters.candidateLevel) {
    questions = questions.filter(q => filters.candidateLevel.includes(q.candidateLevel));
  }
  
  // Filtrage par contexte de poste
  if (filters.jobContext) {
    questions = questions.filter(q => filters.jobContext.includes(q.jobContext));
  }
  
  // Filtrage par texte
  if (filters.searchText) {
    const searchText = filters.searchText.toLowerCase();
    questions = questions.filter(q => 
      q.question.toLowerCase().includes(searchText) ||
      q.intelligence.whyAsked.toLowerCase().includes(searchText)
    );
  }
  
  // Tri par taux de succès
  if (filters.sortBy === 'successRate') {
    questions.sort((a, b) => b.metadata.successRate - a.metadata.successRate);
  }
  
  // Tri par nombre d'utilisations
  if (filters.sortBy === 'usageCount') {
    questions.sort((a, b) => b.metadata.usageCount - a.metadata.usageCount);
  }
  
  return questions;
}

interface QuestionFilters {
  technique?: ('star' | 'situational' | 'behavioral' | 'projective' | 'destabilizer' | 'paradoxical' | 'metaphorical')[];
  dimension?: ('technical_skills' | 'past_experiences' | 'behavior_under_pressure' | 'values_and_motivations' | 'leadership_and_influence' | 'adaptability_and_learning' | 'emotional_intelligence' | 'ambition_and_projection' | 'culture_fit' | 'integrity_and_ethics')[];
  candidateLevel?: ('junior' | 'intermediate' | 'senior' | 'expert_executive')[];
  jobContext?: ('team_management' | 'technical_expertise' | 'client_relationship' | 'project_management' | 'innovation_and_creativity' | 'crisis_management' | 'general')[];
  searchText?: string;
  sortBy?: 'successRate' | 'usageCount' | 'createdAt';
  limit?: number;
}
```

### 6.2 Recommandation de Questions

```typescript
async function recommendQuestions(candidateProfile: CandidateProfile, jobProfile: JobProfile): Promise<ExpertQuestion[]> {
  const recommendations: ExpertQuestion[] = [];
  
  // Questions basées sur le niveau du candidat
  const levelQuestions = await searchQuestions({
    candidateLevel: [candidateProfile.level],
    jobContext: [jobProfile.context]
  });
  
  // Questions basées sur les compétences à évaluer
  for (const skill of jobProfile.requiredSkills) {
    const skillQuestions = await searchQuestions({
      dimension: [mapSkillToDimension(skill)],
      candidateLevel: [candidateProfile.level]
    });
    recommendations.push(...skillQuestions.slice(0, 2));
  }
  
  // Questions basées sur les signaux de vigilance
  for (const vigilanceSignal of candidateProfile.vigilanceSignals) {
    const signalQuestions = await searchQuestions({
      dimension: [mapSignalToDimension(vigilanceSignal)],
      technique: ['behavioral', 'projective', 'destabilizer']
    });
    recommendations.push(...signalQuestions.slice(0, 1));
  }
  
  // Déduplication
  const uniqueRecommendations = removeDuplicates(recommendations);
  
  // Limitation à 10 questions
  return uniqueRecommendations.slice(0, 10);
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE expert_questions (
  id VARCHAR(36) PRIMARY KEY,
  question TEXT NOT NULL,
  
  technique VARCHAR(50) NOT NULL,
  dimension VARCHAR(50) NOT NULL,
  candidate_level VARCHAR(50) NOT NULL,
  job_context VARCHAR(50) NOT NULL,
  
  why_asked TEXT NOT NULL,
  what_good_answer_contains JSON NOT NULL,
  what_bad_answer_reveals JSON NOT NULL,
  manipulation_signals_to_detect JSON NOT NULL,
  follow_up_if_evasive JSON NOT NULL,
  variants_by_profile JSON NOT NULL,
  
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_updated_by VARCHAR(36),
  usage_count INT DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0
);

CREATE INDEX idx_question_technique ON expert_questions(technique);
CREATE INDEX idx_question_dimension ON expert_questions(dimension);
CREATE INDEX idx_question_level ON expert_questions(candidate_level);
CREATE INDEX idx_question_context ON expert_questions(job_context);
CREATE INDEX idx_question_usage ON expert_questions(usage_count);
```

---

## 8. API Endpoints

```typescript
// GET /api/expert-questions
async function getQuestions(filters?: QuestionFilters): Promise<ExpertQuestion[]> {
  return await searchQuestions(filters || {});
}

// GET /api/expert-questions/:id
async function getQuestion(id: string): Promise<ExpertQuestion> {
  return await getQuestionById(id);
}

// POST /api/expert-questions
async function createQuestion(question: Omit<ExpertQuestion, 'questionId' | 'metadata'>): Promise<ExpertQuestion> {
  return await addQuestion(question);
}

// PUT /api/expert-questions/:id
async function updateQuestion(id: string, question: Partial<ExpertQuestion>): Promise<ExpertQuestion> {
  return await modifyQuestion(id, question);
}

// DELETE /api/expert-questions/:id
async function deleteQuestion(id: string): Promise<void> {
  return await removeQuestion(id);
}

// POST /api/expert-questions/:id/usage
async function recordUsage(id: string, success: boolean): Promise<void> {
  return await updateQuestionUsage(id, success);
}

// POST /api/expert-questions/recommend
async function recommendQuestions(candidateId: string, jobId: string): Promise<ExpertQuestion[]> {
  const candidateProfile = await getCandidateProfile(candidateId);
  const jobProfile = await getJobProfile(jobId);
  return await recommendQuestions(candidateProfile, jobProfile);
}
```

---

## 9. Maintenance de la Bibliothèque

### 9.1 Fréquence de Maintenance

| Activité | Fréquence |
|----------|-----------|
| Ajout de nouvelles questions | Mensuelle |
| Mise à jour des métadonnées | Mensuelle |
| Analyse des taux de succès | Mensuelle |
| Nettoyage des questions peu utilisées | Trimestrielle |
| Audit de qualité | Semestrielle |

### 9.2 Processus d'Ajout de Questions

```typescript
async function addNewQuestion(question: Omit<ExpertQuestion, 'questionId' | 'metadata'>): Promise<ExpertQuestion> {
  // Validation de la question
  const validation = await validateQuestion(question);
  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }
  
  // Génération de l'ID
  const questionId = generateQuestionId(question.technique, question.dimension);
  
  // Création de la question
  const newQuestion: ExpertQuestion = {
    ...question,
    questionId,
    metadata: {
      createdBy: 'system',
      createdAt: new Date(),
      lastUpdated: new Date(),
      lastUpdatedBy: 'system',
      usageCount: 0,
      successRate: 0
    }
  };
  
  // Sauvegarde
  await saveQuestion(newQuestion);
  
  return newQuestion;
}
```

---

## 10. Indicateurs de Suivi

### 10.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de succès | Questions avec succès / total | ≥ 80% |
| Taux d'utilisation | Questions utilisées / total | ≥ 60% |
| Diversité des questions | Questions par technique / total | Équilibré |
| Pertinence des questions | Questions pertinentes / total | ≥ 85% |

### 10.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Nombre total de questions | Questions dans la bibliothèque | 500+ |
| Questions par technique | Distribution par technique | Équilibrée |
| Questions par dimension | Distribution par dimension | Équilibrée |
| Taux de recommandation | Recommandations acceptées / total | ≥ 70% |

---

## 11. Conclusion

La Bibliothèque de Questions Expert est une base de questions classifiée et intelligente. Pour chaque question, le moteur sait pourquoi elle est posée, ce qu'une bonne réponse contient, ce qu'une mauvaise réponse révèle, les signaux de manipulation à détecter, les relances si la réponse est évasive, et les variantes selon le profil.

**Points clés :**
- 7 techniques d'entretien (STAR, Situationnel, Comportemental, Projectif, Déstabilisateur, Paradoxal, Métaphorique)
- 10 dimensions évaluées (Compétences techniques, Expériences passées, Comportements sous pression, Valeurs et motivations, Leadership et influence, Adaptabilité et apprentissage, Intelligence émotionnelle, Ambition et projection, Culture fit, Intégrité et éthique)
- 4 niveaux de candidat (Junior, Confirmé, Senior, Expert/Dirigeant)
- 6 contextes de poste (Management d'équipe, Expertise technique, Relation client, Gestion de projet, Innovation et créativité, Gestion de crise)
- Intelligence par question (pourquoi posée, bonne réponse, mauvaise réponse, signaux manipulation, relances, variantes)
- Recherche et filtrage multi-critères
- Recommandation automatique basée sur le profil candidat et le poste
