# DOC-C7-01 : Les 5 Principes de Calibration Juste

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir les 5 principes fondamentaux de calibration juste pour le Correctif 7 Scoring Calibration. Ce document structure les règles qui garantissent que le moteur de scoring attribue des scores justes et cohérents, évitant les surestimations comme le cas Sophie (64/100 du moteur vs 45/100 attendu par un DRH senior).

---

## 2. Contexte de la Faille

**Problème identifié :**
Le moteur de scoring actuel surestime les candidats. Exemple : Sophie a obtenu 64/100 du moteur, alors qu'un DRH senior lui aurait donné 45/100. L'écart de 19 points est dangereux et peut conduire à de mauvaises recommandations de recrutement.

**Racine du problème :**
- Attribution de points sans preuves concrètes
- Ignorance des lacunes critiques
- Non prise en compte des silences du candidat
- Confusion entre qualité intrinsèque du candidat et adéquation au poste
- Valorisation excessive de performances ponctuelles au détriment de la cohérence

**Solution :**
Les 5 principes de calibration juste remettent le scoring à son niveau juste en imposant des règles strictes d'attribution des points.

---

## 3. Principe 1 — Aucun Point sans Preuve

### 3.1 Règle Absolue

Chaque point attribué doit être justifié par une preuve concrète. Pas une impression. Pas une intuition. Une preuve citée.

### 3.2 Format Obligatoire

**Structure de justification :**
```
Score X attribué parce que :
→ Preuve 1 : [citation exacte ou fait]
→ Preuve 2 : [citation exacte ou fait]
```

**Exemple :**
```
Score 4/5 attribué pour la compétence "Gestion de paie" parce que :
→ Preuve 1 : "J'ai géré la paie pour 200 salariés pendant 3 ans"
→ Preuve 2 : "J'ai mis en place un nouveau logiciel de paie en 2023"
```

### 3.3 Règle d'Absence de Preuve

Si aucune preuve disponible :
- Score = 0 sur cette dimension
- Pas de score par défaut ou par sympathie
- Pas de score basé sur des déclarations non vérifiées

### 3.4 Types de Preuves Acceptées

**Preuves directes :**
- Citations exactes du candidat
- Faits vérifiables (expériences, formations, réalisations)
- Résultats mesurables (chiffres, pourcentages, durées)
- Références confirmées

**Preuves indirectes :**
- Cohérence entre différentes réponses
- Détails spécifiques qui indiquent une expérience réelle
- Capacité à répondre à des questions de creusage (voir Correctif 1)

**Preuves refusées :**
- Déclarations générales ("Je suis bon en...")
- Impressions de l'évaluateur
- Intuitions
- Sympathie pour le candidat

### 3.5 Application Pratique

**Pour chaque dimension évaluée :**
1. Identifier les critères de scoring
2. Chercher des preuves concrètes pour chaque critère
3. Attribuer un score uniquement si des preuves sont disponibles
4. Documenter les preuves dans le format obligatoire
5. Si aucune preuve : score = 0

---

## 4. Principe 2 — Les Lacunes Critiques Pèsent Plus que les Forces

### 4.1 Définition d'une Lacune Critique

Une lacune critique est une compétence ou une connaissance dont l'absence met en danger :
- Le candidat (risque d'échec dans le poste)
- L'entreprise (risque juridique, financier, réputationnel)
- Des tiers (risque pour les salariés, clients, partenaires)

### 4.2 Coefficient Lacune Critique

Toute lacune critique identifiée déclenche un coefficient réducteur sur le score global :

**Coefficient par nombre de lacunes critiques :**
- 1 lacune critique : Score global × 0.75
- 2 lacunes critiques : Score global × 0.60
- 3 lacunes critiques : Score global × 0.50
- 4+ lacunes critiques : Score global × 0.40

### 4.3 Exemples de Lacunes Critiques

**Pour un poste DRH :**
- Méconnaissance de la procédure salarié protégé
- Incapacité à expliquer le processus de licenciement
- Absence de connaissance du droit du travail français
- Incapacité à gérer un conflit collectif

**Pour un poste de manager :**
- Aucune expérience de management
- Incapacité à donner un feedback négatif
- Absence de compétences en résolution de conflits
- Incapacité à déléguer

**Pour un poste de direction :**
- Incapacité à prendre des décisions sous pression légère
- Absence de vision stratégique
- Incapacité à communiquer avec la direction générale
- Absence de compétences en gestion budgétaire

### 4.4 Identification des Lacunes Critiques

**Processus d'identification :**
1. Lister les compétences et connaissances obligatoires pour le poste
2. Identifier celles dont l'absence est critique
3. Évaluer le candidat sur ces éléments
4. Documenter les lacunes critiques identifiées
5. Appliquer le coefficient réducteur

### 4.5 Application Pratique

**Exemple :**
Score brut : 70/100
Lacunes critiques identifiées : 2 (méconnaissance procédure salarié protégé, incapacité à gérer conflit collectif)
Coefficient : × 0.60
Score final : 70 × 0.60 = 42/100

---

## 5. Principe 3 — Le Silence est un Score Négatif

### 5.1 Principe Fondamental

Ce que le candidat N'A PAS DIT est aussi important que ce qu'il a dit. Les silences révélateurs doivent être pénalisés.

### 5.2 Application

**Processus :**
1. Lister les éléments attendus pour CE poste dans CE contexte
2. Pour chaque élément non mentionné par le candidat :
   - Si critique : −5 points
   - Si significatif : −3 points
   - Si mineur : −1 point

### 5.3 Exemple pour un Candidat DRH

**Éléments attendus :**
- Autorisation de l'Inspection du Travail
- Budget RH
- Stratégie de l'entreprise
- Processus de recrutement
- Gestion des relations sociales

**Application :**
- N'a pas mentionné l'autorisation de l'Inspection du Travail : −5 points (critique)
- N'a pas mentionné le budget RH : −2 points (significatif)
- N'a pas posé de questions sur la stratégie : −3 points (significatif)
- A mentionné le processus de recrutement : 0 points (ne pénalise pas)
- A mentionné la gestion des relations sociales : 0 points (ne pénalise pas)

**Total pénalité :** −10 points

### 5.4 Classification des Éléments

**Critique (−5 points) :**
- Éléments dont l'absence indique une lacune critique
- Éléments obligatoires pour le poste
- Éléments dont la méconnaissance est dangereuse

**Significatif (−3 points) :**
- Éléments importants mais non critiques
- Éléments qui indiquent une lacune significative
- Éléments dont l'absence suggère un manque d'expérience

**Mineur (−1 point) :**
- Éléments secondaires
- Éléments dont l'absence indique un manque de précision
- Éléments qui peuvent être acquis rapidement

### 5.5 Application Pratique

**Pour chaque évaluation :**
1. Identifier les éléments attendus pour le poste
2. Classer chaque élément (critique, significatif, mineur)
3. Vérifier si le candidat a mentionné chaque élément
4. Appliquer les pénalités pour les éléments non mentionnés
5. Soustraire les pénalités du score brut

---

## 6. Principe 4 — Le Score Reflète CE Poste, Pas le Candidat en Général

### 6.1 Principe Fondamental

Un candidat peut être excellent en tant que professionnel RH. Et être insuffisant pour CE poste à CE moment. Le score est toujours relatif au poste. Jamais absolu.

### 6.2 Distinction Fondamentale

**Score = Adéquation candidat / poste**
- Évalue si le candidat correspond aux exigences spécifiques du poste
- Prend en compte le contexte de l'entreprise
- Prend en compte le moment du recrutement

**Score ≠ Qualité intrinsèque du candidat**
- N'évalue pas si le candidat est un bon professionnel en général
- N'évalue pas le potentiel du candidat pour d'autres postes
- N'évalue pas la valeur humaine du candidat

### 6.3 Application Pratique

**Exemple :**
Un candidat peut être :
- Excellent DRH pour une PME de 50 salariés
- Insuffisant pour un poste de DRH dans une grande entreprise de 5000 salariés
- Le score pour le poste dans la grande entreprise sera bas, même si le candidat est excellent pour la PME

### 6.4 Facteurs de Contexte

**Facteurs à prendre en compte :**
- Taille de l'entreprise
- Secteur d'activité
- Culture d'entreprise
- Équipe existante
- Enjeux spécifiques du poste
- Moment du recrutement (crise, croissance, stabilité)

### 6.5 Implications

**Pour le scoring :**
- Le score doit être calculé spécifiquement pour chaque poste
- Le même candidat peut avoir des scores différents pour des postes similaires dans des contextes différents
- Le score ne doit pas être transférable d'un poste à l'autre sans recalcul

---

## 7. Principe 5 — La Cohérence Vaut Plus que la Performance Ponctuelle

### 7.1 Principe Fondamental

Un candidat qui donne 3 bonnes réponses et 7 réponses moyennes est moins bien coté qu'un candidat qui donne 10 réponses cohérentes et solides même si moins brillantes. La cohérence prédit mieux la performance réelle que les éclats ponctuels.

### 7.2 Coefficient Cohérence

**Calcul de la cohérence :**
- Évaluer la cohérence des réponses du candidat
- Classer la cohérence (élevée, standard, faible)
- Appliquer le coefficient correspondant

**Coefficient :**
- Cohérence élevée : Score × 1.10
- Cohérence standard : Score × 1.00
- Cohérence faible : Score × 0.90

### 7.3 Évaluation de la Cohérence

**Cohérence élevée :**
- Réponses cohérentes entre elles
- Pas de contradictions
- Discours structuré et logique
- Capacité à maintenir la ligne directrice

**Cohérence standard :**
- Réponses globalement cohérentes
- Quelques incohérences mineures
- Discours relativement structuré

**Cohérence faible :**
- Réponses incohérentes
- Contradictions significatives
- Discours désorganisé
- Changements de position fréquents

### 7.4 Application Pratique

**Exemple :**
Candidat A : 3 excellentes réponses, 7 réponses moyennes, cohérence faible
Score brut : 60/100
Coefficient : × 0.90
Score final : 54/100

Candidat B : 10 réponses solides et cohérentes, cohérence élevée
Score brut : 58/100
Coefficient : × 1.10
Score final : 63.8/100

**Résultat :** Candidat B (63.8) > Candidat A (54)

### 7.5 Indicateurs de Cohérence

**Indicateurs positifs :**
- Maintien de la même position sur des questions similaires
- Capacité à articuler les réponses entre elles
- Discours structuré avec une ligne directrice claire
- Absence de contradictions

**Indicateurs négatifs :**
- Changements de position sur des questions similaires
- Contradictions entre différentes réponses
- Discours désorganisé
- Incohérences logiques

---

## 8. Structure de Données (TypeScript)

```typescript
interface CalibrationPrinciple {
  principleId: string;
  name: string;
  description: string;
  
  rules: {
    absoluteRule: string;
    mandatoryFormat: string;
    application: string[];
  };
  
  examples: {
    positive: string[];
    negative: string[];
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface CalibrationPrinciples {
  principlesId: string;
  
  principle1: {
    name: string;
    description: string;
    absoluteRule: string;
    mandatoryFormat: string;
    noProofRule: string;
    acceptedProofs: string[];
    rejectedProofs: string[];
    practicalApplication: string[];
  };
  
  principle2: {
    name: string;
    description: string;
    criticalGapDefinition: string;
    coefficient: {
      one: number;
      two: number;
      three: number;
      fourPlus: number;
    };
    examples: {
      drh: string[];
      manager: string[];
      director: string[];
    };
    identificationProcess: string[];
    practicalApplication: string;
  };
  
  principle3: {
    name: string;
    description: string;
    fundamentalPrinciple: string;
    application: string[];
    example: {
      expectedElements: string[];
      application: string[];
    };
    classification: {
      critical: {
        points: number;
        description: string;
      };
      significant: {
        points: number;
        description: string;
      };
      minor: {
        points: number;
        description: string;
      };
    };
    practicalApplication: string[];
  };
  
  principle4: {
    name: string;
    description: string;
    fundamentalPrinciple: string;
    distinction: {
      score: string;
      notScore: string;
    };
    practicalApplication: string;
    contextFactors: string[];
    implications: string[];
  };
  
  principle5: {
    name: string;
    description: string;
    fundamentalPrinciple: string;
    coefficient: {
      high: number;
      standard: number;
      low: number;
    };
    coherenceEvaluation: {
      high: string[];
      standard: string[];
      low: string[];
    };
    practicalApplication: string;
    indicators: {
      positive: string[];
      negative: string[];
    };
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 9. Stockage et Gestion

### 9.1 Schéma SQL

```sql
CREATE TABLE calibration_principle (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  
  rules JSON NOT NULL,
  examples JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE calibration_principles (
  id VARCHAR(36) PRIMARY KEY,
  
  principle1 JSON NOT NULL,
  principle2 JSON NOT NULL,
  principle3 JSON NOT NULL,
  principle4 JSON NOT NULL,
  principle5 JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 10. API Endpoints

```typescript
// GET /api/calibration-principles
async function getCalibrationPrinciples(): Promise<CalibrationPrinciples> {
  return await getCalibrationPrinciples();
}

// PUT /api/calibration-principles
async function updateCalibrationPrinciples(principles: CalibrationPrinciples): Promise<CalibrationPrinciples> {
  return await updateCalibrationPrinciples(principles);
}

// POST /api/calibration/apply-principle1
async function applyPrinciple1(dimension: string, responses: any): Promise<any> {
  return await applyPrinciple1(dimension, responses);
}

// POST /api/calibration/apply-principle2
async function applyPrinciple2(score: number, criticalGaps: number): Promise<number> {
  return await applyPrinciple2(score, criticalGaps);
}

// POST /api/calibration/apply-principle3
async function applyPrinciple3(score: number, expectedElements: string[], mentionedElements: string[]): Promise<number> {
  return await applyPrinciple3(score, expectedElements, mentionedElements);
}

// POST /api/calibration/apply-principle4
async function applyPrinciple4(candidateId: string, positionId: string): Promise<any> {
  return await applyPrinciple4(candidateId, positionId);
}

// POST /api/calibration/apply-principle5
async function applyPrinciple5(score: number, coherence: 'high' | 'standard' | 'low'): Promise<number> {
  return await applyPrinciple5(score, coherence);
}

// POST /api/calibration/evaluate-coherence
async function evaluateCoherence(responses: any[]): Promise<'high' | 'standard' | 'low'> {
  return await evaluateCoherence(responses);
}
```

---

## 11. Indicateurs de Suivi

### 11.1 Métriques d'Application

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'application du Principe 1 | Scores avec preuves / total | 100% |
- Taux d'identification des lacunes critiques | Lacunes critiques identifiées / total | ≥ 95% |
- Taux d'application des pénalités de silence | Pénalités appliquées / total | ≥ 90% |

### 11.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Écart moyen moteur / DRH senior | Différence moyenne des scores | ≤ 5 points |
- Taux de scores justes | Scores justes / total | ≥ 90% |

---

## 12. Conclusion

Les 5 principes de calibration juste garantissent que le moteur de scoring attribue des scores justes et cohérents. Principe 1 : Aucun point sans preuve (format obligatoire de justification, score = 0 si aucune preuve). Principe 2 : Les lacunes critiques pèsent plus que les forces (coefficient réducteur : 1 lacune × 0.75, 2 lacunes × 0.60, 3 lacunes × 0.50). Principe 3 : Le silence est un score négatif (pénalités : critique −5, significatif −3, mineur −1). Principe 4 : Le score reflète CE poste pas le candidat en général (score = adéquation candidat/poste, pas qualité intrinsèque). Principe 5 : La cohérence vaut plus que la performance ponctuelle (coefficient : élevée × 1.10, standard × 1.00, faible × 0.90). Application stricte de ces principes pour éviter les surestimations comme le cas Sophie (64/100 du moteur vs 45/100 attendu). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 5 principes fondamentaux de calibration juste
- Principe 1 : Aucun point sans preuve
- Principe 2 : Lacunes critiques pèsent plus que les forces
- Principe 3 : Silence est un score négatif
- Principe 4 : Score reflète CE poste pas le candidat en général
- Principe 5 : Cohérence vaut plus que performance ponctuelle
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques d'application et de qualité
