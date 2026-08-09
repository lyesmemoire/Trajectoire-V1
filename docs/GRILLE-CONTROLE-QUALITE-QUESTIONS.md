# Grille de Contrôle Qualité - Questions Extraites

Cette grille est utilisée pour valider la qualité des questions extraites depuis les docs RH avant leur intégration dans la base de questions.

## Classification des Critères

- **Critères bloquants** : 7 (Légal/éthique) → REJET direct si échec
- **Critères critiques** : 2 (role), 3 (phase), 5 (profil), 9 (objectif) → Réécriture requise si échec
- **Critères améliorables** : 1, 4, 6, 8, 10 → Correction rapide possible si échec

**Actions selon le type d'échec :**
- Critère bloquant = 0 → Question rejetée, ne rentre pas en base
- Critère critique = 0 → Question à réécrire (pas juste corriger tags)
- Critère améliorable = 0 → Correction rapide (tags, difficulté, profil)

## Checklist Rapide (0/1 par item)

Pour chaque question, évaluer les 10 critères suivants :

### 1. Compréhensible
- **Critère** : Formulation claire, pas de phrase bancale ou ambiguë.
- **Validation** : La question est facile à comprendre et sans ambiguïté.

### 2. Alignée avec role
- **Critère** : La question correspond au rôle spécifié.
  - `hr` → question plutôt comportementale/motivationnelle/fit
  - `tech` → question concrète sur pratique, code, architecture, incidents
  - `exec` → vision, décision, responsabilité, impact organisationnel
- **Validation** : Le ton et le contenu correspondent au rôle.

### 3. Alignée avec phase
- **Critère** : La question correspond à la phase spécifiée.
  - `hr` : ouverture, parcours, motivations
  - `tech` : problèmes concrets, choix techniques, trade-offs
  - `pressure` : ambiguïté, dilemmes, contradictions
  - `leadership` : influence, vision, gestion conflits
  - `wrap` : synthèse, projection, alignement final
- **Validation** : La phase est cohérente avec le contenu.

### 4. Difficulté cohérente (1–5)
- **Critère** : Le niveau de difficulté est approprié.
  - `1–2` : junior / entrée douce
  - `3` : solide mais raisonnable
  - `4–5` : exigeant, forte expérience requise
- **Validation** : La difficulté correspond au contenu de la question.

### 5. Profil ciblé pertinent (target_profile)
- **Critère** : Le profil ciblé est approprié.
  - `junior` : pas de questions trop stratégiques ou politiques
  - `executive` : pas de questions trop scolaires/simplistes
- **Validation** : Le profil est cohérent avec la difficulté et le contenu.

### 6. Pas de doublon évident
- **Critère** : La question n'est pas un doublon.
- **Validation** : Même question déjà présente avec une autre ID ?

### 7. Pas de risque légal/éthique évident
- **Critère** : La question respecte les règles légales et éthiques.
- **Validation** : 
  - Pas de question illicite (âge, famille, santé, opinions politiques/religieuses, etc.)
  - Pas de ton méprisant/violent
- **Note** : Ce critère est **bloquant**. Si violé, la question doit être rejetée.

### 8. Tags/triggers utiles
- **Critère** : Les tags et triggers sont pertinents.
- **Validation** :
  - Les tags décrivent bien le sujet (api, conflict, leadership, etc.)
  - Les triggers collent à de vrais mots-clés de CV/poste

### 9. Objectif clair (primary_goal)
- **Critère** : L'objectif de la question est clair.
- **Validation** : On comprend ce que la question cherche à mesurer (motivation, technique, comportement, leadership…).

### 10. Utilisable telle quelle en entretien réel
- **Critère** : La question est prête à l'emploi.
- **Validation** : Tu serais OK pour qu'un recruteur humain lise cette question à un candidat aujourd'hui.

## Objectifs de Qualité

Viser les objectifs suivants pour chaque lot de questions extraites :

- **≥ 90 %** des questions avec score ≥ 8/10
- **0 question** "bloquante" (critère 7 violé)

## Processus de Validation

1. **Extraction** : Lancer le script sur 2-3 docs RH
2. **Échantillonnage** : Prendre un échantillon de 30-50 questions
3. **Évaluation** : Passer chaque question dans la grille
4. **Correction** : Corriger manuellement les questions qui échouent
5. **Itération** : Répéter sur d'autres docs si qualité satisfaisante

## Outils Recommandés

- **Notion** : Créer une base avec les 10 critères comme colonnes
- **Google Sheets** : Tableur avec formules de score automatique
- **Excel** : Tableur avec filtres et tri par score

## Exemple de Tableau

| ID | Question | Compréhensible | Role | Phase | Difficulté | Profil | Doublon | Légal | Tags | Objectif | Utilisable | Commentaire / Action | Score |
|----|----------|---------------|------|-------|------------|--------|---------|-------|------|----------|------------|----------------------|-------|
| tech-api-1 | Peux-tu me décrire... | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | OK | 10/10 |
| hr-motiv-1 | Pourquoi ce poste ? | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | Tag 'motivation' à ajouter | 9/10 |
| tech-arch-1 | Comment tu architectes... | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Role devrait être tech, pas hr | 9/10 |
| behav-conflict-1 | As-tu déjà eu des conflits... | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | Question supprimée (risque légal : santé) | REJET |

## Critères de Rollout Shadow

Une fois la qualité validée, passer au rollout shadow du meta-brain sur V3 :

1. Activer shadow mode sur `engine=v3`
2. Observer les logs `unified`, `metaDecision`, `metaQuestion`
3. Valider la cohérence des décisions et questions
4. Si ≥ 80 % des questions jugées "adaptées", passer au pilotage réel

## Critères de Pilotage Réel

Pour passer en production limitée :

- Au moins 80 % des questions jugées "adaptées" par un humain
- Aucune question signalée comme juridiquement risquée
- Aucune question inutilement agressive pour junior/senior
- Pas de crash/timeout/dérive JSON sur N entretiens

## Pipeline d'Usage (Go/No-Go)

Pour chaque nouveau lot de questions (ex : +100 questions) :

1. **Échantillonnage** : Prendre 30–50 questions au hasard
2. **Évaluation** : Remplir la grille pour chacune
3. **Décision** :
   - Si ≥ 90 % des questions ont score ≥ 8/10 **ET** 0 question bloquante → **LOT ACCEPTÉ**
   - Sinon → Corriger/filtrer les questions problématiques
4. **Vérification** : Relancer un échantillon plus petit (10–20) après correction

Ce processus fixe clairement le "go/no-go" pour mettre à jour `questions.fr.json`.
