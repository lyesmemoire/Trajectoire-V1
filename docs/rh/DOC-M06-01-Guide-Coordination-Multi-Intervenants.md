# DOC-M06-01 : Guide de Coordination Multi-Intervenants

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le guide de coordination multi-intervenants pour le MVP-META-06 Collaborative Decision Engine. Ce document structure l'attribution des rôles et la coordination entre les différents intervenants dans le processus de décision de recrutement.

---

## 2. Principe Fondateur

Chaque intervenant a un rôle spécifique et évalue des aspects distincts du candidat. La coordination évite les doublons, garantit une couverture complète, et facilite la prise de décision collective.

---

## 3. Attribution des Rôles

### 3.1 Intervenant RH

**Évalue :**
- Culture fit
- Soft skills
- Motivations
- Conformité légale

**Ne double pas :**
- Compétences techniques

**Responsabilités :**
- Évaluer l'alignement avec les valeurs de l'entreprise
- Évaluer les compétences interpersonnelles
- Évaluer les motivations du candidat
- Vérifier la conformité légale (autorisation de travail, etc.)

---

### 3.2 Intervenant Manager Direct

**Évalue :**
- Compétences métier
- Adéquation équipe
- Style de travail

**Ne double pas :**
- Questions RH génériques

**Responsabilités :**
- Évaluer les compétences techniques spécifiques au poste
- Évaluer l'adéquation avec l'équipe existante
- Évaluer le style de travail du candidat
- Évaluer la capacité à collaborer

---

### 3.3 Intervenant Expert Technique

**Évalue :**
- Profondeur technique
- Connaissances spécifiques

**Ne double pas :**
- Soft skills
- Culture

**Responsabilités :**
- Évaluer la profondeur des connaissances techniques
- Évaluer les compétences spécifiques à un domaine
- Évaluer la capacité technique à résoudre des problèmes complexes
- Valider l'expertise technique annoncée

---

### 3.4 Intervenant Direction

**Évalue :**
- Vision
- Leadership
- Potentiel long terme
- Représentation externe

**Ne double pas :**
- Opérationnel

**Responsabilités :**
- Évaluer la vision du candidat
- Évaluer le potentiel de leadership
- Évaluer le potentiel à long terme
- Évaluer la capacité de représentation externe

---

## 4. Processus de Coordination

### 4.1 Phase de Préparation

**Actions :**
1. Identification des intervenants nécessaires
2. Attribution des rôles selon le profil du poste
3. Génération du briefing automatique pour chaque intervenant
4. Planification des entretiens

**Durée :** 2-3 jours avant les entretiens

---

### 4.2 Phase d'Évaluation

**Actions :**
1. Chaque intervenant réalise son évaluation selon son rôle
2. Les intervenants documentent leurs observations
3. Les intervenants notent leurs scores selon leurs critères
4. Les évaluations sont centralisées dans le système

**Durée :** Variable selon le nombre d'entretiens

---

### 4.3 Phase d'Agrégation

**Actions :**
1. Le moteur analyse les convergences entre évaluations
2. Le moteur analyse les divergences entre évaluations
3. Le moteur classe les divergences par type
4. Le moteur génère l'ordre du jour de la réunion de décision

**Durée :** Automatique, quelques minutes

---

### 4.4 Phase de Décision

**Actions :**
1. Réunion de décision avec tous les intervenants
2. Discussion des convergences (rapide)
3. Discussion des divergences (approfondie)
4. Identification des informations manquantes
5. Prise de décision collective
6. Documentation de la décision

**Durée :** 45-60 minutes

---

## 5. Structure de Données (TypeScript)

```typescript
interface IntervenantRole {
  roleId: string;
  roleType: 'hr' | 'manager' | 'expert' | 'direction';
  
  evaluates: string[];
  doesNotDuplicate: string[];
  
  responsibilities: string[];
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface IntervenantAssignment {
  assignmentId: string;
  recruitmentId: string;
  candidateId: string;
  
  intervenantId: string;
  intervenantName: string;
  intervenantRole: IntervenantRole;
  
  assignedAt: Date;
  assignedBy: string;
  
  evaluationStatus: 'pending' | 'inProgress' | 'completed';
  evaluationCompletedAt?: Date;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface CoordinationSession {
  sessionId: string;
  recruitmentId: string;
  candidateId: string;
  
  intervenants: IntervenantAssignment[];
  
  phase: 'preparation' | 'evaluation' | 'aggregation' | 'decision' | 'completed';
  
  preparationDate: Date;
  evaluationStartDate: Date;
  evaluationEndDate?: Date;
  aggregationDate?: Date;
  decisionDate?: Date;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE intervenant_role (
  id VARCHAR(36) PRIMARY KEY,
  role_type VARCHAR(20) NOT NULL,
  
  evaluates JSON NOT NULL,
  does_not_duplicate JSON NOT NULL,
  responsibilities JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE intervenant_assignment (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  intervenant_id VARCHAR(36) NOT NULL,
  intervenant_name VARCHAR(100) NOT NULL,
  intervenant_role_id VARCHAR(36) NOT NULL,
  
  assigned_at TIMESTAMP NOT NULL,
  assigned_by VARCHAR(100) NOT NULL,
  
  evaluation_status VARCHAR(20) NOT NULL,
  evaluation_completed_at TIMESTAMP,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_intervenant_assignment_recruitment ON intervenant_assignment(recruitment_id);
CREATE INDEX idx_intervenant_assignment_candidate ON intervenant_assignment(candidate_id);
CREATE INDEX idx_intervenant_assignment_intervenant ON intervenant_assignment(intervenant_id);

CREATE TABLE coordination_session (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  phase VARCHAR(20) NOT NULL,
  
  preparation_date TIMESTAMP NOT NULL,
  evaluation_start_date TIMESTAMP NOT NULL,
  evaluation_end_date TIMESTAMP,
  aggregation_date TIMESTAMP,
  decision_date TIMESTAMP,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_coordination_session_recruitment ON coordination_session(recruitment_id);
CREATE INDEX idx_coordination_session_candidate ON coordination_session(candidate_id);
```

---

## 7. API Endpoints

```typescript
// POST /api/coordination/assign-intervenants
async function assignIntervenants(recruitmentId: string, candidateId: string, intervenants: IntervenantAssignment[]): Promise<CoordinationSession> {
  return await assignIntervenants(recruitmentId, candidateId, intervenants);
}

// GET /api/coordination/session/:sessionId
async function getCoordinationSession(sessionId: string): Promise<CoordinationSession> {
  return await getCoordinationSession(sessionId);
}

// GET /api/coordination/session/recruitment/:recruitmentId
async function getCoordinationSessionByRecruitment(recruitmentId: string): Promise<CoordinationSession> {
  return await getCoordinationSessionByRecruitment(recruitmentId);
}

// PUT /api/coordination/session/:sessionId/phase
async function updateSessionPhase(sessionId: string, phase: 'preparation' | 'evaluation' | 'aggregation' | 'decision' | 'completed'): Promise<CoordinationSession> {
  return await updateSessionPhase(sessionId, phase);
}

// PUT /api/coordination/assignment/:assignmentId/status
async function updateEvaluationStatus(assignmentId: string, status: 'pending' | 'inProgress' | 'completed'): Promise<IntervenantAssignment> {
  return await updateEvaluationStatus(assignmentId, status);
}

// GET /api/coordination/roles
async function getIntervenantRoles(): Promise<IntervenantRole[]> {
  return await getIntervenantRoles();
}

// GET /api/coordination/role/:roleType
async function getIntervenantRole(roleType: 'hr' | 'manager' | 'expert' | 'direction'): Promise<IntervenantRole> {
  return await getIntervenantRole(roleType);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de couverture des rôles | Rôles assignés / rôles nécessaires | 100% |
- Taux de complétude des évaluations | Évaluations complètes / assignées | 100% |
- Délai moyen de coordination | Temps moyen de préparation à décision | < 7 jours |

### 8.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de respect des rôles | Évaluations conformes au rôle / totales | ≥ 95% |
- Taux de doublon évité | Cas sans doublon / totaux | 100% |

---

## 9. Conclusion

Le guide de coordination multi-intervenants structure l'attribution des rôles et la coordination entre les différents intervenants. 4 types d'intervenants : RH (culture fit, soft skills, motivations, conformité légale), Manager direct (compétences métier, adéquation équipe, style de travail), Expert technique (profondeur technique, connaissances spécifiques), Direction (vision, leadership, potentiel long terme, représentation externe). Chaque intervenant a des responsabilités clairement définies et ne double pas les autres. Processus de coordination en 4 phases : préparation, évaluation, agrégation, décision. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 4 types d'intervenants
- Attribution claire des rôles
- Responsabilités spécifiques
- Évitement des doublons
- Processus de coordination en 4 phases
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'utilisation
