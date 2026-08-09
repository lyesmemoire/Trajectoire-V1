# DOC-008-01 : Spécification du Moteur d'Apprentissage

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la spécification du moteur d'apprentissage (MVP-008) qui apprend des décisions humaines pour améliorer ses recommandations dans le temps, avec des garde-fous explicites pour éviter l'amplification des biais et les apprentissages non désirés.

---

## 2. Principe Fondateur

Le moteur apprend de chaque décision humaine. Il enrichit ses connaissances dans le temps. Il améliore ses recommandations par l'usage. Il ne peut pas apprendre de mauvaises habitudes sans garde-fous explicites.

---

## 3. Avertissement Critique

Un Learning Engine sans garde-fous est dangereux.

### 3.1 RISQUE 1 — Amplification des Biais

Si le recruteur a des biais inconscients :
- → Le moteur les apprend
- → Il les systématise
- → Il les rend invisibles et défendables
- → Risque juridique maximal

**Exemple :** Si les recruteurs tendent à favoriser les candidats de certaines écoles, le moteur apprendra à surpondérer cette caractéristique, rendant le biais systématique et difficile à détecter.

### 3.2 RISQUE 2 — Surapprentissage Local

Le moteur s'adapte à UN recruteur :
- → Il perd sa généralité
- → Il devient inutilisable pour d'autres contextes

**Exemple :** Si un recruteur a une préférence marquée pour les profils avec une certaine expérience, le moteur apprendra cette préférence personnelle comme une règle générale, réduisant sa performance pour d'autres recruteurs.

### 3.3 RISQUE 3 — Feedback de Mauvaise Qualité

Un ✓ ou ✗ sans contexte :
- → Le moteur apprend la mauvaise leçon
- → Sans le savoir

**Exemple :** Si un recruteur refuse un candidat pour une raison non liée aux compétences (ex: disponibilité), mais marque simplement "refusé", le moteur pourrait apprendre à pénaliser injustement le profil technique du candidat.

**Ces trois risques sont non négociables. Leur traitement est une condition de déploiement.**

---

## 4. Architecture du Feedback

Le feedback recruteur n'est jamais un simple ✓ / ✗.

### 4.1 FEEDBACK STRUCTURÉ OBLIGATOIRE

```typescript
interface RecruiterFeedback {
  // Décision finale
  finalDecision: 'retained' | 'rejected' | 'pending';
  
  // Accord avec le moteur
  engineAgreement: 'yes' | 'no' | 'partial';
  
  // Facteur déterminant
  determiningFactor: 
    | 'technical_skill'
    | 'sector_experience'
    | 'soft_skills'
    | 'culture_fit'
    | 'compensation'
    | 'availability'
    | 'other';
  
  // Si "other", précision requise
  otherFactor?: string;
  
  // Élément le plus utile
  mostUsefulElement: string;
  // Ce que le moteur a bien vu
  
  // Élément manquant
  missingElement: string;
  // Ce que le moteur n'a pas vu
  
  // Commentaire libre
  comment?: string; // 200 caractères max
}
```

### 4.2 FEEDBACK DIFFÉRÉ — 6 MOIS APRÈS RECRUTEMENT

```typescript
interface DeferredFeedback {
  // Candidat retenu
  if (finalDecision === 'retained') {
    integrationSuccess: 'yes' | 'no' | 'partial';
    actualPerformance: 'below_expectations' | 'as_expected' | 'above_expectations';
    departedBefore6Months: boolean;
  }
  
  // Candidat refusé
  if (finalDecision === 'rejected') {
    decisionRegretted: 'yes' | 'no' | 'unknown';
  }
}
```

Ce feedback différé est le plus précieux. Il permet au moteur d'apprendre ce qui prédit le succès RÉEL, pas seulement l'appréciation immédiate.

---

## 5. Ce que le Moteur Apprend

### 5.1 NIVEAU 1 — Pondérations

Ajuster le poids de chaque critère en fonction des décisions validées dans un contexte donné (secteur / taille entreprise / type de poste).

**Exemple d'apprentissage :**
- Dans le secteur Fintech : le poids de "Python" augmente de 10%
- Dans les startups : le poids des certifications diminue de 15%
- Pour les postes seniors : le poids de l'expérience sectorielle augmente de 20%

**Structure de données :**
```typescript
interface WeightAdjustment {
  criterion: string;
  context: {
    sector?: string;
    companySize?: string;
    jobType?: string;
  };
  currentWeight: number;
  proposedWeight: number;
  confidence: number;
  feedbackCount: number;
}
```

### 5.2 NIVEAU 2 — Patterns de Transfert

Enrichir la bibliothèque des compétences transférables validées terrain.

**Exemple d'apprentissage :**
```
Dans le secteur Fintech,
Python + SQL → déduit correctement
capacité à apprendre Scala
dans 80% des cas validés
```

**Structure de données :**
```typescript
interface TransferPatternLearning {
  sourceSkills: string[];
  targetSkill: string;
  context: {
    sector?: string;
    companySize?: string;
  };
  validationRate: number; // 0-1
  confidence: number;
  feedbackCount: number;
}
```

### 5.3 NIVEAU 3 — Règles Contextuelles

Découvrir des règles implicites propres à un secteur ou un type d'organisation.

**Exemple d'apprentissage :**
```
Dans les startups early-stage,
le moteur surpondère les certifications.
Les recruteurs les ignorent.
Corriger la pondération.
```

**Structure de données :**
```typescript
interface ContextualRuleLearning {
  rule: string;
  context: {
    sector?: string;
    companySize?: string;
    companyStage?: string;
  };
  currentBehavior: string;
  learnedBehavior: string;
  confidence: number;
  feedbackCount: number;
}
```

### 5.4 NIVEAU 4 — Ontologie RH

Enrichir les relations entre compétences, ajouter des synonymes validés terrain, corriger des proximités surestimées ou sous-estimées.

**Exemple d'apprentissage :**
- Ajout de synonyme : "React.js" ≈ "React"
- Correction de proximité : "Docker" → "Kubernetes" (proximité augmentée de 0.7 à 0.85)
- Ajout de relation : "TypeScript" → "JavaScript" (relation de parenté)

**Structure de données :**
```typescript
interface OntologyLearning {
  type: 'synonym' | 'proximity' | 'relation';
  source: string;
  target: string;
  currentValue: number;
  proposedValue: number;
  confidence: number;
  feedbackCount: number;
}
```

---

## 6. Architecture du Moteur d'Apprentissage

### 6.1 Flux de Données

```
FEEDBACK RECRUTEUR
    ↓
COLLECTE (FeedbackCollectorService)
    ↓
VALIDATION (FeedbackValidatorService)
    ↓
FILTRE ANTI-BIAIS (BiasFilterService)
    ↓
AGRÉGATION (FeedbackAggregatorService)
    ↓
ANALYSE (LearningAnalyzerService)
    ↓
PROPOSITION D'APPRENTISSAGE (LearningProposerService)
    ↓
VALIDATION HUMAINE (HumanValidationService)
    ↓
DÉPLOIEMENT (LearningDeployerService)
    ↓
VERSIONNING (VersionManagerService)
```

### 6.2 Services Principaux

#### 6.2.1 FeedbackCollectorService

Collecte le feedback structuré des recruteurs.

**Responsabilités :**
- Validation du format du feedback
- Enregistrement dans la base de données
- Association avec la décision du moteur
- Horodatage précis

#### 6.2.2 FeedbackValidatorService

Valide la qualité du feedback avant traitement.

**Responsabilités :**
- Vérification de la complétude du feedback
- Détection de feedbacks incohérents
- Filtrage des feedbacks de mauvaise qualité
- Alertes si taux de rejet élevé

#### 6.2.3 BiasFilterService

Filtre les feedbacks pour détecter et bloquer les biais potentiels.

**Responsabilités :**
- Analyse des corrélations avec critères prohibés (réf. RH-000 / RH-860)
- Vérification de la distribution équilibrée
- Détection de patterns discriminatoires systémiques
- Suspension des lots suspects

#### 6.2.4 FeedbackAggregatorService

Agrège les feedbacks par contexte et critère.

**Responsabilités :**
- Groupement des feedbacks par secteur, taille entreprise, type de poste
- Calcul des statistiques agrégées
- Identification des patterns significatifs
- Préparation pour l'analyse

#### 6.2.5 LearningAnalyzerService

Analyse les feedbacks agrégés pour identifier les apprentissages possibles.

**Responsabilités :**
- Analyse des écarts entre moteur et humain
- Identification des pondérations à ajuster
- Détection de nouveaux patterns de transfert
- Découverte de règles contextuelles

#### 6.2.6 LearningProposerService

Propose les modifications basées sur l'analyse.

**Responsabilités :**
- Génération des propositions d'apprentissage
- Calcul de la confiance de chaque proposition
- Vérification des seuils minimaux de feedback
- Priorisation des propositions

#### 6.2.7 HumanValidationService

Gère le processus de validation humaine.

**Responsabilités :**
- Présentation des propositions au DRH référent
- Collecte de la validation ou rejet
- Traçabilité des décisions de validation
- Gestion des retours pour révision

#### 6.2.8 LearningDeployerService

Déploie les apprentissages validés.

**Responsabilités :**
- Application des modifications validées
- Archivage de la version précédente
- Monitoring post-déploiement
- Gestion des rollbacks si nécessaire

#### 6.2.9 VersionManagerService

Gère le versioning du moteur.

**Responsabilités :**
- Archivage de chaque version
- Gestion des rollback
- Comparaison entre versions
- Reporting des changements

---

## 7. Cycle d'Apprentissage

### 7.1 Fréquence des Cycles

| Type d'Apprentissage | Fréquence | Volume de Feedback Requis |
|----------------------|-----------|---------------------------|
| Ajustement mineur de pondération | Hebdomadaire | 20 feedbacks concordants |
| Ajustement majeur de pondération | Mensuel | 50 feedbacks concordants |
| Nouveau pattern de transfert | Trimestriel | 100 feedbacks concordants |
| Nouvelle règle contextuelle | Trimestriel | 100 feedbacks concordants |
| Modification ontologie | Semestriel | 200 feedbacks concordants |

### 7.2 Processus d'un Cycle

```
1. COLLECTE (Quotidienne)
   - Collecte des feedbacks du jour
   - Validation du format
   - Enregistrement

2. FILTRE ANTI-BIAIS (Quotidienne)
   - Analyse du lot du jour
   - Détection de biais
   - Suspension si nécessaire

3. AGRÉGATION (Hebdomadaire)
   - Agrégation des feedbacks de la semaine
   - Calcul des statistiques
   - Identification des patterns

4. ANALYSE (Hebdomadaire)
   - Analyse des écarts moteur/humain
   - Proposition d'apprentissages
   - Vérification des seuils

5. VALIDATION HUMAINE (Hebdomadaire)
   - Présentation au DRH référent
   - Validation ou rejet
   - Traçabilité

6. DÉPLOIEMENT (Hebdomadaire si validé)
   - Application des modifications
   - Archivage de la version
   - Monitoring

7. AUDIT (Trimestriel)
   - Revue complète des apprentissages
   - Validation par DRH + Juriste + DPO
   - Rapport et corrections
```

---

## 8. Métriques de Suivi

### 8.1 Métriques d'Apprentissage

| Métrique | Description | Cible |
|----------|-------------|-------|
| Volume de feedback | Nombre de feedbacks collectés par semaine | ≥ 50 |
| Taux de feedback valide | Feedbacks validés / total feedbacks | ≥ 95% |
| Taux de rejet anti-biais | Lots rejetés pour biais / total lots | ≤ 5% |
| Taux de validation humaine | Propositions validées / total propositions | ≥ 80% |
| Temps de déploiement | Temps entre validation et déploiement | < 24h |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Accord moteur/humain | Pourcentage d'accord avec les décisions humaines | ≥ 85% (après MVP-008) |
| Amélioration de l'accord | Évolution de l'accord après chaque cycle | ≥ +2% par cycle |
| Satisfaction recruteur | Note moyenne de satisfaction | ≥ 4.5/5 |
| Taux de rollback | Rollbacks / déploiements | ≤ 5% |

---

## 9. Intégration avec MVP-007 et MVP-007b

### 9.1 Intégration avec MVP-007

Le moteur d'apprentissage utilise les décisions de MVP-007 comme base :

- **Input :** Décisions de MVP-007 (recommandation, justification, confiance)
- **Feedback :** Feedback recruteur sur la décision
- **Apprentissage :** Ajustement des pondérations et règles de MVP-007

### 9.2 Intégration avec MVP-007b

Le moteur d'apprentissage utilise les traces de doute de MVP-007b :

- **Input :** Traces de doute (DOC-007b-04)
- **Feedback :** Résolution des doutes par les recruteurs
- **Apprentissage :** Amélioration de la détection d'incertitude

---

## 10. Prérequis de Déploiement

### 10.1 Golden Dataset

Avant de déployer MVP-008, constituer un golden dataset de référence (voir DOC-008-09).

**Composition :**
- 100 paires CV / Poste avec décision humaine connue
- Diversité obligatoire : 10 secteurs, 5 niveaux d'expérience, profils atypiques inclus

**Usage :**
- Mesurer l'accord moteur / humain avant MVP-008
- Objectif MVP : > 75% d'accord
- Objectif V2 : > 85% d'accord
- Après chaque cycle : recalculer l'accord, rollback si baisse

### 10.2 Feedback Minimum

Volume minimum de feedback requis avant premier apprentissage :

- **Global :** 500 feedbacks
- **Par secteur :** 50 feedbacks
- **Par type de poste :** 30 feedbacks

### 10.3 Validation des Garde-Fous

Tous les garde-fous doivent être implémentés et testés avant déploiement :

- Filtre anti-biais (DOC-008-04)
- Validation humaine (DOC-008-05)
- Seuils de déclenchement (DOC-008-06)
- Protocole de rollback (DOC-008-07)
- Audit trimestriel (DOC-008-08)

---

## 11. Sécurité et Confidentialité

### 11.1 Protection des Données

Les données de feedback doivent être :

- **Anonymisées** pour l'apprentissage
- **Chiffrées** au repos et en transit
- **Contrôlées** par des droits d'accès stricts

### 11.2 Conformité RGPD

Le moteur doit respecter le RGPD :

- **Base légale** : Intérêt légitime pour l'amélioration du système
- **Minimisation** : Collecte uniquement les données nécessaires
- **Droit d'accès** : Les recruteurs peuvent accéder à leurs feedbacks
- **Droit d'opposition** : Possibilité de s'opposer à l'utilisation des feedbacks

### 11.3 Audit de Sécurité

Un audit de sécurité doit être effectué annuellement :

- **Scope :** Pipeline de feedback, stockage, apprentissage
- **Rapport :** Documenté et partagé avec le comité de gouvernance

---

## 12. Gouvernance

### 12.1 Comité de Gouvernance

Un comité supervise le moteur d'apprentissage :

**Membres :**
- Lead Technique MVP-008
- DRH Référent
- Expert Conformité
- DPO
- Expert Éthique

**Responsabilités :**
- Valider les apprentissages proposés
- Approuver les déploiements
- Surveiller les métriques d'impact
- Gérer les risques éthiques

### 12.2 Processus de Gouvernance

**Réunion hebdomadaire :**
- Revue des feedbacks de la semaine
- Analyse des apprentissages proposés
- Décision sur les déploiements

**Rapport mensuel :**
- État du moteur d'apprentissage
- Métriques d'impact
- Risques identifiés
- Recommandations

**Audit trimestriel :**
- Audit complet des apprentissages
- Validation éthique et juridique
- Rapport au comité exécutif

---

## 13. Maintenance

### 13.1 Maintenance du Pipeline

Le pipeline d'apprentissage doit être maintenu :

- **Mise à jour des schémas** : Lors de l'évolution des structures de données
- **Optimisation des performances** : Amélioration continue du temps de traitement
- **Surveillance des erreurs** : Monitoring et correction

### 13.2 Maintenance des Modèles

Les modèles d'apprentissage doivent être maintenus :

- **Réentraînement régulier** : Selon le cycle défini
- **Monitoring du drift** : Surveillance de la dégradation
- **Mise à jour des algorithmes** : Adoption de nouvelles techniques

---

## 14. Conclusion

La spécification du moteur d'apprentissage garantit :

- **Apprentissage continu** basé sur les décisions humaines
- **Amélioration progressive** des recommandations
- **Garde-fous explicites** contre les biais et surapprentissage
- **Traçabilité complète** de tous les apprentissages
- **Conformité éthique** et réglementaire
- **Validation humaine** de toutes les modifications
