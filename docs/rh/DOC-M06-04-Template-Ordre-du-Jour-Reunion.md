# DOC-M06-04 : Template Ordre du Jour Réunion de Décision

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le template de l'ordre du jour généré automatiquement pour la réunion de décision du MVP-META-06 Collaborative Decision Engine. Ce document structure le format de l'ordre du jour qui facilite la décision collective.

---

## 2. Principe Fondateur

L'ordre du jour est généré automatiquement à partir de l'analyse des convergences et divergences. Il structure la réunion en 4 points : convergences (rapide), divergences majeures (approfondi), informations manquantes (action), décision et documentation (vote).

---

## 3. Format de l'Ordre du Jour

### 3.1 En-tête

```markdown
# RÉUNION DE DÉCISION

Candidat : [Nom du candidat]
Poste : [Intitulé du poste]
Date : [Date de la réunion]
Durée estimée : 45-60 minutes

Intervenants présents :
- [Intervenant 1] - [Rôle]
- [Intervenant 2] - [Rôle]
- [Intervenant 3] - [Rôle]
- [Intervenant 4] - [Rôle]
```

---

### 3.2 POINT 1 — Convergences (5 min)

**Objectif :**
Revue rapide des points sur lesquels tout le monde s'accorde.

**Format :**
```markdown
## POINT 1 — CONVERGENCES (5 min)

Ce sur quoi tout le monde s'accorde :

- [Dimension 1] : Score moyen X/5 (confiance haute)
  - HR : X/5
  - Manager : X/5
  - Expert : X/5
  - Direction : X/5

- [Dimension 2] : Score moyen X/5 (confiance haute)
  - HR : X/5
  - Manager : X/5
  - Expert : X/5
  - Direction : X/5

Ces points ne nécessitent pas de débat.
```

---

### 3.3 POINT 2 — Divergences Majeures (20 min)

**Objectif :**
Discussion approfondie des points sur lesquels il faut débattre.

**Format :**
```markdown
## POINT 2 — DIVERGENCES MAJEURES (20 min)

Ce sur quoi il faut débattre :

### Divergence 1 : [Dimension]

**Position A :** [Intervenant] dit [quoi]
- Score : X/5
- Justification : [observation]

**Position B :** [Intervenant] dit [quoi]
- Score : X/5
- Justification : [observation]

**Type de divergence :** [Compétence / Perspective / Intuition / Biais]

**Question pour trancher :** [formulation]

---

### Divergence 2 : [Dimension]

**Position A :** [Intervenant] dit [quoi]
- Score : X/5
- Justification : [observation]

**Position B :** [Intervenant] dit [quoi]
- Score : X/5
- Justification : [observation]

**Type de divergence :** [Compétence / Perspective / Intuition / Biais]

**Question pour trancher :** [formulation]
```

---

### 3.4 POINT 3 — Informations Manquantes (10 min)

**Objectif :**
Identification de ce qui n'a pas été évalué et qui manque pour décider.

**Format :**
```markdown
## POINT 3 — INFORMATIONS MANQUANTES (10 min)

Ce qui n'a pas été évalué et qui manque pour décider :

- [Information 1] : [description]
  - Pourquoi c'est important : [explication]
  - Solution proposée : [action]

- [Information 2] : [description]
  - Pourquoi c'est important : [explication]
  - Solution proposée : [action]
```

---

### 3.5 POINT 4 — Décision et Documentation (10 min)

**Objectif :**
Prise de décision collective et documentation.

**Format :**
```markdown
## POINT 4 — DÉCISION ET DOCUMENTATION (10 min)

### Vote

- [Intervenant 1] : Pour / Contre / Abstention
- [Intervenant 2] : Pour / Contre / Abstention
- [Intervenant 3] : Pour / Contre / Abstention
- [Intervenant 4] : Pour / Contre / Abstention

**Résultat du vote :** [Pour / Contre / En attente]

### Facteur décisif

[Ce qui a fait basculer la décision]

### Risques acceptés consciemment

- [Risque 1] : [description]
- [Risque 2] : [description]

### Conditions de la décision (si applicable)

- [Condition 1] : [description]
- [Condition 2] : [description]

### Traçabilité

- Archivé : Oui/Non
- Auditable : Oui/Non
- Signé : Oui/Non
```

---

## 4. Structure de Données (TypeScript)

```typescript
interface AgendaItem {
  itemId: string;
  agendaId: string;
  
  itemType: 'convergence' | 'divergence' | 'missingInfo' | 'decision';
  
  order: number;
  durationMinutes: number;
  
  content: {
    title: string;
    description?: string;
    data?: any;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface ConvergenceItem extends AgendaItem {
  itemType: 'convergence';
  
  content: {
    title: string;
    dimension: string;
    meanScore: number;
    confidence: 'low' | 'medium' | 'high';
    scores: {
      intervenantId: string;
      intervenantRole: string;
      score: number;
    }[];
  };
}

interface DivergenceItem extends AgendaItem {
  itemType: 'divergence';
  
  content: {
    title: string;
    dimension: string;
    positions: {
      intervenantId: string;
      intervenantRole: string;
      score: number;
      justification: string;
    }[];
    divergenceType: 'competence' | 'perspective' | 'intuition' | 'bias';
    debateQuestion: string;
  };
}

interface MissingInfoItem extends AgendaItem {
  itemType: 'missingInfo';
  
  content: {
    title: string;
    information: string;
    importance: string;
    proposedSolution: string;
  };
}

interface DecisionItem extends AgendaItem {
  itemType: 'decision';
  
  content: {
    title: string;
    votes: {
      intervenantId: string;
      intervenantRole: string;
      vote: 'for' | 'against' | 'abstain';
    }[];
    voteResult: 'for' | 'against' | 'pending';
    decisiveFactor: string;
    acceptedRisks: string[];
    conditions: string[];
    traceability: {
      archived: boolean;
      auditable: boolean;
      signed: boolean;
    };
  };
}

interface MeetingAgenda {
  agendaId: string;
  recruitmentId: string;
  candidateId: string;
  
  candidateName: string;
  positionTitle: string;
  meetingDate: Date;
  estimatedDuration: number;
  
  intervenants: {
    intervenantId: string;
    intervenantName: string;
    intervenantRole: string;
  }[];
  
  items: AgendaItem[];
  
  generatedAt: Date;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 5. Stockage et Gestion

### 5.1 Schéma SQL

```sql
CREATE TABLE meeting_agenda (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  candidate_name VARCHAR(100) NOT NULL,
  position_title VARCHAR(100) NOT NULL,
  meeting_date TIMESTAMP NOT NULL,
  estimated_duration INT NOT NULL,
  
  intervenants JSON NOT NULL,
  items JSON NOT NULL,
  
  generated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_meeting_agenda_recruitment ON meeting_agenda(recruitment_id);
CREATE INDEX idx_meeting_agenda_candidate ON meeting_agenda(candidate_id);
CREATE INDEX idx_meeting_agenda_date ON meeting_agenda(meeting_date);
```

---

## 6. API Endpoints

```typescript
// POST /api/agenda/generate
async function generateAgenda(recruitmentId: string, candidateId: string): Promise<MeetingAgenda> {
  return await generateAgenda(recruitmentId, candidateId);
}

// GET /api/agenda/:agendaId
async function getAgenda(agendaId: string): Promise<MeetingAgenda> {
  return await getAgenda(agendaId);
}

// GET /api/agenda/recruitment/:recruitmentId
async function getAgendaByRecruitment(recruitmentId: string): Promise<MeetingAgenda> {
  return await getAgendaByRecruitment(recruitmentId);
}

// PUT /api/agenda/:agendaId/item
async function addAgendaItem(agendaId: string, item: AgendaItem): Promise<MeetingAgenda> {
  return await addAgendaItem(agendaId, item);
}

// PUT /api/agenda/:agendaId/decision
async function recordDecision(agendaId: string, decision: DecisionItem): Promise<MeetingAgenda> {
  return await recordDecision(agendaId, decision);
}

// POST /api/agenda/:agendaId/export
async function exportAgenda(agendaId: string, format: 'markdown' | 'pdf'): Promise<any> {
  return await exportAgenda(agendaId, format);
}
```

---

## 7. Exemple Complet

```markdown
# RÉUNION DE DÉCISION

Candidat : Jean Dupont
Poste : Lead Developer
Date : 2026-08-15
Durée estimée : 45-60 minutes

Intervenants présents :
- Marie Martin - RH
- Pierre Durand - Manager direct
- Sophie Bernard - Expert technique
- Luc Petit - Direction

---

## POINT 1 — CONVERGENCES (5 min)

Ce sur quoi tout le monde s'accorde :

- Culture fit : Score moyen 4.4/5 (confiance haute)
  - HR : 4.5/5
  - Manager : 4.2/5
  - Expert : 4.3/5
  - Direction : 4.6/5

- Soft skills : Score moyen 4.2/5 (confiance haute)
  - HR : 4.3/5
  - Manager : 4.0/5
  - Expert : 4.1/5
  - Direction : 4.4/5

Ces points ne nécessitent pas de débat.

---

## POINT 2 — DIVERGENCES MAJEURES (20 min)

Ce sur quoi il faut débattre :

### Divergence 1 : Potentiel de leadership

**Position A :** Direction dit 5.0/5
- Score : 5.0/5
- Justification : Vision claire, charisme naturel

**Position B :** Manager dit 3.0/5
- Score : 3.0/5
- Justification : Manque d'expérience d'équipe

**Type de divergence :** Perspective

**Question pour trancher :** Le potentiel de leadership est-il suffisant pour compenser le manque d'expérience d'équipe ?

---

### Divergence 2 : Profondeur technique

**Position A :** Expert technique dit 3.5/5
- Score : 3.5/5
- Justification : Lacunes sur les technologies récentes

**Position B :** Manager dit 4.5/5
- Score : 4.5/5
- Justification : Solide sur les technologies de l'entreprise

**Type de divergence :** Compétence

**Question pour trancher :** Les lacunes techniques sont-elles comblables par la formation ?

---

## POINT 3 — INFORMATIONS MANQUANTES (10 min)

Ce qui n'a pas été évalué et qui manque pour décider :

- Références : Non contactées
  - Pourquoi c'est important : Valider l'expérience et le style de travail
  - Solution proposée : Contacter 2 références avant décision finale

- Test technique pratique : Non réalisé
  - Pourquoi c'est important : Valider la profondeur technique en situation
  - Solution proposée : Organiser un test technique de 2h

---

## POINT 4 — DÉCISION ET DOCUMENTATION (10 min)

## POINT 4 — DÉCISION ET DOCUMENTATION (10 min)

### Vote

- Marie Martin (RH) : Pour
- Pierre Durand (Manager) : Contre
- Sophie Bernard (Expert) : Abstention
- Luc Petit (Direction) : Pour

**Résultat du vote :** Pour (2 pour, 1 contre, 1 abstention)

### Facteur décisif

Le potentiel de leadership et la culture fit priment sur les lacunes techniques, qui sont comblables.

### Risques acceptés consciemment

- Lacunes techniques sur les technologies récentes
- Manque d'expérience d'équipe

### Conditions de la décision

- Références contactées et positives
- Test technique réussi (score ≥ 3/5)
- Plan de formation sur les technologies récentes défini

### Traçabilité

- Archivé : Oui
- Auditable : Oui
- Signé : Oui
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération d'agendas | Agendas générés / réunions planifiées | 100% |
- Taux de respect du temps | Réunions dans le temps estimé / totales | ≥ 90% |

### 8.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de documentation complète | Décisions documentées / totales | 100% |
- Taux de traçabilité | Décisions traçables / totales | 100% |

---

## 9. Conclusion

Le template de l'ordre du jour réunion de décision structure la réunion en 4 points. POINT 1 : Convergences (5 min) - revue rapide des points d'accord, confiance amplifiée. POINT 2 : Divergences majeures (20 min) - discussion approfondie avec positions A/B, type de divergence, question pour trancher. POINT 3 : Informations manquantes (10 min) - identification de ce qui manque, solution proposée. POINT 4 : Décision et documentation (10 min) - vote, facteur décisif, risques acceptés, conditions, traçabilité. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 4 points de l'ordre du jour
- Convergences (5 min)
- Divergences majeures (20 min)
- Informations manquantes (10 min)
- Décision et documentation (10 min)
- Vote et documentation
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'utilisation
