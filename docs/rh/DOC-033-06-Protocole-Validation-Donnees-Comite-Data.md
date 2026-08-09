# DOC-033-06 : Protocole de Validation des Données par le Comité Data

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de validation des données par le Comité Data pour MVP-033 Real Data Foundation. Ce protocole structure le processus de validation des nouvelles données injectées, l'audit de la qualité des patterns, la validation des apprentissages, et la supervision de la conformité RGPD.

---

## 2. Principe Fondateur

La qualité des données est la responsabilité collective du Comité Data. Chaque lot de données doit être validé avant injection, chaque pattern doit être audité avant utilisation, et chaque apprentissage doit être validé avant déploiement. La conformité RGPD est supervisée en permanence.

---

## 3. Composition du Comité Data

### 3.1 Membres

**DRH Senior**
- Responsable : Validation de la pertinence RH des données
- Expertise : Processus de recrutement, évaluation des candidats
- Vote : Oui / Non / Abstention

**DPO (Data Protection Officer)**
- Responsable : Validation de la conformité RGPD
- Expertise : Protection des données personnelles, anonymisation
- Vote : Oui / Non / Abstention

**Data Scientist**
- Responsable : Validation de la qualité technique des données
- Expertise : Qualité des données, statistiques, apprentissage
- Vote : Oui / Non / Abstention

**Juriste**
- Responsable : Validation de la conformité juridique
- Expertise : Contrats de données, réglementations
- Vote : Oui / Non / Abstention

### 3.2 Fréquence des Réunions

**Réunions mensuelles :**
- Date : Premier mardi de chaque mois
- Durée : 2 heures
- Ordre du jour : Validation des données, audit des patterns, conformité RGPD

**Réunions extraordinaires :**
- Déclenchées en cas d'alerte critique
- Durée : 1 heure
- Ordre du jour : Résolution de l'alerte

---

## 4. Processus de Validation des Données

### 4.1 Soumission des Données

**Qui soumet :**
- Partenaires data (cabinets, entreprises)
- Équipe interne Trajectoire

**Quand :**
- Avant chaque injection de nouvelles données
- Minimum 7 jours avant la réunion du Comité Data

**Comment :**
- Via le portail de soumission de données
- Avec le formulaire de validation complété
- Avec la preuve d'anonymisation validée par le DPO du partenaire

---

### 4.2 Checklist de Validation

**Qualité des Données :**
- [ ] Données complètes (tous les champs requis remplis)
- [ ] Données exactes (pas d'incohérences évidentes)
- [ ] Données représentatives (échantillon représentatif)
- [ ] Données à jour (moins de 3 ans)

**Anonymisation :**
- [ ] Identifiants directs supprimés
- [ ] Identifiants indirects anonymisés
- [ ] Champs libres nettoyés
- [ ] Validation par le DPO du partenaire
- [ ] Test de ré-identification négatif

**Conformité RGPD :**
- [ ] Consentement des personnes concernées
- [ ] Base légale claire
- [ ] Durée de conservation définie
- [ ] Droit de retrait respecté
- [ ] Contrat de partage de données signé

**Pertinence RH :**
- [ ] Données pertinentes pour le recrutement
- [ ] Contexte clair et documenté
- [ ] Résultats observés traçables
- [ ] Patterns identifiables

---

### 4.3 Processus de Vote

**Vote par membre :**
- Oui : Données validées pour injection
- Non : Données rejetées (avec motif)
- Abstention : Pas d'opinion

**Règle de décision :**
- Unanimité requise pour validation
- Si un Non → Données rejetées
- Si une Abstention → Discussion supplémentaire

**Documentation du vote :**
- Date et heure du vote
- Vote de chaque membre
- Motifs des votes Non
- Décision finale

---

### 4.4 Suivi des Décisions

**Données validées :**
- Injection dans la base de données
- Notification au soumetteur
- Enregistrement dans le registre de validation

**Données rejetées :**
- Notification au soumetteur avec motifs
- Possibilité de correction et resoumission
- Enregistrement dans le registre de rejet

**Données en attente :**
- Discussion supplémentaire requise
- Réunion extraordinaire si nécessaire
- Décision différée

---

## 5. Processus d'Audit des Patterns

### 5.1 Sélection des Patterns à Auditer

**Critères de sélection :**
- Nouveaux patterns identifiés
- Patterns avec une confiance élevée
- Patterns contestés par les recruteurs
- Patterns anciens (révision périodique)

**Fréquence :**
- Nouveaux patterns : Audit immédiat
- Patterns existants : Audit trimestriel
- Patterns contestés : Audit prioritaire

---

### 5.2 Checklist d'Audit des Patterns

**Validité Statistique :**
- [ ] Échantillon suffisant (≥ 50 cas)
- [ ] Significativité statistique (p < 0.05)
- [ ] Robustesse (stable sur différentes périodes)
- [ ] Pas de biais évident

**Pertinence RH :**
- [ ] Explication RH claire
- [ ] Alignement avec les meilleures pratiques
- [ ] Applicabilité dans différents contextes
- [ ] Pas de discrimination évidente

**Conformité Éthique :**
- [ ] Pas de biais discriminatoire
- [ ] Transparence des facteurs
- [ ] Possibilité d'explication
- [ ] Conformité avec la charte éthique (réf. MVP-031)

---

### 5.3 Processus de Vote

**Vote par membre :**
- Oui : Pattern validé pour utilisation
- Non : Pattern rejeté (avec motif)
- Abstention : Pas d'opinion

**Règle de décision :**
- Unanimité requise pour validation
- Si un Non → Pattern rejeté
- Si une Abstention → Discussion supplémentaire

---

### 5.4 Suivi des Décisions

**Patterns validés :**
- Déploiement dans le moteur
- Notification à l'équipe technique
- Enregistrement dans le registre de patterns

**Patterns rejetés :**
- Notification à l'équipe technique avec motifs
- Possibilité de correction et resoumission
- Enregistrement dans le registre de rejet

**Patterns en attente :**
- Discussion supplémentaire requise
- Réunion extraordinaire si nécessaire
- Décision différée

---

## 6. Processus de Validation des Apprentissages

### 6.1 Sélection des Apprentissages à Valider

**Critères de sélection :**
- Nouveaux apprentissages du moteur
- Apprentissages avec un impact significatif
- Apprentissages contestés par les recruteurs
- Apprentissages périodiques (révision trimestrielle)

**Fréquence :**
- Nouveaux apprentissages : Validation immédiate
- Apprentissages existants : Validation trimestrielle
- Apprentissages contestés : Validation prioritaire

---

### 6.2 Checklist de Validation des Apprentissages

**Performance :**
- [ ] Amélioration mesurable des métriques
- [ ] Pas de régression sur d'autres métriques
- [ ] Stabilité dans le temps
- [ ] Généralisabilité

**Conformité Éthique :**
- [ ] Pas de biais discriminatoire
- [ ] Transparence des décisions
- [ ] Possibilité d'explication
- [ ] Conformité avec la charte éthique

**Conformité RGPD :**
- [ ] Pas de violation de la vie privée
- [ ] Respect du consentement
- [ ] Droit à l'explication
- [ ] Possibilité de retrait

---

### 6.3 Processus de Vote

**Vote par membre :**
- Oui : Apprentissage validé pour déploiement
- Non : Apprentissage rejeté (avec motif)
- Abstention : Pas d'opinion

**Règle de décision :**
- Unanimité requise pour validation
- Si un Non → Apprentissage rejeté
- Si une Abstention → Discussion supplémentaire

---

### 6.4 Suivi des Décisions

**Apprentissages validés :**
- Déploiement en production
- Notification à l'équipe technique
- Enregistrement dans le registre d'apprentissages

**Apprentissages rejetés :**
- Notification à l'équipe technique avec motifs
- Possibilité de correction et resoumission
- Enregistrement dans le registre de rejet

**Apprentissages en attente :**
- Discussion supplémentaire requise
- Réunion extraordinaire si nécessaire
- Décision différée

---

## 7. Processus de Supervision de la Conformité RGPD

### 7.1 Audit Périodique

**Fréquence :**
- Audit complet : Annuel
- Audit partiel : Trimestriel

**Contenu de l'audit :**
- Revue des contrats de partage de données
- Vérification de l'anonymisation
- Test de ré-identification
- Revue des durées de conservation
- Vérification des droits de retrait

---

### 7.2 Notification de Violation

**En cas de violation de données :**
- Notification immédiate au Comité Data
- Évaluation de l'impact
- Notification aux autorités compétentes (si requis)
- Notification aux personnes concernées (si requis)
- Plan de correction

---

### 7.3 Test de Ré-identification Annuel

**Processus :**
1. Sélectionner un échantillon de 100 enregistrements
2. Tenter de ré-identifier avec des sources externes
3. Documenter les résultats
4. Si ré-identification possible → Mesures correctives immédiates

---

## 8. Structure de Données (TypeScript)

```typescript
interface DataCommittee {
  committeeId: string;
  version: string;
  createdAt: Date;
  
  members: {
    drh: {
      name: string;
      email: string;
      role: string;
    };
    dpo: {
      name: string;
      email: string;
      role: string;
    };
    dataScientist: {
      name: string;
      email: string;
      role: string;
    };
    jurist: {
      name: string;
      email: string;
      role: string;
    };
  };
  
  meetings: {
    monthlySchedule: string;
    lastMeeting: Date;
    nextMeeting: Date;
  };
  
  metadata: {
    lastUpdated: Date;
    status: 'active' | 'inactive';
  };
}

interface DataValidationRequest {
  requestId: string;
  requestNumber: string;
  
  submittedBy: {
    name: string;
    email: string;
    organization: string;
  };
  
  submittedAt: Date;
  
  data: {
    type: 'interviews' | 'cv_poste_pairs' | 'patterns' | 'learnings';
    volume: number;
    source: string;
    description: string;
  };
  
  anonymization: {
    validatedByPartnerDPO: boolean;
    reidentificationTestPassed: boolean;
    testDate?: Date;
  };
  
  checklist: {
    quality: {
      complete: boolean;
      accurate: boolean;
      representative: boolean;
      upToDate: boolean;
    };
    anonymization: {
      directIdentifiersRemoved: boolean;
      indirectIdentifiersAnonymized: boolean;
      freeFieldsCleaned: boolean;
      partnerDPOValidated: boolean;
      reidentificationTestNegative: boolean;
    };
    rgpd: {
      consent: boolean;
      legalBasis: boolean;
      retentionPeriod: boolean;
      withdrawalRight: boolean;
      dataSharingContract: boolean;
    };
    hrRelevance: {
      relevant: boolean;
      contextClear: boolean;
      resultsTraceable: boolean;
      patternsIdentifiable: boolean;
    };
  };
  
  votes: {
    drh: 'yes' | 'no' | 'abstain';
    dpo: 'yes' | 'no' | 'abstain';
    dataScientist: 'yes' | 'no' | 'abstain';
    jurist: 'yes' | 'no' | 'abstain';
  };
  
  decision: {
    status: 'pending' | 'approved' | 'rejected' | 'deferred';
    decidedAt?: Date;
    reasons?: string[];
  };
  
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

interface PatternAudit {
  auditId: string;
  auditNumber: string;
  
  patternId: string;
  patternName: string;
  
  auditedAt: Date;
  auditedBy: string;
  
  checklist: {
    statisticalValidity: {
      sufficientSample: boolean;
      statisticalSignificance: boolean;
      robustness: boolean;
      noObviousBias: boolean;
    };
    hrRelevance: {
      clearExplanation: boolean;
      alignedWithBestPractices: boolean;
      applicableInDifferentContexts: boolean;
      noObviousDiscrimination: boolean;
    };
    ethicalCompliance: {
      noDiscriminatoryBias: boolean;
      factorTransparency: boolean;
      explainability: boolean;
      ethicalCharterCompliance: boolean;
    };
  };
  
  votes: {
    drh: 'yes' | 'no' | 'abstain';
    dpo: 'yes' | 'no' | 'abstain';
    dataScientist: 'yes' | 'no' | 'abstain';
    jurist: 'yes' | 'no' | 'abstain';
  };
  
  decision: {
    status: 'pending' | 'approved' | 'rejected' | 'deferred';
    decidedAt?: Date;
    reasons?: string[];
  };
  
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

interface LearningValidation {
  validationId: string;
  validationNumber: string;
  
  learningId: string;
  learningName: string;
  
  validatedAt: Date;
  validatedBy: string;
  
  checklist: {
    performance: {
      measurableImprovement: boolean;
      noRegression: boolean;
      stability: boolean;
      generalizability: boolean;
    };
    ethicalCompliance: {
      noDiscriminatoryBias: boolean;
      decisionTransparency: boolean;
      explainability: boolean;
      ethicalCharterCompliance: boolean;
    };
    rgpdCompliance: {
      noPrivacyViolation: boolean;
      consentRespected: boolean;
      rightToExplanation: boolean;
      withdrawalPossibility: boolean;
    };
  };
  
  votes: {
    drh: 'yes' | 'no' | 'abstain';
    dpo: 'yes' | 'no' | 'abstain';
    dataScientist: 'yes' | 'no' | 'abstain';
    jurist: 'yes' | 'no' | 'abstain';
  };
  
  decision: {
    status: 'pending' | 'approved' | 'rejected' | 'deferred';
    decidedAt?: Date;
    reasons?: string[];
  };
  
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}
```

---

## 9. Stockage et Gestion

### 9.1 Schéma SQL

```sql
CREATE TABLE data_committee (
  id VARCHAR(36) PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  
  members JSON NOT NULL,
  meetings JSON NOT NULL,
  metadata JSON NOT NULL,
  
  UNIQUE KEY idx_data_committee_version (version)
);

CREATE TABLE data_validation_request (
  id VARCHAR(36) PRIMARY KEY,
  request_number VARCHAR(50) NOT NULL UNIQUE,
  
  submitted_by JSON NOT NULL,
  submitted_at TIMESTAMP NOT NULL,
  
  data JSON NOT NULL,
  anonymization JSON NOT NULL,
  checklist JSON NOT NULL,
  votes JSON NOT NULL,
  decision JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_data_validation_status ON data_validation_request((decision->>'$.status'));
CREATE INDEX idx_data_validation_submitted ON data_validation_request(submitted_at);

CREATE TABLE pattern_audit (
  id VARCHAR(36) PRIMARY KEY,
  audit_number VARCHAR(50) NOT NULL UNIQUE,
  
  pattern_id VARCHAR(36) NOT NULL,
  pattern_name VARCHAR(255) NOT NULL,
  
  audited_at TIMESTAMP NOT NULL,
  audited_by VARCHAR(255) NOT NULL,
  
  checklist JSON NOT NULL,
  votes JSON NOT NULL,
  decision JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_pattern_audit_pattern ON pattern_audit(pattern_id);
CREATE INDEX idx_pattern_audit_status ON pattern_audit((decision->>'$.status'));

CREATE TABLE learning_validation (
  id VARCHAR(36) PRIMARY KEY,
  validation_number VARCHAR(50) NOT NULL UNIQUE,
  
  learning_id VARCHAR(36) NOT NULL,
  learning_name VARCHAR(255) NOT NULL,
  
  validated_at TIMESTAMP NOT NULL,
  validated_by VARCHAR(255) NOT NULL,
  
  checklist JSON NOT NULL,
  votes JSON NOT NULL,
  decision JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_learning_validation_learning ON learning_validation(learning_id);
CREATE INDEX idx_learning_validation_status ON learning_validation((decision->>'$.status'));
```

---

## 10. API Endpoints

```typescript
// GET /api/data/committee
async function getDataCommittee(): Promise<DataCommittee> {
  return await getDataCommittee();
}

// POST /api/data/validation/request
async function submitDataValidationRequest(request: DataValidationRequest): Promise<DataValidationRequest> {
  return await submitDataValidationRequest(request);
}

// GET /api/data/validation/requests
async function getDataValidationRequests(status?: string): Promise<DataValidationRequest[]> {
  return await getDataValidationRequests(status);
}

// PUT /api/data/validation/request/:requestId/vote
async function castVote(requestId: string, member: string, vote: string): Promise<DataValidationRequest> {
  return await castVote(requestId, member, vote);
}

// PUT /api/data/validation/request/:requestId/decision
async function makeDecision(requestId: string, decision: string, reasons?: string[]): Promise<DataValidationRequest> {
  return await makeDecision(requestId, decision, reasons);
}

// POST /api/data/pattern/audit
async function submitPatternAudit(audit: PatternAudit): Promise<PatternAudit> {
  return await submitPatternAudit(audit);
}

// GET /api/data/pattern/audits
async function getPatternAudits(status?: string): Promise<PatternAudit[]> {
  return await getPatternAudits(status);
}

// POST /api/data/learning/validation
async function submitLearningValidation(validation: LearningValidation): Promise<LearningValidation> {
  return await submitLearningValidation(validation);
}

// GET /api/data/learning/validations
async function getLearningValidations(status?: string): Promise<LearningValidation[]> {
  return await getLearningValidations(status);
}
```

---

## 11. Indicateurs de Suivi

### 11.1 Métriques de Validation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de validation des données | Données validées / soumises | ≥ 90% |
- Taux de validation des patterns | Patterns validés / audités | ≥ 85% |
- Taux de validation des apprentissages | Apprentissages validés / soumis | ≥ 85% |
- Temps moyen de validation | Jours de soumission à décision | ≤ 14 jours |

### 11.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de conformité RGPD | Validations conformes / total | 100% |
- Taux de conformité éthique | Validations conformes / total | 100% |
- Taux de rejet | Rejets / total | ≤ 10% |

---

## 12. Conclusion

Le protocole de validation des données par le Comité Data structure le processus de validation des nouvelles données, l'audit des patterns, la validation des apprentissages, et la supervision de la conformité RGPD. Le Comité Data composé de 4 membres (DRH, DPO, Data Scientist, Juriste) se réunit mensuellement pour valider les données avec une règle d'unanimité.

**Points clés :**
- Comité Data composé de 4 membres
- Réunions mensuelles
- Processus de validation des données structuré
- Checklist de validation complète
- Processus de vote avec unanimité requise
- Audit des patterns trimestriel
- Validation des apprentissages trimestrielle
- Supervision de la conformité RGPD
- Test de ré-identification annuel
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de validation et de qualité
