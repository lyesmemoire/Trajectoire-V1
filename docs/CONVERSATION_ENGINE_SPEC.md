# Conversation Engine Specification

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Objectif

Ce document définit le moteur de conversation du recruteur virtuel : comment une conversation fonctionne réellement, pas comment OpenAI fonctionne, mais comment un recruteur humain agit. C'est le cœur de l'interaction.

---

## Flux de Conversation

### Flux Principal

```
Question
    ↓
Réponse du Candidat
    ↓
Silence (2-3 secondes)
    ↓
Analyse (Parsing + Compréhension)
    ↓
Hypothèse (Ce que le candidat veut dire)
    ↓
Décision (Relance ou Question Suivante)
    ↓
Relance (si nécessaire)
    ↓
Observation (Réaction du candidat)
    ↓
Nouvelle Hypothèse
    ↓
Question Suivante
```

---

## Détail du Flux

### 1. Question

**Objectif** : Poser une question ciblée pour évaluer une compétence.

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

**Timing**
- Délai de réponse : 2-3 secondes
- Délai de silence : 2-3 secondes après la réponse

---

### 2. Réponse du Candidat

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
- Émotion dans la réponse

**Timing**
- Délai de début : 0-1 seconde
- Durée de la réponse : 30-120 secondes
- Délai de fin : Immédiat

---

### 3. Silence

**Objectif** : Laisser du temps au candidat pour réfléchir et au recruteur pour analyser.

**Durée** : 2-3 secondes

**Objectifs du silence**
- Permettre au candidat de compléter sa pensée
- Permettre au recruteur d'analyser la réponse
- Créer un espace de réflexion
- Éviter l'interruption

**Signaux pendant le silence**
- Le candidat continue de parler → Ne pas interrompre
- Le candidat semble réfléchir → Laisser du temps
- Le candidat semble bloqué → Proposer de reformuler

---

### 4. Analyse

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

**Timing**
- Durée de l'analyse : 100-500ms
- Délai de décision : 500-1000ms

---

### 5. Hypothèse

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

**Confidence de l'hypothèse**
- Haute : Réponse claire et détaillée
- Moyenne : Réponse avec quelques ambiguïtés
- Faible : Réponse vague ou évasive

---

### 6. Décision

**Objectif** : Décider de relancer ou de passer à la question suivante.

**Critères de décision**
- **Relance** : Si la réponse est vague, évasive, ou nécessite des clarifications
- **Question suivante** : Si la réponse est claire, détaillée, et valide

**Types de décisions**
- Relance (Clarification)
- Relance (Approfondissement)
- Relance (Challenge)
- Question suivante
- Transition de stage

**Timing**
- Durée de la décision : 100-500ms

---

### 7. Relance

**Objectif** : Approfondir ou clarifier la réponse.

**Types de relances**
- **Clarification** : "Pouvez-vous préciser X ?"
- **Approfondissement** : "Comment avez-vous fait X ?"
- **Challenge** : "Pourquoi avez-vous choisi X ?"
- **Transition** : "Passons à autre chose"

**Caractéristiques**
- Polie et respectueuse
- Ciblée sur un point spécifique
- Évite de surcharger le candidat
- Donne du temps pour répondre

**Timing**
- Délai de relance : 1-2 secondes après le silence

---

### 8. Observation

**Objectif** : Observer la réaction du candidat à la relance.

**Types de réactions**
- Positive : Le candidat répond avec confiance
- Négative : Le candidat semble stressé ou bloqué
- Évasive : Le candidat continue d'éviter
- Améliorée : Le candidat donne une meilleure réponse

**Signaux à observer**
- Confiance dans la voix
- Vitesse de la réponse
- Détails supplémentaires
- Émotion dans la réponse

**Timing**
- Durée de l'observation : 30-60 secondes

---

### 9. Nouvelle Hypothèse

**Objectif** : Formuler une nouvelle hypothèse basée sur la relance.

**Processus**
1. **Mise à jour** : Mettre à jour l'hypothèse avec les nouvelles informations
2. **Validation** : Valider la nouvelle hypothèse
3. **Confiance** : Évaluer la confiance de la nouvelle hypothèse

**Types de mises à jour**
- Confirmation : L'hypothèse initiale est confirmée
- Infirmation : L'hypothèse initiale est infirmée
- Affinement : L'hypothèse est affinée

**Timing**
- Durée de la mise à jour : 100-500ms

---

### 10. Question Suivante

**Objectif** : Passer à la question suivante.

**Critères de transition**
- La compétence est validée
- La compétence est partiellement validée
- La compétence n'est pas validée (après plusieurs relances)
- Le temps est écoulé

**Types de transitions**
- Même compétence, question différente
- Compétence différente
- Stage différent
- Fin de l'entretien

**Timing**
- Délai de transition : 1-2 secondes

---

## Gestion du Silence

### Pourquoi le Silence est Important

Le silence est un outil puissant pour un recruteur :
- Permet au candidat de réfléchir
- Permet au recruteur d'analyser
- Crée un espace de réflexion
- Évite l'interruption

### Durée du Silence

**Silence court** : 1-2 secondes
- Pour les réponses simples
- Pour les réponses directes
- Pour les réponses courtes

**Silence moyen** : 2-3 secondes
- Pour les réponses complexes
- Pour les réponses détaillées
- Pour les réponses techniques

**Silence long** : 3-5 secondes
- Pour les réponses très complexes
- Pour les réponses évasives
- Pour les réponses stressées

### Signaux Pendant le Silence

**Le candidat continue de parler**
- Ne pas interrompre
- Laisser le candidat compléter sa pensée
- Adapter la durée du silence

**Le candidat semble réfléchir**
- Laisser du temps
- Ne pas presser le candidat
- Proposer de reformuler si nécessaire

**Le candidat semble bloqué**
- Proposer de reformuler la question
- Donner un exemple
- Passer à autre chose si nécessaire

---

## Gestion des Relances

### Quand Relancer

**Clarification**
- Réponse vague
- Réponse imprécise
- Réponse ambiguë
- Réponse générique

**Approfondissement**
- Réponse intéressante
- Réponse avec potentiel
- Réponse avec des détails intéressants
- Réponse qui mérite d'être explorée

**Challenge**
- Réponse trop parfaite
- Réponse sans nuance
- Réponse sans réflexion
- Réponse sans critique

### Comment Relancer

**Polie et respectueuse**
- "Pouvez-vous préciser X ?"
- "Pourriez-vous donner un exemple ?"
- "Comment exactement ?"

**Ciblée**
- Un seul point par relance
- Éviter les relances multiples
- Éviter les relances générales

**Donne du temps**
- Laisser du temps pour répondre
- Ne pas presser le candidat
- Proposer de reformuler si nécessaire

### Limite des Relances

**Maximum 3 relances par question**
- Après 3 relances, passer à autre chose
- Noter l'évitement si nécessaire
- Adapter la difficulté si nécessaire

---

## Gestion des Transitions

### Quand Transitionner

**Compétence validée**
- Le candidat a démontré la compétence
- Le candidat a donné des preuves solides
- Le candidat a répondu avec confiance

**Compétence partiellement validée**
- Le candidat a partiellement démontré la compétence
- Le candidat a donné des preuves partielles
- Le candidat a répondu avec une confiance moyenne

**Compétence non validée**
- Le candidat n'a pas démontré la compétence
- Le candidat a donné des preuves faibles
- Le candidat a évité la question

**Temps écoulé**
- L'entretien dépasse le temps alloué
- Le candidat semble fatigué
- Le recruteur a évalué suffisamment

### Comment Transitionner

**Smooth transition**
- "Merci pour votre réponse. Passons à autre chose."
- "C'est intéressant. Passons à un autre sujet."
- "Bien. Passons à la prochaine question."

**Abrupt transition**
- "Passons à autre chose."
- "Question suivante."
- "Autre sujet."

**Justification de transition**
- "Nous avons couvert ce sujet. Passons à autre chose."
- "Nous avons passé suffisamment de temps sur ce sujet. Passons à autre chose."
- "Je pense que nous avons une bonne compréhension. Passons à autre chose."

---

## Gestion de la Difficulté

### Adaptation de la Difficulté

**Augmenter la difficulté**
- Si le candidat répond avec excellence
- Si le candidat répond avec confiance
- Si le candidat demande plus de challenge

**Réduire la difficulté**
- Si le candidat semble stressé
- Si le candidat semble bloqué
- Si le candidat demande de l'aide

**Maintenir la difficulté**
- Si le candidat répond de manière moyenne
- Si le candidat répond avec une confiance moyenne
- Si le candidat ne demande ni plus ni moins de challenge

### Signaux d'Adaptation

**Signaux d'augmentation**
- Réponse excellente
- Réponse détaillée
- Réponse avec des exemples concrets
- Réponse avec des preuves solides

**Signaux de réduction**
- Réponse stressée
- Réponse bloquée
- Réponse avec hésitations
- Réponse avec manque de confiance

**Signaux de maintien**
- Réponse moyenne
- Réponse avec une confiance moyenne
- Réponse avec quelques détails
- Réponse avec quelques preuves

---

## Gestion de l'Émotion

### Détection de l'Émotion

**Signaux audio**
- Voix tremblante (stress)
- Voix rapide (excitation)
- Voix lente (fatigue)
- Voix monotone (ennui)

**Signaux textuels**
- Réponse courte (stress)
- Réponse longue (excitation)
- Réponse vague (ennui)
- Réponse évasive (peur)

### Adaptation à l'Émotion

**Stress**
- Réduire la pression
- Donner du temps
- Encourager
- Passer à autre chose si nécessaire

**Excitation**
- Canaliser l'excitation
- Poser des questions ciblées
- Maintenir le focus
- Éviter les distractions

**Fatigue**
- Réduire la difficulté
- Poser des questions plus simples
- Proposer une pause
- Terminer l'entretien si nécessaire

**Ennui**
- Augmenter la difficulté
- Poser des questions plus stimulantes
- Challengé
- Passer à autre chose si nécessaire

---

## Conclusion

Le Conversation Engine Specification définit comment une conversation fonctionne réellement, pas comment OpenAI fonctionne, mais comment un recruteur humain agit. C'est le cœur de l'interaction.

Les points clés sont :
1. Flux de conversation en 10 étapes (Question → Réponse → Silence → Analyse → Hypothèse → Décision → Relance → Observation → Nouvelle Hypothèse → Question Suivante)
2. Gestion du silence (1-5 secondes selon la complexité)
3. Gestion des relances (maximum 3 par question)
4. Gestion des transitions (smooth, abrupt, avec justification)
5. Gestion de la difficulté (adaptation selon les signaux)
6. Gestion de l'émotion (détection et adaptation)

Ce document doit être utilisé comme référence pour l'implémentation du Director et de l'AI Guard.
