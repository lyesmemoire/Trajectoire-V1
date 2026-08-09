# DOC-011-08 : 20 Cas Réels Documentés avec Raisonnement Moteur et Feedback Recruteur

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le template et la structure pour documenter 20 cas réels d'utilisation du moteur pendant le programme beta MVP-011. Chaque cas documente le raisonnement du moteur et le feedback du recruteur.

---

## 2. Principe Fondateur

Les cas réels documentent l'utilisation du moteur sur des recrutements authentiques. Ils capturent le raisonnement du moteur et le feedback du recruteur pour identifier les forces et les faiblesses du système.

---

## 3. Structure du Cas de Document

### 3.1 En-tête

```
┌─────────────────────────────────────────┐
│ CAS RÉEL #XX                           │
├─────────────────────────────────────────┤
│                                         │
| Cas ID : [CASE-ID]                     │
| Beta ID : [BETA-ID]                    │
| Semaine : [X]                          │
| Date : [DD/MM/YYYY]                    │
│                                         │
| Profil beta : [DRH Grand Groupe / DRH PME / Cabinet / Chasseur / Manager]│
│ Type de recrutement : [____]           │
│ Stade du recrutement : [Début / Milieu / Fin]│
│                                         │
└─────────────────────────────────────────┘
```

### 3.2 Contexte du Recrutement

```
┌─────────────────────────────────────────┐
│ CONTEXTE DU RECRUTEMENT                 │
├─────────────────────────────────────────┤
│                                         │
| Poste à pourvoir :                     │
│ [Titre du poste]                        │
│                                         │
| Entreprise :                           │
│ [Nom de l'entreprise]                   │
│ Secteur : [____]                       │
│ Taille : [____]                         │
│                                         │
| Fiche de poste :                       │
│ [Résumé de la fiche de poste]           │
│                                         │
| Critères du poste :                    │
│ • Compétences techniques : [____]       │
│ • Expérience : [____]                   │
│ • Soft skills : [____]                  │
│ • Autres critères : [____]              │
│                                         │
| Candidat :                             │
│ [Anonymisation : CAND-XXXX]             │
│ Expérience : [____]                     │
│ Compétences : [____]                    │
│                                         │
└─────────────────────────────────────────┘
```

### 3.3 Raisonnement du Moteur

```
┌─────────────────────────────────────────┐
│ RAISONNEMENT DU MOTEUR                  │
├─────────────────────────────────────────┤
│                                         │
| Score global : [X/100]                  │
│ Niveau de confiance : [X%]             │
│                                         │
| Analyse par critère :                  │
│                                         │
| Compétences techniques :                │
| • Score : [X/100]                      │
| • Détail : [____]                      │
| • Justification : [____]                │
│                                         │
| Expérience :                           │
| • Score : [X/100]                      │
| • Détail : [____]                      │
| • Justification : [____]                │
│                                         │
| Soft skills :                          │
| • Score : [X/100]                      │
| • Détail : [____]                      │
| • Justification : [____]                │
│                                         │
| Autres critères :                      │
│ • Score : [X/100]                      │
| • Détail : [____]                      │
| • Justification : [____]                │
│                                         │
| Arbre de décision (résumé) :           │
│ [Résumé de l'arbre de décision]         │
│                                         │
| Recommandation du moteur :             │
| ○ Accepter                             │
| ○ Refuser                              │
| ○ Doute                                │
│                                         │
| Justification de la recommandation :   │
│ [____]                                  │
│                                         │
└─────────────────────────────────────────┘
```

### 3.4 Décision du Recruteur

```
┌─────────────────────────────────────────┐
│ DÉCISION DU RECRUTEUR                  │
├─────────────────────────────────────────┤
│                                         │
| Décision finale :                      │
│ ○ Accepter                             │
│ ○ Refuser                              │
│ ○ En attente                           │
│                                         │
| Accord avec le moteur :                 │
│ ○ Oui                                 │
│ ○ Non                                 │
│ ○ Partiellement                         │
│                                         │
| Justification de la décision :         │
│ [____]                                  │
│ [____]                                  │
│                                         │
| Facteurs influençant la décision :     │
│ • [Facteur 1]                          │
│ • [Facteur 2]                          │
│ • [Facteur 3]                          │
│                                         │
└─────────────────────────────────────────┘
```

### 3.5 Feedback du Recruteur

```
┌─────────────────────────────────────────┐
│ FEEDBACK DU RECRUTEUR                  │
├─────────────────────────────────────────┤
│                                         │
| Ce qui a fonctionné :                 │
│                                         │
| • [Point positif 1]                     │
| • [Point positif 2]                     │
│ • [Point positif 3]                     │
│                                         │
| Ce qui n'a pas fonctionné :            │
│                                         │
| • [Point négatif 1]                     │
| • [Point négatif 2]                     │
│ • [Point négatif 3]                     │
│                                         │
| Ce qui manque :                        │
│                                         │
| • [Manque 1]                           │
│ • [Manque 2]                           │
│                                         │
| Suggestions d'amélioration :           │
│                                         │
| • [Suggestion 1]                       │
│ • [Suggestion 2]                       │
│                                         │
└─────────────────────────────────────────┘
```

### 3.6 Analyse Croisée

```
┌─────────────────────────────────────────┐
│ ANALYSE CROISÉE                        │
├─────────────────────────────────────────┤
│                                         │
| Comparaison décision moteur / recruteur :│
│                                         │
| • Accord : [____]                      │
| • Désaccord : [____]                   │
| • Explication du désaccord : [____]      │
│                                         │
| Leçons apprises :                      │
│                                         │
| • [Leçon 1]                           │
| • [Leçon 2]                           │
│                                         │
| Implications pour le moteur :          │
│                                         │
| • [Implication 1]                      │
| • [Implication 2]                      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 4. Structure de Données (TypeScript)

```typescript
interface RealCase {
  caseId: string;
  betaId: string;
  weekNumber: number;
  date: Date;
  
  betaProfile: 'grand_groupe' | 'pme' | 'cabinet' | 'chasseur' | 'manager';
  recruitmentType: string;
  recruitmentStage: 'beginning' | 'middle' | 'end';
  
  context: {
    jobTitle: string;
    company: {
      name: string;
      sector: string;
      size: string;
    };
    jobPosting: {
      summary: string;
      criteria: {
        technicalSkills: string[];
        experience: string;
        softSkills: string[];
        otherCriteria: string[];
      };
    };
    candidate: {
      anonymizedId: string;
      experience: string;
      skills: string[];
    };
  };
  
  engineReasoning: {
    globalScore: number;
    confidenceLevel: number;
    
    criteriaAnalysis: {
      technicalSkills: {
        score: number;
        detail: string;
        justification: string;
      };
      experience: {
        score: number;
        detail: string;
        justification: string;
      };
      softSkills: {
        score: number;
        detail: string;
        justification: string;
      };
      otherCriteria: {
        score: number;
        detail: string;
        justification: string;
      };
    };
    
    decisionTreeSummary: string;
    
    recommendation: 'accept' | 'reject' | 'doubt';
    recommendationJustification: string;
  };
  
  recruiterDecision: {
    finalDecision: 'accept' | 'reject' | 'pending';
    agreementWithEngine: 'yes' | 'no' | 'partial';
    decisionJustification: string;
    influencingFactors: string[];
  };
  
  recruiterFeedback: {
    whatWorked: string[];
    whatDidntWork: string[];
    whatsMissing: string[];
    improvementSuggestions: string[];
  };
  
  crossAnalysis: {
    engineVsRecruiterComparison: {
      agreement: string;
      disagreement: string;
      disagreementExplanation: string;
    };
    lessonsLearned: string[];
    implicationsForEngine: string[];
  };
}
```

---

## 5. Template de Cas (Exemple)

### 5.1 Cas #01

```
┌─────────────────────────────────────────┐
│ CAS RÉEL #01                           │
├─────────────────────────────────────────┤
│                                         │
| Cas ID : CASE-20261015-BG001-01       │
| Beta ID : BG001                        │
| Semaine : 3                            │
| Date : 15/10/2026                      │
│                                         │
| Profil beta : DRH Grand Groupe         │
| Type de recrutement : Développeur senior│
| Stade du recrutement : Milieu           │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ CONTEXTE DU RECRUTEMENT                 │
├─────────────────────────────────────────┤
│                                         │
| Poste à pourvoir :                     │
| Développeur Full Stack Senior           │
│                                         │
| Entreprise :                           │
| TechCorp                               │
| Secteur : Tech / Software               │
| Taille : 2000 salariés                  │
│                                         │
| Fiche de poste :                       │
| Développeur full stack senior avec       │
| expérience en React, Node.js et         │
| architecture cloud.                     │
│                                         │
| Critères du poste :                    │
| • Compétences techniques : React,       │
|   Node.js, AWS, Docker                 │
| • Expérience : 5+ ans                  │
| • Soft skills : Communication,          │
|   Leadership                           │
| • Autres critères : Expérience startup  │
│                                         │
| Candidat :                             │
| CAND-a1b2c3d4                           │
| Expérience : 6 ans                     │
| Compétences : React, Node.js, Docker,   │
|   Kubernetes, CI/CD                     │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ RAISONNEMENT DU MOTEUR                  │
├─────────────────────────────────────────┤
│                                         │
| Score global : 78/100                  │
| Niveau de confiance : 85%              │
│                                         │
| Analyse par critère :                  │
│                                         │
| Compétences techniques :                │
| • Score : 85/100                      │
| • Détail : Le candidat possède toutes   │
|   les compétences requises et           │
|   supplémentaires (Kubernetes, CI/CD)   │
| • Justification : Correspondance        │
|   parfaite avec les critères            │
│                                         │
| Expérience :                           │
| • Score : 80/100                      │
| • Détail : 6 ans d'expérience,         │
|   supérieur au minimum de 5 ans         │
| • Justification : Expérience            │
|   suffisante                           │
│                                         │
| Soft skills :                          │
| • Score : 65/100                      │
| • Détail : Communication mentionnée     │
|   mais leadership non explicitement       │
| • Justification : Leadership            │
|   insuffisamment documenté             │
│                                         │
| Autres critères :                      │
| • Score : 90/100                      │
| • Détail : Expérience startup          │
|   confirmée (2 startups)               │
| • Justification : Correspondance          │
|   avec préférence implicite             │
│                                         │
| Arbre de décision (résumé) :           │
| NIVEAU 1 : Compétences techniques → ✅   │
| NIVEAU 2 : Expérience → ✅              │
| NIVEAU 3 : Soft skills → ⚠️              │
| NIVEAU 4 : Expérience startup → ✅       │
| NIVEAU 5 : Décision finale → ✅ Accepter │
│                                         │
| Recommandation du moteur :             │
| ✅ Accepter                             │
│                                         │
| Justification de la recommandation :   │
| Le candidat correspond aux critères     │
| techniques et d'expérience, avec une    │
| expérience startup qui correspond aux   │
| préférences implicites. Le seul point   │
| d'attention est le leadership qui        │
| pourrait être exploré en entretien.      │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ DÉCISION DU RECRUTEUR                  │
├─────────────────────────────────────────┤
│                                         │
| Décision finale :                      │
| ✅ Accepter                             │
│                                         │
| Accord avec le moteur :                 │
| ✅ Oui                                 │
│                                         │
| Justification de la décision :         │
| Le moteur a raison. Le candidat a       │
| les compétences techniques et           │
| l'expérience requises. Le leadership    │
| sera évalué en entretien.              │
│                                         │
| Facteurs influençant la décision :     │
| • Compétences techniques solides        │
| • Expérience startup pertinente          │
| • Correspondance avec les préférences    │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│ FEEDBACK DU RECRUTEUR                                                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│ Ce qui a fonctionné :                                                            │
│                                                                                   │
│ • L'arbre de décision est très clair et facile à suivre                          │
│ • L'analyse par critère est détaillée et utile                                   │
│ • La recommandation correspond à mon intuition                                     │
│                                                                                   │
│ Ce qui n'a pas fonctionné :                                                       │
│                                                                                   │
│ • Le score de soft skills est basé sur des informations limitées du CV             │
│ • Le moteur ne prend pas en compte l'expérience de management spécifique            │
│                                                                                   │
│ Ce qui manque :                                                                  │
│                                                                                   │
│ • Possibilité d'ajouter des critères personnalisés (ex: management spécifique)    │
│ • Intégration avec LinkedIn pour vérifier les recommandations                      │
│                                                                                   │
│ Suggestions d'amélioration :                                                     │
│                                                                                   │
│ • Permettre d'ajouter des critères personnalisés                                  │
│ • Améliorer l'extraction des soft skills depuis les CV                            │
│ • Intégrer les recommandations LinkedIn                                           │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│ ANALYSE CROISÉE                                                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│ Comparaison décision moteur / recruteur :                                        │
│                                                                                   │
│ • Accord : Le recruteur accepte la recommandation du moteur                      │
│ • Désaccord : Aucun                                                               │
│ • Explication du désaccord : N/A                                                │
│                                                                                   │
│ Leçons apprises :                                                                │
│                                                                                   │
│ • Le moteur est efficace pour évaluer les compétences techniques                   │
│ • L'arbre de décision aide à justifier les décisions auprès des parties prenantes  │
│ • Les soft skills nécessitent plus de données pour être évaluées avec précision    │
│                                                                                   │
│ Implications pour le moteur :                                                    │
│                                                                                   │
│ • Améliorer l'extraction des soft skills depuis les CV                             │
│ • Permettre l'ajout de critères personnalisés                                     │
│ • Enrichir les données avec des sources externes (LinkedIn)                        │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Processus de Documentation

### 6.1 Pendant l'Utilisation

- Observer le recruteur utiliser le moteur
- Capturer le raisonnement du moteur
- Noter la décision du recruteur
- Enregistrer le feedback immédiat

### 6.2 Immédiatement Après

- Compléter le template de cas
- Valider avec le recruteur
- Documenter les insights

### 6.3 Analyse Croisée

- Comparer avec les autres cas
- Identifier les patterns
- Identifier les besoins divergents

---

## 7. Stockage et Gestion

### 7.1 Stockage

Les cas sont stockés dans :

- **Google Drive** : Dossier partagé avec l'équipe
- **Notion** : Base de données structurée
- **Git** : Version control (format markdown)

### 7.2 Nom de Fichier

Format : `CASE-BETA-[BETA-ID]-S[X]-[YYYY-MM-DD]-[XX].md`

Exemple : `CASE-BETA-BG001-S3-2026-10-15-01.md`

### 7.3 Confidentialité

Les données des cas sont :
- Anonymisées (candidats, entreprises)
- Conservées conformément au RGPD
- Accessibles uniquement à l'équipe produit
- Utilisées uniquement pour l'amélioration du produit

---

## 8. Analyse des 20 Cas

### 8.1 Répartition par Profil Beta

| Profil Beta | Nombre de Cas | Pourcentage |
|-------------|---------------|-------------|
| DRH Grand Groupe | 4 | 20% |
| DRH PME | 4 | 20% |
| Cabinet de Recrutement | 4 | 20% |
| Chasseur de Têtes | 4 | 20% |
| Manager Opérationnel | 4 | 20% |

### 8.2 Répartition par Type de Recrutement

| Type de Recrutement | Nombre de Cas | Pourcentage |
|---------------------|---------------|-------------|
| Technique | 8 | 40% |
| Management | 6 | 30% |
| Commercial | 3 | 15% |
| Autre | 3 | 15% |

### 8.3 Répartition par Semaine

| Semaine | Nombre de Cas | Pourcentage |
|---------|---------------|-------------|
| Semaine 3 | 5 | 25% |
| Semaine 4 | 5 | 25% |
| Semaine 5 | 5 | 25% |
| Semaine 6 | 5 | 25% |

---

## 9. Métriques d'Analyse

### 9.1 Accord Moteur / Recruteur

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'accord | Décisions en accord / total | ≥ 70% |
| Taux de désaccord | Décisions en désaccord / total | ≤ 30% |
| Taux d'accord partiel | Décisions en accord partiel / total | ≤ 20% |

### 9.2 Satisfaction du Recruteur

| Métrique | Description | Cible |
|----------|-------------|-------|
| Satisfaction moyenne | Satisfaction moyenne des recruteurs | ≥ 4/5 |
| Utilité perçue | Utilité perçue du moteur | ≥ 4/5 |
| Confiance | Confiance dans les recommandations | ≥ 4/5 |

---

## 10. Conclusion

La documentation des 20 cas réels permet de capturer l'utilisation du moteur en conditions réelles et d'identifier les forces et les faiblesses du système. Ces cas sont une source précieuse d'insights pour l'amélioration continue du produit.

**Points clés :**
- Template standardisé pour tous les cas
- Documentation du raisonnement du moteur
- Documentation de la décision du recruteur
- Documentation du feedback
- Analyse croisée des cas
- Confidentialité et conformité RGPD
- Répartition équilibrée par profil et type de recrutement
