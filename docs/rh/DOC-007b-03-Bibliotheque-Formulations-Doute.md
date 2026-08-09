# DOC-007b-03 : Bibliothèque de Formulations de Doute

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Fournir une bibliothèque de formulations standardisées pour l'expression du doute par le moteur de raisonnement. Ces formulations garantissent cohérence, clarté et actionabilité dans toutes les situations de doute.

---

## 2. Structure des Formulations

Toute formulation de doute respecte la structure obligatoire :

```
CE QUE JE SAIS AVEC CERTITUDE
[...]

CE QUE J'ESTIME AVEC RÉSERVE
[...]

CE QUE JE NE SAIS PAS
[...]

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
[...]
```

---

## 3. Formulations NIVEAU 1 : Données Insuffisantes

### 3.1 DI-1.1 : CV Incomplet

#### Formulation Standard

```
CE QUE JE SAIS AVEC CERTITUDE
- Le candidat a fourni un CV incomplet
- Les informations suivantes sont absentes : [liste]
- Le poste requiert : [liste des exigences]

CE QUE J'ESTIME AVEC RÉSERVE
- (Aucune estimation possible sans données)

CE QUE JE NE SAIS PAS
- Les compétences techniques du candidat
- L'expérience professionnelle en années
- Le niveau de maîtrise des technologies
- La progression de carrière

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
- Demander au candidat de compléter son CV
- Préciser les compétences techniques maîtrisées
- Indiquer les durées d'expérience
- Fournir des exemples de projets
```

#### Formulation Variante (Expériences Manquantes)

```
CE QUE JE SAIS AVEC CERTITUDE
- Le candidat a déclaré des compétences mais aucune expérience
- Les compétences déclarées sont : [liste]
- Aucune expérience professionnelle n'est listée

CE QUE J'ESTIME AVEC RÉSERVE
- Il est possible que l'expérience soit mal formulée
- Les compétences pourraient être acquises hors contexte professionnel

CE QUE JE NE SAIS PAS
- Comment les compétences ont été acquises
- La durée réelle de pratique
- Le contexte d'application des compétences

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
- Demander des précisions sur l'expérience
- Solliciter des exemples de projets personnels
- Vérifier les références si disponibles
```

### 3.2 DI-1.2 : Fiche de Poste Incomplète

#### Formulation Standard

```
CE QUE JE SAIS AVEC CERTITUDE
- La fiche de poste est incomplète
- Les informations suivantes sont absentes : [liste]
- Le candidat a fourni : [résumé du profil]

CE QUE J'ESTIME AVEC RÉSERVE
- (Aucune estimation possible sans exigences claires)

CE QUE JE NE SAIS PAS
- Les compétences critiques requises
- L'expérience minimale attendue
- Le contexte de l'équipe
- Les contraintes organisationnelles

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
- Compléter la fiche de poste avec les compétences critiques
- Spécifier l'expérience minimale requise
- Définir le contexte de l'équipe
- Préciser les contraintes organisationnelles
```

### 3.3 DI-1.3 : Données Ambiguës

#### Formulation Standard

```
CE QUE JE SAIS AVEC CERTITUDE
- Le candidat utilise des formulations vagues
- Les champs suivants sont ambigus : [liste]
- Exemples d'ambiguïté : [exemples]

CE QUE J'ESTIME AVEC RÉSERVE
- Le candidat pourrait avoir les compétences mais ne les exprime pas clairement
- Le niveau de maîtrise est difficile à évaluer

CE QUE JE NE SAIS PAS
- Le niveau réel de maîtrise des compétences
- La profondeur technique
- L'expérience pratique

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
- Demander au candidat de préciser ses compétences
- Solliciter des exemples concrets d'utilisation
- Conduire un entretien technique ciblé
```

---

## 4. Formulations NIVEAU 2 : Signaux Contradictoires

### 4.1 SC-2.1 : Contradiction Compétences/Expérience

#### Formulation Standard

```
CE QUE JE SAIS AVEC CERTITUDE
- Le candidat déclare [compétence] au niveau [niveau]
- Aucune expérience correspondante n'est listée
- Les expériences listées sont : [liste]

CE QUE J'ESTIME AVEC RÉSERVE
- Il est possible que l'expérience soit mal formulée
- Le niveau d'expertise pourrait être surestimé
- La compétence pourrait avoir été acquise hors contexte professionnel

CE QUE JE NE SAIS PAS
- Comment la compétence a été acquise
- La durée réelle de pratique
- Le contexte d'application de la compétence

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
- Clarifier en entretien l'expérience avec [compétence]
- Demander des exemples concrets de projets
- Vérifier les références sur cette compétence
- Évaluer la compétence via un test technique
```

### 4.2 SC-2.2 : Incohérence Chronologique

#### Formulation Standard (Chevauchement)

```
CE QUE JE SAIS AVEC CERTITUDE
- Le candidat présente des chevauchements d'expériences
- Chevauchement détecté entre [expérience1] et [expérience2]
- Aucune explication n'est fournie

CE QUE J'ESTIME AVEC RÉSERVE
- Il est possible que le candidat ait travaillé en parallèle
- Les durées pourraient être mal estimées

CE QUE JE NE SAIS PAS
- Si le chevauchement est réel ou une erreur
- La nature du travail en parallèle si réel
- L'impact sur la disponibilité

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
- Clarifier la chronologie des expériences
- Expliquer les chevauchements si réels
- Vérifier la disponibilité actuelle
```

#### Formulation Variante (Période Sans Activité)

```
CE QUE JE SAIS AVEC CERTITUDE
- Le candidat présente une période sans activité
- Période détectée : [durée] entre [expérience1] et [expérience2]
- Aucune explication n'est fournie

CE QUE J'ESTIME AVEC RÉSERVE
- Le candidat pourrait avoir été en formation
- La période pourrait correspondre à une activité non listée

CE QUE JE NE SAIS PAS
- La raison de cette période
- Les activités entreprises pendant cette période
- L'impact sur la continuité des compétences

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
- Expliquer la période sans activité
- Décrire les activités entreprises
- Évaluer l'impact sur les compétences
```

### 4.3 SC-2.3 : Contradiction Formation/Titre

#### Formulation Standard

```
CE QUE JE SAIS AVEC CERTITUDE
- Le candidat a un niveau de formation : [formation]
- Le titre du poste actuel est : [titre]
- L'expérience totale est : [durée]

CE QUE J'ESTIME AVEC RÉSERVE
- Le candidat pourrait avoir des compétences pratiques non académiques
- L'expérience pourrait compenser le niveau de formation

CE QUE JE NE SAIS PAS
- Comment le candidat a atteint ce niveau de responsabilité
- Si les compétences pratiques sont suffisantes
- La pertinence de la formation pour le poste

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
- Clarifier le parcours vers ce niveau de responsabilité
- Évaluer les compétences pratiques en entretien
- Vérifier la pertinence de la formation
```

### 4.4 SC-2.4 : Incohérence Secteur

#### Formulation Standard

```
CE QUE JE SAIS AVEC CERTITUDE
- Le candidat a travaillé dans des secteurs variés
- Secteurs : [liste]
- Le poste cible est dans : [secteur]

CE QUE J'ESTIME AVEC RÉSERVE
- Les compétences pourraient être transférables entre secteurs
- Le candidat pourrait avoir une capacité d'adaptation élevée

CE QUE JE NE SAIS PAS
- La pertinence de l'expérience dans [secteur cible]
- La capacité de transfert des compétences
- La motivation pour le changement de secteur

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
- Expliquer la motivation pour le changement de secteur
- Évaluer la transférabilité des compétences
- Vérifier la compréhension du secteur cible
```

---

## 5. Formulations NIVEAU 3 : Zone Grise Métier

### 5.1 ZG-3.1 : Profil Atypique

#### Formulation Standard

```
CE QUE JE SAIS AVEC CERTITUDE
- Le candidat présente un parcours non conventionnel
- Changements de carrière : [liste]
- Expérience dans des domaines éloignés : [liste]

CE QUE J'ESTIME AVEC RÉSERVE
- La transférabilité des compétences entre domaines
- La capacité d'adaptation du candidat
- La pertinence de l'expérience atypique

CE QUE JE NE SAIS PAS
- Comment les compétences d'un domaine s'appliquent à l'autre
- La solidité des compétences techniques
- La motivation pour les changements de carrière

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
- Intervention d'un expert RH pour évaluer ce profil
- Entretien technique approfondi
- Vérification des compétences pratiques
- Évaluation de la motivation
```

### 5.2 ZG-3.2 : Contexte Inhabituel

#### Formulation Standard

```
CE QUE JE SAIS AVEC CERTITUDE
- Le poste présente un contexte inhabituel
- Caractéristiques du contexte : [liste]
- L'équipe a une structure : [description]

CE QUE J'ESTIME AVEC RÉSERVE
- Le candidat pourrait s'adapter à ce contexte
- Les compétences du candidat pourraient être transférables

CE QUE JE NE SAIS PAS
- La capacité du candidat à s'adapter à ce contexte
- L'impact du contexte sur la performance
- La pertinence des compétences du candidat

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
- Intervention d'un expert RH pour évaluer le contexte
- Entretien avec l'équipe actuelle
- Période d'essai prolongée si recrutement
```

### 5.3 ZG-3.3 : Compétences Émergentes

#### Formulation Standard

```
CE QUE JE SAIS AVEC CERTITUDE
- Le candidat maîtrise des compétences émergentes
- Compétences : [liste]
- Ces compétences ne sont pas couvertes par mes patterns de référence

CE QUE J'ESTIME AVEC RÉSERVE
- Ces compétences pourraient être pertinentes pour le poste
- Le candidat pourrait être un early adopter

CE QUE JE NE SAIS PAS
- La pertinence réelle de ces compétences pour le poste
- Le niveau de maîtrise effectif
- La transférabilité de ces compétences

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
- Intervention d'un expert technique pour évaluer ces compétences
- Recherche sur la pertinence de ces compétences
- Évaluation pratique via un projet test
```

### 5.4 ZG-3.4 : Cas Limite

#### Formulation Standard

```
CE QUE JE SAIS AVEC CERTITUDE
- Le candidat est à la limite des critères
- Expérience : [durée] vs requis : [durée requise]
- Compétences : [nombre] vs requis : [nombre requis]

CE QUE J'ESTIME AVEC RÉSERVE
- Le candidat pourrait compenser par d'autres facteurs
- La progression pourrait être rapide

CE QUE JE NE SAIS PAS
- Si le candidat peut performer au niveau requis
- La capacité à combler l'écart rapidement
- L'impact sur la performance à long terme

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
- Évaluation approfondie en entretien
- Test technique pour vérifier le niveau réel
- Plan de formation structuré si recrutement
- Période d'essai prolongée
```

---

## 6. Formulations NIVEAU 4 : Risque Éthique ou Juridique

### 6.1 RE-4.1 : Discrimination Potentielle

#### Formulation Standard

```
Je dois interrompre ce raisonnement.

J'ai détecté un élément qui présente
un risque éthique et juridique.

Le critère [critère détecté]
constitue une discrimination potentielle
basée sur [caractéristique protégée],
interdite par la législation [référence légale].

Je ne peux pas poursuivre sur ce point
sans intervention humaine.

Orientation vers l'expert conformité RH
pour révision des critères de sélection.
```

#### Formulation Variante (Langage Implicite)

```
Je dois interrompre ce raisonnement.

J'ai détecté un élément qui présente
un risque éthique et juridique.

Le langage utilisé [exemple]
suggère une discrimination potentielle
basée sur [caractéristique protégée].

Je ne peux pas poursuivre sur ce point
sans intervention humaine.

Orientation vers l'expert conformité RH
pour révision du langage utilisé.
```

### 6.2 RE-4.2 : Risque RGPD

#### Formulation Standard

```
Je dois interrompre ce raisonnement.

J'ai détecté un élément qui présente
un risque juridique RGPD.

La donnée [donnée détectée]
est une donnée sensible
non justifiée par le contexte du recrutement.

Je ne peux pas poursuivre sur ce point
sans intervention humaine.

Orientation vers le DPO
pour validation du traitement de données.
```

### 6.3 RE-4.3 : Violation de Conformité

#### Formulation Standard

```
Je dois interrompre ce raisonnement.

J'ai détecté un élément qui présente
un risque de non-conformité.

L'exigence [exigence détectée]
semble contraire à la législation [référence].

Je ne peux pas poursuivre sur ce point
sans intervention humaine.

Orientation vers l'expert conformité RH
pour révision des exigences du poste.
```

---

## 7. Formulations Génériques

### 7.1 Introduction Générale

```
Les données disponibles sont insuffisantes
pour produire une recommandation fiable.

Ce qui me manque :
[liste précise des données manquantes]

Ce que je peux faire malgré ce manque :
[analyse partielle avec périmètre clairement borné]

Ce que je recommande avant de décider :
[actions : demander des précisions /
 conduire un entretien ciblé /
 demander des références]
```

### 7.2 Conclusion Générale

```
En l'état actuel des informations,
je ne peux pas formuler de recommandation.

Les points suivants doivent être clarifiés
avant toute décision :
[liste des points à clarifier]

Une fois ces clarifications obtenues,
je pourrai fournir une analyse plus précise.
```

---

## 8. Modèles de Remplacement

### 8.1 Modèles pour "CE QUE JE SAIS AVEC CERTITUDE"

| Situation | Modèle |
|----------|--------|
| Compétence déclarée | "Le candidat déclare [compétence] au niveau [niveau]" |
| Expérience listée | "Le candidat a une expérience de [durée] en [domaine]" |
| Formation | "Le candidat a obtenu [diplôme] en [année]" |
| Certification | "Le candidat est certifié [certification]" |
| Poste requis | "Le poste requiert [compétence] comme compétence [critique/préférée]" |

### 8.2 Modèles pour "CE QUE J'ESTIME AVEC RÉSERVE"

| Situation | Modèle |
|----------|--------|
| Estimation de niveau | "J'estime que le niveau est [niveau] (hypothèse basée sur [raison])" |
| Transfert de compétences | "Je suppose que [compétence] est transférable (hypothèse basée sur [raison])" |
| Capacité d'adaptation | "J'estime que la capacité d'adaptation est [niveau] (hypothèse basée sur [raison])" |

### 8.3 Modèles pour "CE QUE JE NE SAIS PAS"

| Situation | Modèle |
|----------|--------|
| Compétence manquante | "Je ne connais pas le niveau de maîtrise de [compétence]" |
| Contexte absent | "Je ne sais pas si [condition] est applicable" |
| Motivation | "Je ne peux pas évaluer la motivation pour [changement]" |

### 8.4 Modèles pour "CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE"

| Situation | Modèle |
|----------|--------|
| Clarification | "Je recommande de clarifier [point] en entretien" |
| Vérification | "Je suggère de vérifier [point] via [méthode]" |
| Test | "Je propose d'évaluer [compétence] via un test technique" |
| Expert | "Je recommande l'intervention d'un expert [type]" |

---

## 9. Règles de Formulation

### 9.1 Règles de Langage

- Utiliser un langage clair et précis
- Éviter le jargon technique excessif
- Être factuel et objectif
- Ne pas émettre d'opinion subjective

### 9.2 Règles de Structure

- Respecter scrupuleusement la structure à 4 sections
- Chaque section doit être non vide si applicable
- Utiliser des listes à puces pour la clarté
- Numéroter les éléments si nécessaire

### 9.3 Règles de Contenu

- "CE QUE JE SAIS AVEC CERTITUDE" : uniquement des faits observables
- "CE QUE J'ESTIME AVEC RÉSERVE" : inférences avec justification
- "CE QUE JE NE SAIS PAS" : inconnues identifiées
- "CE QUE JE RECOMMANDE" : actions concrètes et réalisables

---

## 10. Implémentation

### 10.1 Structure de Données

```typescript
interface DoubtFormulation {
  level: number;
  type: string;
  certainFacts: string[];
  reservedEstimates: Array<{
    estimate: string;
    justification: string;
  }>;
  unknowns: string[];
  recommendations: string[];
}
```

### 10.2 Bibliothèque de Formulations

```typescript
class DoubtFormulationLibrary {
  private formulations: Map<string, DoubtFormulation> = new Map();

  getFormulation(level: number, type: string, context: any): DoubtFormulation {
    const key = `${level}-${type}`;
    const template = this.formulations.get(key);
    
    if (!template) {
      return this.getDefaultFormulation(level, type);
    }

    return this.customizeFormulation(template, context);
  }

  private customizeFormulation(template: DoubtFormulation, context: any): DoubtFormulation {
    // Customization based on context
    return template;
  }
}
```

---

## 11. Maintenance

La bibliothèque de formulations doit être révisée :

- Trimestriellement basé sur les retours d'expérience
- Lors de l'ajout de nouveaux types de doute
- Basé sur l'évolution du langage et des normes
- Basé sur les besoins d'accessibilité

---

## 12. Conclusion

La bibliothèque de formulations de doute garantit :

- **Cohérence** des expressions de doute
- **Clarté** pour les utilisateurs
- **Actionabilité** des recommandations
- **Traçabilité** des décisions
- **Accessibilité** pour les non-techniciens
