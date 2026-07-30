# Audit QA Indépendant - Business Features Readiness

**Date:** 2026-07-29
**Auditeur:** Antigravity (QA Senior Indépendant)
**Règle stricte :** `Absence de preuve explicite = NON VALIDÉ (FAIL / UNKNOWN)`. Aucune hypothèse tolérée.

---

## 1. Inventaire des Fonctionnalités Métier

### F1. Simulations d'Entretiens sous Pression (SIL)
- **Description :** Moteur d'interviews dynamiques avec interruptions et stress générés par LLM.
- **Dépendances :** Services SIL, LLM (Mistral), Websockets/Realtime.
- **Criticité :** CRITIQUE (Cœur de valeur du produit).
- **Utilisateur :** Candidat / Utilisateur final.
- **Risques :** Latence LLM inacceptable, déconnexion en plein entretien, épuisement de crédits accidentel, hallucinations du modèle.

### F2. Replay Comportemental
- **Description :** Rejeu asynchrone des métriques d'une session (Stress, Hésitation) via le moteur `Replay Engine`.
- **Dépendances :** Base de données (stockage des snapshots), UI des cartes 3D, GraphQL/REST.
- **Criticité :** HAUTE (Facteur "Whaou" et pédagogique).
- **Utilisateur :** Candidat / Utilisateur final.
- **Risques :** Désynchronisation temporelle lors du replay, corruption des états stockés.

### F3. Career DNA (Profilage Psychologique)
- **Description :** Suivi lissé (EMA 0.7/0.3) des traits psychologiques du candidat au fil des sessions.
- **Dépendances :** Base de données (`evaluations`, `profiles`), Algorithme EMA.
- **Criticité :** MOYENNE (Fidélisation).
- **Utilisateur :** Candidat / Utilisateur final.
- **Risques :** Incohérence mathématique sur la durée, division par zéro, données écrasées.

### F4. ATS Score Réel & Optimisation CV
- **Description :** Parsing de CV, scoring via LLM Mistral, réécriture des "bullets points" et débit de crédits associé.
- **Dépendances :** Parser PDF/Text, API LLM Mistral, Système de Crédits (Stripe/Base de données).
- **Criticité :** CRITIQUE (Monétisation directe).
- **Utilisateur :** Candidat / Utilisateur final.
- **Risques :** Biais IA, facturation multiple pour un même CV en cas de timeout, échecs de parsing silencieux.

### F5. Referral Rewards (Programme Ambassadeur)
- **Description :** Attribution de crédits gratuits basée sur l'usage réel ou l'achat d'un filleul.
- **Dépendances :** Table des parrainages, Stripe Webhooks, File d'attente (Events).
- **Criticité :** MOYENNE (Acquisition).
- **Utilisateur :** Candidat / Ambassadeur.
- **Risques :** Fraude (création de comptes multiples), race conditions lors de l'attribution des crédits.

---

## 2. Grille d'Audit Strict (Matrice 15 Points)

| Critère d'Audit | F1 (Simulations) | F2 (Replay) | F3 (Career DNA) | F4 (ATS / CV) | F5 (Referral) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Tests Unitaires / Intégration** | PASS | PASS | PASS | PASS | PASS |
| **Tests End-to-End (E2E)** | PASS (06-interview) | UNKNOWN | UNKNOWN | PASS (05-ats-module) | UNKNOWN |
| **Property-Based Testing (PBT)** | PASS | PASS | PASS | UNKNOWN | UNKNOWN |
| **Fuzzing / Chaos** | FAIL (Chaos: exit 1) | PASS | PASS | UNKNOWN | UNKNOWN |
| **Cas limites (Edge Cases)** | PASS (Architecture) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| **Erreurs Utilisateur (Inputs)** | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| **Workflows Interrompus** | FAIL | FAIL | UNKNOWN | FAIL (Risque débit double) | FAIL |
| **Annulations (UX / API)** | FAIL | FAIL | N/A | FAIL | N/A |
| **Reprises (Recovery)** | PASS (Replay) | PASS | N/A | FAIL | N/A |
| **Doublons (Idempotence)** | PASS (Déterministe) | UNKNOWN | PASS | FAIL | FAIL (Race cond.) |
| **Transactions Concurrentes** | FAIL | UNKNOWN | UNKNOWN | FAIL | FAIL |
| **Droits (RLS / Auth)** | PASS | PASS | PASS | PASS | PASS |
| **Messages d'Erreur (UX)** | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| **Comportement Offline** | FAIL | FAIL | FAIL | FAIL | FAIL |
| **Comportement Réseau Lent** | FAIL | FAIL | FAIL | FAIL | FAIL |

### Justifications des FAIL / UNKNOWN :
* **Tests de Chaos** : Le dernier pipeline de certification a échoué à l'étape "Chaos Engineering Qualification (exit code 1)". Cela prouve une instabilité sous contrainte (F1).
* **Concurrence & Doublons** : Aucune preuve de tests de charge transactionnels simultanés sur le débit de crédits ATS (F4) ou les récompenses Referral (F5). Sans test de charge (Load/Stress) avéré et documenté, le risque de double-dépense (`race condition`) est de 100%.
* **Annulations & Interruptions** : Aucun test E2E (Playwright) ne simule l'abandon d'un upload de CV ou la fermeture soudaine du navigateur pendant un débit Stripe/Mistral. Que se passe-t-il si l'utilisateur coupe sa connexion juste après l'envoi de la requête ATS ? Les crédits sont-ils perdus ? Il n'y a aucune preuve du contraire.
* **Offline / Slow 3G** : Aucune trace dans la suite E2E (`01-homepage.spec.ts` à `09-mobile-recovery.spec.ts`) d'un test simulant une perte de réseau (`page.route('**/*', route => route.abort())`) ou un throttle réseau. Pour une web app temps réel (Websockets/LLM), l'absence de gestion explicite de la reconnexion UI équivaut à un bug fatal en production.
* **Erreurs Utilisateur & Messages UX** : Aucune preuve formelle que l'UI affiche des messages clairs (ex: "Fichier PDF trop lourd") plutôt que de crasher ou de faire un timeout silencieux.

---

## DÉCISION FINALE

> [!CAUTION]
> **NO-GO PRODUCTION**

**Justification détaillée :**

Bien que l'architecture logicielle sous-jacente soit brillante (Certification PBT, Preuves Mathématiques, Moteur de Convergence N-Version, Traçabilité SLSA), il y a un **décalage massif entre la robustesse de l'infrastructure et la résilience fonctionnelle / UX (User Experience)**.

Un produit n'est pas "Production-Ready" simplement parce que ses arbres de syntaxe abstraite sont mathématiquement prouvés ou que son pipeline CI est parfait. Il est "Production-Ready" quand il survit au chaos humain et réseau. 

En l'état actuel :
1. **L'échec de la suite Chaos Engineering** indique que le système backend ne gère pas encore correctement les injections d'anomalies.
2. **Absence totale de QA sur l'instabilité réseau (Offline/Throttling)** : Un candidat passant un entretien de simulation dans un train perdra sa session sans aucune garantie UX.
3. **Risque transactionnel (Crédits)** : Aucune preuve de résilience contre les attaques par rejeu ou les interruptions en cours de facturation des crédits Mistral/Stripe. L'idempotence des API critiques métier n'est pas couverte par les tests E2E.

**Plan d'Action Correctif requis pour un GO :**
- Réparer le test de Chaos (`exit code 1`).
- Implémenter des tests Playwright simulant le mode `Offline` et le `Network Throttling`.
- Créer une suite E2E d'interruptions (fermer la page pendant la génération LLM) pour vérifier la facturation et le recovery.
- Prouver l'idempotence des endpoints ATS et Referral avec des tests de concurrence massifs (simultanéité de requêtes).
