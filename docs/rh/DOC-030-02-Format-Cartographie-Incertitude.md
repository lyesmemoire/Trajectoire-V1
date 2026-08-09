# DOC-030-02 : Format de la Cartographie d'Incertitude

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le format de la cartographie d'incertitude pour MVP-030 Uncertainty Management Engine. Ce format structure la présentation de l'incertitude pour chaque évaluation complète, organisant les connaissances par niveau de certitude et identifiant explicitement les zones d'ignorance.

---

## 2. Principe Fondateur

Pour chaque évaluation complète, le moteur produit une cartographie de son incertitude. Cette cartographie organise les connaissances en 5 sections : ce que le moteur sait avec certitude, ce qu'il estime avec confiance, ce qu'il estime avec réserve, ce qu'il ne sait pas, et ce que personne ne peut savoir sans informations supplémentaires.

---

## 3. Structure de la Cartographie

### 3.1 Section 1 — CE QUE JE SAIS AVEC CERTITUDE (Niveau 0)

**Contenu :**
Liste des faits établis avec certitude maximale.

**Format :**
```
✅ CE QUE JE SAIS AVEC CERTITUDE (Niveau 0)

[Fait 1]
  Source : [source du fait]
  Règle appliquée : [règle et sa source]
  Validité : [période de validité]

[Fait 2]
  Source : [source du fait]
  Règle appliquée : [règle et sa source]
  Validité : [période de validité]
```

**Exemple :**
```
✅ CE QUE JE SAIS AVEC CERTITUDE (Niveau 0)

La période d'essai maximale pour un cadre est 4 mois renouvelable une fois
  Source : Code du travail, article L1242-2
  Règle appliquée : Règle légale explicite
  Validité : Permanente (sauf modification législative)

Ce candidat a les qualifications obligatoires pour le poste
  Source : CV analysé, diplômes vérifiés
  Règle appliquée : Critères obligatoires du poste
  Validité : Actuelle (si critères inchangés)
```

---

### 3.2 Section 2 — CE QUE J'ESTIME AVEC CONFIANCE (Niveau 1)

**Contenu :**
Liste des estimations fiables basées sur des précédents concordants.

**Format :**
```
🟢 CE QUE J'ESTIME AVEC CONFIANCE (Niveau 1)

[Estimation 1]
  Basé sur : [N] précédents concordants
  Taux de succès observé : [X%]
  Hypothèses : [aucune significative]
  Marge d'erreur : [±X%]

[Estimation 2]
  Basé sur : [N] précédents concordants
  Taux de succès observé : [X%]
  Hypothèses : [aucune significative]
  Marge d'erreur : [±X%]
```

**Exemple :**
```
🟢 CE QUE J'ESTIME AVEC CONFIANCE (Niveau 1)

Ce candidat présente les caractéristiques des profils qui réussissent dans ce contexte
  Basé sur : 47 précédents concordants
  Taux de succès observé : 84%
  Hypothèses : aucune significative
  Marge d'erreur : ±5%

Ce soft skill est fortement présent d'après les réponses obtenues
  Basé sur : 32 précédents concordants
  Taux de succès observé : 78%
  Hypothèses : aucune significative
  Marge d'erreur : ±7%
```

---

### 3.3 Section 3 — CE QUE J'ESTIME AVEC RÉSERVE (Niveau 2-3)

**Contenu :**
Liste des estimations incertaines basées sur des hypothèses ou des données partielles.

**Format :**
```
🟡 CE QUE J'ESTIME AVEC RÉSERVE (Niveau 2-3)

[Estimation 1]
  Basé sur : [analogies / données partielles]
  Hypothèses posées : [liste explicite]
  Ce qui pourrait invalider ces estimations :
    - [condition 1]
    - [condition 2]
    - [condition 3]
  Niveau de confiance : [modérée / faible]

[Estimation 2]
  Basé sur : [analogies / données partielles]
  Hypothèses posées : [liste explicite]
  Ce qui pourrait invalider ces estimations :
    - [condition 1]
    - [condition 2]
    - [condition 3]
  Niveau de confiance : [modérée / faible]
```

**Exemple :**
```
🟡 CE QUE J'ESTIME AVEC RÉSERVE (Niveau 2-3)

Ce candidat pourrait avoir un bon fit culturel
  Basé sur : analogies avec des profils similaires
  Hypothèses posées :
    - La culture de l'entreprise est stable
    - Le candidat a répondu sincèrement aux questions culturelles
    - Le style de management est compatible
  Ce qui pourrait invalider ces estimations :
    - Changement de culture en cours
    - Réponses préparées et non sincères
    - Incompatibilité de personnalité non détectée
  Niveau de confiance : modérée

Ce profil pourrait correspondre aux attentes du poste
  Basé sur : données partielles sur l'expérience
  Hypothèses posées :
    - Les compétences techniques demandées restent inchangées
    - L'environnement de travail est stable
    - Le candidat peut s'adapter rapidement
  Ce qui pourrait invalider ces estimations :
    - Évolution des besoins techniques
    - Changement de contexte de travail
    - Difficulté d'adaptation non anticipée
  Niveau de confiance : faible
```

---

### 3.4 Section 4 — CE QUE JE NE SAIS PAS (Niveau 4)

**Contenu :**
Liste des zones d'ignorance où le moteur ne peut pas évaluer avec les données disponibles.

**Format :**
```
🔴 CE QUE JE NE SAIS PAS (Niveau 4)

[Zone d'ignorance 1]
  Pourquoi je ne peux pas évaluer : [explication]
  Ce n'est pas une limite temporaire : [vrai / faux]
  Ce qui permettrait d'évaluer :
    - [action 1]
    - [action 2]
    - [action 3]

[Zone d'ignorance 2]
  Pourquoi je ne peux pas évaluer : [explication]
  Ce n'est pas une limite temporaire : [vrai / faux]
  Ce qui permettrait d'évaluer :
    - [action 1]
    - [action 2]
    - [action 3]
```

**Exemple :**
```
🔴 CE QUE JE NE SAIS PAS (Niveau 4)

La motivation profonde de ce candidat
  Pourquoi je ne peux pas évaluer : Les motivations profondes nécessitent des informations psychologiques que je ne peux obtenir
  Ce n'est pas une limite temporaire : vrai
  Ce qui permettrait d'évaluer :
    - Entretien approfondi avec un psychologue
    - Période d'essai prolongée avec suivi
    - Analyse comportementale avancée

La performance future réelle de ce candidat
  Pourquoi je ne peux pas évaluer : La performance dépend de facteurs externes imprévisibles
  Ce n'est pas une limite temporaire : vrai
  Ce qui permettrait d'évaluer :
    - Simulation de performance en conditions réelles
    - Période d'essai avec objectifs clairs
    - Suivi rapproché pendant 6 mois
```

---

### 3.5 Section 5 — CE QUE PERSONNE NE PEUT SAVOIR SANS INFORMATIONS SUPPLÉMENTAIRES

**Contenu :**
Liste des incertitudes fondamentales qui resteraient incertaines même avec plus d'informations.

**Format :**
```
⚫ CE QUE PERSONNE NE PEUT SAVOIR SANS INFORMATIONS SUPPLÉMENTAIRES

[Incertitude fondamentale 1]
  Pourquoi c'est irréductible : [explication]
  Ce qui resterait incertain même avec plus d'informations : [liste]
  Recommandation : décision sous incertitude assumée et documentée

[Incertitude fondamentale 2]
  Pourquoi c'est irréductible : [explication]
  Ce qui resterait incertain même avec plus d'informations : [liste]
  Recommandation : décision sous incertitude assumée et documentée
```

**Exemple :**
```
⚫ CE QUE PERSONNE NE PEUT SAVOIR SANS INFORMATIONS SUPPLÉMENTAIRES

L'évolution personnelle du candidat dans 3 ans
  Pourquoi c'est irréductible : Les êtres humains changent de manière imprévisible
  Ce qui resterait incertain même avec plus d'informations :
    - Évolution des motivations
    - Changement de priorités
    - Réactions aux événements de vie
  Recommandation : décision sous incertitude assumée et documentée

La chimie d'équipe réelle avec les futurs collègues
  Pourquoi c'est irréductible : La chimie entre êtres humains ne peut être prédite avec certitude
  Ce qui resterait incertain même avec plus d'informations :
    - Dynamique d'équipe en évolution
    - Interactions spontanées
    - Adaptation mutuelle
  Recommandation : décision sous incertitude assumée et documentée
```

---

## 4. Structure de Données (TypeScript)

```typescript
interface UncertaintyMap {
  mapId: string;
  evaluationId: string;
  createdAt: Date;
  
  level0: {
    facts: {
      statement: string;
      source: string;
      ruleApplied: string;
      validity: string;
    }[];
  };
  
  level1: {
    estimates: {
      statement: string;
      basedOn: number;
      successRate: number;
      assumptions: string[];
      marginOfError: number;
    }[];
  };
  
  level2_3: {
    estimates: {
      statement: string;
      basedOn: string;
      assumptions: string[];
      invalidatingConditions: string[];
      confidenceLevel: 'moderate' | 'low';
    }[];
  };
  
  level4: {
    unknowns: {
      area: string;
      whyCannotEvaluate: string;
      isNotTemporary: boolean;
      actionsToEvaluate: string[];
    }[];
  };
  
  fundamental: {
    uncertainties: {
      area: string;
      whyIrreducible: string;
      remainsUncertain: string[];
      recommendation: string;
    }[];
  };
  
  metadata: {
    createdBy: string;
    context: string;
    version: string;
  };
}
```

---

## 5. Algorithme de Génération de la Cartographie

### 5.1 Processus Global

```typescript
async function generateUncertaintyMap(evaluation: Evaluation): Promise<UncertaintyMap> {
  // 1. Mesure de l'incertitude
  const uncertaintyAssessment = await measureUncertainty(evaluation);
  
  // 2. Extraction des faits certitudes (Niveau 0)
  const level0 = await extractLevel0Facts(evaluation);
  
  // 3. Extraction des estimations confiantes (Niveau 1)
  const level1 = await extractLevel1Estimates(evaluation);
  
  // 4. Extraction des estimations réservées (Niveau 2-3)
  const level2_3 = await extractLevel2_3Estimates(evaluation);
  
  // 5. Identification des zones d'ignorance (Niveau 4)
  const level4 = await identifyLevel4Unknowns(evaluation);
  
  // 6. Identification des incertitudes fondamentales
  const fundamental = await identifyFundamentalUncertainties(evaluation);
  
  // 7. Construction de la cartographie
  const map: UncertaintyMap = {
    mapId: generateMapId(),
    evaluationId: evaluation.evaluationId,
    createdAt: new Date(),
    level0,
    level1,
    level2_3,
    level4,
    fundamental,
    metadata: {
      createdBy: 'MVP-030 Uncertainty Management Engine',
      context: evaluation.context,
      version: '1.0'
    }
  };
  
  return map;
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE uncertainty_map (
  id VARCHAR(36) PRIMARY KEY,
  evaluation_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  
  level0 JSON NOT NULL,
  level1 JSON NOT NULL,
  level2_3 JSON NOT NULL,
  level4 JSON NOT NULL,
  fundamental JSON NOT NULL,
  metadata JSON NOT NULL,
  
  FOREIGN KEY (evaluation_id) REFERENCES evaluation(id)
);

CREATE INDEX idx_uncertainty_map_evaluation ON uncertainty_map(evaluation_id);
CREATE INDEX idx_uncertainty_map_date ON uncertainty_map(created_at);
```

---

## 7. API Endpoints

```typescript
// POST /api/uncertainty/map
async function generateUncertaintyMap(evaluation: Evaluation): Promise<UncertaintyMap> {
  return await generateUncertaintyMap(evaluation);
}

// GET /api/uncertainty/map/:mapId
async function getUncertaintyMap(mapId: string): Promise<UncertaintyMap> {
  return await getUncertaintyMapById(mapId);
}

// GET /api/uncertainty/map/evaluation/:evaluationId
async function getUncertaintyMapByEvaluation(evaluationId: string): Promise<UncertaintyMap> {
  return await getUncertaintyMapByEvaluation(evaluationId);
}

// GET /api/uncertainty/map/format
async function getUncertaintyMapFormat(): Promise<any> {
  return await getUncertaintyMapFormat();
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétude | Cartographies complètes / total | ≥ 95% |
- Taux de faits certitudes | Faits niveau 0 / total évaluations | ≥ 20% |
- Taux d'estimations confiantes | Estimations niveau 1 / total évaluations | ≥ 40% |
- Taux d'estimations réservées | Estimations niveau 2-3 / total évaluations | ≤ 30% |
- Taux de zones d'ignorance | Zones niveau 4 / total évaluations | ≤ 10% |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Utilisation de la cartographie | Cartographies consultées / créées | ≥ 80% |
- Satisfaction recruteurs | Satisfaction avec la cartographie | ≥ 4.5/5 |
- Réduction des décisions aveugles | Réduction des décisions sans information | ≥ 30% |

---

## 9. Conclusion

Le format de la cartographie d'incertitude structure la présentation de l'incertitude pour chaque évaluation complète. Les 5 sections (ce que je sais avec certitude, ce que j'estime avec confiance, ce que j'estime avec réserve, ce que je ne sais pas, ce que personne ne peut savoir) organisent les connaissances par niveau de certitude et identifient explicitement les zones d'ignorance.

**Points clés :**
- 5 sections structurées
- Organisation par niveau de certitude
- Identification explicite des zones d'ignorance
- Distinction entre incertitude temporaire et fondamentale
- Actions proposées pour réduire l'incertitude
- Recommandations pour les incertitudes irréductibles
- Format de présentation clair et lisible
- Intégration avec les modules existants
