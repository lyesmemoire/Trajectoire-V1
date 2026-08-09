# DOC-M01-03 : Bibliothèque des Biais à Détecter (10 Biais)

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la bibliothèque des 10 biais à détecter pour le MVP-META-01 Méta-Cognition Engine. Ce document structure les 10 types de biais que le moteur recherche activement pour évaluer la qualité de son propre travail.

---

## 2. Principe Fondateur

Le moteur recherche activement les biais qui ont pu affecter son évaluation. La reconnaissance des biais est essentielle pour garantir la fiabilité et l'équité des évaluations.

---

## 3. Bibliothèque des 10 Biais

### 3.1 BIAIS 1 — Biais d'Affinité

**Définition :**
Tendance à favoriser les candidats qui ressemblent aux profils habituellement favorisés par le moteur ou par l'entreprise.

**Signaux de détection :**
- Le candidat partage des caractéristiques avec les profils habituellement embauchés
- Le candidat a un parcours similaire aux recruteurs ou aux décideurs
- Le candidat provient de la même école ou entreprise que des employés actuels

**Impact sur l'évaluation :**
- Surévaluation des compétences
- Sous-évaluation des lacunes
- Préférence injustifiée

**Action corrective :**
- Revoir le scoring en neutralisant les facteurs d'affinité
- Comparer avec des profils similaires non favorisés
- Valider l'évaluation par un tiers

**Exemple :**
Le candidat est diplômé de la même école que le DRH. Le moteur détecte un biais d'affinité potentiel et revoit le scoring pour s'assurer que les compétences sont évaluées objectivement.

---

### 3.2 BIAIS 2 — Biais de Halo

**Définition :**
Tendance à laisser une force initiale forte masquer des faiblesses dans d'autres domaines.

**Signaux de détection :**
- Une compétence ou une caractéristique exceptionnelle influence l'ensemble du scoring
- Les lacunes dans d'autres domaines sont minimisées ou ignorées
- Le score global est disproportionné par rapport aux scores individuels

**Impact sur l'évaluation :**
- Masquage des faiblesses critiques
- Surévaluation globale injustifiée
- Ignorance des zones insuffisamment évaluées

**Action corrective :**
- Revoir le scoring en isolant chaque dimension
- Vérifier que chaque score est justifié par des preuves
- Pondérer les dimensions critiques

**Exemple :**
Le candidat excelle en communication mais a des lacunes en management. Le moteur détecte un biais de halo et revoit le scoring pour s'assurer que les lacunes en management ne sont pas masquées par l'excellence en communication.

---

### 3.3 BIAIS 3 — Biais de Confirmation

**Définition :**
Tendance à chercher à confirmer une impression initiale plutôt qu'à la remettre en question.

**Signaux de détection :**
- Les questions posées sont orientées pour confirmer l'impression initiale
- Les preuves contradictoires sont ignorées ou minimisées
- Le scoring est cohérent avec l'impression initiale malgré des preuves contraires

**Impact sur l'évaluation :**
- Ignorance des preuves contradictoires
- Renforcement d'une impression potentiellement fausse
- Évaluation non équilibrée

**Action corrective :**
- Revoir les questions posées pour vérifier l'équilibre
- Chercher activement des preuves contradictoires
- Revoir le scoring en tenant compte des preuves contraires

**Exemple :**
Le moteur a une impression initiale positive du candidat. Les questions posées sont orientées pour confirmer cette impression. Le moteur détecte un biais de confirmation et revoit les questions pour s'assurer qu'elles sont équilibrées.

---

### 3.4 BIAIS 4 — Biais de Récence

**Définition :**
Tendance à surpondérer les informations récentes par rapport aux informations plus anciennes.

**Signaux de détection :**
- La fin de l'entretien a plus d'impact sur le scoring que le début
- Les réponses finales pèsent plus lourd que les réponses initiales
- Le scoring est influencé par la dernière impression

**Impact sur l'évaluation :**
- Distorsion de l'évaluation globale
- Surpondération des éléments récents
- Sous-pondération des éléments anciens

**Action corrective :**
- Repondérer les observations en fonction de leur importance
- Vérifier que le scoring est équilibré sur l'ensemble de l'entretien
- Pondérer les éléments critiques indépendamment de leur position

**Exemple :**
Le candidat termine l'entretien avec une excellente réponse sur un point mineur. Le moteur détecte un biais de récence et revoit le scoring pour s'assurer que cette réponse finale ne surpondère pas l'évaluation globale.

---

### 3.5 BIAIS 5 — Biais Culturel

**Définition :**
Tendance à mal interpréter le style de communication du candidat (introversion, culture différente) comme un manque de compétences.

**Signaux de détection :**
- Le candidat est introverti et le moteur interprète cela comme un manque de communication
- Le candidat a un style de communication culturellement différent
- Le candidat utilise des expressions ou des références culturelles mal comprises

**Impact sur l'évaluation :**
- Sous-évaluation des compétences de communication
- Interprétation erronée des comportements
- Discrimination culturelle involontaire

**Action corrective :**
- Revoir l'interprétation des comportements
- Adapter l'évaluation au style de communication du candidat
- Valider l'interprétation par un tiers

**Exemple :**
Le candidat est introverti et répond de manière concise. Le moteur détecte un biais culturel potentiel et revoit l'interprétation pour s'assurer que la concision n'est pas interprétée comme un manque de compétences.

---

### 3.6 BIAIS 6 — Biais d'Ancrage

**Définition :**
Tendance à s'ancrer sur une information initiale et à l'utiliser comme référence pour l'ensemble de l'évaluation.

**Signaux de détection :**
- Le premier score ou la première impression influence l'ensemble du scoring
- Les évaluations ultérieures sont ajustées autour de l'ancrage initial
- Le scoring final est proche de l'ancrage initial malgré des preuves contraires

**Impact sur l'évaluation :**
- Distorsion de l'évaluation globale
- Ajustements insuffisants par rapport aux preuves
- Scoring non objectif

**Action corrective :**
- Revoir le scoring en ignorant l'ancrage initial
- Évaluer chaque dimension indépendamment
- Vérifier que le scoring final est justifié par les preuves

**Exemple :**
Le moteur attribue un score initial de 4/5 sur la première compétence. Les scores ultérieurs sont ajustés autour de cet ancrage. Le moteur détecte un biais d'ancrage et revoit le scoring pour s'assurer que chaque dimension est évaluée indépendamment.

---

### 3.7 BIAIS 7 — Biais de Disponibilité

**Définition :**
Tendance à surpondérer les informations facilement accessibles ou récentes dans la mémoire.

**Signaux de détection :**
- Les informations les plus récentes ou les plus marquantes pèsent plus lourd
- Les informations moins accessibles sont sous-pondérées
- Le scoring est influencé par la facilité de rappel des informations

**Impact sur l'évaluation :**
- Surpondération des informations accessibles
- Sous-pondération des informations moins accessibles
- Distorsion de l'évaluation

**Action corrective :**
- Revoir le scoring en pondérant toutes les informations
- Vérifier que les informations moins accessibles sont prises en compte
- Équilibrer le scoring en fonction de l'importance des informations

**Exemple :**
Le candidat donne une réponse très marquante sur un point mineur. Le moteur détecte un biais de disponibilité et revoit le scoring pour s'assurer que cette réponse ne surpondère pas l'évaluation globale.

---

### 3.8 BIAIS 8 — Biais de Contraste

**Définition :**
Tendance à évaluer un candidat en le comparant à d'autres candidats plutôt qu'aux exigences du poste.

**Signaux de détection :**
- Le scoring est influencé par la comparaison avec d'autres candidats
- Le candidat est évalué comme "meilleur" ou "moins bon" que d'autres
- Le scoring ne reflète pas l'adéquation au poste mais la position relative

**Impact sur l'évaluation :**
- Évaluation non objective
- Scoring basé sur la comparaison plutôt que sur les exigences
- Distorsion de l'évaluation

**Action corrective :**
- Revoir le scoring en se basant uniquement sur les exigences du poste
- Ignorer les comparaisons avec d'autres candidats
- Évaluer le candidat de manière absolue

**Exemple :**
Le candidat est meilleur que les candidats précédents mais ne correspond pas aux exigences du poste. Le moteur détecte un biais de contraste et revoit le scoring pour s'assurer qu'il est basé sur les exigences du poste et non sur la comparaison.

---

### 3.9 BIAIS 9 — Biais de Projection

**Définition :**
Tendance à projeter ses propres caractéristiques ou préférences sur le candidat.

**Signaux de détection :**
- Le moteur interprète les réponses du candidat en fonction de ses propres préférences
- Le scoring est influencé par les caractéristiques du moteur
- Le candidat est évalué comme "semblable" ou "différent" du moteur

**Impact sur l'évaluation :**
- Interprétation erronée des réponses
- Scoring basé sur les préférences du moteur
- Évaluation non objective

**Action corrective :**
- Revoir l'interprétation des réponses
- Évaluer le candidat de manière objective
- Ignorer les préférences du moteur

**Exemple :**
Le moteur valorise les candidats qui utilisent un certain style de communication. Le moteur détecte un biais de projection et revoit l'interprétation pour s'assurer qu'elle est objective.

---

### 3.10 BIAIS 10 — Biais de Similarité

**Définition :**
Tendance à favoriser les candidats qui sont similaires au moteur ou aux décideurs.

**Signaux de détection :**
- Le candidat partage des caractéristiques avec le moteur ou les décideurs
- Le scoring est influencé par la similarité
- Le candidat est évalué comme "semblable" ou "différent"

**Impact sur l'évaluation :**
- Favoritisme injustifié
- Scoring basé sur la similarité plutôt que sur les compétences
- Évaluation non équitable

**Action corrective :**
- Revoir le scoring en ignorant les similarités
- Évaluer le candidat de manière objective
- Valider l'évaluation par un tiers

**Exemple :**
Le candidat a un parcours similaire à celui du moteur. Le moteur détecte un biais de similarité et revoit le scoring pour s'assurer qu'il est basé sur les compétences et non sur la similarité.

---

## 4. Processus de Détection des Biais

### 4.1 Détection Automatique

**Processus :**
1. Analyse systématique des 10 types de biais
2. Identification des signaux de détection pour chaque biais
3. Évaluation du risque pour chaque biais détecté
4. Génération d'alertes si le risque est modéré ou élevé

### 4.2 Évaluation du Risque

**Échelle de risque :**
- Élevé : Impact significatif sur l'évaluation, action corrective immédiate requise
- Modéré : Impact modéré sur l'évaluation, action corrective recommandée
- Faible : Impact mineur sur l'évaluation, surveillance recommandée

### 4.3 Actions Correctives

**Types d'actions :**
- Revoir le scoring
- Revoir les questions posées
- Revoir l'interprétation des réponses
- Valider l'évaluation par un tiers
- Répéter l'entretien

---

## 5. Structure de Données (TypeScript)

```typescript
interface Bias {
  biasId: string;
  name: string;
  type: 'affinity' | 'halo' | 'confirmation' | 'recency' | 'cultural' | 'anchoring' | 'availability' | 'contrast' | 'projection' | 'similarity';
  
  definition: string;
  detectionSignals: string[];
  impact: string;
  correctiveActions: string[];
  example: string;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface BiasDetection {
  detectionId: string;
  interviewId: string;
  candidateId: string;
  positionId: string;
  
  detectedAt: Date;
  
  biases: {
    biasId: string;
    biasName: string;
    detected: boolean;
    risk: 'high' | 'moderate' | 'low';
    signals: string[];
    impact: string;
    correctiveAction: string;
  }[];
  
  globalRisk: 'high' | 'moderate' | 'low';
  recommendation: string;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface BiasLibrary {
  libraryId: string;
  
  biases: {
    affinity: Bias;
    halo: Bias;
    confirmation: Bias;
    recency: Bias;
    cultural: Bias;
    anchoring: Bias;
    availability: Bias;
    contrast: Bias;
    projection: Bias;
    similarity: Bias;
  };
  
  detectionProcess: {
    automaticDetection: string[];
    riskEvaluation: string;
    correctiveActions: string[];
  };
  
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
CREATE TABLE bias (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  type VARCHAR(30) NOT NULL,
  
  definition TEXT NOT NULL,
  detection_signals JSON NOT NULL,
  impact TEXT NOT NULL,
  corrective_actions JSON NOT NULL,
  example TEXT NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_bias_type ON bias(type);

CREATE TABLE bias_detection (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  position_id VARCHAR(36) NOT NULL,
  
  detected_at TIMESTAMP NOT NULL,
  
  biases JSON NOT NULL,
  global_risk VARCHAR(20) NOT NULL,
  recommendation TEXT,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_bias_detection_interview ON bias_detection(interview_id);
CREATE INDEX idx_bias_detection_candidate ON bias_detection(candidate_id);
CREATE INDEX idx_bias_detection_position ON bias_detection(position_id);

CREATE TABLE bias_library (
  id VARCHAR(36) PRIMARY KEY,
  
  biases JSON NOT NULL,
  detection_process JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 7. API Endpoints

```typescript
// GET /api/bias-library
async function getBiasLibrary(): Promise<BiasLibrary> {
  return await getBiasLibrary();
}

// PUT /api/bias-library
async function updateBiasLibrary(library: BiasLibrary): Promise<BiasLibrary> {
  return await updateBiasLibrary(library);
}

// GET /api/bias/:biasId
async function getBias(biasId: string): Promise<Bias> {
  return await getBiasById(biasId);
}

// POST /api/bias-detection/detect
async function detectBiases(interviewId: string): Promise<BiasDetection> {
  return await detectBiases(interviewId);
}

// GET /api/bias-detection/:detectionId
async function getBiasDetection(detectionId: string): Promise<BiasDetection> {
  return await getBiasDetectionById(detectionId);
}

// GET /api/bias-detection/interview/:interviewId
async function getBiasDetectionByInterview(interviewId: string): Promise<BiasDetection> {
  return await getBiasDetectionByInterview(interviewId);
}

// POST /api/bias-detection/apply-corrective-action
async function applyCorrectiveAction(detectionId: string, biasId: string): Promise<any> {
  return await applyCorrectiveAction(detectionId, biasId);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Détection

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection | Entretiens avec biais détectés / total | 100% |
- Taux de biais à risque élevé | Biais à risque élevé / total | ≤ 10% |

### 8.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux d'actions correctives appliquées | Actions appliquées / recommandées | ≥ 90% |
- Taux de réduction des biais | Biais réduits après action / total | ≥ 80% |

---

## 9. Conclusion

La bibliothèque des 10 biais à détecter structure les types de biais que le moteur recherche activement. 10 biais : Biais d'affinité (favoriser les profils similaires), Biais de halo (force initiale masque les faiblesses), Biais de confirmation (chercher à confirmer l'impression initiale), Biais de récence (surpondérer les informations récentes), Biais culturel (mal interpréter le style de communication), Biais d'ancrage (s'ancrer sur une information initiale), Biais de disponibilité (surpondérer les informations accessibles), Biais de contraste (comparer avec d'autres candidats), Biais de projection (projeter ses propres caractéristiques), Biais de similarité (favoriser les candidats similaires). Processus de détection automatique avec évaluation du risque (élevé, modéré, faible) et actions correctives (revoir le scoring, revoir les questions, revoir l'interprétation, valider par un tiers, répéter l'entretien). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 10 types de biais détaillés
- Signaux de détection pour chaque biais
- Impact sur l'évaluation
- Actions correctives pour chaque biais
- Processus de détection automatique
- Évaluation du risque
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de détection et de qualité
