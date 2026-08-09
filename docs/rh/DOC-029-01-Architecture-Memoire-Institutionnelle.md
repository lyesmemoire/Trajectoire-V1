# DOC-029-01 : Architecture Complète de la Mémoire (5 Couches)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir l'architecture complète de la mémoire institutionnelle pour MVP-029 Institutional Memory Engine. Cette architecture en 5 couches (mémoire des patterns de succès, mémoire des erreurs institutionnelles, mémoire des exceptions validées, mémoire de l'évolution du marché, mémoire des contextes organisationnels) permet de construire et exploiter une mémoire institutionnelle profonde sur toute la durée de vie de l'organisation.

---

## 2. Principe Fondateur

La mémoire institutionnelle n'est pas une base de données de candidats. C'est une base de PATTERNS, de LEÇONS, de SAGESSE accumulée. Elle ne stocke jamais de données individuelles. Elle stocke ce que les données individuelles ont appris au système. RGPD ABSOLU : Aucune donnée personnelle identifiante. Uniquement des patterns agrégés. Uniquement des leçons anonymisées. DPO validateur obligatoire de l'architecture.

---

## 3. Couche 1 — Mémoire des Patterns de Succès

### 3.1 Objectif

Mémoriser ce que le moteur apprend sur ce qui prédit le succès dans différents contextes.

### 3.2 Structure d'un Pattern de Succès

**Contexte :**
- Secteur d'activité
- Taille de l'entreprise
- Type de poste
- Niveau hiérarchique
- Stade de développement

**Profil des candidats qui ont réussi :**
- Caractéristiques communes
- Caractéristiques non prédictives dans ce contexte

**Signaux détectés en entretien :**
- Signaux qui prédisaient le succès
- Signaux qui prédisaient l'échec

**Résultats observés :**
- Taux de succès à 12 mois
- Taux de succès à 24 mois

**Niveau de confiance du pattern :**
- Basé sur le nombre de cas observés
- Confiance (faible / modérée / élevée)
- Dernière mise à jour
- Validité estimée

### 3.3 Volume Cible de Patterns

- Minimum viable : 100 patterns
- Opérationnel : 500 patterns
- Expert : 2000+ patterns

### 3.4 Classification des Patterns

- Par secteur d'activité (20 secteurs)
- Par taille d'entreprise (5 tailles)
- Par type de poste (10 familles)
- Par niveau hiérarchique (5 niveaux)
- Par stade de développement (startup / scale-up / grand groupe)

---

## 4. Couche 2 — Mémoire des Erreurs Institutionnelles

### 4.1 Objectif

Documenter et analyser les erreurs institutionnelles pour en extraire des leçons.

### 4.2 Structure d'une Erreur Documentée

**Type d'erreur :**
- Faux positif : Candidat recommandé qui a échoué
- Faux négatif : Candidat refusé qui aurait réussi
- Erreur de processus : Bonne décision, mauvais processus
- Erreur de signal : Signal mal interprété

**Contexte de l'erreur :**
- Secteur / Taille / Poste / Niveau

**Ce qui s'est passé :**
- Description factuelle et anonymisée
- Décision prise et pourquoi
- Ce qui a été manqué ou mal évalué

**Signal qui aurait dû alerter :**
- Ce qui était présent mais ignoré
- Ce qui était absent mais non détecté
- Ce que le moteur aurait dû dire

**Leçon extraite :**
- Règle créée ou modifiée
- Signal ajouté à la bibliothèque
- Processus ajusté

**Impact sur le moteur :**
- Quelle règle a été modifiée ?
- Quel signal a été ajouté ?
- Quel pattern a été créé ?

### 4.3 Catalogue des Erreurs Récurrentes

**Erreur type 1 — Le candidat brillant en entretien**
- Candidat très performant en entretien
- Résultats réels décevants
- Leçon : Performance en entretien ≠ performance en poste
- Signal ajouté : Sur-préparation détectable

**Erreur type 2 — Le CV parfait, le fit inexistant**
- CV qui coche toutes les cases
- Culture fit raté
- Leçon : Les critères formels ne prédisent pas l'intégration culturelle
- Signal ajouté : Questions culture fit renforcées

**Erreur type 3 — Le profil atypique rejeté**
- Profil hors standards refusé
- Recruté par un concurrent
- Succès remarquable chez le concurrent
- Leçon : Les standards excluent parfois les meilleurs profils
- Signal ajouté : Détection des profils atypiques à fort potentiel

**Erreur type 4 — L'urgence qui fait baisser les standards**
- Poste à pourvoir d'urgence
- Standards abaissés
- Recrutement raté
- Leçon : L'urgence ne justifie pas d'abaisser les standards fondamentaux
- Signal ajouté : Alerte si urgence détectée + recommandation de maintien des critères essentiels

---

## 5. Couche 3 — Mémoire des Exceptions Validées

### 5.1 Objectif

Intégration directe avec MVP-028. Toutes les exceptions accordées et leurs résultats sont mémorisées.

### 5.2 Jurisprudence Interne

Le moteur construit progressivement une jurisprudence interne :
- Dans quel contexte une exception à cette règle a-t-elle bien fonctionné ?
- Dans quel contexte a-t-elle échoué ?

### 5.3 Exploitation

Cette jurisprudence est exploitée dans chaque nouveau cas d'exception.

---

## 6. Couche 4 — Mémoire de l'Évolution du Marché

### 6.1 Objectif

Mémoriser l'évolution du marché RH pour détecter les patterns qui se périment.

### 6.2 Types d'Évolution Mémorisés

- Évolution des attentes candidats
- Évolution des pratiques de recrutement
- Évolution des compétences valorisées
- Émergence de nouveaux profils
- Disparition de profils obsolètes
- Évolution des salaires par profil

### 6.3 Détection de Péremption

Le moteur détecte les patterns qui se périment et alerte pour les mettre à jour.

---

## 7. Couche 5 — Mémoire des Contextes Organisationnels

### 7.1 Objectif

Mémoriser les patterns de succès spécifiques à chaque type d'organisation.

### 7.2 Types de Contextes Mémorisés

- Ce qui fonctionne dans les startups
- Ce qui fonctionne dans les grands groupes
- Ce qui fonctionne dans les ETI
- Ce qui fonctionne dans le secteur public
- Ce qui fonctionne dans les cabinets

### 7.3 Transition de Contextes

Mémorisation des profils qui transitent bien d'un contexte à l'autre vs ceux qui n'y arrivent pas.

---

## 8. Architecture Technique

### 8.1 Diagramme d'Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    EXPLOITATION EN TEMPS RÉEL                 │
│  (Recherche de patterns / Extraction des leçons / Adaptation)│
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       COUCHE 5                                │
│              Mémoire des Contextes Organisationnels          │
│  (Startups / Grands groupes / ETI / Public / Cabinets)      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       COUCHE 4                                │
│              Mémoire de l'Évolution du Marché               │
│  (Attentes / Pratiques / Compétences / Profils / Salaires)  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       COUCHE 3                                │
│              Mémoire des Exceptions Validées                 │
│  (Intégration MVP-028 / Jurisprudence interne)              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       COUCHE 2                                │
│              Mémoire des Erreurs Institutionnelles            │
│  (Faux positifs / Faux négatifs / Processus / Signaux)     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       COUCHE 1                                │
│              Mémoire des Patterns de Succès                  │
│  (Contexte / Profil / Signaux / Résultats / Confiance)       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    ALIMENTATION DE LA MÉMOIRE                 │
│  (Feedbacks / Résultats / Exceptions / Veille / Beta)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Structure de Données (TypeScript)

```typescript
interface InstitutionalMemory {
  memoryId: string;
  createdAt: Date;
  updatedAt: Date;
  
  layer1: {
    successPatterns: SuccessPattern[];
  };
  
  layer2: {
    institutionalErrors: InstitutionalError[];
  };
  
  layer3: {
    validatedExceptions: ValidatedException[];
  };
  
  layer4: {
    marketEvolution: MarketEvolution[];
  };
  
  layer5: {
    organizationalContexts: OrganizationalContext[];
  };
}

interface SuccessPattern {
  patternId: string;
  context: {
    sector: string;
    companySize: string;
    jobType: string;
    hierarchyLevel: string;
    developmentStage: string;
  };
  
  successfulProfile: {
    commonCharacteristics: string[];
    nonPredictiveCharacteristics: string[];
  };
  
  interviewSignals: {
    successSignals: string[];
    failureSignals: string[];
  };
  
  results: {
    withCharacteristics: {
      successRate12Months: number;
      successRate24Months: number;
    };
    withoutCharacteristics: {
      successRate12Months: number;
      successRate24Months: number;
    };
  };
  
  confidence: {
    basedOnCases: number;
    level: 'low' | 'moderate' | 'high';
    lastUpdated: Date;
    estimatedValidity: number; // months
  };
}

interface InstitutionalError {
  errorId: string;
  errorType: 'false_positive' | 'false_negative' | 'process_error' | 'signal_error';
  
  context: {
    sector: string;
    companySize: string;
    jobType: string;
    hierarchyLevel: string;
  };
  
  whatHappened: {
    description: string;
    decision: string;
    missedOrMisEvaluated: string;
  };
  
  alertingSignal: {
    presentButIgnored: string;
    absentButUndetected: string;
    engineShouldHaveSaid: string;
  };
  
  lessonExtracted: {
    ruleCreatedOrModified: string;
    signalAdded: string;
    processAdjusted: string;
  };
  
  engineImpact: {
    ruleModified: string;
    signalAdded: string;
    patternCreated: string;
  };
}
```

---

## 10. Stockage et Gestion

### 10.1 Schéma SQL

```sql
CREATE TABLE institutional_memory (
  id VARCHAR(36) PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  
  layer1 JSON NOT NULL,
  layer2 JSON NOT NULL,
  layer3 JSON NOT NULL,
  layer4 JSON NOT NULL,
  layer5 JSON NOT NULL
);

CREATE TABLE success_pattern (
  id VARCHAR(36) PRIMARY KEY,
  memory_id VARCHAR(36) NOT NULL,
  
  context JSON NOT NULL,
  successful_profile JSON NOT NULL,
  interview_signals JSON NOT NULL,
  results JSON NOT NULL,
  confidence JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (memory_id) REFERENCES institutional_memory(id)
);

CREATE INDEX idx_success_pattern_context ON success_pattern((context->>'sector'));
CREATE INDEX idx_success_pattern_confidence ON success_pattern((confidence->>'level'));

CREATE TABLE institutional_error (
  id VARCHAR(36) PRIMARY KEY,
  memory_id VARCHAR(36) NOT NULL,
  
  error_type VARCHAR(50) NOT NULL CHECK (error_type IN ('false_positive', 'false_negative', 'process_error', 'signal_error')),
  context JSON NOT NULL,
  what_happened JSON NOT NULL,
  alerting_signal JSON NOT NULL,
  lesson_extracted JSON NOT NULL,
  engine_impact JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (memory_id) REFERENCES institutional_memory(id)
);

CREATE INDEX idx_institutional_error_type ON institutional_error(error_type);
CREATE INDEX idx_institutional_error_context ON institutional_error((context->>'sector'));
```

---

## 11. API Endpoints

```typescript
// POST /api/institutional-memory/initialize
async function initializeInstitutionalMemory(): Promise<InstitutionalMemory> {
  return await initializeInstitutionalMemory();
}

// GET /api/institutional-memory/:memoryId
async function getInstitutionalMemory(memoryId: string): Promise<InstitutionalMemory> {
  return await getInstitutionalMemoryById(memoryId);
}

// POST /api/institutional-memory/patterns
async function addSuccessPattern(pattern: SuccessPattern): Promise<SuccessPattern> {
  return await addSuccessPattern(pattern);
}

// GET /api/institutional-memory/patterns/:patternId
async function getSuccessPattern(patternId: string): Promise<SuccessPattern> {
  return await getSuccessPatternById(patternId);
}

// GET /api/institutional-memory/patterns/context/:context
async function getPatternsByContext(context: string): Promise<SuccessPattern[]> {
  return await getPatternsByContext(context);
}

// POST /api/institutional-memory/errors
async function addInstitutionalError(error: InstitutionalError): Promise<InstitutionalError> {
  return await addInstitutionalError(error);
}

// GET /api/institutional-memory/errors/:errorId
async function getInstitutionalError(errorId: string): Promise<InstitutionalError> {
  return await getInstitutionalErrorById(errorId);
}

// GET /api/institutional-memory/errors/type/:errorType
async function getErrorsByType(errorType: string): Promise<InstitutionalError[]> {
  return await getErrorsByType(errorType);
}
```

---

## 12. Indicateurs de Suivi

### 12.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Volume de patterns | Nombre de patterns de succès | ≥ 100 (viable), ≥ 500 (opérationnel) |
| Volume d'erreurs | Nombre d'erreurs documentées | ≥ 50 (viable), ≥ 200 (opérationnel) |
- Confiance moyenne | Confiance moyenne des patterns | ≥ 0.7 |
- Couverture contextuelle | Couverture des contextes | ≥ 80% |

### 12.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Réduction des erreurs | Réduction des erreurs récurrentes | ≥ 30% |
- Amélioration des décisions | Amélioration de la qualité des décisions | ≥ 20% |
- Satisfaction recruteurs | Satisfaction des recruteurs avec la mémoire | ≥ 4.5/5 |

---

## 13. Conclusion

L'architecture complète de la mémoire institutionnelle en 5 couches (mémoire des patterns de succès, mémoire des erreurs institutionnelles, mémoire des exceptions validées, mémoire de l'évolution du marché, mémoire des contextes organisationnels) permet de construire et exploiter une mémoire institutionnelle profonde sur toute la durée de vie de l'organisation. L'architecture respecte strictement le RGPD (aucune donnée personnelle identifiante, uniquement des patterns agrégés et des leçons anonymisées) et s'intègre avec les modules existants (MVP-028).

**Points clés :**
- 5 couches de mémoire
- Patterns de succès avec contexte et confiance
- Erreurs institutionnelles documentées
- Exceptions validées intégrées
- Évolution du marché mémorisée
- Contextes organisationnels spécifiques
- RGPD absolu (anonymisation complète)
- Intégration avec MVP-028
- Volume cible : 100-2000 patterns
