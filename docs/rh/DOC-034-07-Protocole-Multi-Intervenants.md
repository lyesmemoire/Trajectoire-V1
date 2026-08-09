# DOC-034-07 : Protocole Multi-Intervenants

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole multi-intervenants pour MVP-034 Interview Orchestrator. Ce protocole structure la coordination des intervenants pour les entretiens panel ou multi-rounds, incluant l'attribution des dimensions par intervenant, le briefing individualisé, la collecte et synthèse des évaluations, et la gestion des désaccords.

---

## 2. Principe Fondateur

Un entretien multi-intervenants doit être coordonné pour éviter les redondances et les angles morts. Chaque intervenant a un rôle spécifique basé sur son expertise. Le moteur orchestre la coordination, génère des briefings individualisés, et synthétise les évaluations pour faciliter la décision collective.

---

## 3. Coordination des Intervenants

### 3.1 Attribution des Dimensions par Intervenant

**RH :**
- Culture fit
- Soft skills
- Motivations
- Compatibilité avec les valeurs de l'entreprise

**Manager Direct :**
- Compétences métier
- Adéquation avec l'équipe
- Capacité opérationnelle immédiate
- Fit avec le style de management

**Expert Technique :**
- Compétences techniques
- Profondeur d'expertise
- Capacité technique à résoudre des problèmes
- Adéquation avec la stack technique

**Direction :**
- Vision
- Leadership
- Potentiel long terme
- Capacité de représentation

**Pair :**
- Collaboration
- Dynamique d'équipe
- Intelligence relationnelle
- Fit avec la culture d'équipe

### 3.2 Répartition des Questions par Intervenant

**Le moteur coordonne les questions :**
- Il attribue chaque question à l'intervenant le plus approprié
- Il évite les redondances
- Il identifie les angles morts et suggère des questions pour les couvrir

**Exemple de répartition :**

**RH :**
- "Qu'est-ce qui vous motive dans ce poste ?"
- "Décrivez le manager idéal pour vous."
- "Quelles sont vos valeurs professionnelles ?"

**Manager Direct :**
- "Comment travaillerez-vous avec l'équipe ?"
- "Quelle est votre approche pour [tâche spécifique] ?"
- "Comment gérez-vous les priorités ?"

**Expert Technique :**
- "Comment résoudriez-vous [problème technique] ?"
- "Quelle est votre expérience avec [technologie] ?"
- "Comment gardez-vous vos compétences à jour ?"

**Direction :**
- "Quelle est votre vision pour ce rôle dans 3 ans ?"
- "Comment avez-vous géré [situation de leadership] ?"
- "Quelles sont vos priorités stratégiques ?"

**Pair :**
- "Comment collaborez-vous avec vos collègues ?"
- "Racontez-moi une collaboration réussie."
- "Comment gérez-vous les conflits d'équipe ?"

---

## 4. Briefing Individualisé par Intervenant

### 4.1 Template de Briefing

**Pour chaque intervenant :**

```
┌─────────────────────────────────────────────────────────────┐
│ BRIEFING INTERVENANT                                       │
│ Intervenant : [Nom]                                       │
│ Rôle : [RH / Manager / Expert / Direction / Pair]          │
│ Candidat : [Prénom Nom]                                    │
│ Poste : [Intitulé]                                        │
├─────────────────────────────────────────────────────────────┤
│ CE QUE VOUS ÉVALUEZ :                                     │
│ • [Dimension 1]                                           │
│ • [Dimension 2]                                           │
│ • [Dimension 3]                                           │
├─────────────────────────────────────────────────────────────┤
│ CE QUE LES AUTRES ÉVALUENT :                              │
│ • [Intervenant 1] : [Dimensions]                          │
│ • [Intervenant 2] : [Dimensions]                          │
│ • [Intervenant 3] : [Dimensions]                          │
│                                                             │
│ ⚠️ ÉVITER LES REDONDANCES SUR :                            │
│ • [Dimension déjà couverte]                                │
├─────────────────────────────────────────────────────────────┤
│ VOS 3 QUESTIONS SPÉCIFIQUES :                              │
│ 1. [Question 1]                                           │
│ 2. [Question 2]                                           │
│ 3. [Question 3]                                           │
├─────────────────────────────────────────────────────────────┤
│ SIGNAUX À SURVEILLER DEPUIS VOTRE ANGLE :                 │
│ • [Signal 1] → [Indicateur]                               │
│ • [Signal 2] → [Indicateur]                               │
├─────────────────────────────────────────────────────────────┤
│ POINTS À VALIDER IMPÉRATIVEMENT :                          │
│ • [Point 1]                                               │
│ • [Point 2]                                               │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Exemple de Briefing RH

```
┌─────────────────────────────────────────────────────────────┐
│ BRIEFING INTERVENANT                                       │
│ Intervenant : Marie Dupont                                 │
│ Rôle : RH                                                 │
│ Candidat : Jean Martin                                    │
│ Poste : Senior Software Engineer                           │
├─────────────────────────────────────────────────────────────┤
│ CE QUE VOUS ÉVALUEZ :                                     │
│ • Culture fit                                             │
│ • Soft skills                                             │
│ • Motivations                                             │
├─────────────────────────────────────────────────────────────┤
│ CE QUE LES AUTRES ÉVALUENT :                              │
│ • Manager : Compétences métier, Adéquation équipe          │
│ • Expert : Compétences techniques, Profondeur expertise    │
│                                                             │
│ ⚠️ ÉVITER LES REDONDANCES SUR :                            │
│ • Compétences techniques (Expert)                           │
│ • Capacité opérationnelle (Manager)                         │
├─────────────────────────────────────────────────────────────┤
│ VOS 3 QUESTIONS SPÉCIFIQUES :                              │
│ 1. "Qu'est-ce qui vous motive dans ce poste ?"             │
│ 2. "Décrivez le manager idéal pour vous."                   │
│ 3. "Quelles sont vos valeurs professionnelles ?"             │
├─────────────────────────────────────────────────────────────┤
│ SIGNAUX À SURVEILLER DEPUIS VOTRE ANGLE :                 │
│ • Questions sur l'équipe → Intelligence relationnelle       │
│ • Évitement des réponses directes → Manque de transparence │
├─────────────────────────────────────────────────────────────┤
│ POINTS À VALIDER IMPÉRATIVEMENT :                          │
│ • Cohérence motivation / culture entreprise                 │
│ • Risque de désengagement                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Collecte et Synthèse des Évaluations

### 5.1 Processus de Collecte

**Chaque intervenant cote via le moteur :**
- Accès à l'interface de cotation
- Cotation des dimensions assignées
- Ajout de notes libres
- Soumission de l'évaluation

**Le moteur collecte les évaluations :**
- Il agrège les cotations de tous les intervenants
- Il identifie les convergences
- Il identifie les divergences
- Il prépare la synthèse

### 5.2 Synthèse des Évaluations

**Le moteur identifie les convergences :**
- Dimensions sur lesquelles tous les intervenants sont d'accord
- Signaux positifs communs
- Signaux de vigilance communs

**Le moteur identifie les divergences :**
- Dimensions sur lesquelles les intervenants divergent
- Signaux contradictoires
- Scores significativement différents

**Le moteur propose une synthèse argumentée :**
- Il présente les convergences
- Il présente les divergences
- Il propose une interprétation
- Il suggère une décision

### 5.3 Exemple de Synthèse

```
┌─────────────────────────────────────────────────────────────┐
│ SYNTHÈSE MULTI-INTERVENANTS                                │
│ Candidat : Jean Martin                                    │
│ Poste : Senior Software Engineer                           │
├─────────────────────────────────────────────────────────────┤
│ CONVERGENCES :                                             │
│ ✓ Expertise technique solide (tous les intervenants)        │
│ ✓ Motivation claire (RH, Manager)                           │
│ ✓ Intelligence relationnelle (RH, Pair)                    │
├─────────────────────────────────────────────────────────────┤
│ DIVERGENCES :                                              │
│ ⚠ Culture fit : RH (positif) / Expert (négatif)           │
│   • RH : "Cohérence avec les valeurs"                      │
│   • Expert : "Tendance à surcharger, risque burn-out"      │
│                                                             │
│ ⚠ Leadership : Manager (positif) / Direction (mitigé)      │
│   • Manager : "Bon leadership opérationnel"                │
│   • Direction : "Leadership stratégique à développer"        │
├─────────────────────────────────────────────────────────────┤
│ INTERPRÉTATION :                                           │
│ Le candidat a une expertise technique solide et une        │
│ motivation claire. Il y a une divergence sur le culture   │
│ fit : RH voit une cohérence avec les valeurs, mais        │
│ Expert identifie un risque de surcharge. Le leadership     │
│ opérationnel est bon, mais le leadership stratégique       │
│ doit être développé.                                       │
├─────────────────────────────────────────────────────────────┤
│ RECOMMANDATION : Recommandé avec conditions                │
│                                                             │
│ CONDITIONS :                                               │
│ • Clarifier le risque de surcharge avec le manager         │
│ • Plan de développement du leadership stratégique            │
│ • Suivi rapproché les 6 premiers mois                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Gestion des Désaccords Entre Intervenants

### 6.1 Identification des Désaccords

**Types de désaccords :**

**Désaccord mineur :**
- Différence de score faible (≤ 1 point sur 5)
- Exemple : RH note 4/5, Manager note 3/5
- Interprétation : Différence de perspective normale

**Désaccord modéré :**
- Différence de score moyenne (2 points sur 5)
- Exemple : RH note 4/5, Expert note 2/5
- Interprétation : Besoin de discussion

**Désaccord majeur :**
- Différence de score élevée (≥ 3 points sur 5)
- Exemple : RH note 5/5, Expert note 1/5
- Interprétation : Conflit significatif à résoudre

### 6.2 Processus de Résolution

**Si les évaluations divergent :**

**Étape 1 — Le moteur identifie la source du désaccord :**
- Dimension spécifique
- Intervenants en désaccord
- Nature du désaccord (score, signal, interprétation)

**Étape 2 — Le moteur propose une grille de discussion :**
- Points de convergence
- Points de divergence
- Questions de clarification
- Données supplémentaires à collecter

**Étape 3 — Discussion entre intervenants :**
- Réunion de synchronisation
- Présentation des points de vue
- Discussion des divergences
- Recherche de consensus

**Étape 4 — Décision collective :**
- Si consensus atteint → Décision commune
- Si consensus partiel → Vote pondéré
- Si désaccord persiste → Décision par le décideur final

### 6.3 Grille de Discussion

**Template de grille :**

```
┌─────────────────────────────────────────────────────────────┐
│ GRILLE DE DISCUSSION                                       │
│ Dimension : [Nom de la dimension]                           │
├─────────────────────────────────────────────────────────────┤
│ INTERVENANTS EN DÉSACCORD :                                 │
│ • [Intervenant 1] : Score [X/5], Justification [...]        │
│ • [Intervenant 2] : Score [Y/5], Justification [...]        │
├─────────────────────────────────────────────────────────────┤
│ POINTS DE CONVERGENCE :                                     │
│ • [Point 1]                                               │
│ • [Point 2]                                               │
├─────────────────────────────────────────────────────────────┤
│ POINTS DE DIVERGENCE :                                      │
│ • [Point 1]                                               │
│ • [Point 2]                                               │
├─────────────────────────────────────────────────────────────┤
│ QUESTIONS DE CLARIFICATION :                                │
│ • [Question 1]                                           │
│ • [Question 2]                                           │
├─────────────────────────────────────────────────────────────┤
│ DONNÉS SUPPLÉMENTAIRES NÉCESSAIRES :                       │
│ • [Donnée 1]                                             │
│ • [Donnée 2]                                             │
├─────────────────────────────────────────────────────────────┤
│ PROPOSITION DE SYNTHÈSE :                                  │
│ [Proposition]                                             │
├─────────────────────────────────────────────────────────────┤
│ DÉCISION :                                                 │
│ [Décision collective]                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Structure de Données (TypeScript)

```typescript
interface MultiInterviewerProtocol {
  protocolId: string;
  interviewId: string;
  
  interviewers: {
    interviewerId: string;
    name: string;
    role: 'hr' | 'manager' | 'expert' | 'director' | 'peer';
    assignedDimensions: string[];
    otherInterviewers: {
      interviewerId: string;
      name: string;
      role: string;
      assignedDimensions: string[];
    }[];
    specificQuestions: {
      question: string;
      order: number;
    }[];
    signalsToWatch: {
      signal: string;
      indicator: string;
    }[];
    mustValidate: string[];
  }[];
  
  questionAllocation: {
    question: string;
    assignedToInterviewer: string;
    dimension: string;
    rationale: string;
  }[];
  
  evaluations: {
    interviewerId: string;
    dimension: string;
    score: number;
    notes: string;
    submittedAt: Date;
  }[];
  
  synthesis: {
    convergences: {
      dimension: string;
      consensus: string;
    }[];
    divergences: {
      dimension: string;
      interviewer1: string;
      score1: number;
      justification1: string;
      interviewer2: string;
      score2: number;
      justification2: string;
    }[];
    interpretation: string;
    recommendation: string;
    conditions?: string[];
  };
  
  disagreementResolution: {
    dimension: string;
    disagreementType: 'minor' | 'moderate' | 'major';
    discussionGrid: {
      convergences: string[];
      divergences: string[];
      clarificationQuestions: string[];
      additionalDataNeeded: string[];
      synthesisProposal: string;
      decision: string;
    };
  }[];
  
  metadata: {
    createdAt: Date;
    lastUpdated: Date;
    status: 'active' | 'completed' | 'cancelled';
  };
}
```

---

## 8. Stockage et Gestion

### 8.1 Schéma SQL

```sql
CREATE TABLE multi_interviewer_protocol (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  
  interviewers JSON NOT NULL,
  question_allocation JSON NOT NULL,
  evaluations JSON NOT NULL,
  synthesis JSON NOT NULL,
  disagreement_resolution JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview(id)
);

CREATE INDEX idx_multi_interviewer_protocol_interview ON multi_interviewer_protocol(interview_id);
CREATE INDEX idx_multi_interviewer_protocol_status ON multi_interviewer_protocol((metadata->>'$.status'));

CREATE TABLE interviewer_evaluation (
  id VARCHAR(36) PRIMARY KEY,
  protocol_id VARCHAR(36) NOT NULL,
  interviewer_id VARCHAR(36) NOT NULL,
  
  dimension VARCHAR(255) NOT NULL,
  score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
  notes TEXT NOT NULL,
  submitted_at TIMESTAMP NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (protocol_id) REFERENCES multi_interviewer_protocol(id)
);

CREATE INDEX idx_interviewer_evaluation_protocol ON interviewer_evaluation(protocol_id);
CREATE INDEX idx_interviewer_evaluation_interviewer ON interviewer_evaluation(interviewer_id);
```

---

## 9. API Endpoints

```typescript
// POST /api/interview/multi-interviewer/setup
async function setupMultiInterviewerProtocol(interviewId: string, interviewers: any[]): Promise<MultiInterviewerProtocol> {
  return await setupMultiInterviewerProtocol(interviewId, interviewers);
}

// GET /api/interview/multi-interviewer/:protocolId
async function getMultiInterviewerProtocol(protocolId: string): Promise<MultiInterviewerProtocol> {
  return await getMultiInterviewerProtocolById(protocolId);
}

// POST /api/interview/multi-interviewer/:protocolId/briefing/:interviewerId
async function generateInterviewerBriefing(protocolId: string, interviewerId: string): Promise<any> {
  return await generateInterviewerBriefing(protocolId, interviewerId);
}

// POST /api/interview/multi-interviewer/:protocolId/evaluation
async function submitInterviewerEvaluation(protocolId: string, interviewerId: string, evaluation: any): Promise<InterviewerEvaluation> {
  return await submitInterviewerEvaluation(protocolId, interviewerId, evaluation);
}

// POST /api/interview/multi-interviewer/:protocolId/synthesize
async function synthesizeEvaluations(protocolId: string): Promise<MultiInterviewerProtocol> {
  return await synthesizeEvaluations(protocolId);
}

// POST /api/interview/multi-interviewer/:protocolId/resolve-disagreement
async function resolveDisagreement(protocolId: string, dimension: string, resolution: any): Promise<MultiInterviewerProtocol> {
  return await resolveDisagreement(protocolId, dimension, resolution);
}
```

---

## 10. Indicateurs de Suivi

### 10.1 Métriques de Coordination

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de couverture | Dimensions couvertes / total | 100% |
- Taux de redondance | Questions redondantes / total | ≤ 5% |
- Taux de briefing | Briefings lus / générés | ≥ 95% |

### 10.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de convergence | Convergences / total dimensions | ≥ 70% |
- Taux de résolution de désaccord | Désaccords résolus / total | ≥ 80% |
- Satisfaction intervenants | Note moyenne | ≥ 4.0/5 |

---

## 11. Conclusion

Le protocole multi-intervenants structure la coordination des intervenants pour les entretiens panel ou multi-rounds. Le moteur attribue les dimensions par intervenant, génère des briefings individualisés, collecte et synthétise les évaluations, et gère les désaccords entre intervenants pour faciliter la décision collective.

**Points clés :**
- Attribution des dimensions par intervenant (RH, Manager, Expert, Direction, Pair)
- Répartition des questions par intervenant
- Briefing individualisé par intervenant
- Collecte des évaluations via le moteur
- Synthèse des évaluations (convergences, divergences)
- Gestion des désaccords (mineur, modéré, majeur)
- Grille de discussion pour résolution
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de coordination et de qualité
