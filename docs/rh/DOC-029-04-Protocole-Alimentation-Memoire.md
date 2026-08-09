# DOC-029-04 : Protocole d'Alimentation de la Mémoire

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole d'alimentation de la mémoire institutionnelle pour MVP-029 Institutional Memory Engine. Ce protocole définit les 5 sources d'alimentation (feedbacks recruteurs, résultats à 6/12/24 mois, exceptions documentées, veille marché, retours beta recruteurs) et le processus d'intégration des données dans les 5 couches de la mémoire.

---

## 2. Principe Fondateur

La mémoire institutionnelle est alimentée par 5 sources complémentaires. Chaque source est traitée selon un protocole spécifique pour extraire les patterns, les leçons, et les erreurs institutionnelles. Toutes les données sont anonymisées et agrégées avant d'être stockées dans la mémoire, en conformité stricte avec le RGPD.

---

## 3. Sources d'Alimentation

### 3.1 Source 1 — Feedbacks Recruteurs (réf. MVP-008)

**Description :**
Feedbacks qualitatifs des recruteurs sur les recrutements.

**Type de données :**
- Feedbacks sur les candidats
- Feedbacks sur les processus
- Feedbacks sur les décisions
- Feedbacks sur les signaux détectés

**Fréquence :**
- Après chaque recrutement
- Synthèse hebdomadaire

**Processus d'intégration :**
1. Collecte des feedbacks via MVP-008
2. Anonymisation des données personnelles
3. Agrégation des feedbacks par contexte
4. Extraction des patterns de succès
5. Identification des erreurs institutionnelles
6. Intégration dans les couches 1 et 2

---

### 3.2 Source 2 — Résultats à 6, 12, 24 Mois

**Description :**
Résultats quantitatifs des recrutements à 6, 12, et 24 mois.

**Type de données :**
- Performance du candidat
- Intégration culturelle
- Rétention
- Satisfaction manager

**Fréquence :**
- 6 mois après le recrutement
- 12 mois après le recrutement
- 24 mois après le recrutement

**Processus d'intégration :**
1. Collecte des résultats via le système de suivi
2. Anonymisation des données personnelles
3. Agrégation des résultats par contexte
4. Validation des patterns de succès
5. Infirmation des patterns infirmés
6. Mise à jour de la confiance des patterns
7. Intégration dans la couche 1

---

### 3.3 Source 3 — Exceptions Documentées (réf. MVP-028)

**Description :**
Exceptions accordées et leurs résultats.

**Type de données :**
- Exceptions accordées
- Exceptions refusées
- Résultats des exceptions
- Jurisprudence interne

**Fréquence :**
- À chaque exception
- Synthèse trimestrielle

**Processus d'intégration :**
1. Collecte des exceptions via MVP-028
2. Anonymisation des données personnelles
3. Agrégation des exceptions par contexte
4. Construction de la jurisprudence interne
5. Identification des patterns d'exception
6. Intégration dans la couche 3

---

### 3.4 Source 4 — Veille Marché (réf. MVP-019)

**Description :**
Données de veille sur l'évolution du marché RH.

**Type de données :**
- Évolution des attentes candidats
- Évolution des pratiques de recrutement
- Évolution des compétences valorisées
- Émergence de nouveaux profils
- Disparition de profils obsolètes
- Évolution des salaires par profil

**Fréquence :**
- Quotidienne (automatique)
- Synthèse hebdomadaire

**Processus d'intégration :**
1. Collecte des données de veille via MVP-019
2. Analyse des tendances
3. Identification des patterns périmentés
4. Alerte pour mise à jour des patterns
5. Intégration dans la couche 4

---

### 3.5 Source 5 — Retours Beta Recruteurs (réf. MVP-011)

**Description :**
Feedbacks des recruteurs beta sur le système.

**Type de données :**
- Feedbacks sur les recommandations
- Feedbacks sur les patterns
- Feedbacks sur les erreurs détectées
- Suggestions d'amélioration

**Fréquence :**
- Après chaque utilisation
- Synthèse mensuelle

**Processus d'intégration :**
1. Collecte des feedbacks via MVP-011
2. Anonymisation des données personnelles
3. Agrégation des feedbacks
4. Validation des patterns
5. Identification des erreurs institutionnelles
6. Intégration dans les couches 1 et 2

---

## 4. Processus d'Alimentation

### 4.1 Processus Global

```typescript
async function feedInstitutionalMemory(): Promise<FeedingResult> {
  // 1. Alimentation depuis les feedbacks recruteurs
  const recruiterFeedbacks = await feedFromRecruiterFeedbacks();
  
  // 2. Alimentation depuis les résultats
  const results = await feedFromResults();
  
  // 3. Alimentation depuis les exceptions
  const exceptions = await feedFromExceptions();
  
  // 4. Alimentation depuis la veille marché
  const marketWatch = await feedFromMarketWatch();
  
  // 5. Alimentation depuis les retours beta
  const betaFeedbacks = await feedFromBetaFeedbacks();
  
  // 6. Construction du résultat
  const result: FeedingResult = {
    feedingId: generateFeedingId(),
    fedAt: new Date(),
    
    recruiterFeedbacks,
    results,
    exceptions,
    marketWatch,
    betaFeedbacks
  };
  
  // 7. Sauvegarde du résultat
  await saveFeedingResult(result);
  
  return result;
}
```

---

### 4.2 Alimentation depuis les Feedbacks Recruteurs

```typescript
async function feedFromRecruiterFeedbacks(): Promise<{
  patternsCreated: number;
  errorsCreated: number;
  patternsUpdated: number;
}> {
  // 1. Récupération des feedbacks depuis MVP-008
  const feedbacks = await getRecruiterFeedbacks();
  
  // 2. Anonymisation des données
  const anonymizedFeedbacks = await anonymizeFeedbacks(feedbacks);
  
  // 3. Agrégation par contexte
  const aggregatedFeedbacks = await aggregateByContext(anonymizedFeedbacks);
  
  // 4. Extraction des patterns de succès
  const patternsCreated = await extractSuccessPatterns(aggregatedFeedbacks);
  
  // 5. Identification des erreurs institutionnelles
  const errorsCreated = await identifyInstitutionalErrors(aggregatedFeedbacks);
  
  // 6. Mise à jour des patterns existants
  const patternsUpdated = await updateExistingPatterns(aggregatedFeedbacks);
  
  return {
    patternsCreated,
    errorsCreated,
    patternsUpdated
  };
}
```

---

### 4.3 Alimentation depuis les Résultats

```typescript
async function feedFromResults(): Promise<{
  patternsValidated: number;
  patternsInvalidated: number;
  confidenceUpdated: number;
}> {
  // 1. Récupération des résultats à 6, 12, 24 mois
  const results = await getResultsAt6Months();
  const results12 = await getResultsAt12Months();
  const results24 = await getResultsAt24Months();
  
  // 2. Anonymisation des données
  const anonymizedResults = await anonymizeResults([...results, ...results12, ...results24]);
  
  // 3. Agrégation par contexte
  const aggregatedResults = await aggregateByContext(anonymizedResults);
  
  // 4. Validation des patterns de succès
  const patternsValidated = await validateSuccessPatterns(aggregatedResults);
  
  // 5. Infirmation des patterns infirmés
  const patternsInvalidated = await invalidateSuccessPatterns(aggregatedResults);
  
  // 6. Mise à jour de la confiance des patterns
  const confidenceUpdated = await updatePatternConfidence(aggregatedResults);
  
  return {
    patternsValidated,
    patternsInvalidated,
    confidenceUpdated
  };
}
```

---

### 4.4 Alimentation depuis les Exceptions

```typescript
async function feedFromExceptions(): Promise<{
  jurisprudenceCreated: number;
  patternsCreated: number;
}> {
  // 1. Récupération des exceptions depuis MVP-028
  const exceptions = await getExceptions();
  
  // 2. Anonymisation des données
  const anonymizedExceptions = await anonymizeExceptions(exceptions);
  
  // 3. Agrégation par contexte
  const aggregatedExceptions = await aggregateByContext(anonymizedExceptions);
  
  // 4. Construction de la jurisprudence interne
  const jurisprudenceCreated = await buildJurisprudence(aggregatedExceptions);
  
  // 5. Identification des patterns d'exception
  const patternsCreated = await identifyExceptionPatterns(aggregatedExceptions);
  
  return {
    jurisprudenceCreated,
    patternsCreated
  };
}
```

---

### 4.5 Alimentation depuis la Veille Marché

```typescript
async function feedFromMarketWatch(): Promise<{
  patternsDeprecated: number;
  alertsGenerated: number;
}> {
  // 1. Récupération des données de veille depuis MVP-019
  const marketData = await getMarketWatchData();
  
  // 2. Analyse des tendances
  const trends = await analyzeTrends(marketData);
  
  // 3. Identification des patterns périmentés
  const patternsDeprecated = await identifyDeprecatedPatterns(trends);
  
  // 4. Génération des alertes
  const alertsGenerated = await generateAlerts(patternsDeprecated);
  
  return {
    patternsDeprecated,
    alertsGenerated
  };
}
```

---

### 4.6 Alimentation depuis les Retours Beta

```typescript
async function feedFromBetaFeedbacks(): Promise<{
  patternsValidated: number;
  errorsCreated: number;
}> {
  // 1. Récupération des feedbacks depuis MVP-011
  const feedbacks = await getBetaFeedbacks();
  
  // 2. Anonymisation des données
  const anonymizedFeedbacks = await anonymizeFeedbacks(feedbacks);
  
  // 3. Agrégation des feedbacks
  const aggregatedFeedbacks = await aggregateFeedbacks(anonymizedFeedbacks);
  
  // 4. Validation des patterns
  const patternsValidated = await validatePatterns(aggregatedFeedbacks);
  
  // 5. Identification des erreurs institutionnelles
  const errorsCreated = await identifyInstitutionalErrors(aggregatedFeedbacks);
  
  return {
    patternsValidated,
    errorsCreated
  };
}
```

---

## 5. Anonymisation et Agrégation

### 5.1 Protocole d'Anonymisation

**Principe :**
Toutes les données personnelles sont anonymisées avant d'être stockées dans la mémoire institutionnelle.

**Processus :**
1. Suppression des noms, prénoms, emails
2. Suppression des identifiants uniques
3. Agrégation par contexte
4. Conservation uniquement des patterns agrégés
5. Validation par le DPO

**Outils :**
- Anonymisation automatique
- Hashage des identifiants
- Agrégation statistique

---

### 5.2 Protocole d'Agrégation

**Principe :**
Les données sont agrégées par contexte pour créer des patterns exploitables.

**Dimensions d'agrégation :**
- Secteur d'activité
- Taille de l'entreprise
- Type de poste
- Niveau hiérarchique
- Stade de développement

**Processus :**
1. Classification des données par contexte
2. Agrégation statistique par contexte
3. Calcul des moyennes et écarts-types
4. Identification des tendances
5. Création des patterns

---

## 6. Structure de Données (TypeScript)

```typescript
interface FeedingResult {
  feedingId: string;
  fedAt: Date;
  
  recruiterFeedbacks: {
    patternsCreated: number;
    errorsCreated: number;
    patternsUpdated: number;
  };
  
  results: {
    patternsValidated: number;
    patternsInvalidated: number;
    confidenceUpdated: number;
  };
  
  exceptions: {
    jurisprudenceCreated: number;
    patternsCreated: number;
  };
  
  marketWatch: {
    patternsDeprecated: number;
    alertsGenerated: number;
  };
  
  betaFeedbacks: {
    patternsValidated: number;
    errorsCreated: number;
  };
}

interface AnonymizedData {
  originalId: string;
  anonymizedId: string;
  context: {
    sector: string;
    companySize: string;
    jobType: string;
    hierarchyLevel: string;
  };
  
  data: any;
  
  anonymizedAt: Date;
  anonymizedBy: string;
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE feeding_result (
  id VARCHAR(36) PRIMARY KEY,
  fed_at TIMESTAMP NOT NULL,
  
  recruiter_feedbacks JSON NOT NULL,
  results JSON NOT NULL,
  exceptions JSON NOT NULL,
  market_watch JSON NOT NULL,
  beta_feedbacks JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feeding_result_date ON feeding_result(fed_at);

CREATE TABLE anonymized_data (
  id VARCHAR(36) PRIMARY KEY,
  original_id VARCHAR(36) NOT NULL,
  anonymized_id VARCHAR(36) NOT NULL,
  
  context JSON NOT NULL,
  data JSON NOT NULL,
  
  anonymized_at TIMESTAMP NOT NULL,
  anonymized_by VARCHAR(255) NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_anonymized_data_context ON anonymized_data((context->>'sector'));
CREATE INDEX idx_anonymized_data_anonymized_at ON anonymized_data(anonymized_at);
```

---

## 8. API Endpoints

```typescript
// POST /api/institutional-memory/feed
async function feedInstitutionalMemory(): Promise<FeedingResult> {
  return await feedInstitutionalMemory();
}

// GET /api/institutional-memory/feeding/:feedingId
async function getFeedingResult(feedingId: string): Promise<FeedingResult> {
  return await getFeedingResultById(feedingId);
}

// GET /api/institutional-memory/feeding/latest
async function getLatestFeedingResult(): Promise<FeedingResult> {
  return await getLatestFeedingResult();
}

// POST /api/institutional-memory/feed/source/:source
async function feedFromSource(source: string): Promise<any> {
  switch (source) {
    case 'recruiter-feedbacks':
      return await feedFromRecruiterFeedbacks();
    case 'results':
      return await feedFromResults();
    case 'exceptions':
      return await feedFromExceptions();
    case 'market-watch':
      return await feedFromMarketWatch();
    case 'beta-feedbacks':
      return await feedFromBetaFeedbacks();
    default:
      throw new Error('Unknown source');
  }
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'alimentation | Sources alimentées / total | ≥ 95% |
- Taux d'anonymisation | Données anonymisées / total | 100% |
- Taux d'agrégation | Données agrégées / total | ≥ 95% |
- Satisfaction DPO | Satisfaction du DPO avec le protocole | ≥ 4.5/5 |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Volume de patterns créés | Patterns créés / mois | ≥ 10 |
- Volume d'erreurs documentées | Erreurs documentées / mois | ≥ 5 |
- Qualité des patterns | Patterns validés / créés | ≥ 80% |

---

## 10. Conclusion

Le protocole d'alimentation de la mémoire institutionnelle définit les 5 sources d'alimentation (feedbacks recruteurs, résultats à 6/12/24 mois, exceptions documentées, veille marché, retours beta recruteurs) et le processus d'intégration des données dans les 5 couches de la mémoire. Le protocole assure une anonymisation complète et une agrégation statistique pour respecter strictement le RGPD. Le protocole s'intègre avec les modules existants (MVP-008, MVP-019, MVP-011, MVP-028).

**Points clés :**
- 5 sources d'alimentation
- Processus d'intégration par source
- Anonymisation complète (RGPD absolu)
- Agrégation statistique par contexte
- Validation DPO obligatoire
- Intégration avec les modules existants
- Métriques de qualité et d'impact
