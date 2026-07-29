# Recruiter Intelligence Specification

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Objectif

Ce document définit l'intelligence du recruteur virtuel : comment il pense, prend des décisions, utilise des stratégies et tactiques, détecte les signaux psychologiques, et évalue les compétences. C'est le cerveau du système.

---

## 1. Processus de Décision

### Flux de Décision du Recruteur

```
Question
    ↓
Réponse du Candidat
    ↓
Analyse (Parsing + Compréhension)
    ↓
Hypothèse (Ce que le candidat veut dire)
    ↓
Preuve (Quelles preuves sont fournies)
    ↓
Validation (Les preuves sont-elles solides ?)
    ↓
Décision (Compétence validée ou non)
    ↓
Relance (Approfondir ou passer à autre chose)
```

### Détail de Chaque Étape

#### Question

**Objectif** : Poser une question ciblée pour évaluer une compétence spécifique.

**Types de questions**
- Ouverte : "Parlez-moi d'un projet complexe..."
- Spécifique : "Comment avez-vous géré X ?"
- Hypothétique : "Que feriez-vous si... ?"
- Comportementale : "Décrivez une situation où..."

**Caractéristiques**
- Claire et précise
- Un seul objectif par question
- Évite les questions multiples
- Évite les questions suggestives

---

#### Réponse du Candidat

**Objectif** : Recevoir la réponse du candidat.

**Types de réponses**
- Directe : Réponse claire et structurée
- Vague : Réponse imprécise
- Évasive : Évitement de la question
- Technique : Réponse très détaillée
- Comportementale : Réponse basée sur l'expérience

**Caractéristiques à observer**
- Longueur de la réponse
- Structure de la réponse
- Confiance dans la réponse
- Détails vs généralités

---

#### Analyse

**Objectif** : Comprendre ce que le candidat a dit.

**Processus**
1. **Parsing** : Extraire les informations clés
2. **Compréhension** : Interpréter le sens
3. **Contextualisation** : Remettre dans le contexte
4. **Identification** : Identifier les compétences démontrées

**Outils**
- NLP pour l'extraction d'entités
- Classification des réponses
- Détection des thèmes
- Détection des sentiments

---

#### Hypothèse

**Objectif** : Formuler une hypothèse sur ce que le candidat veut dire.

**Processus**
1. **Inférence** : Déduire le sens implicite
2. **Clarification** : Identifier les ambiguïtés
3. **Interprétation** : Interpréter les sous-entendus
4. **Validation** : Valider l'hypothèse

**Types d'hypothèses**
- Le candidat a fait X
- Le candidat a compris Y
- Le candidat a évité Z
- Le candidat est confiant sur W

---

#### Preuve

**Objectif** : Identifier les preuves fournies par le candidat.

**Types de preuves**
- **Quantitatives** : Chiffres, métriques, pourcentages
- **Qualitatives** : Descriptions, anecdotes, exemples
- **Directes** : "J'ai fait X"
- **Indirectes** : "L'équipe a fait X" (implication)

**Évaluation des preuves**
- Spécificité : La preuve est-elle spécifique ?
- Mesurabilité : La preuve est-elle mesurable ?
- Vérifiabilité : La preuve est-elle vérifiable ?
- Pertinence : La preuve est-elle pertinente ?

---

#### Validation

**Objectif** : Valider si les preuves sont solides.

**Critères de validation**
- **Suffisance** : Les preuves sont-elles suffisantes ?
- **Consistance** : Les preuves sont-elles cohérentes ?
- **Crédibilité** : Les preuves sont-elles crédibles ?
- **Récence** : Les preuves sont-elles récentes ?

**Processus de validation**
1. Vérifier la cohérence interne
2. Vérifier la cohérence avec le CV
3. Vérifier la cohérence avec les réponses précédentes
4. Vérifier la plausibilité

---

#### Décision

**Objectif** : Décider si la compétence est validée.

**Types de décisions**
- **Validée** : La compétence est démontrée avec des preuves solides
- **Partiellement validée** : La compétence est partiellement démontrée
- **Non validée** : La compétence n'est pas démontrée
- **Besoin de clarification** : Besoin de plus d'informations

**Facteurs de décision**
- Qualité des preuves
- Niveau de détail
- Confiance du candidat
- Cohérence avec le CV

---

#### Relance

**Objectif** : Approfondir ou passer à autre chose.

**Types de relances**
- **Clarification** : "Pouvez-vous préciser X ?"
- **Approfondissement** : "Comment avez-vous fait X ?"
- **Challenge** : "Pourquoi avez-vous choisi X ?"
- **Transition** : "Passons à autre chose"

**Critères de relance**
- Si la réponse est vague → Clarification
- Si la réponse est intéressante → Approfondissement
- Si la réponse est suspecte → Challenge
- Si la compétence est validée → Transition

---

## 2. Stratégies

### Clarification

**Objectif** : Clarifier une réponse vague ou ambiguë.

**Tactiques**
- "Pouvez-vous donner un exemple concret ?"
- "Que voulez-vous dire par X ?"
- "Pouvez-vous préciser Y ?"
- "Comment exactement ?"

**Signaux**
- Réponse vague
- Réponse imprécise
- Réponse ambiguë
- Réponse générique

---

### Evidence

**Objectif** : Obtenir des preuves quantitatives ou qualitatives.

**Tactiques**
- "Combien exactement ?"
- "Quelle était l'ampleur de X ?"
- "Quels résultats avez-vous obtenus ?"
- "Comment avez-vous mesuré X ?"

**Signaux**
- Réponse sans chiffres
- Réponse sans métriques
- Réponse sans résultats
- Réponse sans exemples

---

### Challenge

**Objectif** : Challenger une réponse pour tester la profondeur.

**Tactiques**
- "Pourquoi avez-vous choisi X ?"
- "Quelles alternatives avez-vous considérées ?"
- "Quels étaient les tradeoffs ?"
- "Comment auriez-vous fait différemment ?"

**Signaux**
- Réponse trop parfaite
- Réponse sans nuance
- Réponse sans réflexion
- Réponse sans critique

---

### Ownership

**Objectif** : Identifier le rôle exact du candidat.

**Tactiques**
- "Quel était précisément votre rôle ?"
- "Qu'avez-vous fait personnellement ?"
- "Quelle partie avez-vous dirigée ?"
- "Comment avez-vous contribué ?"

**Signaux**
- Réponse à la première personne du pluriel ("nous")
- Réponse vague sur le rôle
- Réponse sans responsabilité claire
- Réponse sans contribution personnelle

---

### Metrics

**Objectif** : Obtenir des métriques quantitatives.

**Tactiques**
- "Comment avez-vous mesuré X ?"
- "Quelles étaient les métriques ?"
- "Quel était l'impact chiffré ?"
- "Comment avez-vous suivi les progrès ?"

**Signaux**
- Réponse sans métriques
- Réponse sans chiffres
- Réponse sans mesure
- Réponse sans suivi

---

### Tradeoffs

**Objectif** : Identifier les compromis et les décisions.

**Tactiques**
- "Quels étaient les tradeoffs ?"
- "Quelles contraintes avez-vous rencontrées ?"
- "Comment avez-vous arbitré entre X et Y ?"
- "Qu'avez-vous sacrifié ?"

**Signaux**
- Réponse sans compromis
- Réponse sans contraintes
- Réponse sans arbitrage
- Réponse sans sacrifice

---

### Failure

**Objectif** : Identifier les échecs et les leçons apprises.

**Tactiques**
- "Quels échecs avez-vous rencontrés ?"
- "Qu'avez-vous appris de X ?"
- "Comment auriez-vous fait différemment ?"
- "Quels étaient les points faibles ?"

**Signaux**
- Réponse sans échecs
- Réponse sans leçons
- Réponse sans réflexion
- Réponse sans critique

---

### Leadership

**Objectif** : Évaluer les compétences de leadership.

**Tactiques**
- "Comment avez-vous motivé l'équipe ?"
- "Comment avez-vous géré les conflits ?"
- "Comment avez-vous pris des décisions difficiles ?"
- "Comment avez-vous développé les talents ?"

**Signaux**
- Réponse sans leadership
- Réponse sans motivation
- Réponse sans gestion de conflits
- Réponse sans développement

---

### Architecture

**Objectif** : Évaluer les compétences d'architecture.

**Tactiques**
- "Quelle était l'architecture ?"
- "Pourquoi avez-vous choisi X ?"
- "Quels étaient les tradeoffs ?"
- "Comment avez-vous évolué l'architecture ?"

**Signaux**
- Réponse sans architecture
- Réponse sans justification
- Réponse sans tradeoffs
- Réponse sans évolution

---

### Debugging

**Objectif** : Évaluer les compétences de debugging.

**Tactiques**
- "Comment avez-vous identifié le problème ?"
- "Comment avez-vous investigué ?"
- "Comment avez-vous résolu ?"
- "Qu'avez-vous appris ?"

**Signaux**
- Réponse sans investigation
- Réponse sans méthodologie
- Réponse sans résolution
- Réponse sans apprentissage

---

### Product

**Objectif** : Évaluer les compétences produit.

**Tactiques**
- "Quel était le problème utilisateur ?"
- "Comment avez-vous identifié le besoin ?"
- "Comment avez-vous priorisé ?"
- "Quel était l'impact ?"

**Signaux**
- Réponse sans utilisateur
- Réponse sans besoin
- Réponse sans priorisation
- Réponse sans impact

---

### Behavior

**Objectif** : Évaluer les compétences comportementales.

**Tactiques**
- "Décrivez une situation où..."
- "Comment avez-vous réagi ?"
- "Qu'avez-vous ressenti ?"
- "Qu'avez-vous appris ?"

**Signaux**
- Réponse sans situation
- Réponse sans réaction
- Réponse sans émotion
- Réponse sans apprentissage

---

## 3. Tactiques

### Exemple 1 : "J'ai amélioré les performances"

**Réponse du candidat** : "J'ai amélioré les performances de l'application."

**Tactique 1 : Evidence**
- **Question** : "Combien exactement ?"
- **Objectif** : Obtenir un chiffre précis
- **Réponse attendue** : "J'ai réduit le temps de réponse de 500ms à 100ms."

**Tactique 2 : Metrics**
- **Question** : "Comment les avez-vous mesurées ?"
- **Objectif** : Obtenir la méthodologie de mesure
- **Réponse attendue** : "J'ai utilisé New Relic pour mesurer le temps de réponse P95."

**Tactique 3 : Ownership**
- **Question** : "Quel était précisément votre rôle ?"
- **Objectif** : Identifier la contribution personnelle
- **Réponse attendue** : "J'ai identifié le goulot d'étranglement dans la base de données et j'ai optimisé les requêtes."

---

### Exemple 2 : "J'ai dirigé l'équipe"

**Réponse du candidat** : "J'ai dirigé l'équipe sur le projet."

**Tactique 1 : Clarification**
- **Question** : "Que voulez-vous dire par 'dirigé' ?"
- **Objectif** : Clarifier le rôle exact
- **Réponse attendue** : "J'ai défini la vision, priorisé les tâches, et fait des revues de code."

**Tactique 2 : Evidence**
- **Question** : "Quelle était la taille de l'équipe ?"
- **Objectif** : Obtenir un chiffre précis
- **Réponse attendue** : "L'équipe comptait 5 développeurs."

**Tactique 3 : Leadership**
- **Question** : "Comment avez-vous motivé l'équipe ?"
- **Objectif** : Évaluer les compétences de leadership
- **Réponse attendue** "J'ai organisé des réunions hebdomadaires, donné du feedback, et célébré les succès."

---

### Exemple 3 : "J'ai utilisé une architecture microservices"

**Réponse du candidat** : "J'ai utilisé une architecture microservices."

**Tactique 1 : Clarification**
- **Question** : "Pourquoi avez-vous choisi microservices ?"
- **Objectif** : Comprendre la justification
- **Réponse attendue** : "Pour permettre le déploiement indépendant et la scalabilité."

**Tactique 2 : Tradeoffs**
- **Question** : "Quels étaient les tradeoffs ?"
- **Objectif** : Identifier les compromis
- **Réponse attendue** : "La complexité opérationnelle a augmenté, mais la scalabilité s'est améliorée."

**Tactique 3 : Architecture**
- **Question** : "Comment avez-vous géré la communication entre services ?"
- **Objectif** : Évaluer les compétences d'architecture
- **Réponse attendue** : "J'ai utilisé gRPC pour la communication synchrone et Kafka pour la communication asynchrone."

---

## 4. Psychologie

### Détection du Stress

**Signaux**
- Réponses courtes
- Hésitations
- Répétitions
- Voix tremblante (audio)
- Respiration rapide (audio)

**Tactiques**
- Réduire la pression
- Donner du temps
- Reformuler la question
- Passer à autre chose si nécessaire

---

### Détection de l'Évitement

**Signaux**
- Réponses hors sujet
- Réponses génériques
- Réponses sans détails
- Changement de sujet

**Tactiques**
- Revenir à la question
- Clarifier l'objectif
- Donner un exemple
- Challenge si nécessaire

---

### Détection du Mensonge

**Signaux**
- Incohérences avec le CV
- Incohérences avec les réponses précédentes
- Réponses trop parfaites
- Réponses sans faiblesses

**Tactiques**
- Challenge
- Demander des détails
- Vérifier la cohérence
- Demander des preuves

---

### Détection de la Survente

**Signaux**
- Réponses très longues
- Réponses trop détaillées
- Réponses hors sujet
- Répétitions

**Tactiques**
- Interrompre poliment
- Clarifier l'objectif
- Demander de synthétiser
- Passer à autre chose

---

### Détection du Manque de Confiance

**Signaux**
- Hésitations
- "Je pense que..."
- "Je ne suis pas sûr..."
- Réponses avec des conditionnels

**Tactiques**
- Encourager
- Donner du temps
- Valider les réponses
- Réduire la pression

---

### Détection de la Réponse IA

**Signaux**
- Réponses trop structurées
- Réponses trop parfaites
- Réponses sans émotion
- Réponses génériques

**Tactiques**
- Challenge
- Demander des détails personnels
- Demander des émotions
- Demander des exemples spécifiques

---

### Détection du Bullshit Technique

**Signaux**
- Utilisation de buzzwords sans contexte
- Réponses superficielles
- Réponses sans profondeur
- Réponses sans compréhension

**Tactiques**
- Demander des détails
- Demander "pourquoi"
- Demander "comment"
- Challenge la compréhension

---

### Détection de la Réponse Vague

**Signaux**
- Réponses sans chiffres
- Réponses sans exemples
- Réponses sans détails
- Réponses génériques

**Tactiques**
- Clarification
- Demander des exemples
- Demander des chiffres
- Demander des détails

---

## 5. Arbres de Décision

### Arbre de Décision : Réponse Excellente

```
Réponse excellente
    ↓
Augmenter la difficulté
    ↓
Compétence : Architecture
    ↓
Question : "Quelle était l'architecture ?"
    ↓
Réponse excellente
    ↓
Compétence : Leadership
    ↓
Question : "Comment avez-vous dirigé l'équipe ?"
    ↓
Réponse excellente
    ↓
Compétence : Tradeoffs
    ↓
Question : "Quels étaient les tradeoffs ?"
```

### Arbre de Décision : Réponse Moyenne

```
Réponse moyenne
    ↓
Clarifier
    ↓
Relance : "Pouvez-vous préciser ?"
    ↓
Réponse améliorée
    ↓
Continuer
    ↓
Réponse toujours moyenne
    ↓
Passer à autre chose
    ↓
Compétence partiellement validée
```

### Arbre de Décision : Réponse Faible

```
Réponse faible
    ↓
Challenge
    ↓
Relance : "Pourquoi ?"
    ↓
Réponse améliorée
    ↓
Continuer
    ↓
Réponse toujours faible
    ↓
Passer à autre chose
    ↓
Compétence non validée
```

### Arbre de Décision : Évitement

```
Évitement détecté
    ↓
Clarifier
    ↓
Relance : "Pouvez-vous répondre à la question ?"
    ↓
Réponse toujours évasive
    ↓
Challenge
    ↓
Relance : "Pourquoi évitez-vous cette question ?"
    ↓
Réponse toujours évasive
    ↓
Compétence non validée
    ↓
Noter l'évitement
```

---

## 6. Objectifs

### Structure d'un Objectif

Chaque question doit avoir :

#### Goal

**Description** : L'objectif de la question

**Exemple** : "Évaluer la capacité du candidat à concevoir une architecture scalable."

#### Expected Signals

**Description** : Les signaux attendus pour une réponse excellente

**Exemple** :
- Mention de la scalabilité
- Mention des tradeoffs
- Mention des contraintes
- Mention des décisions

#### Exit Conditions

**Description** : Les conditions pour passer à la question suivante

**Exemple** :
- Le candidat a fourni une réponse détaillée
- Le candidat a démontré une compréhension claire
- Le candidat a donné des exemples concrets

#### Failure Conditions

**Description** : Les conditions pour considérer la compétence non validée

**Exemple** :
- Le candidat a donné une réponse vague
- Le candidat a évité la question
- Le candidat n'a pas démontré de compréhension

---

### Exemple d'Objectif

**Question** : "Parlez-moi d'un projet d'architecture scalable que vous avez conçu."

**Goal** : Évaluer la capacité du candidat à concevoir une architecture scalable.

**Expected Signals** :
- Mention de la scalabilité
- Mention des tradeoffs
- Mention des contraintes
- Mention des décisions
- Mention des résultats

**Exit Conditions** :
- Le candidat a décrit l'architecture
- Le candidat a expliqué les tradeoffs
- Le candidat a donné des résultats chiffrés

**Failure Conditions** :
- Le candidat a donné une réponse vague
- Le candidat n'a pas mentionné la scalabilité
- Le candidat n'a pas donné de résultats

---

## 7. Compétences

### Comment Mesurer

#### Leadership

**Pourquoi** : Évaluer la capacité à diriger une équipe.

**Preuves attendues** :
- Exemples de motivation d'équipe
- Exemples de gestion de conflits
- Exemples de prise de décision
- Exemples de développement de talents

**Timing** :
- Phase d'introduction (leadership général)
- Phase de comportemental (leadership spécifique)

**Métriques** :
- Clarté du rôle
- Impact des décisions
- Développement de l'équipe
- Résultats de l'équipe

---

#### Architecture

**Pourquoi** : Évaluer la capacité à concevoir des systèmes.

**Preuves attendues** :
- Description de l'architecture
- Justification des choix
- Tradeoffs identifiés
- Évolution de l'architecture

**Exemples concrets** :
- "J'ai conçu une architecture microservices pour permettre le déploiement indépendant."
- "J'ai choisi PostgreSQL pour la cohérence des données."
- "Le tradeoff était la complexité opérationnelle vs la scalabilité."

**Timing** :
- Phase technique (architecture générale)
- Phase de system design (architecture spécifique)

**Métriques** :
- Complexité de l'architecture
- Pertinence des choix
- Clarté des tradeoffs
- Impact des décisions

---

#### Debugging

**Pourquoi** : Évaluer la capacité à résoudre des problèmes.

**Preuves attendues** :
- Méthodologie d'investigation
- Outils utilisés
- Résolution du problème
- Leçons apprises

**Exemples concrets** :
- "J'ai utilisé les logs pour identifier le problème."
- "J'ai utilisé le profiling pour identifier le goulot d'étranglement."
- "J'ai résolu le problème en optimisant la requête."

**Timing** :
- Phase technique (debugging général)
- Phase de live coding (debugging spécifique)

**Métriques** :
- Efficacité de l'investigation
- Pertinence des outils
- Qualité de la résolution
- Profondeur des leçons

---

#### Communication

**Pourquoi** : Évaluer la capacité à communiquer clairement.

**Preuves attendues** :
- Clarté de l'expression
- Structure de la réponse
- Précision des termes
- Adaptation à l'auditoire

**Exemples concrets** :
- "J'ai expliqué l'architecture à l'équipe technique."
- "J'ai présenté les résultats au management."
- "J'ai documenté le processus pour l'équipe."

**Timing** :
- Tout au long de l'entretien

**Métriques** :
- Clarté de l'expression
- Structure de la réponse
- Précision des termes
- Adaptation à l'auditoire

---

#### Problem Solving

**Pourquoi** : Évaluer la capacité à résoudre des problèmes complexes.

**Preuves attendues** :
- Analyse du problème
- Génération de solutions
- Évaluation des solutions
- Mise en œuvre

**Exemples concrets** :
- "J'ai analysé le problème en identifiant les causes racines."
- "J'ai généré plusieurs solutions et j'ai évalué les tradeoffs."
- "J'ai mis en œuvre la solution et j'ai mesuré l'impact."

**Timing** :
- Phase technique (problem solving général)
- Phase de system design (problem solving spécifique)

**Métriques** :
- Qualité de l'analyse
- Créativité des solutions
- Pertinence de l'évaluation
- Efficacité de la mise en œuvre

---

## Conclusion

Le Recruiter Intelligence Specification définit comment le recruteur virtuel pense, prend des décisions, utilise des stratégies et tactiques, détecte les signaux psychologiques, et évalue les compétences. C'est le cerveau du système.

Les points clés sont :
1. Processus de décision en 7 étapes (Question → Réponse → Analyse → Hypothèse → Preuve → Validation → Décision → Relance)
2. 12 stratégies (Clarification, Evidence, Challenge, Ownership, Metrics, Tradeoffs, Failure, Leadership, Architecture, Debugging, Product, Behavior)
3. Tactiques spécifiques pour chaque type de réponse
4. Détection de 8 signaux psychologiques (Stress, Évitement, Mensonge, Survente, Manque de confiance, Réponse IA, Bullshit technique, Réponse vague)
5. Arbres de décision pour chaque type de réponse
6. Objectifs structurés (Goal, Expected Signals, Exit Conditions, Failure Conditions)
7. Compétences mesurées avec preuves, exemples concrets, timing et métriques

Ce document doit être utilisé comme référence pour l'implémentation du Planner, du Director et de l'AI Guard.
