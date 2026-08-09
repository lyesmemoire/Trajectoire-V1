# DOC-028-07 : Protocole de Révision des Règles Basé sur les Exceptions

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de révision des règles basé sur les exceptions pour MVP-028 Exception Intelligence Engine. Ce protocole définit le processus de révision des règles en fonction des exceptions accordées et des résultats observés, avec un Comité de Révision des Règles (DRH + Juridique + Métier) qui se réunit semestriellement pour valider les révisions.

---

## 2. Principe Fondateur

Le protocole de révision des règles utilise les données du registre officiel des exceptions et des rapports trimestriels pour identifier les règles candidates à révision. Le Comité de Révision des Règles (DRH + Juridique + Métier) se réunit semestriellement pour analyser les règles candidates, valider les révisions, et décider des actions (réviser, renforcer, préciser, créer, supprimer).

---

## 3. Comité de Révision des Règles

### 3.1 Composition

**Membres :**
- DRH (Directeur des Ressources Humaines)
- Juridique (Directeur Juridique ou Conseiller Juridique)
- Métier (Représentants des métiers concernés)

---

### 3.2 Fréquence

**Réunions :**
- Semestrielle (2 fois par an)
- Janvier et juillet
- Durée : 2 heures

---

### 3.3 Input

**Documents d'entrée :**
- Rapport trimestriel des exceptions (dernier trimestre)
- Registre officiel des exceptions (6 derniers mois)
- Propositions de révision générées par le moteur
- Feedback des utilisateurs du système

---

### 3.4 Output

**Documents de sortie :**
- Règles révisées
- Règles créées
- Règles supprimées
- Rapport de révision

---

## 4. Processus de Révision

### 4.1 Identification des Règles Candidates

**Critères d'identification :**
- Volume d'exceptions ≥ 10 sur 6 mois
- Taux d'accord ≥ 70%
- Taux de succès ≥ 70%
- Ou : Taux d'accord ≤ 50% ou taux de succès ≤ 50%

**Processus :**
1. Le moteur identifie les règles candidates
2. Le moteur génère des propositions de révision
3. Les propositions sont soumises au Comité

---

### 4.2 Analyse des Règles Candidates

**Analyse par le Comité :**
- Revue des exceptions accordées
- Revue des résultats observés
- Analyse du contexte original de la règle
- Évaluation de l'impact de la révision

---

### 4.3 Décision de Révision

**Types de décisions :**
- Réviser la règle
- Renforcer la règle
- Préciser la règle
- Créer une nouvelle règle
- Supprimer la règle
- Aucune action

---

## 5. Types de Révision

### 5.1 Réviser la Règle

**Condition :**
- 10 exceptions similaires accordées avec résultats positifs

**Action :**
- Modifier le texte de la règle
- Adapter les critères
- Inclure les exceptions dans la règle

**Exemple :**
- Règle originale : "Exiger 5 ans d'expérience minimum"
- Révision : "Exiger 5 ans d'expérience minimum ou équivalence entrepreneuriale démontrée"

---

### 5.2 Renforcer la Règle

**Condition :**
- 5 exceptions similaires échouent avec résultats négatifs

**Action :**
- Durcir les critères
- Préciser les conditions d'exception
- Renforcer l'argumentaire d'exception

**Exemple :**
- Règle originale : "Exiger 5 ans d'expérience minimum"
- Renforcement : "Exiger 5 ans d'expérience minimum. Les exceptions ne sont accordées que pour les parcours entrepreneuriaux avec preuve de réussite."

---

### 5.3 Préciser la Règle

**Condition :**
- Résultats mixtes (certains positifs, certains négatifs)

**Action :**
- Identifier les facteurs de succès
- Préciser les conditions d'exception
- Clarifier les critères

**Exemple :**
- Règle originale : "Exiger 5 ans d'expérience minimum"
- Précision : "Exiger 5 ans d'expérience minimum. Les exceptions sont accordées uniquement pour les parcours entrepreneuriaux avec responsabilités de leadership équivalentes."

---

### 5.4 Créer une Nouvelle Règle

**Condition :**
- Nouveau contexte identifié
- Besoin de règle spécifique

**Action :**
- Créer une nouvelle règle
- Définir les critères
- Intégrer dans le corpus

**Exemple :**
- Nouvelle règle : "Équivalence entrepreneuriale : 3 ans en startup fondateur = 5 ans en grande entreprise"

---

### 5.5 Supprimer la Règle

**Condition :**
- Règle obsolète
- Règle en conflit avec une règle de niveau supérieur
- Règle non pertinente

**Action :**
- Supprimer la règle du corpus
- Documenter la suppression
- Communiquer la suppression

**Exemple :**
- Règle supprimée : "Exiger un bureau physique"

---

## 6. Algorithme de Révision des Règles

### 6.1 Processus Global

```typescript
async function reviseRules(reportId: string): Promise<RuleRevision> {
  // 1. Récupération du rapport trimestriel
  const report = await getQuarterlyReport(reportId);
  
  // 2. Récupération des règles candidates à révision
  const ruleCandidates = report.ruleRevisionCandidates.filter(r => r.revisionType !== 'none');
  
  // 3. Pour chaque règle candidate
  const revisions = await Promise.all(
    ruleCandidates.map(candidate => reviseRule(candidate))
  );
  
  // 4. Construction de la révision
  const ruleRevision: RuleRevision = {
    revisionId: generateRevisionId(),
    reportId,
    revisedAt: new Date(),
    
    revisions
  };
  
  // 5. Sauvegarde de la révision
  await saveRuleRevision(ruleRevision);
  
  return ruleRevision;
}
```

---

### 6.2 Révision d'une Règle

```typescript
async function reviseRule(candidate: any): Promise<{
  ruleReference: string;
  ruleText: string;
  revisionType: 'revise' | 'strengthen' | 'precise' | 'create' | 'delete' | 'none';
  proposedRevision: string;
  justification: string;
  committeeDecision: 'approved' | 'rejected' | 'pending';
  committeeJustification: string;
}> {
  // Génération de la proposition de révision
  const proposedRevision = await generateProposedRevision(candidate);
  
  return {
    ruleReference: candidate.ruleReference,
    ruleText: candidate.ruleText,
    revisionType: candidate.revisionType,
    proposedRevision,
    justification: candidate.justification,
    committeeDecision: 'pending',
    committeeJustification: ''
  };
}
```

---

### 6.3 Génération de la Proposition de Révision

```typescript
async function generateProposedRevision(candidate: any): Promise<string> {
  switch (candidate.revisionType) {
    case 'revise':
      return await generateReviseProposal(candidate);
    case 'strengthen':
      return await generateStrengthenProposal(candidate);
    case 'precise':
      return await generatePreciseProposal(candidate);
    case 'create':
      return await generateCreateProposal(candidate);
    case 'delete':
      return await generateDeleteProposal(candidate);
    default:
      return 'Aucune révision proposée.';
  }
}
```

---

### 6.4 Génération de la Proposition de Révision (Réviser)

```typescript
async function generateReviseProposal(candidate: any): Promise<string> {
  // Récupération des exceptions similaires
  const similarExceptions = await getSimilarExceptions(candidate.ruleReference);
  
  // Analyse des facteurs de succès
  const successFactors = await analyzeSuccessFactors(similarExceptions);
  
  // Génération de la proposition
  const proposal = `Révision proposée pour ${candidate.ruleReference} :
  
  Règle actuelle : "${candidate.ruleText}"
  
  Facteurs de succès identifiés :
  ${successFactors.map(f => `- ${f}`).join('\n')}
  
  Proposition de révision :
  "${candidate.ruleText} ou équivalence démontrée selon les facteurs de succès identifiés."`;
  
  return proposal;
}
```

---

## 7. Structure de Données (TypeScript)

```typescript
interface RuleRevision {
  revisionId: string;
  reportId: string;
  revisedAt: Date;
  
  revisions: {
    ruleReference: string;
    ruleText: string;
    revisionType: 'revise' | 'strengthen' | 'precise' | 'create' | 'delete' | 'none';
    proposedRevision: string;
    justification: string;
    committeeDecision: 'approved' | 'rejected' | 'pending';
    committeeJustification: string;
  }[];
}

interface CommitteeMeeting {
  meetingId: string;
  date: Date;
  attendees: string[];
  
  input: {
    quarterlyReport: string;
    exceptionRegistry: string;
    revisionProposals: string[];
    userFeedback: string[];
  };
  
  output: {
    revisedRules: string[];
    createdRules: string[];
    deletedRules: string[];
    revisionReport: string;
  };
}
```

---

## 8. Stockage et Gestion

### 8.1 Schéma SQL

```sql
CREATE TABLE rule_revision (
  id VARCHAR(36) PRIMARY KEY,
  report_id VARCHAR(36) NOT NULL,
  revised_at TIMESTAMP NOT NULL,
  
  revisions JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (report_id) REFERENCES quarterly_report(id)
);

CREATE INDEX idx_rule_revision_report ON rule_revision(report_id);
CREATE INDEX idx_rule_revision_date ON rule_revision(revised_at);

CREATE TABLE committee_meeting (
  id VARCHAR(36) PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  
  attendees JSON NOT NULL,
  input JSON NOT NULL,
  output JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_committee_meeting_date ON committee_meeting(date);
```

---

## 9. API Endpoints

```typescript
// POST /api/exception-intelligence/rules/revise
async function reviseRules(reportId: string): Promise<RuleRevision> {
  return await reviseRules(reportId);
}

// GET /api/exception-intelligence/rules/revision/:revisionId
async function getRuleRevision(revisionId: string): Promise<RuleRevision> {
  return await getRuleRevisionById(revisionId);
}

// POST /api/exception-intelligence/committee/meeting
async function createCommitteeMeeting(meeting: CommitteeMeeting): Promise<CommitteeMeeting> {
  return await createCommitteeMeeting(meeting);
}

// GET /api/exception-intelligence/committee/meeting/:meetingId
async function getCommitteeMeeting(meetingId: string): Promise<CommitteeMeeting> {
  return await getCommitteeMeetingById(meetingId);
}

// PUT /api/exception-intelligence/rules/revision/:revisionId/approve
async function approveRuleRevision(revisionId: string, justification: string): Promise<RuleRevision> {
  return await approveRuleRevision(revisionId, justification);
}

// PUT /api/exception-intelligence/rules/revision/:revisionId/reject
async function rejectRuleRevision(revisionId: string, justification: string): Promise<RuleRevision> {
  return await rejectRuleRevision(revisionId, justification);
}
```

---

## 10. Indicateurs de Suivi

### 10.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de révision de règles | Règles révisées / candidates | ≥ 70% |
- Taux d'approbation du Comité | Révisions approuvées / soumises | ≥ 80% |
- Délai de révision | Délai moyen de révision | ≤ 30 jours |
- Satisfaction Comité | Satisfaction avec le processus | ≥ 4.5/5 |

### 10.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Réduction des exceptions | Réduction des exceptions après révision | ≥ 30% |
- Amélioration de la qualité | Amélioration de la qualité des décisions | ≥ 20% |
- Satisfaction utilisateurs | Satisfaction des utilisateurs avec les règles révisées | ≥ 4.5/5 |

---

## 11. Conclusion

Le protocole de révision des règles basé sur les exceptions définit le processus de révision des règles en fonction des exceptions accordées et des résultats observés. Le Comité de Révision des Règles (DRH + Juridique + Métier) se réunit semestriellement pour analyser les règles candidates, valider les révisions, et décider des actions (réviser, renforcer, préciser, créer, supprimer). Le protocole permet d'adapter le corpus de règles en fonction des exceptions et des résultats observés.

**Points clés :**
- Comité de Révision des Règles (DRH + Juridique + Métier)
- Réunions semestrielles
- 5 types de révision (réviser, renforcer, préciser, créer, supprimer)
- Processus structuré de révision
- Propositions générées par le moteur
- Validation par le Comité
- Traçabilité complète des révisions
- Intégration avec le registre officiel et les rapports trimestriels
