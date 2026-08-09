# DOC-007b-01 : Taxonomie des Situations de Doute

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la taxonomie complète des situations de doute que le moteur de raisonnement peut rencontrer. Cette taxonomie permet de classifier et traiter systématiquement les cas d'incertitude.

---

## 2. Principe Fondateur

La capacité à douter est une marque d'expertise. Un moteur qui affirme toujours est dangereux. Un moteur qui sait quand il ne sait pas est digne de confiance.

MVP-007b définit précisément :
- Quand le moteur doit douter
- Comment il exprime son doute
- Ce qu'il propose malgré le doute
- Comment ce doute est tracé

---

## 3. Niveaux de Doute

### 3.1 NIVEAU 1 — Données Insuffisantes

**Définition :** Les données disponibles ne permettent pas une analyse fiable.

**Indicateurs :**
- CV trop court ou trop vague
- Fiche de poste incomplète
- Compétences clés non renseignées
- Expérience formulée de manière ambiguë
- Absence de contexte équipe

**Sous-catégories :**

#### DI-1.1 : CV Incomplet
- Pas d'expériences professionnelles
- Pas de formation académique
- Compétences non détaillées
- Durées d'expérience non spécifiées

#### DI-1.2 : Fiche de Poste Incomplète
- Compétences critiques non définies
- Expérience minimale non spécifiée
- Contraintes organisationnelles non fournies
- Contexte équipe absent

#### DI-1.3 : Données Ambiguës
- Compétences formulées de manière vague ("bon niveau en informatique")
- Expériences sans dates
- Titres de poste non standard
- Secteurs d'activité non précisés

**Réponse Moteur :**
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

---

### 3.2 NIVEAU 2 — Signaux Contradictoires

**Définition :** Les données contiennent des incohérences qui nécessitent clarification.

**Indicateurs :**
- CV contient des informations contradictoires
- Parcours présente des incohérences
- Compétences déclarées et expérience non alignées
- Chronologie impossible

**Sous-catégories :**

#### SC-2.1 : Contradiction Compétences/Expérience
- Candidat déclare une compétence mais aucune expérience correspondante
- Niveau de compétence déclaré incompatible avec l'expérience
- Compétences avancées déclarées sans progression visible

#### SC-2.2 : Incohérence Chronologique
- Chevauchement d'expériences non expliqué
- Périodes sans activité non justifiées
- Progression de carrière régressive sans explication

#### SC-2.3 : Contradiction Formation/Titre
- Titre de poste incompatible avec le niveau de formation
- Diplôme non pertinent pour le domaine d'expertise
- Formation récente pour poste senior sans expérience

#### SC-2.4 : Incohérence Secteur
- Expérience dans des secteurs sans lien logique
- Changements de domaine fréquents sans explication
- Compétences spécifiques à un secteur mais expérience dans un autre

**Réponse Moteur :**
```
J'ai détecté des éléments contradictoires
qui nécessitent clarification avant
toute recommandation.

Contradictions identifiées :
[liste précise]

Ces points doivent être clarifiés
en entretien avant décision.
```

---

### 3.3 NIVEAU 3 — Zone Grise Métier

**Définition :** La situation ne correspond pas à un pattern connu ou dépasse les règles existantes.

**Indicateurs :**
- Situation ne correspond pas à un pattern connu
- Règles existantes ne couvrent pas ce cas
- Contexte inhabituellement spécifique
- Profil atypique

**Sous-catégories :**

#### ZG-3.1 : Profil Atypique
- Candidat avec parcours non conventionnel
- Changements de carrière radicaux multiples
- Expérience dans des domaines éloignés du poste

#### ZG-3.2 : Contexte Inhabituel
- Poste avec contraintes très spécifiques
- Équipe avec structure non standard
- Organisation avec culture unique

#### ZG-3.3 : Compétences Émergentes
- Compétences très récentes non couvertes par les patterns
- Technologies de pointe sans historique
- Méthodologies expérimentales

#### ZG-3.4 : Cas Limite
- Candidat à la limite des critères (expérience minimale juste atteinte)
- Profil borderline entre deux niveaux de séniorité
- Compétences partiellement transférables

**Réponse Moteur :**
```
Ce profil présente des caractéristiques
inhabituelles qui dépassent
mes patterns de référence.

Ce que j'observe :
[description factuelle]

Ce que je ne peux pas évaluer :
[liste des dimensions hors périmètre]

Je recommande l'intervention d'un expert
RH humain pour ce cas spécifique.
```

---

### 3.4 NIVEAU 4 — Risque Éthique ou Juridique

**Définition :** La situation active un signal de discrimination potentielle ou un risque RGPD.

**Indicateurs :**
- Question ou profil active un signal de discrimination potentielle
- Risque RGPD détecté
- Critères prohibés présents

**Sous-catégories :**

#### RE-4.1 : Discrimination Potentielle
- Critères basés sur l'âge, le genre, l'origine, etc.
- Questions sur des caractéristiques protégées
- Biais détecté dans les critères de sélection

#### RE-4.2 : Risque RGPD
- Données personnelles sensibles non justifiées
- Traitement de données sans consentement explicite
- Conservation de données au-delà de la durée nécessaire

#### RE-4.3 : Violation de Conformité
- Critères non conformes à la législation locale
- Exigences discriminatoires implicites
- Pratiques non conformes aux standards RH

**Réponse Moteur :**
```
Je dois interrompre ce raisonnement.
J'ai détecté un élément qui présente
un risque [éthique / juridique / RGPD].

[Description précise du risque]

Je ne peux pas poursuivre sur ce point
sans intervention humaine.

[Orientation vers l'expert compétent]
```

---

## 4. Matrice de Décision

| Situation | Niveau | Action Moteur | Recommandation |
|-----------|--------|---------------|----------------|
| CV incomplet | 1 | Refus de recommander | Demander précisions |
| Fiche poste incomplète | 1 | Refus de recommander | Compléter fiche |
| Données ambiguës | 1 | Analyse partielle bornée | Entretien ciblé |
| Contradiction compétences/expérience | 2 | Refus de recommander | Clarification entretien |
| Incohérence chronologique | 2 | Refus de recommander | Explication requise |
| Profil atypique | 3 | Analyse limitée | Intervention expert |
| Compétences émergentes | 3 | Analyse exploratoire | Validation expert |
| Discrimination potentielle | 4 | Arrêt immédiat | Intervention conformité |
| Risque RGPD | 4 | Arrêt immédiat | Intervention DPO |

---

## 5. Format du Doute Structuré

Toute expression de doute du moteur doit respecter cette structure :

### 5.1 CE QUE JE SAIS AVEC CERTITUDE

**Contenu :** Faits établis, non sujets à interprétation

**Exemples :**
- "Le candidat déclare 3 ans d'expérience en DevOps"
- "Le poste requiert Kubernetes comme compétence critique"
- "L'équipe compte 5 personnes dont 2 seniors"

**Règles :**
- Uniquement des faits observables dans les données
- Aucune inférence
- Aucune hypothèse

### 5.2 CE QUE J'ESTIME AVEC RÉSERVE

**Contenu :** Inférences raisonnables mais non garanties, hypothèses posées et pourquoi

**Exemples :**
- "J'estime que le candidat peut acquérir Kubernetes en 2-3 mois (hypothèse basée sur la maîtrise de Docker et Terraform)"
- "Je suppose que l'équipe peut accompagner la montée en compétence (hypothèse basée sur la présence de 2 seniors)"

**Règles :**
- Inférences explicitement marquées comme estimations
- Hypothèses clairement identifiées
- Justification de chaque hypothèse

### 5.3 CE QUE JE NE SAIS PAS

**Contenu :** Données manquantes identifiées, questions sans réponse dans les documents

**Exemples :**
- "Je ne connais pas le niveau de maîtrise réel de Kubernetes"
- "Je ne sais pas si l'équipe a une capacité de mentorat"
- "Je ne peux pas évaluer la capacité d'adaptation du candidat"

**Règles :**
- Liste précise des inconnues
- Distinction entre données manquantes et impossibilité d'évaluation
- Transparence totale sur les limites

### 5.4 CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE

**Contenu :** Actions possibles dans les limites du doute, ce que l'humain doit vérifier avant de décider

**Exemples :**
- "Je recommande de conduire un entretien technique ciblé sur Kubernetes"
- "Je suggère de vérifier les références du candidat sur ses compétences DevOps"
- "Je propose de demander au candidat de détailler son expérience avec Docker"

**Règles :**
- Actions concrètes et réalisables
- Clarification des responsabilités (moteur vs humain)
- Périmètre clairement défini

---

## 6. Taxonomie Hiérarchique

```
DOUTE
├── NIVEAU 1 : Données Insuffisantes
│   ├── DI-1.1 : CV Incomplet
│   ├── DI-1.2 : Fiche de Poste Incomplète
│   └── DI-1.3 : Données Ambiguës
├── NIVEAU 2 : Signaux Contradictoires
│   ├── SC-2.1 : Contradiction Compétences/Expérience
│   ├── SC-2.2 : Incohérence Chronologique
│   ├── SC-2.3 : Contradiction Formation/Titre
│   └── SC-2.4 : Incohérence Secteur
├── NIVEAU 3 : Zone Grise Métier
│   ├── ZG-3.1 : Profil Atypique
│   ├── ZG-3.2 : Contexte Inhabituel
│   ├── ZG-3.3 : Compétences Émergentes
│   └── ZG-3.4 : Cas Limite
└── NIVEAU 4 : Risque Éthique ou Juridique
    ├── RE-4.1 : Discrimination Potentielle
    ├── RE-4.2 : Risque RGPD
    └── RE-4.3 : Violation de Conformité
```

---

## 7. Critères de Classification

### 7.1 Critères pour NIVEAU 1

- **Gravité :** Faible à moyenne
- **Résolvabilité :** Élevée (compléter les données)
- **Impact sur décision :** Bloquant temporaire
- **Action requise :** Collecte d'informations

### 7.2 Critères pour NIVEAU 2

- **Gravité :** Moyenne
- **Résolvabilité :** Moyenne (clarification requise)
- **Impact sur décision :** Bloquant jusqu'à clarification
- **Action requise :** Entretien ciblé

### 7.3 Critères pour NIVEAU 3

- **Gravité :** Variable
- **Résolvabilité :** Faible (expertise requise)
- **Impact sur décision :** Analyse limitée
- **Action requise :** Intervention expert

### 7.4 Critères pour NIVEAU 4

- **Gravité :** Élevée
- **Résolvabilité :** Variable (conformité requise)
- **Impact sur décision :** Arrêt immédiat
- **Action requise :** Intervention conformité/DPO

---

## 8. Exemples de Classification

### 8.1 Exemple NIVEAU 1

**Situation :** CV avec seulement "Développeur" et aucune autre information

**Classification :** DI-1.1 : CV Incomplet

**Réponse :**
```
CE QUE JE SAIS AVEC CERTITUDE
- Le candidat se déclare "Développeur"
- Aucune autre information n'est disponible

CE QUE J'ESTIME AVEC RÉSERVE
- (Aucune estimation possible)

CE QUE JE NE SAIS PAS
- Les compétences techniques du candidat
- L'expérience en années
- Les technologies maîtrisées
- Le niveau de séniorité

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
- Demander au candidat de détailler son expérience
- Compléter le CV avec les compétences techniques
- Préciser les technologies maîtrisées
```

### 8.2 Exemple NIVEAU 2

**Situation :** Candidat déclare "Expert Kubernetes" mais aucune expérience DevOps

**Classification :** SC-2.1 : Contradiction Compétences/Expérience

**Réponse :**
```
CE QUE JE SAIS AVEC CERTITUDE
- Le candidat se déclare "Expert Kubernetes"
- Aucune expérience DevOps n'est listée

CE QUE J'ESTIME AVEC RÉSERVE
- Il est possible que l'expérience soit mal formulée
- Le niveau d'expertise pourrait être surestimé

CE QUE JE NE SAIS PAS
- Comment le candidat a acquis cette expertise
- La durée réelle de pratique de Kubernetes
- Le contexte d'utilisation de Kubernetes

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
- Clarifier en entretien l'expérience Kubernetes
- Demander des exemples concrets de projets
- Vérifier les références sur cette compétence
```

### 8.3 Exemple NIVEAU 3

**Situation :** Candidat avec parcours de musicien devenu développeur senior

**Classification :** ZG-3.1 : Profil Atypique

**Réponse :**
```
CE QUE JE SAIS AVEC CERTITUDE
- Le candidat a un parcours musical
- Il se déclare développeur senior
- Le changement de domaine est radical

CE QUE J'ESTIME AVEC RÉSERVE
- La transférabilité des compétences musicales au développement
- La capacité d'adaptation du candidat
- La solidité des compétences techniques

CE QUE JE NE SAIS PAS
- Comment la transition s'est opérée
- La durée de la pratique du développement
- La pertinence des compétences musicales

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
- Intervention d'un expert RH pour évaluer ce profil
- Entretien technique approfondi
- Vérification des compétences pratiques
```

### 8.4 Exemple NIVEAU 4

**Situation :** Critères de sélection incluant "candidat de moins de 30 ans"

**Classification :** RE-4.1 : Discrimination Potentielle

**Réponse :**
```
Je dois interrompre ce raisonnement.

J'ai détecté un élément qui présente
un risque éthique et juridique.

Le critère "candidat de moins de 30 ans"
constitue une discrimination potentielle
basée sur l'âge, interdite par la législation.

Je ne peux pas poursuivre sur ce point
sans intervention humaine.

Orientation vers l'expert conformité RH
pour révision des critères de sélection.
```

---

## 9. Maintenance de la Taxonomie

La taxonomie doit être révisée :

- Trimestriellement basé sur les cas rencontrés
- Lors de l'ajout de nouvelles fonctionnalités
- Basé sur les retours d'expérience des utilisateurs
- Basé sur l'évolution de la réglementation

---

## 10. Intégration avec le Système

La taxonomie est utilisée par :

- `DoubtDetectorService` pour classifier les situations de doute
- `DecisionBuilderService` pour formuler les réponses appropriées
- `ReasoningService` pour décider de l'action à entreprendre
- MVP-008 Learning Engine pour améliorer la détection d'incertitude

---

## 11. Conclusion

La taxonomie des situations de doute garantit :

- **Classification systématique** des cas d'incertitude
- **Réponses appropriées** pour chaque type de doute
- **Transparence** sur les limites du système
- **Actionabilité** pour résoudre les situations de doute
- **Traçabilité** pour l'amélioration continue
