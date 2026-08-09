# DOC-M09-02 : Questions Révélatrices pour Chaque Décalage

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir les questions révélatrices pour chaque décalage fondamental pour le MVP-META-09 Gap Detection Engine. Ce document structure les questions spécifiques qui permettent de détecter les écarts entre le discours et la réalité.

---

## 2. Principe Fondateur

Chaque décalage fondamental nécessite une question spécifique conçue pour révéler l'écart entre ce que le candidat dit de lui-même et ce que ses comportements montrent réellement. Ces questions sont formulées pour contourner les réponses préparées et obtenir des preuves concrètes.

---

## 3. Questions Révélatrices

### 3.1 Question pour le Décalage Leadership

**Question :**
"Donnez-moi un exemple de décision difficile et impopulaire que VOUS avez prise seul. Pas avec votre équipe. Vous seul."

**Objectif de la question :**
- Forcer le candidat à fournir un exemple de décision solitaire
- Éviter les exemples de "leadership collaboratif" qui masquent l'absence de vrai leadership
- Détecter si le candidat a réellement pris des décisions difficiles seul

**Ce qu'on cherche dans la réponse :**
- Le candidat a-t-il une décision solitaire à raconter ?
- La décision était-elle vraiment difficile et impopulaire ?
- Le candidat a-t-il assumé la responsabilité seul ?
- Les autres le suivaient-ils sans autorité formelle ?

**Signal de décalage :**
- Le candidat ne trouve pas d'exemple
- L'exemple implique toujours une décision collective
- La décision n'était pas vraiment impopulaire
- Le candidat minimise sa responsabilité

---

### 3.2 Question pour le Décalage Autonomie

**Question :**
"Décrivez-moi un projet que vous avez mené de A à Z sans cadre prédéfini, sans processus existant, en créant tout vous-même."

**Objectif de la question :**
- Forcer le candidat à décrire un projet de création ex nihilo
- Éviter les exemples de "gestion de projet" dans des cadres structurés
- Détecter si le candidat a réellement travaillé sans structure

**Ce qu'on cherche dans la réponse :**
- Le candidat a-t-il un exemple de création à partir de rien ?
- Le projet était-il vraiment sans cadre prédéfini ?
- Le candidat a-t-il créé les processus lui-même ?
- Le candidat a-t-il géré l'incertitude ?

**Signal de décalage :**
- Le candidat ne trouve pas d'exemple
- L'exemple implique toujours un cadre existant
- Le candidat minimise l'incertitude du projet
- Le candidat décrit un projet très structuré

---

### 3.3 Question pour le Décalage Ambition

**Question :**
"Qu'avez-vous fait proactivement pour progresser dans votre carrière ces 12 derniers mois ? Sans qu'on vous le demande."

**Objectif de la question :**
- Forcer le candidat à décrire des initiatives proactives
- Éviter les exemples de "progression" imposés par l'entreprise
- Détecter si le candidat a réellement une ambition motrice

**Ce qu'on cherche dans la réponse :**
- Le candidat a-t-il des initiatives proactives à raconter ?
- Les initiatives étaient-elles vraiment proactives ?
- Le candidat a-t-il créé des opportunités ?
- Le candidat a-t-il quitté des postes confortables pour des défis ?

**Signal de décalage :**
- Le candidat ne trouve pas d'exemple
- Les initiatives étaient imposées par l'entreprise
- Le candidat décrit une progression passive
- Le candidat minimise son rôle dans la progression

---

### 3.4 Question pour le Décalage Motivation

**Question :**
"Si le salaire était identique dans tous les postes, lequel choisiriez-vous ? Pourquoi ?"

**Objectif de la question :**
- Forcer le candidat à choisir sans considération financière
- Éviter les réponses centrées sur le salaire
- Détecter la motivation intrinsèque réelle

**Ce qu'on cherche dans la réponse :**
- Le candidat choisit-il un poste pour le sens/impact ?
- Le candidat choisit-il un poste pour le titre ?
- Le candidat choisit-il un poste pour l'entreprise ?
- Le candidat a-t-il du mal à choisir sans salaire ?

**Signal de décalage :**
- Le candidat a du mal à choisir
- Le candidat revient sur le salaire
- Le candidat choisit pour des raisons extrinsèques (titre, avantages)
- Le candidat ne peut pas justifier son choix

---

### 3.5 Question pour le Décalage Conflit

**Question :**
"Racontez-moi une fois où vous avez maintenu votre position face à votre manager et où vous avez eu raison de le faire. Comment ça s'est terminé ?"

**Objectif de la question :**
- Forcer le candidat à décrire une confrontation réelle
- Éviter les exemples de "gestion de conflit" qui se terminent par compromis
- Détecter si le candidat a réellement une tolérance au conflit

**Ce qu'on cherche dans la réponse :**
- Le candidat a-t-il un exemple de confrontation réelle ?
- Le candidat a-t-il maintenu sa position ?
- Le candidat a-t-il eu raison ?
- La confrontation s'est-elle terminée par une résolution ou un compromis ?

**Signal de décalage :**
- Le candidat ne trouve pas d'exemple
- L'exemple se termine par un compromis mou
- Le candidat minimise la confrontation
- Le candidat décrit une situation où il a cédé

---

## 4. Structure de Données (TypeScript)

```typescript
interface RevealingQuestion {
  questionId: string;
  gapType: 'leadership' | 'autonomy' | 'ambition' | 'motivation' | 'conflict';
  
  question: string;
  objective: string;
  
  whatToLookFor: {
    hasExample: boolean;
    exampleRelevant: boolean;
    candidateResponsibility: boolean;
    outcome: string;
  };
  
  gapSignal: {
    noExample: boolean;
    collectiveDecision: boolean;
    notDifficult: boolean;
    minimizedResponsibility: boolean;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface QuestionResponse {
  responseId: string;
  questionId: string;
  recruitmentId: string;
  candidateId: string;
  
  response: string;
  analysis: {
    hasExample: boolean;
    exampleRelevant: boolean;
    candidateResponsibility: boolean;
    outcome: string;
    gapSignal: boolean;
  };
  
  recordedAt: Date;
  
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
CREATE TABLE revealing_question (
  id VARCHAR(36) PRIMARY KEY,
  gap_type VARCHAR(20) NOT NULL,
  question TEXT NOT NULL,
  objective TEXT NOT NULL,
  what_to_look_for JSON NOT NULL,
  gap_signal JSON NOT NULL,
  metadata JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_revealing_question_gap_type ON revealing_question(gap_type);

CREATE TABLE question_response (
  id VARCHAR(36) PRIMARY KEY,
  question_id VARCHAR(36) NOT NULL,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  response TEXT NOT NULL,
  analysis JSON NOT NULL,
  recorded_at TIMESTAMP NOT NULL,
  metadata JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_question_response_recruitment ON question_response(recruitment_id);
CREATE INDEX idx_question_response_candidate ON question_response(candidate_id);
```

---

## 6. API Endpoints

```typescript
// GET /api/revealing-questions
async function getRevealingQuestions(): Promise<RevealingQuestion[]> {
  return await getRevealingQuestions();
}

// GET /api/revealing-questions/:gapType
async function getRevealingQuestionByGapType(gapType: string): Promise<RevealingQuestion> {
  return await getRevealingQuestionByGapType(gapType);
}

// POST /api/question-response
async function recordQuestionResponse(response: any): Promise<QuestionResponse> {
  return await recordQuestionResponse(response);
}

// GET /api/question-response/:responseId
async function getQuestionResponse(responseId: string): Promise<QuestionResponse> {
  return await getQuestionResponse(responseId);
}

// GET /api/question-response/recruitment/:recruitmentId
async function getQuestionResponsesByRecruitment(recruitmentId: string): Promise<QuestionResponse[]> {
  return await getQuestionResponsesByRecruitment(recruitmentId);
}
```

---

## 7. Indicateurs de Suivi

### 7.1 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'utilisation des questions | Questions posées / entretiens | ≥ 90% |
- Taux de réponses exploitables | Réponses exploitables / totales | ≥ 80% |

### 7.2 Métriques d'Efficacité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de détection de décalages | Décalages détectés / questions posées | ≥ 30% |
- Taux de confirmation post-recrutement | Confirmations / décalages détectés | ≥ 70% |

---

## 8. Exemple Complet

```markdown
QUESTION RÉVÉLATRICE — LEADERSHIP

Question : "Donnez-moi un exemple de décision difficile et impopulaire que VOUS avez prise seul. Pas avec votre équipe. Vous seul."

Réponse du candidat : "Euh... je n'ai pas vraiment d'exemple. En général, je prends les décisions avec mon équipe. On discute et on décide ensemble."

Analyse :
→ A-t-il un exemple : Non
→ Exemple pertinent : N/A
→ Responsabilité du candidat : N/A
→ Issue : N/A
→ Signal de décalage : Oui

Conclusion : Décalage leadership détecté. Le candidat déclare un leadership mais n'a pas d'exemple de décision solitaire difficile.
```

---

## 9. Conclusion

Les questions révélatrices pour chaque décalage structurent les questions spécifiques qui permettent de détecter les écarts entre le discours et la réalité. 5 questions : Leadership (décision solitaire difficile), Autonomie (projet de A à Z sans cadre), Ambition (initiatives proactives 12 derniers mois), Motivation (choix sans salaire), Conflit (maintien position face manager). Chaque question inclut l'objectif, ce qu'on cherche dans la réponse, et le signal de décalage. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 5 questions révélatrices spécifiques
- Objectif de chaque question
- Ce qu'on cherche dans la réponse
- Signal de décalage identifié
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques d'utilisation et d'efficacité
