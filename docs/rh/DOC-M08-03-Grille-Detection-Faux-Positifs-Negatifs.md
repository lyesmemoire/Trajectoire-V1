# DOC-M08-03 : Grille de Détection des Faux Positifs / Négatifs

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la grille de détection des faux positifs et faux négatifs pour le MVP-META-08 Error Learning Engine. Ce document structure les critères de détection et le processus d'analyse obligatoire.

---

## 2. Principe Fondateur

Les faux positifs (candidats recrutés à tort) et faux négatifs (candidats refusés à tort) sont détectés automatiquement par l'analyse de l'évolution professionnelle. Chaque cas détecté déclenche une analyse obligatoire pour identifier les erreurs d'évaluation.

---

## 3. Détection des Faux Négatifs

### 3.1 Signal de Faux Négatif

**Définition :**
Candidat refusé + Succès remarquable dans les 12 mois dans un poste similaire ailleurs.

**Critères de succès remarquable :**
- Promotion dans les 12 mois
- Performance élevée documentée
- Reconnaissance publique (LinkedIn, awards)
- Rétention > 12 mois dans le nouveau poste
- Évolution positive de carrière

**Critères de poste similaire :**
- Même niveau hiérarchique
- Même domaine d'activité
- Même type de responsabilités
- Entreprise de taille similaire ou supérieure

---

### 3.2 Analyse Obligatoire pour Faux Négatifs

**Questions d'analyse :**
- Quel critère nous a fait refuser ce candidat ?
- Ce critère était-il justifié ?
- Que devons-nous changer dans notre grille d'évaluation ?

**Processus d'analyse :**
1. Identifier le critère de refus principal
2. Évaluer la pertinence du critère
3. Comparer avec le succès observé
4. Proposer une correction de la grille

---

## 4. Détection des Faux Positifs

### 4.1 Signal de Faux Positif

**Définition :**
Candidat recruté + Échec dans les 12 mois (départ, licenciement, performance insuffisante).

**Critères d'échec :**
- Départ volontaire dans les 12 mois
- Licenciement pour performance
- Licenciement pour comportement
- Performance insuffisante documentée
- Conflits majeurs documentés

---

### 4.2 Analyse Obligatoire pour Faux Positifs

**Questions d'analyse :**
- Quel signal avons-nous manqué ?
- Quelle réponse préparée avons-nous cru ?
- Quelle lacune avons-nous sous-estimée ?

**Processus d'analyse :**
1. Identifier le signal manqué
2. Analyser les réponses préparées
3. Identifier les lacunes sous-estimées
4. Proposer une correction de la grille

---

## 5. Grille de Détection

### 5.1 Grille pour Faux Négatifs

| Critère | Poids | Seuil | Action |
|---------|-------|-------|--------|
| Promotion dans 12 mois | 30% | Oui | Analyse obligatoire |
| Performance élevée documentée | 25% | Oui | Analyse obligatoire |
| Reconnaissance publique | 15% | Oui | Analyse obligatoire |
| Rétention > 12 mois | 20% | Oui | Analyse obligatoire |
| Évolution positive de carrière | 10% | Oui | Analyse obligatoire |

**Score de faux négatif :** Σ (critères remplis × poids) ≥ 50%

---

### 5.2 Grille pour Faux Positifs

| Critère | Poids | Seuil | Action |
|---------|-------|-------|--------|
| Départ volontaire < 12 mois | 30% | Oui | Analyse obligatoire |
| Licenciement performance | 35% | Oui | Analyse obligatoire |
| Licenciement comportement | 20% | Oui | Analyse obligatoire |
| Performance insuffisante | 10% | Oui | Analyse obligatoire |
| Conflits majeurs | 5% | Oui | Analyse obligatoire |

**Score de faux positif :** Σ (critères remplis × poids) ≥ 50%

---

## 6. Structure de Données (TypeScript)

```typescript
interface FalseNegativeDetection {
  detectionId: string;
  recruitmentId: string;
  candidateId: string;
  
  signals: {
    promotion: boolean;
    highPerformance: boolean;
    publicRecognition: boolean;
    retentionOver12Months: boolean;
    positiveCareerEvolution: boolean;
  };
  
  score: number; // 0-100
  threshold: number; // 50
  detected: boolean;
  
  analysis: {
    rejectionCriterion: string;
    criterionJustified: boolean;
    proposedChange: string;
    analyzedAt: Date;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface FalsePositiveDetection {
  detectionId: string;
  recruitmentId: string;
  candidateId: string;
  
  signals: {
    voluntaryDeparture: boolean;
    performanceTermination: boolean;
    behaviorTermination: boolean;
    insufficientPerformance: boolean;
    majorConflicts: boolean;
  };
  
  score: number; // 0-100
  threshold: number; // 50
  detected: boolean;
  
  analysis: {
    missedSignal: string;
    preparedResponseBelieved: string;
    underestimatedGap: string;
    proposedChange: string;
    analyzedAt: Date;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE false_negative_detection (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  signals JSON NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  threshold DECIMAL(5,2) NOT NULL,
  detected BOOLEAN NOT NULL,
  
  analysis JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_false_negative_detection_recruitment ON false_negative_detection(recruitment_id);
CREATE INDEX idx_false_negative_detection_candidate ON false_negative_detection(candidate_id);
CREATE INDEX idx_false_negative_detection_detected ON false_negative_detection(detected);

CREATE TABLE false_positive_detection (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  signals JSON NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  threshold DECIMAL(5,2) NOT NULL,
  detected BOOLEAN NOT NULL,
  
  analysis JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_false_positive_detection_recruitment ON false_positive_detection(recruitment_id);
CREATE INDEX idx_false_positive_detection_candidate ON false_positive_detection(candidate_id);
CREATE INDEX idx_false_positive_detection_detected ON false_positive_detection(detected);
```

---

## 8. API Endpoints

```typescript
// POST /api/error-detection/false-negative
async function detectFalseNegative(recruitmentId: string): Promise<FalseNegativeDetection> {
  return await detectFalseNegative(recruitmentId);
}

// POST /api/error-detection/false-positive
async function detectFalsePositive(recruitmentId: string): Promise<FalsePositiveDetection> {
  return await detectFalsePositive(recruitmentId);
}

// PUT /api/error-detection/false-negative/:detectionId/analysis
async function recordFalseNegativeAnalysis(detectionId: string, analysis: any): Promise<FalseNegativeDetection> {
  return await recordFalseNegativeAnalysis(detectionId, analysis);
}

// PUT /api/error-detection/false-positive/:detectionId/analysis
async function recordFalsePositiveAnalysis(detectionId: string, analysis: any): Promise<FalsePositiveDetection> {
  return await recordFalsePositiveAnalysis(detectionId, analysis);
}

// GET /api/error-detection/false-negative/pending-analysis
async function getPendingFalseNegativeAnalyses(): Promise<FalseNegativeDetection[]> {
  return await getPendingFalseNegativeAnalyses();
}

// GET /api/error-detection/false-positive/pending-analysis
async function getPendingFalsePositiveAnalyses(): Promise<FalsePositiveDetection[]> {
  return await getPendingFalsePositiveAnalyses();
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Détection

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de faux négatifs détectés | Faux négatifs / candidats refusés suivis | ≥ 5% |
- Taux de faux positifs détectés | Faux positifs / candidats recrutés | ≤ 10% |
- Taux d'analyse complétée | Analyses complétées / détectées | 100% |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de correction appliquée | Corrections appliquées / proposées | ≥ 80% |
- Réduction du taux d'erreur | Réduction / taux initial | ≥ 20% |

---

## 10. Exemple Complet

```markdown
DÉTECTION FAUX NÉGATIF

Candidat : [Anonymisé]
Recrutement : REC-2026-001

Signaux détectés :
→ Promotion dans 12 mois : Oui (poids 30%)
→ Performance élevée documentée : Oui (poids 25%)
→ Reconnaissance publique : Non (poids 0%)
→ Rétention > 12 mois : Oui (poids 20%)
→ Évolution positive de carrière : Oui (poids 10%)

Score : 85%
Seuil : 50%
Détecté : Oui

Analyse obligatoire :
→ Critère de refus : Culture fit partiel (score 2.5/5)
→ Critère justifié : Non
→ Correction proposée : Réduire le poids du culture fit dans la grille
→ Analysé le : 2026-08-15
```

---

## 11. Conclusion

La grille de détection des faux positifs/négatifs structure les critères de détection et le processus d'analyse obligatoire. Faux négatifs : Candidat refusé + Succès remarquable dans les 12 mois (Promotion 30%, Performance élevée 25%, Reconnaissance publique 15%, Rétention > 12 mois 20%, Évolution positive 10%). Faux positifs : Candidat recruté + Échec dans les 12 mois (Départ volontaire 30%, Licenciement performance 35%, Licenciement comportement 20%, Performance insuffisante 10%, Conflits majeurs 5%). Analyse obligatoire pour chaque cas détecté. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Grille de détection pour faux négatifs
- Grille de détection pour faux positifs
- Score seuil de 50%
- Analyse obligatoire pour chaque cas
- Questions d'analyse spécifiques
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de détection et d'impact
