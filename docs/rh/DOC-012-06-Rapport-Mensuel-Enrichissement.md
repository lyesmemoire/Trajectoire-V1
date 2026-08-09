# DOC-012-06 : Rapport Mensuel d'Enrichissement

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le rapport mensuel d'enrichissement pour MVP-012. Ce rapport compile les résultats du cycle mensuel d'enrichissement (acquisition, qualification, test, déploiement) et fournit une vue d'ensemble de l'évolution de la couverture du Knowledge Pack.

---

## 2. Principe Fondateur

Le rapport mensuel d'enrichissement est la synthèse du cycle mensuel. Il documente les activités d'enrichissement, les résultats des tests, les décisions prises, et l'évolution de la couverture du Knowledge Pack.

---

## 3. Structure du Rapport

### 3.1 En-tête

```
┌─────────────────────────────────────────┐
│ RAPPORT MENSUEL D'ENRICHISSEMENT KP   │
├─────────────────────────────────────────┤
│                                         │
| Mois : [Mois] [Année]                  │
| Période : [DD/MM/YYYY - DD/MM/YYYY]     │
| Version KP : [X.X.X]                    │
| Rapport ID : [REPORT-ID]               │
│                                         │
| Rédigé par : [Nom]                     │
| Validé par : [Nom]                     │
| Date : [DD/MM/YYYY]                    │
│                                         │
└─────────────────────────────────────────┘
```

### 3.2 Résumé Exécutif

```
┌─────────────────────────────────────────┐
│ RÉSUMÉ EXÉCUTIF                       │
├─────────────────────────────────────────┤
│                                         │
| Vue d'ensemble du mois :               │
│                                         │
| • Entrées acquises : [XXX]              │
| • Entrées qualifiées : [XXX]            │
| • Entrées déployées : [XXX]             │
| • Taux de réussite : [XX%]              │
│                                         │
| Évolution de la couverture :           │
│                                         │
| • Couverture métiers : [XX%] → [XX%] ([+/- XX%])│
| • Couverture compétences : [XX%] → [XX%] ([+/- XX%])│
| • Taux de synonymes résolus : [XX%] → [XX%] ([+/- XX%])│
| • Taux de faux négatifs : [XX%] → [XX%] ([+/- XX%])│
│                                         │
| Décision du mois :                      │
│ ○ Déploiement réussi                   │
| ○ Déploiement avec réserves            │
| ○ Rollback effectué                    │
│                                         │
| Recommandations pour le mois prochain : │
│ • [Recommandation 1]                   │
│ • [Recommandation 2]                   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 4. Activités du Mois

### 4.1 Semaine 1 : Acquisition

```
┌─────────────────────────────────────────┐
│ SEMAINE 1 : ACQUISITION                │
├─────────────────────────────────────────┤
│                                         │
| Sources acquises :                     │
│                                         │
| ROME 4.0 :                            │
| • Entrées acquises : [XXX]             │
| • Nouvelles entrées : [XXX]            │
| • Entrées modifiées : [XXX]            │
| • Delta : [+/- XXX]                    │
│                                         │
| ESCO v1.1 :                           │
| • Entrées acquises : [XXX]             │
| • Nouvelles entrées : [XXX]            │
| • Entrées modifiées : [XXX]            │
| • Delta : [+/- XXX]                    │
│                                         │
| RNCP/RS :                             │
| • Entrées acquises : [XXX]             │
| • Nouvelles entrées : [XXX]            │
| • Entrées modifiées : [XXX]            │
| • Delta : [+/- XXX]                    │
│                                         │
| Synonymes terrain :                   │
| • Entrées acquises : [XXX]             │
| • Nouvelles entrées : [XXX]            │
| • Delta : [+/- XXX]                    │
│                                         │
| Résumé acquisition :                  │
| • Total entrées acquises : [XXX]       │
| • Total nouvelles entrées : [XXX]       │
| • Total entrées modifiées : [XXX]       │
| • Delta total : [+/- XXX]               │
│                                         │
| Problèmes rencontrés :                │
| • [Problème 1] - [Résolution]          │
| • [Problème 2] - [Résolution]          │
│                                         │
└─────────────────────────────────────────┘
```

### 4.2 Semaine 2 : Qualification

```
┌─────────────────────────────────────────┐
│ SEMAINE 2 : QUALIFICATION              │
├─────────────────────────────────────────┤
│                                         │
| Résultats de qualification :           │
│                                         │
| Entrées reçues : [XXX]                  │
| Entrées qualifiées : [XXX]              │
| Taux de qualification : [XX%]          │
│                                         │
| Détails par source :                  │
│                                         │
| ROME 4.0 :                            │
| • Entrées reçues : [XXX]               │
| • Entrées qualifiées : [XXX]            │
| • Taux de qualification : [XX%]         │
|                                         │
| ESCO v1.1 :                           │
| • Entrées reçues : [XXX]               │
| • Entrées qualifiées : [XXX]            │
| • Taux de qualification : [XX%]         │
│                                         │
| RNCP/RS :                             │
| • Entrées reçues : [XXX]               │
| • Entrées qualifiées : [XXX]            │
| • Taux de qualification : [XX%]         │
│                                         │
| Synonymes terrain :                   │
| • Entrées reçues : [XXX]               │
| • Entrées qualifiées : [XXX]            │
| • Taux de qualification : [XX%]         │
│                                         │
| Doublons résolus :                     │
| • Doublons exacts : [XXX]               │
| • Doublons fuzzy : [XXX]                │
| • Synonymes : [XXX]                     │
| • Total résolus : [XXX]                 │
| • Taux de réduction : [XX%]             │
│                                         │
| Relations créées :                     │
| • Relations hiérarchiques : [XXX]       │
| • Relations associatives : [XXX]        │
| • Relations synonymes : [XXX]           │
| • Relations traductions : [XXX]         │
| • Total créées : [XXX]                  │
│                                         │
| Validation DRH :                       │
| • Lots validés : [XXX]                  │
| • Lots rejetés : [XXX]                  │
| • Réserves : [XXX]                      │
│                                         │
└─────────────────────────────────────────┘
```

### 4.3 Semaine 3 : Test

```
┌─────────────────────────────────────────┐
│ SEMAINE 3 : TEST                        │
├─────────────────────────────────────────┤
│                                         │
| Résultats du test sur golden dataset : │
│                                         │
| Couverture métiers :                   │
| • Baseline : [XX%]                     │
| • Test : [XX%]                         │
| • Delta : [+/- XX%]                    │
|                                         │
| Couverture compétences :               │
| • Baseline : [XX%]                     │
| • Test : [XX%]                         │
| • Delta : [+/- XX%]                    │
│                                         │
| Taux de décision correcte :            │
| • Baseline : [XX%]                     │
| • Test : [XX%]                         │
| • Delta : [+/- XX%]                    │
│                                         │
| Taux de cas limites passés :           │
| • Baseline : [XX%]                     │
| • Test : [XX%]                         │
| • Delta : [+/- XX%]                    │
│                                         │
| Améliorations identifiées :            │
| • [Amélioration 1] - [Impact]          │
| • [Amélioration 2] - [Impact]          │
│                                         │
| Dégradations identifiées :             │
| • [Dégradation 1] - [Sévérité] - [Action]│
| • [Dégradation 2] - [Sévérité] - [Action]│
│                                         │
| Décision du test :                     │
| ○ Déployer                            │
| ○ Investiguer                          │
| ○ Rollback                            │
│                                         │
| Justification : [____]                 │
│                                         │
└─────────────────────────────────────────┘
```

### 4.4 Semaine 4 : Déploiement

```
┌─────────────────────────────────────────┐
│ SEMAINE 4 : DÉPLOIEMENT               │
├─────────────────────────────────────────┤
│                                         │
| Entrées déployées :                    │
│ • Total déployées : [XXX]              │
| • Par source :                         │
|   - ROME 4.0 : [XXX]                  │
|   - ESCO v1.1 : [XXX]                 │
|   - RNCP/RS : [XXX]                   │
|   - Synonymes terrain : [XXX]          │
│                                         │
| Versionnage :                          │
| • Version précédente : [X.X.X]         │
| • Version actuelle : [X.X.X]            │
| • Type de mise à jour : [Mineure / Majeure]│
│                                         │
| Traçabilité :                          │
| • Date de déploiement : [DD/MM/YYYY]   │
| • Effectué par : [Nom]                 │
| • Validé par : [Nom]                   │
│                                         │
| Problèmes post-déploiement :           │
| • [Problème 1] - [Résolution]          │
| • [Problème 2] - [Résolution]          │
│                                         │
| Rollback effectué :                     │
| ○ Non                                 │
│ ○ Oui - [Raison]                      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 5. Évolution de la Couverture

### 5.1 Métriques de Couverture

```
┌─────────────────────────────────────────┐
│ ÉVOLUTION DE LA COUVERTURE              │
├─────────────────────────────────────────┤
│                                         │
| Couverture métiers :                   │
│ • Mois dernier : [XX%]                 │
| • Ce mois : [XX%]                      │
| • Évolution : [+/- XX%]                │
| • Cible : [XX%]                        │
│ • Écart à la cible : [+/- XX%]         │
│                                         │
| Couverture compétences :               │
| • Mois dernier : [XX%]                 │
| • Ce mois : [XX%]                      │
| • Évolution : [+/- XX%]                │
| • Cible : [XX%]                        │
| • Écart à la cible : [+/- XX%]         │
│                                         │
| Taux de synonymes résolus :            │
| • Mois dernier : [XX%]                 │
| • Ce mois : [XX%]                      │
| • Évolution : [+/- XX%]                │
| • Cible : [XX%]                        │
| • Écart à la cible : [+/- XX%]         │
│                                         │
| Taux de faux négatifs :                │
| • Mois dernier : [XX%]                 │
| • Ce mois : [XX%]                      │
| • Évolution : [+/- XX%]                │
| • Cible : ≤ [XX%]                      │
| • Écart à la cible : [+/- XX%]         │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 Volume par Catégorie

```
┌─────────────────────────────────────────┐
│ VOLUME PAR CATÉGORIE                   │
├─────────────────────────────────────────┤
│                                         │
| Métiers :                              │
| • Mois dernier : [XXX]                 │
| • Ce mois : [XXX]                      │
| • Évolution : [+/- XXX]                │
| • Cible : [XXX]                        │
│                                         │
| Compétences :                          │
| • Mois dernier : [XXX]                 │
| • Ce mois : [XXX]                      │
| • Évolution : [+/- XXX]                │
| • Cible : [XXX]                        │
│                                         │
| Certifications :                       │
| • Mois dernier : [XXX]                 │
| • Ce mois : [XXX]                      │
| • Évolution : [+/- XXX]                │
| • Cible : [XXX]                        │
│                                         │
| Synonymes :                            │
| • Mois dernier : [XXX]                 │
| • Ce mois : [XXX]                      │
| • Évolution : [+/- XXX]                │
| • Cible : [XXX]                        │
│                                         │
| Relations :                            │
| • Mois dernier : [XXX]                 │
| • Ce mois : [XXX]                      │
| • Évolution : [+/- XXX]                │
| • Cible : [XXX]                        │
│                                         │
└─────────────────────────────────────────┘
```

---

## 6. Analyse des Résultats

### 6.1 Analyse des Améliorations

```
┌─────────────────────────────────────────┐
│ ANALYSE DES AMÉLIORATIONS              │
├─────────────────────────────────────────┤
│                                         │
| Amélioration 1 :                       │
| • Type : [Couverture / Volume / Performance]│
| • Métrique : [____]                    │
| • Delta : [+XX%]                       │
| • Source : [ROME / ESCO / RNCP / OPCO / Terrain]│
| • Impact : [Positif / Significatif]    │
| • Analyse : [____]                     │
│                                         │
| Amélioration 2 :                       │
| • Type : [Couverture / Volume / Performance]│
| • Métrique : [____]                    │
| • Delta : [+XX%]                       │
| • Source : [ROME / ESCO / RNCP / OPCO / Terrain]│
| • Impact : [Positif / Significatif]    │
| • Analyse : [____]                     │
│                                         │
└─────────────────────────────────────────┘
```

### 6.2 Analyse des Dégradations

```
┌─────────────────────────────────────────┐
│ ANALYSE DES DÉGRADATIONS               │
├─────────────────────────────────────────┤
│                                         │
| Dégradation 1 :                        │
| • Type : [Couverture / Volume / Performance]│
| • Métrique : [____]                    │
| • Delta : [-XX%]                       │
| • Source : [ROME / ESCO / RNCP / OPCO / Terrain]│
| • Sévérité : [Critique / Modérée]      │
| • Action prise : [____]                │
| • Analyse : [____]                     │
│                                         │
| Dégradation 2 :                        │
| • Type : [Couverture / Volume / Performance]│
| • Métrique : [____]                    │
| • Delta : [-XX%]                       │
| • Source : [ROME / ESCO / RNCP / OPCO / Terrain]│
| • Sévérité : [Critique / Modérée]      │
| • Action prise : [____]                │
| • Analyse : [____]                     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 7. Recommandations

### 7.1 Recommandations pour le Mois Prochain

```
┌─────────────────────────────────────────┐
│ RECOMMANDATIONS POUR LE MOIS PROCHAIN  │
├─────────────────────────────────────────┤
│                                         │
| Priorité 1 :                           │
| • [Recommandation]                     │
| • Justification : [____]                │
| • Responsable : [____]                 │
│                                         │
| Priorité 2 :                           │
| • [Recommandation]                     │
| • Justification : [____]                │
| • Responsable : [____]                 │
│                                         │
| Priorité 3 :                           │
| • [Recommandation]                     │
| • Justification : [____]                │
| • Responsable : [____]                 │
│                                         │
└─────────────────────────────────────────┘
```

### 7.2 Recommandations Long Terme

```
┌─────────────────────────────────────────┐
│ RECOMMANDATIONS LONG TERME             │
├─────────────────────────────────────────┤
│                                         │
| • [Recommandation 1]                   │
| • [Recommandation 2]                   │
| • [Recommandation 3]                   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 8. Structure de Données (TypeScript)

```typescript
interface MonthlyEnrichmentReport {
  reportId: string;
  month: string;
  year: number;
  period: {
    startDate: Date;
    endDate: Date;
  };
  
  kpVersion: string;
  
  executiveSummary: {
    entriesAcquired: number;
    entriesQualified: number;
    entriesDeployed: number;
    successRate: number;
    
    coverageEvolution: {
      jobsCoverage: { previous: number; current: number; delta: number };
      skillsCoverage: { previous: number; current: number; delta: number };
      synonymsResolutionRate: { previous: number; current: number; delta: number };
      falseNegativeRate: { previous: number; current: number; delta: number };
    };
    
    decision: 'deployed' | 'deployed_with_reservations' | 'rollback';
    recommendations: string[];
  };
  
  activities: {
    week1: {
      acquisition: {
        rome: { acquired: number; new: number; modified: number; delta: number };
        esco: { acquired: number; new: number; modified: number; delta: number };
        rncp: { acquired: number; new: number; modified: number; delta: number };
        terrain: { acquired: number; new: number; delta: number };
        summary: { totalAcquired: number; totalNew: number; totalModified: number; totalDelta: number };
        problems: { description: string; resolution: string }[];
      };
    };
    
    week2: {
      qualification: {
        entriesReceived: number;
        entriesQualified: number;
        qualificationRate: number;
        
        bySource: {
          rome: { received: number; qualified: number; rate: number };
          esco: { received: number; qualified: number; rate: number };
          rncp: { received: number; qualified: number; rate: number };
          terrain: { received: number; qualified: number; rate: number };
        };
        
        duplicates: {
          exact: number;
          fuzzy: number;
          synonyms: number;
          total: number;
          reductionRate: number;
        };
        
        relations: {
          hierarchical: number;
          associative: number;
          synonyms: number;
          translations: number;
          total: number;
        };
        
        drhValidation: {
          validated: number;
          rejected: number;
          reservations: number;
        };
      };
    };
    
    week3: {
      test: {
        jobsCoverage: { baseline: number; test: number; delta: number };
        skillsCoverage: { baseline: number; test: number; delta: number };
        decisionAccuracy: { baseline: number; test: number; delta: number };
        edgeCasePassRate: { baseline: number; test: number; delta: number };
        
        improvements: { type: string; metric: string; delta: number; impact: string }[];
        degradations: { type: string; metric: string; delta: number; severity: string; action: string }[];
        
        decision: 'deploy' | 'investigate' | 'rollback';
        justification: string;
      };
    };
    
    week4: {
      deployment: {
        deployedEntries: number;
        bySource: {
          rome: number;
          esco: number;
          rncp: number;
          terrain: number;
        };
        
        versioning: {
          previousVersion: string;
          currentVersion: string;
          updateType: 'minor' | 'major';
        };
        
        traceability: {
          deploymentDate: Date;
          performedBy: string;
          validatedBy: string;
        };
        
        postDeploymentProblems: { description: string; resolution: string }[];
        
        rollback: {
          performed: boolean;
          reason?: string;
        };
      };
    };
  };
  
  coverageEvolution: {
    jobsCoverage: { previous: number; current: number; delta: number; target: number; gap: number };
    skillsCoverage: { previous: number; current: number; delta: number; target: number; gap: number };
    synonymsResolutionRate: { previous: number; current: number; delta: number; target: number; gap: number };
    falseNegativeRate: { previous: number; current: number; delta: number; target: number; gap: number };
  };
  
  volumeEvolution: {
    jobs: { previous: number; current: number; delta: number; target: number };
    skills: { previous: number; current: number; delta: number; target: number };
    certifications: { previous: number; current: number; delta: number; target: number };
    synonyms: { previous: number; current: number; delta: number; target: number };
    relations: { previous: number; current: number; delta: number; target: number };
  };
  
  analysis: {
    improvements: {
      type: string;
      metric: string;
      delta: number;
      source: string;
      impact: string;
      analysis: string;
    }[];
    degradations: {
      type: string;
      metric: string;
      delta: number;
      source: string;
      severity: string;
      actionTaken: string;
      analysis: string;
    }[];
  };
  
  recommendations: {
    nextMonth: {
      priority: number;
      recommendation: string;
      justification: string;
      owner: string;
    }[];
    longTerm: string[];
  };
  
  metadata: {
    preparedBy: string;
    validatedBy: string;
    preparedDate: Date;
    validatedDate: Date;
  };
}
```

---

## 9. Génération du Rapport

### 9.1 Processus de Génération

```typescript
async function generateMonthlyReport(month: string, year: number): Promise<MonthlyEnrichmentReport> {
  // Récupération des données du mois
  const acquisitionData = await getAcquisitionData(month, year);
  const qualificationData = await getQualificationData(month, year);
  const testData = await getTestData(month, year);
  const deploymentData = await getDeploymentData(month, year);
  
  // Récupération des métriques de couverture
  const coverageEvolution = await getCoverageEvolution(month, year);
  const volumeEvolution = await getVolumeEvolution(month, year);
  
  // Analyse des résultats
  const analysis = await analyzeResults(acquisitionData, qualificationData, testData, deploymentData);
  
  // Génération des recommandations
  const recommendations = await generateRecommendations(analysis, coverageEvolution);
  
  // Construction du rapport
  const report: MonthlyEnrichmentReport = {
    reportId: generateReportId(),
    month,
    year,
    period: getPeriod(month, year),
    kpVersion: await getKPVersion(),
    
    executiveSummary: generateExecutiveSummary(acquisitionData, qualificationData, testData, deploymentData, coverageEvolution),
    
    activities: {
      week1: { acquisition: acquisitionData },
      week2: { qualification: qualificationData },
      week3: { test: testData },
      week4: { deployment: deploymentData }
    },
    
    coverageEvolution,
    volumeEvolution,
    
    analysis,
    recommendations,
    
    metadata: {
      preparedBy: 'Équipe produit',
      validatedBy: 'DRH référent',
      preparedDate: new Date(),
      validatedDate: null
    }
  };
  
  // Sauvegarde du rapport
  await saveReport(report);
  
  return report;
}
```

---

## 10. Distribution du Rapport

### 10.1 Destinataires

| Destinataire | Format | Fréquence |
|-------------|--------|----------|
| DRH référent | PDF + Email | Mensuelle |
| Référent Formation | PDF + Email | Mensuelle |
| Équipe technique | PDF + Email | Mensuelle |
| Équipe produit | PDF + Email | Mensuelle |
| Direction | PDF + Email | Mensuelle |

### 10.2 Email de Distribution

**Objet :** Rapport mensuel d'enrichissement KP - [Mois] [Année]

**Corps :**

```
Bonjour,

Le rapport mensuel d'enrichissement du Knowledge Pack pour [Mois] [Année] est disponible.

Résumé :
- Entrées acquises : [XXX]
- Entrées qualifiées : [XXX]
- Entrées déployées : [XXX]
- Taux de réussite : [XX%]

Évolution de la couverture :
- Couverture métiers : [XX%] → [XX%] ([+/- XX%])
- Couverture compétences : [XX%] → [XX%] ([+/- XX%])
- Taux de synonymes résolus : [XX%] → [XX%] ([+/- XX%])
- Taux de faux négatifs : [XX%] → [XX%] ([+/- XX%])

Décision du mois : [Déploiement réussi / Déploiement avec réserves / Rollback effectué]

Le rapport complet est disponible en pièce jointe.

Cordialement,
Équipe produit Trajectoire
```

---

## 11. Stockage et Archivage

### 11.1 Stockage

Les rapports mensuels sont stockés dans :

- **S3 Bucket** : Rapports PDF
- **Base de données** : Données structurées
- **Git** : Version control (format markdown)

### 11.2 Archivage

**Rétention :** 5 ans  
**Format d'archivage :** PDF + JSON  
**Lieu d'archivage :** S3 Glacier

### 11.3 Nom de Fichier

Format : `RAPPORT-ENRICHISSEMENT-[YYYY-MM].pdf`

Exemple : `RAPPORT-ENRICHISSEMENT-2026-10.pdf`

---

## 12. Indicateurs de Suivi

### 12.1 Métriques de Rapport

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétude | Rapports complets / total | 100% |
| Taux de ponctualité | Rapports à temps / total | 100% |
| Taux de validation | Rapports validés / total | 100% |
| Qualité des données | Précision des données | 100% |

---

## 13. Conclusion

Le rapport mensuel d'enrichissement compile les résultats du cycle mensuel et fournit une vue d'ensemble de l'évolution de la couverture du Knowledge Pack. Ce rapport est essentiel pour suivre les progrès et identifier les axes d'amélioration.

**Points clés :**
- Synthèse des 4 semaines du cycle mensuel
- Évolution de la couverture KP
- Analyse des améliorations et dégradations
- Recommandations pour le mois prochain
- Distribution aux parties prenantes
