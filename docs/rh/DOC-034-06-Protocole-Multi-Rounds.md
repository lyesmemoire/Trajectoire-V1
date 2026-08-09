# DOC-034-06 : Protocole Multi-Rounds

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole multi-rounds pour MVP-034 Interview Orchestrator. Ce protocole structure la gestion des processus de recrutement en plusieurs rounds, avec une vue d'ensemble globale, une préparation automatique de chaque round, et une analyse inter-rounds pour assurer la cohérence et la qualité des décisions.

---

## 2. Principe Fondateur

Un processus en plusieurs rounds doit être cohérent, progressif, et efficient. Le moteur maintient une vue d'ensemble de tout le processus, prépare automatiquement chaque round en fonction des précédents, et analyse la cohérence inter-rounds pour détecter les incohérences et les évolutions du candidat.

---

## 3. Vision Globale du Processus

### 3.1 Tableau de Bord Candidat Global

**Pour chaque candidat en processus :**

```
┌─────────────────────────────────────────────────────────────┐
│ TABLEAU DE BORD CANDIDAT GLOBAL                             │
├─────────────────────────────────────────────────────────────┤
│ Candidat : [Prénom Nom]                                    │
│ Poste : [Intitulé]                                         │
│ Processus démarré : [Date]                                 │
│ Round actuel : [N]                                         │
├─────────────────────────────────────────────────────────────┤
│ ROUND 1 :                                                   │
│   Statut : Complété ✓                                      │
│   Score : 7/10                                             │
│   Points clés :                                            │
│   • Expertise technique solide                              │
│   • Motivation claire                                      │
│   • Culture fit partiel                                    │
│   • Leadership à approfondir                                │
├─────────────────────────────────────────────────────────────┤
│ ROUND 2 :                                                   │
│   Statut : En cours ⏳                                     │
│   Score : -/10                                             │
│   Objectifs :                                              │
│   • Valider leadership                                     │
│   • Clarifier culture fit                                  │
│   • Approfondir motivations                                │
├─────────────────────────────────────────────────────────────┤
│ ROUND N :                                                   │
│   Statut : À venir ○                                       │
│   Score : -/10                                             │
├─────────────────────────────────────────────────────────────┤
│ ÉVOLUTION INTER-ROUNDS :                                   │
│   Cohérence : 85% ✓                                        │
│   Amélioration : Positive ✓                                 │
│   Fatigue processus : Non détectée ✓                       │
├─────────────────────────────────────────────────────────────┤
│ DÉCISION FINALE RECOMMANDÉE :                               │
│   Recommandation : À déterminer                             │
│   Niveau de confiance : -                                  │
│   Cartographie incertitude : -                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Métriques Globales

**Cohérence inter-rounds :**
- Le candidat dit-il la même chose à différents intervenants ?
- Incohérences inter-rounds → signal fort

**Évolution :**
- Le candidat s'améliore-t-il d'un round à l'autre ? (normal et positif)
- Le candidat se dégrade-t-il ? (signal de vigilance)

**Fatigue du processus :**
- Un processus trop long décourage les meilleurs candidats
- Le moteur alerte si le processus devient trop long vs le marché

---

## 4. Préparation Automatique de Chaque Round

### 4.1 Round 1 → Round 2

**Ce qui a été validé au Round 1 :**
- Liste des compétences validées
- Liste des soft skills évalués
- Liste des motivations clarifiées
- Liste des signaux détectés

**Ce qui reste à valider :**
- Liste des compétences non validées
- Liste des soft skills non évalués
- Liste des motivations non clarifiées
- Liste des zones d'ombre résiduelles

**Questions spécifiques pour le Round 2 :**
- Basées sur les zones d'ombre du Round 1
- Basées sur les incohérences détectées
- Basées sur les signaux de vigilance

**Intervenant recommandé pour le Round 2 :**
- Différent de l'intervenant du Round 1 si possible
- Expert dans les zones à valider
- Capable de challenger le candidat

**Ce que le Round 2 doit impérativement clarifier :**
- Les 3 zones d'ombre les plus critiques
- Les 2 incohérences les plus significatives
- Le point de décision clé

### 4.2 Round 2 → Round 3

**Même logique que Round 1 → Round 2 :**
- Ce qui a été validé au Round 2
- Ce qui reste à valider
- Questions spécifiques pour le Round 3
- Intervenant recommandé
- Ce que le Round 3 doit impérativement clarifier

**Focus sur ce qui reste ambigu :**
- Si le Round 2 a clarifié 70% des zones d'ombre
- Le Round 3 doit clarifier les 30% restants
- Si une incohérence persiste après le Round 2
- Le Round 3 doit impérativement la clarifier

**Niveau de challenge augmenté :**
- Si le candidat a bien performé au Round 2
- Le Round 3 doit augmenter le niveau de challenge
- Pour tester la résilience et la cohérence sous pression

### 4.3 Round N → Round N+1

**Logique généralisée :**
- Analyse de ce qui a été validé
- Identification de ce qui reste à valider
- Génération de questions spécifiques
- Recommandation d'intervenant
- Définition des objectifs impératifs

**Adaptation dynamique :**
- Si le candidat est très fort → Augmenter le challenge
- Si le candidat est faible → Réduire le challenge et clarifier les blocages
- Si le candidat est mitigé → Maintenir le challenge et clarifier les zones d'ombre

---

## 5. Analyse Inter-Rounds

### 5.1 Cohérence

**Définition :**
Le candidat dit-il la même chose à différents intervenants ?

**Méthode d'analyse :**
- Le moteur compare les réponses du candidat entre rounds
- Il identifie les convergences et divergences
- Il analyse la nature des divergences

**Types de divergences :**

**Divergence mineure :**
- Différence de formulation sans changement de fond
- Exemple : "J'aime le travail d'équipe" vs "Je préfère collaborer"
- Interprétation : Cohérence maintenue

**Divergence modérée :**
- Différence significative mais explicable
- Exemple : "Je cherche un poste stable" vs "Je suis ouvert à de nouveaux défis"
- Interprétation : Besoin de clarification

**Divergence majeure :**
- Contradiction directe sans explication
- Exemple : "Je suis un leader" vs "Je préfère être un contributeur individuel"
- Interprétation : Signal fort d'incohérence

**Action en cas d'incohérence :**
- Alerte immédiate au recruteur
- Question de clarification suggérée
- Si l'incohérence persiste → Signal éliminatoire potentiel

### 5.2 Évolution

**Définition :**
Le candidat s'améliore-t-il d'un round à l'autre ?

**Méthode d'analyse :**
- Le moteur compare les scores entre rounds
- Il analyse l'évolution des compétences et soft skills
- Il identifie les tendances

**Types d'évolution :**

**Amélioration positive :**
- Le candidat s'améliore d'un round à l'autre
- Exemple : Score soft skills passe de 3/5 à 4/5
- Interprétation : Normal et positif
- Le candidat apprend et s'adapte

**Stabilité :**
- Le candidat maintient un niveau constant
- Exemple : Score compétences reste à 4/5
- Interprétation : Cohérence et fiabilité

**Dégradation :**
- Le candidat se dégrade d'un round à l'autre
- Exemple : Score motivation passe de 4/5 à 2/5
- Interprétation : Signal de vigilance
- Possibles causes : fatigue, désintérêt, incohérence

**Action en cas de dégradation :**
- Alerte au recruteur
- Analyse des causes potentielles
- Si la dégradation est significative → Signal éliminatoire potentiel

### 5.3 Fatigue du Processus

**Définition :**
Un processus trop long décourage les meilleurs candidats.

**Méthode d'analyse :**
- Le moteur surveille la durée du processus
- Il compare avec les benchmarks du marché
- Il alerte si le processus devient trop long

**Seuils d'alerte :**

**Processus normal :**
- 2 rounds pour un poste junior
- 3 rounds pour un poste senior
- 4 rounds maximum pour un poste C-Level

**Processus long :**
- 3 rounds pour un poste junior
- 4 rounds pour un poste senior
- 5 rounds pour un poste C-Level
- Alerte : Processus potentiellement trop long

**Processus trop long :**
- Plus de 3 rounds pour un poste junior
- Plus de 4 rounds pour un poste senior
- Plus de 5 rounds pour un poste C-Level
- Alerte critique : Risque de perdre le candidat

**Action en cas de processus trop long :**
- Alerte immédiate au recruteur
- Recommandation : Accélérer ou simplifier
- Si le candidat est très attractif → Prioriser la décision

---

## 6. Structure de Données (TypeScript)

```typescript
interface MultiRoundProcess {
  processId: string;
  candidateId: string;
  jobId: string;
  
  globalDashboard: {
    candidateName: string;
    jobTitle: string;
    processStartedAt: Date;
    currentRound: number;
    
    rounds: {
      roundNumber: number;
      status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
      score?: number;
      keyPoints: string[];
      objectives?: string[];
      interviewer?: string;
      completedAt?: Date;
    }[];
    
    interRoundAnalysis: {
      coherence: number;
      evolution: 'positive' | 'stable' | 'degraded';
      processFatigue: 'not_detected' | 'detected' | 'critical';
    };
    
    finalRecommendation?: {
      recommendation: 'recommended' | 'rejected' | 'to_deepen';
      confidenceLevel: number;
      uncertaintyMapping: {
        technicalSkills: 'low' | 'medium' | 'high';
        motivations: 'low' | 'medium' | 'high';
        cultureFit: 'low' | 'medium' | 'high';
      };
    };
  };
  
  roundPreparation: {
    fromRound: number;
    toRound: number;
    
    validated: {
      competencies: string[];
      softSkills: string[];
      motivations: string[];
      signals: string[];
    };
    
    remaining: {
      competencies: string[];
      softSkills: string[];
      motivations: string[];
      shadowZones: string[];
    };
    
    specificQuestions: {
      question: string;
      rationale: string;
      basedOn: 'shadow_zone' | 'inconsistency' | 'vigilance';
    }[];
    
    recommendedInterviewer: string;
    
    mustClarify: string[];
  };
  
  interRoundAnalysis: {
    round1: number;
    round2: number;
    
    coherence: {
      overall: number;
      divergences: {
        type: 'minor' | 'moderate' | 'major';
        description: string;
        action: string;
      }[];
    };
    
    evolution: {
      overall: 'positive' | 'stable' | 'degraded';
      details: {
        dimension: string;
        from: number;
        to: number;
        trend: 'improvement' | 'stable' | 'degradation';
      }[];
    };
    
    processFatigue: {
      duration: number;
      benchmark: number;
      status: 'normal' | 'long' | 'too_long';
      recommendation: string;
    };
  };
  
  metadata: {
    createdAt: Date;
    lastUpdated: Date;
    status: 'active' | 'completed' | 'cancelled';
  };
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE multi rond_process (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  
  global_dashboard JSON NOT NULL,
  round_preparation JSON NOT NULL,
  inter_round_analysis JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (candidate_id) REFERENCES candidate(id),
  FOREIGN KEY (job_id) REFERENCES job(id)
);

CREATE INDEX idx_multi_round_process_candidate ON multi_round_process(candidate_id);
CREATE INDEX idx_multi_round_process_job ON multi_round_process(job_id);
CREATE INDEX idx_multi_round_process_status ON multi_round_process((metadata->>'$.status'));

CREATE TABLE round_evaluation (
  id VARCHAR(36) PRIMARY KEY,
  process_id VARCHAR(36) NOT NULL,
  round_number INT NOT NULL,
  
  score INT NOT NULL,
  key_points JSON NOT NULL,
  objectives JSON NOT NULL,
  interviewer VARCHAR(255),
  completed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (process_id) REFERENCES multi_round_process(id)
);

CREATE INDEX idx_round_evaluation_process ON round_evaluation(process_id);
CREATE INDEX idx_round_evaluation_round ON round_evaluation(round_number);
```

---

## 8. API Endpoints

```typescript
// POST /api/interview/multi-round/start
async function startMultiRoundProcess(candidateId: string, jobId: string): Promise<MultiRoundProcess> {
  return await startMultiRoundProcess(candidateId, jobId);
}

// GET /api/interview/multi-round/:processId
async function getMultiRoundProcess(processId: string): Promise<MultiRoundProcess> {
  return await getMultiRoundProcessById(processId);
}

// GET /api/interview/multi-round/candidate/:candidateId
async function getMultiRoundProcessByCandidate(candidateId: string): Promise<MultiRoundProcess> {
  return await getMultiRoundProcessByCandidate(candidateId);
}

// POST /api/interview/multi-round/:processId/prepare
async function prepareNextRound(processId: string, fromRound: number, toRound: number): Promise<MultiRoundProcess> {
  return await prepareNextRound(processId, fromRound, toRound);
}

// POST /api/interview/multi-round/:processId/analyze
async function analyzeInterRounds(processId: string, round1: number, round2: number): Promise<MultiRoundProcess> {
  return await analyzeInterRounds(processId, round1, round2);
}

// PUT /api/interview/multi-round/:processId/final-recommendation
async function setFinalRecommendation(processId: string, recommendation: any): Promise<MultiRoundProcess> {
  return await setFinalRecommendation(processId, recommendation);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Processus

| Métrique | Description | Cible |
|----------|-------------|-------|
| Durée moyenne du processus | Jours du début à la décision | ≤ 21 jours |
- Nombre moyen de rounds | Rounds / processus | 2-3 rounds |
- Taux de complétion | Processus complétés / démarrés | ≥ 85% |

### 9.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Cohérence inter-rounds | Cohérence moyenne | ≥ 80% |
- Évolution positive | Amélioration / total | ≥ 60% |
- Fatigue processus | Processus trop long / total | ≤ 10% |

---

## 10. Conclusion

Le protocole multi-rounds structure la gestion des processus de recrutement en plusieurs rounds, avec une vue d'ensemble globale, une préparation automatique de chaque round, et une analyse inter-rounds pour assurer la cohérence et la qualité des décisions. Le moteur maintient la cohérence, détecte les incohérences, et alerte en cas de fatigue du processus.

**Points clés :**
- Tableau de bord candidat global
- Vue d'ensemble de tous les rounds
- Préparation automatique de chaque round
- Analyse de cohérence inter-rounds
- Analyse d'évolution du candidat
- Surveillance de la fatigue du processus
- Alertes automatiques
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de processus et de qualité
