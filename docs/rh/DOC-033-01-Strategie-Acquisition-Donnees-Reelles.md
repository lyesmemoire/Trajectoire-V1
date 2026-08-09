# DOC-033-01 : Stratégie d'Acquisition des Données Réelles

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la stratégie d'acquisition des données réelles pour MVP-033 Real Data Foundation. Cette stratégie structure l'acquisition de données en 4 phases (historiques, temps réel, profondes, continu) pour atteindre la masse critique nécessaire à l'intelligence du moteur cognitif RH.

---

## 2. Principe Fondateur

L'intelligence du moteur est directement proportionnelle à la qualité et à la quantité des données réelles qui l'alimentent. L'équation fondamentale est : Intelligence = Architecture × Données × Feedback. Si Données = 0 → Intelligence = 0, quelle que soit la qualité de l'Architecture.

---

## 3. Cible Minimale Viable

### 3.1 Données de Référence Nécessaires

**1000 entretiens réels anonymisés avec résultats à 12 mois**
- Base minimum pour des patterns fiables
- Permet la validation des prédictions
- Essentiel pour l'apprentissage du moteur

**500 cas de recrutements réussis documentés**
- Patterns de succès (réf. MVP-029)
- Identification des facteurs de succès
- Amélioration des prédictions positives

**200 cas de recrutements échoués documentés**
- Patterns d'échec (réf. MVP-029)
- Identification des facteurs d'échec
- Amélioration des prédictions négatives

**100 cas d'exceptions décidées avec résultats observés**
- Bibliothèque d'exceptions (réf. MVP-028)
- Validation des décisions d'exception
- Amélioration de la gestion des exceptions

**50 dilemmes éthiques réels avec décisions et résultats**
- Bibliothèque éthique (réf. MVP-031)
- Validation des décisions éthiques
- Amélioration de la sagesse éthique

**10 000 paires CV / Poste avec décisions humaines documentées**
- Golden dataset pour mesurer l'accord
- Benchmark de performance
- Validation des prédictions du moteur

---

## 4. Plan d'Acquisition en 4 Phases

### 4.1 Phase 1 — Données Historiques (Mois 1-2)

**Objectif :**
Constituer la base initiale à partir de données existantes.

**Sources Prioritaires :**

**Source 1 : Partenaires cabinets de recrutement**
- Approcher 3 à 5 cabinets partenaires
- Proposer un accord de partage de données anonymisées
- En échange de l'accès au moteur en beta
- Ce qu'ils apportent :
  - Données d'entretiens anonymisées
  - Décisions prises et résultats observés
  - Patterns sectoriels
- Ce que vous apportez :
  - Accès beta au moteur
  - Rapport personnalisé sur leurs patterns

**Source 2 : Entreprises beta (réf. MVP-011)**
- Les 5 entreprises beta partagent :
  - Leurs données RH historiques anonymisées
  - Leurs recrutements des 3 dernières années
  - Leurs résultats à 12 mois par recrutement

**Source 3 : Données publiques**
- Études et rapports publics :
  - Rapport DARES sur l'emploi
  - Études LinkedIn sur les compétences
  - Études sectorielles publiées
  - Benchmarks salariaux publics

**Source 4 : Votre propre usage**
- Chaque interaction avec le moteur crée des données
- Si le feedback est correctement collecté

**Livrables Phase 1 :**
- 250 entretiens anonymisés
- 100 paires CV/Poste avec décisions
- 50 patterns initiaux identifiés
- Premier golden dataset constitué

---

### 4.2 Phase 2 — Données en Temps Réel (Mois 3-6)

**Objectif :**
Alimenter le moteur avec des données fraîches issues de l'usage réel.

**Mécanismes d'Acquisition :**

**Feedback recruteur structuré (réf. MVP-008 Learning Engine)**
- Chaque recrutement = données
- Chaque feedback = apprentissage

**Résultats à 6 mois**
- Suivi systématique des recrutements effectués avec le moteur
- Comparaison prédiction / réalité

**Retours beta recruteurs (réf. MVP-011)**
- Sessions hebdomadaires documentées
- Patterns identifiés et validés

**Livrables Phase 2 :**
- 500 entretiens anonymisés supplémentaires
- Premier cycle d'apprentissage complété
- Patterns initiaux validés ou infirmés
- Golden dataset enrichi

---

### 4.3 Phase 3 — Données Profondes (Mois 6-12)

**Objectif :**
Atteindre la masse critique pour des patterns fiables.

**Mécanismes :**

**Résultats à 12 mois**
- Les recrutements effectués en Phase 1 arrivent à maturité
- Première vraie validation des prédictions du moteur

**Expansion du réseau de partenaires**
- Nouveaux cabinets partenaires
- Nouvelles entreprises beta
- Volume de données multiplié

**Spécialisation sectorielle**
- Concentrer les données sur 2 à 3 secteurs cibles
- Atteindre la masse critique par secteur plus rapidement

**Livrables Phase 3 :**
- 1000 entretiens anonymisés atteints
- 100 patterns validés par les résultats
- Accord moteur / humain mesuré : > 75%
- Première version des patterns d'exception validée

---

### 4.4 Phase 4 — Données en Continu (Mois 12+)

**Objectif :**
Entretenir et enrichir la base en permanence.

**Mécanismes Permanents :**

**Pipeline de données continu**
- Chaque recrutement avec le moteur = données nouvelles
- Chaque résultat à 12 mois = validation ou invalidation

**Veille et données marché (réf. MVP-019)**
- Mise à jour trimestrielle des benchmarks et des patterns de marché

**Révision des patterns périmés (réf. MVP-029 gouvernance)**
- Patterns anciens mis à jour ou supprimés

**Livrables Phase 4 :**
- Pipeline de données continu opérationnel
- Mise à jour trimestrielle des patterns
- Base de données en croissance continue

---

## 5. Structure de Données (TypeScript)

```typescript
interface DataAcquisitionStrategy {
  strategyId: string;
  version: string;
  createdAt: Date;
  
  targetMinimumViable: {
    interviewsWith12MonthResults: number;
    successfulRecruitments: number;
    failedRecruitments: number;
    exceptionCases: number;
    ethicalDilemmas: number;
    cvPostePairs: number;
  };
  
  phases: {
    phase1: {
      name: 'Historical Data';
      duration: 'Months 1-2';
      objective: string;
      sources: DataSource[];
      deliverables: string[];
    };
    phase2: {
      name: 'Real-time Data';
      duration: 'Months 3-6';
      objective: string;
      mechanisms: string[];
      deliverables: string[];
    };
    phase3: {
      name: 'Deep Data';
      duration: 'Months 6-12';
      objective: string;
      mechanisms: string[];
      deliverables: string[];
    };
    phase4: {
      name: 'Continuous Data';
      duration: 'Months 12+';
      objective: string;
      mechanisms: string[];
      deliverables: string[];
    };
  };
  
  currentPhase: 'phase1' | 'phase2' | 'phase3' | 'phase4';
  
  progress: {
    interviewsCollected: number;
    cvPostePairsCollected: number;
    patternsIdentified: number;
    goldenDatasetSize: number;
  };
  
  metadata: {
    lastUpdated: Date;
    status: 'active' | 'completed';
  };
}

interface DataSource {
  sourceId: string;
  name: string;
  type: 'partner_cabinet' | 'beta_company' | 'public_data' | 'own_usage';
  
  description: string;
  
  whatTheyProvide: string[];
  whatWeProvide: string[];
  
  status: 'pending' | 'active' | 'completed' | 'inactive';
  
  dataCollected: {
    interviews: number;
    cvPostePairs: number;
    patterns: number;
  };
  
  metadata: {
    contactedAt?: Date;
    agreedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE data_acquisition_strategy (
  id VARCHAR(36) PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  
  target_minimum_viable JSON NOT NULL,
  phases JSON NOT NULL,
  current_phase VARCHAR(20) NOT NULL CHECK (current_phase IN ('phase1', 'phase2', 'phase3', 'phase4')),
  progress JSON NOT NULL,
  metadata JSON NOT NULL,
  
  UNIQUE KEY idx_data_acquisition_version (version)
);

CREATE TABLE data_source (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('partner_cabinet', 'beta_company', 'public_data', 'own_usage')),
  
  description TEXT NOT NULL,
  what_they_provide JSON NOT NULL,
  what_we_provide JSON NOT NULL,
  
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'active', 'completed', 'inactive')),
  data_collected JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_data_source_type ON data_source(type);
CREATE INDEX idx_data_source_status ON data_source(status);
```

---

## 7. API Endpoints

```typescript
// GET /api/data/acquisition/strategy
async function getDataAcquisitionStrategy(): Promise<DataAcquisitionStrategy> {
  return await getDataAcquisitionStrategy();
}

// PUT /api/data/acquisition/strategy/phase/:phase
async function transitionPhase(phase: string): Promise<DataAcquisitionStrategy> {
  return await transitionPhase(phase);
}

// POST /api/data/source
async function addDataSource(source: DataSource): Promise<DataSource> {
  return await addDataSource(source);
}

// PUT /api/data/source/:sourceId
async function updateDataSource(sourceId: string, source: DataSource): Promise<DataSource> {
  return await updateDataSource(sourceId, source);
}

// GET /api/data/sources
async function getDataSources(): Promise<DataSource[]> {
  return await getDataSources();
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Volume

| Métrique | Description | Cible Phase 1 | Cible Phase 2 | Cible Phase 3 |
|----------|-------------|---------------|---------------|---------------|
| Entretiens anonymisés | Entretiens collectés | 250 | 750 | 1000 |
- Paires CV/Poste | Paires collectées | 100 | 500 | 1000 |
- Patterns identifiés | Patterns identifiés | 50 | 75 | 100 |
- Golden dataset | Taille du golden dataset | 100 | 500 | 1000 |

### 8.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de données complètes | Données complètes / total | ≥ 80% |
- Taux de données avec résultats à 12 mois | Données avec résultats / total | ≥ 70% |
- Taux de validation des patterns | Patterns validés / identifiés | ≥ 75% |

---

## 9. Conclusion

La stratégie d'acquisition des données réelles structure l'acquisition de données en 4 phases (historiques, temps réel, profondes, continu) pour atteindre la masse critique nécessaire à l'intelligence du moteur. Les sources multiples (partenaires cabinets, entreprises beta, données publiques, usage propre) et les mécanismes d'acquisition variés permettent de constituer une base de données riche et diversifiée.

**Points clés :**
- Cible minimale viable définie
- 4 phases d'acquisition structurées
- 4 sources de données principales
- Livrables clairs par phase
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de volume et de qualité
- Suivi de la progression
- Transition automatique des phases
