# DOC-007-07 : Protocole de Détection du Doute

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de détection du doute pour le moteur de raisonnement. Le doute structuré est une marque d'expertise : un DRH Senior sait quand il ne sait pas. Le moteur apprend la même discipline.

---

## 2. Principe Fondateur

**Règle absolue :** Si les données sont insuffisantes, le moteur NE PRODUIT PAS de recommandation forcée.

Le moteur produit : "Je ne peux pas recommander sur ce profil avec les données disponibles. Ce qui me manque pour décider : [liste précise]. Ce que je recommande avant de décider : [actions concrètes]."

---

## 3. Types de Doute

### 3.1 Doute par Données Manquantes

Le moteur détecte des données manquantes critiques qui empêchent une décision éclairée.

**Données manquantes critiques :**
- Compétences explicitement déclarées par le candidat
- Expériences professionnelles du candidat
- Formation académique du candidat
- Compétences critiques requises pour le poste
- Expérience minimale requise pour le poste
- Contexte de l'équipe (quand l'équipe est petite et a des écarts)

### 3.2 Doute par Problèmes Critiques

Le moteur détecte des problèmes critiques qui rendent la décision risquée.

**Problèmes critiques :**
- Compétence(s) bloquante(s) non compensable(s)
- Équipe ne peut pas absorber les manques identifiés
- Délais d'acquisition non compatibles avec les besoins opérationnels
- Capacité d'adaptation du candidat incertaine
- Nombre élevé d'écarts non compensables (≥ 3)

### 3.3 Doute par Signaux de Vigilance Multiples

Le moteur détecte un cumul de signaux de vigilance qui suggère une incertitude.

**Signaux de vigilance :**
- Nombre élevé de signaux de vigilance (≥ 3)
- Équipe petite pour absorber les manques
- Capacité d'adaptation à confirmer
- Mobilité excessive
- Absence d'expérience professionnelle

---

## 4. Algorithme de Détection du Doute

### 4.1 Calcul du Score de Confiance

```typescript
let confidenceScore = 100;

// Pénalité pour données manquantes
confidenceScore -= missingData.length * 15;

// Pénalité pour problèmes critiques
confidenceScore -= criticalIssues.length * 20;

// Pénalités contextuelles
if (!teamAbsorptionCapacity) confidenceScore -= 15;
if (!acquisitionDelayCompatibility) confidenceScore -= 15;
if (!adaptationCapacity) confidenceScore -= 10;
```

### 4.2 Niveaux de Confiance

| Score | Niveau de Confiance | Action |
|-------|-------------------|--------|
| ≥ 70 | HIGH | Recommandation possible |
| 40-69 | MEDIUM | Recommandation possible avec vigilance |
| < 40 | LOW | Données insuffisantes - Refus de recommander |

### 4.3 Déclenchement du Doute

Le doute est déclenché si :

1. **Données manquantes critiques** > 0
2. **Confidence score** < 40
3. **Problèmes critiques** ≥ 2

---

## 5. Structure de la Sortie en Cas de Doute

### 5.1 Interface DoubtDetection

```typescript
interface DoubtDetection {
  hasDoubt: boolean;
  confidence: 'high' | 'medium' | 'low';
  missingData: string[];
  recommendedActions: string[];
  reasoning: string[];
}
```

### 5.2 Exemple de Sortie en Cas de Doute

```json
{
  "hasDoubt": true,
  "confidence": "low",
  "missingData": [
    "Compétences explicitement déclarées par le candidat",
    "Expériences professionnelles du candidat",
    "Formation académique du candidat",
    "Compétences critiques requises pour le poste"
  ],
  "recommendedActions": [
    "Compléter les informations manquantes dans le CV ou la fiche de poste",
    "Réévaluer les exigences du poste ou rechercher un profil avec ces compétences",
    "Envisager un renfort temporaire ou un mentorat externe"
  ],
  "reasoning": [
    "Données insuffisantes : 4 information(s) manquante(s)",
    "Problèmes critiques identifiés : 2",
    "Risque opérationnel élevé sans support équipe",
    "Nombre élevé de signaux de vigilance"
  ]
}
```

---

## 6. Actions Recommandées

### 6.1 Compléter les Données

**Quand :** Données manquantes critiques

**Actions :**
- Compléter les informations manquantes dans le CV
- Enrichir la fiche de poste avec les compétences critiques
- Ajouter le contexte de l'équipe

### 6.2 Réévaluer les Exigences

**Quand :** Écarts bloquants non compensables

**Actions :**
- Réévaluer les exigences du poste
- Rechercher un profil avec ces compétences
- Envisager un poste junior avec plan de formation

### 6.3 Envisager un Support Externe

**Quand :** Équipe ne peut pas absorber les manques

**Actions :**
- Envisager un renfort temporaire
- Mettre en place un mentorat externe
- Ajuster le planning d'intégration

### 6.4 Ajuster le Planning

**Quand :** Délais d'acquisition non compatibles

**Actions :**
- Ajuster le planning d'intégration
- Ajuster les objectifs opérationnels
- Envisager une formation accélérée

### 6.5 Approfondir l'Évaluation

**Quand :** Capacité d'adaptation incertaine

**Actions :**
- Approfondir l'évaluation en entretien
- Mettre en place un test technique
- Vérifier les références

---

## 7. Protocole de Validation

### 7.1 Validation de la Détection du Doute

Pour chaque cas de test du golden dataset (voir DOC-007-06) :

1. **Identifier les cas où le doute doit être déclenché**
2. **Vérifier que le moteur détecte le doute**
3. **Vérifier que les données manquantes sont correctement identifiées**
4. **Vérifier que les actions recommandées sont pertinentes**

### 7.2 Critères de Validation

#### 7.2.1 Taux de Détection Correcte

```
Taux = (Cas doute correctement détectés / Total cas avec doute attendu) × 100
```

**Cible :** ≥ 95%

#### 7.2.2 Taux de Faux Positifs

```
Taux = (Cas doute détecté à tort / Total cas sans doute attendu) × 100
```

**Cible :** ≤ 5%

#### 7.2.3 Pertinence des Actions Recommandées

**Validation manuelle** par des experts RH pour un échantillon de cas.

**Cible :** ≥ 90% d'actions jugées pertinentes

---

## 8. Intégration dans le Flux de Raisonnement

### 8.1 Positionnement dans le Flux

```
COUCHE 1 : Collecte des Faits
    ↓
COUCHE 2 : Analyse des Écarts
    ↓
COUCHE 3 : Contextualisation
    ↓
DÉTECTION DU DOUTE (DoubtDetectorService)
    ↓
COUCHE 4 : Décision Argumentée
```

### 8.2 Impact sur la Décision

Si le doute est détecté :

- **Recommandation :** `insufficient_data`
- **Confiance :** `low`
- **Justification :** Liste des données manquantes et problèmes critiques
- **Actions recommandées :** Liste des actions pour compléter les données

### 8.3 Exemple de Flux avec Doute

**Input :**
- Candidat : CV incomplet (pas d'expériences)
- Poste : Poste complet
- Contexte : Aucun

**Flux :**
1. **Couche 1** : Faits collectés → données manquantes détectées
2. **Couche 2** : Analyse des écarts → impossible sans données
3. **Couche 3** : Contextualisation → impossible sans contexte
4. **Détection du doute** → hasDoubt = true, confidence = low
5. **Couche 4** → Décision : insufficient_data

**Output :**
```markdown
# Je ne peux pas recommander sur ce profil avec les données disponibles

## Données Insuffisantes
- Compétences explicitement déclarées par le candidat
- Expériences professionnelles du candidat
- Formation académique du candidat
- Compétences critiques requises pour le poste

## Actions Recommandées
- Compléter les informations manquantes dans le CV ou la fiche de poste
- Réévaluer les exigences du poste ou rechercher un profil avec ces compétences

## Niveau de Confiance: FAIBLE
```

---

## 9. Cas de Test pour la Détection du Doute

### 9.1 Cas DI-001 : CV Incomplet

**Input :**
- Candidat : Compétences déclarées seulement, pas d'expériences
- Poste : Poste complet avec exigences
- Contexte : Aucun

**Expected Output :**
- hasDoubt : true
- confidence : low
- missingData : ["Expériences professionnelles du candidat", "Formation académique du candidat"]

### 9.2 Cas DI-002 : Fiche de Poste Incomplète

**Input :**
- Candidat : CV complet
- Poste : Titre seulement, pas de compétences
- Contexte : Aucun

**Expected Output :**
- hasDoubt : true
- confidence : low
- missingData : ["Compétences critiques requises pour le poste"]

### 9.3 Cas DI-003 : Écart Bloquant sans Support Équipe

**Input :**
- Candidat : Profil partiel avec écart bloquant
- Poste : Poste avec compétence bloquante
- Contexte : Équipe petite (3 personnes), pas d'expert

**Expected Output :**
- hasDoubt : true
- confidence : low
- criticalIssues : ["1 compétence bloquante non compensable", "L'équipe ne peut pas absorber les manques"]

### 9.4 Cas DI-004 : Délais d'Acquisition Incompatibles

**Input :**
- Candidat : Profil avec écarts transférables mais délais longs
- Poste : Poste avec contraintes opérationnelles strictes
- Contexte : Contrainte : disponibilité immédiate

**Expected Output :**
- hasDoubt : true
- confidence : low
- criticalIssues : ["Les délais d'acquisition ne sont pas compatibles avec les besoins opérationnels"]

### 9.5 Cas DI-005 : Capacité d'Adaptation Incertaine

**Input :**
- Candidat : Profil sans signaux d'apprentissage rapide, progression plate
- Poste : Poste avec écarts transférables
- Contexte : Équipe de taille moyenne

**Expected Output :**
- hasDoubt : true
- confidence : medium
- criticalIssues : ["La capacité d'adaptation du candidat est incertaine"]

---

## 10. Maintenance du Protocole

### 10.1 Révision des Seuils

Les seuils de détection du doute doivent être révisés :

- Trimestriellement basé sur les résultats des tests
- Basé sur les retours d'expérience des utilisateurs
- Basé sur les données d'apprentissage (MVP-007 Knowledge Learning)

### 10.2 Ajout de Nouveaux Types de Doute

De nouveaux types de doute peuvent être ajoutés :

- Basé sur l'évolution des besoins métier
- Basé sur les nouvelles contraintes réglementaires
- Basé sur les retours d'expérience

### 10.3 Ajustement des Pénalités

Les pénalités du score de confiance peuvent être ajustées :

- Basé sur la précision de la détection
- Basé sur le taux de faux positifs
- Basé sur la pertinence des actions recommandées

---

## 11. Intégration UI

### 11.1 Affichage du Doute

L'interface utilisateur affiche le doute de manière distinctive :

- Badge gris "Données Insuffisantes"
- Section "Données Insuffisantes" avec liste
- Section "Actions Recommandées" avec boutons d'action
- Niveau de confiance avec indicateur visuel (rouge)

### 11.2 Actions Utilisateur

L'utilisateur peut :

- Compléter les données manquantes
- Relancer l'analyse après complétion
- Exporter le rapport de doute
- Contacter le candidat pour clarification

### 11.3 Historique des Doutes

L'interface peut afficher :

- Historique des doutes détectés pour un candidat
- Évolution du niveau de confiance
- Actions entreprises pour résoudre le doute

---

## 12. Conformité

Le protocole de détection du doute respecte :

- **RH-000** : Principes éthiques RH (transparence, honnêteté)
- **RH-860** : Conformité et auditabilité
- **RGPD** : Protection des données personnelles
- **Accessibilité** : Explication claire des limitations

---

## 13. Exemples d'Intégration

### 13.1 Intégration avec le Recruiter Copilot

Le Recruiter Copilot peut utiliser le protocole de doute pour :

- Alerter le recruteur quand les données sont insuffisantes
- Suggérer des questions pour compléter les données
- Proposer des actions pour résoudre le doute

### 13.2 Intégration avec le Workspace

Le Recruiter Workspace peut utiliser le protocole de doute pour :

- Afficher les profils avec doute de manière distinctive
- Permettre de compléter les données directement dans l'interface
- Suivre la résolution des doutes

### 13.3 Intégration avec l'API

L'API peut exposer :

- Un endpoint pour détecter le doute sur un profil
- Un endpoint pour suggérer des actions de résolution
- Un endpoint pour suivre l'historique des doutes

---

## 14. Conclusion

Le protocole de détection du doute garantit :

- **Transparence** sur les limitations du système
- **Honnêteté** intellectuelle du moteur
- **Actionabilité** pour résoudre les doutes
- **Confiance** des utilisateurs dans les recommandations

Le doute structuré est une caractéristique essentielle d'un système de raisonnement mature et éthique.
