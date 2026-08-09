# DOC-016-08 : Détection Questions Illicites

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de détection des questions illicites pour MVP-016 Interview Simulator. Ce système détecte en temps réel les questions illégales selon le droit français, alerte le recruteur, et propose des alternatives légales.

---

## 2. Principe Fondateur

En France, certaines questions en entretien sont illégales. Un grand cabinet ne se permet jamais cette erreur. Le moteur non plus. Le système détecte en temps réel les questions illicites, alerte le recruteur de manière discrète, et propose systématiquement une alternative légale.

---

## 3. Cadre Légal Français

### 3.1 Article L.1132-1 du Code du Travail

**Texte :**
"Aucune personne ne peut être écartée d'une procédure de recrutement ou de l'accès à un stage ou à une période de formation en entreprise, aucun salarié ne peut être sanctionné, licencié ou faire l'objet d'une mesure discriminatoire, directe ou indirecte, notamment en matière de rémunération, de formation, de reclassement, d'affectation, de qualification, de classification, de promotion professionnelle, de mutation ou de renouvellement de contrat en raison de son origine, de son sexe, de ses mœurs, de son orientation sexuelle, de son identité de genre, de son âge, de sa situation de famille ou de sa grossesse, de ses caractéristiques génétiques, de son appartenance réelle ou supposée à une ethnie, une nation ou une prétendue race, de ses opinions politiques, de ses activités syndicales ou mutualistes, de ses convictions religieuses, de son apparence physique, de son nom de famille ou de son lieu de résidence ou en raison de son état de santé ou de son handicap."

**Sanctions :**
- Amende jusqu'à 45 000€ pour une personne physique
- Amende jusqu'à 225 000€ pour une personne morale
- Responsabilité civile et pénale

---

## 4. Questions Illicites à Détecter

### 4.1 Questions sur l'État de Santé

**Questions illicites :**
- "Êtes-vous souvent malade ?"
- "Avez-vous des problèmes de santé ?"
- "Avez-vous eu des arrêts maladie récemment ?"
- "Comment est votre santé ?"

**Exception :**
- Questions licites uniquement pour les postes nécessitant une aptitude médicale spécifique (ex: conducteur, pompier, militaire)

**Référence légale :** Article L.1132-1 du Code du Travail

---

### 4.2 Questions sur la Situation Familiale

**Questions illicites :**
- "Êtes-vous marié(e) ?"
- "Avez-vous des enfants ?"
- "Prévoyez-vous d'en avoir ?"
- "Êtes-vous célibataire, divorcé(e) ou veuf/veuve ?"
- "Quelle est votre situation familiale ?"

**Référence légale :** Article L.1132-1 du Code du Travail

---

### 4.3 Questions sur la Religion

**Questions illicites :**
- "Pratiquez-vous une religion ?"
- "Quelles fêtes religieuses observez-vous ?"
- "Avez-vous des contraintes religieuses ?"
- "Quelle est votre religion ?"

**Référence légale :** Article L.1132-1 du Code du Travail

---

### 4.4 Questions sur l'Origine

**Questions illicites :**
- "D'où venez-vous exactement ?"
- "Quelle est votre nationalité d'origine ?"
- "Quelle est votre origine ethnique ?"
- "De quel pays viennent vos parents ?"

**Exception :**
- Questions licites uniquement si pertinent pour le poste (ex: nécessité de travailler dans un pays spécifique)

**Référence légale :** Article L.1132-1 du Code du Travail

---

### 4.5 Questions sur les Opinions Politiques

**Questions illicites :**
- "Pour qui avez-vous voté ?"
- "Quelles sont vos opinions politiques ?"
- "Êtes-vous syndiqué ?"
- "Avez-vous des activités politiques ?"

**Référence légale :** Article L.1132-1 du Code du Travail

---

### 4.6 Questions sur le Handicap

**Questions illicites :**
- "Avez-vous un handicap ?"
- "Quel est votre taux d'invalidité ?"
- "Avez-vous une RQTH ?"

**Exception :**
- Questions licites uniquement dans le cadre légal spécifique (obligation d'emploi des travailleurs handicapés)

**Référence légale :** Article L.1132-1 du Code du Travail

---

### 4.7 Questions sur la Situation Financière

**Questions illicites :**
- "Avez-vous des dettes ?"
- "Êtes-vous propriétaire ?"
- "Quelle est votre situation financière ?"
- "Avez-vous des problèmes d'argent ?"

**Référence légale :** Article L.1132-1 du Code du Travail

---

## 5. Protocole de Détection en Temps Réel

### 5.1 Processus de Détection

```
┌─────────────────────────────────────────────────────────────┐
│ PROCESSUS DE DÉTECTION EN TEMPS RÉEL                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. Le recruteur tape une question                         │
│                                                             │
│ 2. Le moteur analyse la question avant l'envoi            │
│    → Analyse sémantique                                    │
│    → Comparaison avec la base de questions illicites      │
│    → Détection de patterns suspects                        │
│                                                             │
│ 3. Si question illicite détectée :                       │
│    → ALERTE IMMÉDIATE (discrète, vue du recruteur)        │
│    → Blocage de l'envoi (optionnel selon configuration)     │
│    → Affichage de l'alerte avec détails juridiques           │
│    → Proposition d'alternative légale                     │
│                                                             │
│ 4. Si question licite :                                  │
│    → Envoi autorisé                                      │
│    → Traçabilité de la question                          │
│                                                             │
│ 5. Archivage de toutes les questions et alertes           │
│    → Traceabilité légale                                  │
│    → Rapport d'audit                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 5.2 Algorithme de Détection

```typescript
async function detectIllegalQuestion(question: string, context: InterviewContext): Promise<IllegalQuestionDetection> {
  const detection: IllegalQuestionDetection = {
    illegal: false,
    category: null,
    reason: null,
    legalReference: null,
    risk: null,
    alternative: null
  };
  
  // Analyse sémantique
  const semanticAnalysis = await analyzeSemantics(question);
  
  // Comparaison avec la base de questions illicites
  const illegalPatterns = await getIllegalPatterns();
  
  for (const pattern of illegalPatterns) {
    if (pattern.regex.test(question)) {
      // Vérification des exceptions
      const exception = await checkException(pattern.category, context);
      
      if (!exception) {
        detection.illegal = true;
        detection.category = pattern.category;
        detection.reason = pattern.reason;
        detection.legalReference = pattern.legalReference;
        detection.risk = pattern.risk;
        detection.alternative = await generateLegalAlternative(question, pattern.category, context);
        
        break;
      }
    }
  }
  
  return detection;
}

async function generateLegalAlternative(question: string, category: IllegalCategory, context: InterviewContext): Promise<string> {
  const alternatives: Record<IllegalCategory, string[]> = {
    health: [
      "Ce poste nécessite une bonne condition physique. Êtes-vous en mesure d'effectuer les tâches physiques requises ?",
      "Avez-vous des contraintes de santé qui pourraient affecter votre capacité à exercer ce poste ?"
    ],
    family: [
      "Ce poste nécessite des déplacements réguliers et parfois des horaires étendus. Avez-vous des contraintes de disponibilité dont nous devrions tenir compte ?",
      "Ce poste implique une certaine mobilité géographique. Avez-vous des contraintes de mobilité ?"
    ],
    religion: [
      "Avez-vous des contraintes de disponibilité pour les jours fériés ou week-ends ?",
      "Ce poste nécessite une disponibilité le samedi. Avez-vous des contraintes à ce niveau ?"
    ],
    origin: [
      "Avez-vous l'autorisation de travail en France ?",
      "Parlez-vous couramment français ?"
    ],
    political: [
      "Avez-vous des activités professionnelles en dehors de ce poste qui pourraient créer un conflit d'intérêts ?",
      "Avez-vous des obligations de disponibilité particulières ?"
    ],
    disability: [
      "Avez-vous besoin d'aménagements particuliers pour exercer ce poste ?",
      "Avez-vous des contraintes qui nécessiteraient des ajustements de poste ?"
    ],
    financial: [
      "Avez-vous des contraintes de mobilité géographique ?",
      "Avez-vous des disponibilités particulières pour les déplacements professionnels ?"
    ]
  };
  
  const categoryAlternatives = alternatives[category];
  const selectedAlternative = categoryAlternatives[Math.floor(Math.random() * categoryAlternatives.length)];
  
  return selectedAlternative;
}
```

---

## 6. Système d'Alerte

### 6.1 Format de l'Alerte

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ ALERTE : QUESTION ILICITE DÉTECTÉE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Question détectée :                                        │
│ "Avez-vous des enfants ?"                                  │
│                                                             │
│ Catégorie : Situation familiale                            │
│                                                             │
│ Référence légale : Article L.1132-1 Code du Travail        │
│                                                             │
│ Risque : Discrimination situation familiale                │
│ Sanction : Amende jusqu'à 45 000€ (personne physique)      │
│           Amende jusqu'à 225 000€ (personne morale)        │
│                                                             │
│ Alternative légale suggérée :                              │
│ "Ce poste nécessite des déplacements réguliers et parfois │
│  des horaires étendus. Avez-vous des contraintes de       │
│  disponibilité dont nous devrions tenir compte ?"         │
│                                                             │
│ [Utiliser l'alternative] [Ignorer et continuer]            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Configuration de l'Alerte

```typescript
interface AlertConfiguration {
  showAlert: boolean;
  blockIllegalQuestions: boolean;
  alertPosition: 'inline' | 'modal' | 'toast';
  alertSeverity: 'warning' | 'error' | 'critical';
  showLegalReference: boolean;
  showSanctions: boolean;
  showAlternative: boolean;
  requireConfirmation: boolean;
}
```

---

## 7. Traçabilité Légale

### 7.1 Archivage des Questions

Toutes les questions posées sont tracées avec :
- Timestamp
- Recruteur
- Candidat
- Question posée
- Détection illicite (oui/non)
- Alertes déclenchées
- Alternative proposée
- Action du recruteur (utilisée/ignorée)

### 7.2 Rapport d'Audit

Le rapport d'audit inclut :
- Aucune question illicite posée (si applicable)
- Conformité Article L.1132-1 vérifiée
- Liste des alertes déclenchées
- Liste des alternatives proposées
- Actions du recruteur
- Statistiques de conformité

**Exemple de rapport :**
```
RAPPORT D'AUDIT CONFORMITÉ LÉGALE
─────────────────────────────────────
Entretien : INT-2026-0803-001
Recruteur : Jean Dupont
Candidat : Marie Martin
Date : 2026-08-03

CONFORMITÉ ARTICLE L.1132-1 : ✅ Vérifiée

STATISTIQUES :
- Total questions posées : 25
- Questions illicites détectées : 1
- Alertes déclenchées : 1
- Alternatives utilisées : 1
- Questions ignorées : 0

DÉTAIL DES ALERTES :
1. Question : "Avez-vous des enfants ?"
   Catégorie : Situation familiale
   Référence : Article L.1132-1
   Alternative proposée : Utilisée ✅
   Action : Recruteur a utilisé l'alternative légale

CONCLUSION :
Conformité légale maintenue. Aucune question illicite posée.
```

---

## 8. Structure de Données (TypeScript)

```typescript
type IllegalCategory = 'health' | 'family' | 'religion' | 'origin' | 'political' | 'disability' | 'financial';

interface IllegalQuestionDetection {
  illegal: boolean;
  category?: IllegalCategory;
  reason?: string;
  legalReference?: string;
  risk?: string;
  alternative?: string;
}

interface IllegalPattern {
  category: IllegalCategory;
  regex: RegExp;
  reason: string;
  legalReference: string;
  risk: string;
  exceptions?: string[];
}

interface QuestionTrace {
  traceId: string;
  interviewId: string;
  recruiterId: string;
  candidateId: string;
  timestamp: Date;
  
  question: string;
  
  detection: IllegalQuestionDetection;
  
  alertTriggered: boolean;
  alternativeProposed?: string;
  recruiterAction: 'used_alternative' | 'ignored' | 'modified';
  
  finalQuestion?: string;
}

interface LegalAuditReport {
  reportId: string;
  interviewId: string;
  generatedAt: Date;
  
  legalCompliance: {
    articleL1132_1: boolean;
    verified: boolean;
  };
  
  statistics: {
    totalQuestions: number;
    illegalDetected: number;
    alertsTriggered: number;
    alternativesUsed: number;
    ignored: number;
  };
  
  alerts: {
    question: string;
    category: IllegalCategory;
    reference: string;
    alternative: string;
    action: string;
  }[];
  
  conclusion: string;
}
```

---

## 9. Stockage et Gestion

### 9.1 Schéma SQL

```sql
CREATE TABLE illegal_pattern (
  id VARCHAR(36) PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  regex_pattern VARCHAR(500) NOT NULL,
  reason TEXT NOT NULL,
  legal_reference VARCHAR(100) NOT NULL,
  risk TEXT NOT NULL,
  exceptions JSON,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pattern_category ON illegal_pattern(category);

CREATE TABLE question_trace (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  recruiter_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  
  question TEXT NOT NULL,
  
  detection JSON NOT NULL,
  
  alert_triggered BOOLEAN DEFAULT FALSE,
  alternative_proposed TEXT,
  recruiter_action VARCHAR(50),
  final_question TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview_copilot(id),
  FOREIGN KEY (recruiter_id) REFERENCES recruiters(id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

CREATE INDEX idx_trace_interview ON question_trace(interview_id);
CREATE INDEX idx_trace_recruiter ON question_trace(recruiter_id);
CREATE INDEX idx_trace_timestamp ON question_trace(timestamp);

CREATE TABLE legal_audit_report (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) UNIQUE NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  legal_compliance JSON NOT NULL,
  statistics JSON NOT NULL,
  alerts JSON NOT NULL,
  conclusion TEXT NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview_copilot(id)
);

CREATE INDEX idx_audit_interview ON legal_audit_report(interview_id);
```

---

## 10. API Endpoints

```typescript
// POST /api/legal-compliance/check-question
async function checkQuestion(question: string, context: InterviewContext): Promise<IllegalQuestionDetection> {
  return await detectIllegalQuestion(question, context);
}

// POST /api/legal-compliance/generate-alternative
async function generateAlternative(question: string, category: IllegalCategory, context: InterviewContext): Promise<string> {
  return await generateLegalAlternative(question, category, context);
}

// GET /api/legal-compliance/illegal-patterns
async function getIllegalPatterns(): Promise<IllegalPattern[]> {
  return await getAllIllegalPatterns();
}

// POST /api/legal-compliance/illegal-patterns
async function addIllegalPattern(pattern: Omit<IllegalPattern, 'id'>): Promise<IllegalPattern> {
  return await createIllegalPattern(pattern);
}

// GET /api/legal-compliance/audit/:interviewId
async function getAuditReport(interviewId: string): Promise<LegalAuditReport> {
  return await generateAuditReport(interviewId);
}

// GET /api/legal-compliance/traces/:interviewId
async function getQuestionTraces(interviewId: string): Promise<QuestionTrace[]> {
  return await getTracesByInterview(interviewId);
}
```

---

## 11. Indicateurs de Suivi

### 11.1 Métriques de Conformité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection | Questions illicites détectées / total | 100% |
| Taux d'utilisation d'alternatives | Alternatives utilisées / proposées | ≥ 95% |
| Taux de conformité | Entretiens sans question illicite / total | 100% |
| Taux de blocage | Questions bloquées / détectées (si activé) | 100% |

### 11.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'alerte acceptées | Alertes acceptées par recruteur / total | ≥ 90% |
| Satisfaction recruteur | Satisfaction avec le système d'alerte | ≥ 4.5/5 |
| Impact sur conformité | Réduction des questions illicites | ≥ 95% |

---

## 12. Conclusion

Le système de détection des questions illicites protège l'entreprise contre les risques juridiques en détectant en temps réel les questions illégales selon le droit français, en alertant le recruteur, et en proposant des alternatives légales. Toutes les questions sont tracées pour assurer la conformité légale et fournir un rapport d'audit exploitable en cas de contentieux.

**Points clés :**
- Détection en temps réel des questions illicites
- 7 catégories de questions illicites (santé, famille, religion, origine, politique, handicap, financier)
- Alertes discrètes avec référence légale et sanctions
- Alternatives légales systématiquement proposées
- Traçabilité légale de toutes les questions
- Rapport d'audit avec conformité Article L.1132-1
- Configuration personnalisable des alertes
- Protection contre les risques juridiques (amendes jusqu'à 225 000€)
