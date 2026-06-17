# 🩺 PRODUCTION SURVIVAL DASHBOARD (5 METRICS ONLY)

Ce dashboard n'est pas conçu pour faire de l'analytics, du debugging ou du profiling. Il est conçu pour une seule chose : répondre en 5 secondes à la question "Est-ce que le système est en train de mourir silencieusement ?".

S'il y a plus de 5 métriques, c'est de la surcharge cognitive. Voici les 5 signaux vitaux de survie en production réelle.

---

## 1. 💰 MARGIN DRIFT (Cost vs Revenue per User)
**La métrique de vie ou de mort financière.**
- **Formule :** `(Stripe_Revenue_24h - LLM_Cost_24h - Infra_Cost_24h) / Active_Users`
- **Seuil critique :** Si cette valeur chute de plus de 15% par rapport à la moyenne mobile des 7 derniers jours.
- **Risque :** Le système tourne, les utilisateurs sont contents, mais la startup perd de l'argent sur chaque action (Runaway AI cost).

---

## 2. 🗄️ REPLAY DIVERGENCE RATE
**La métrique de l'intégrité de l'architecture.**
- **Formule :** `% de sessions où Hash(State) != Hash(Replay(Events))`
- **Seuil critique :** Strictement `> 0%`.
- **Risque :** Dette système invisible. Le code a évolué mais ne sait plus relire le passé, ce qui signifie que l'Event Store ne contient plus la vérité, ou que le déterminisme est brisé.

---

## 3. 💳 PAYMENT FAILURE & DISPUTE RATE
**La métrique de viabilité du produit.**
- **Formule :** `Chargebacks + Failed Webhooks / Total Transactions`
- **Seuil critique :** `> 1.5%` (Alerte Stripe imminente).
- **Risque :** Fraude organisée, bots, ou promesse produit non tenue poussant les utilisateurs à réclamer un remboursement via leur banque.

---

## 4. 🤖 AI DEGRADATION RATE (Fallback Triggers)
**La métrique de l'expérience utilisateur et de la dépendance LLM.**
- **Formule :** `% d'appels IA terminant sur le Fallback Cache ou Timeout`
- **Seuil critique :** `> 5%` sur 1h.
- **Risque :** Panne de Mistral/OpenAI ou requêtes mal formées par l'application. Le système "marche" (pas d'erreurs 500), mais l'utilisateur paie pour des résultats dégradés ou génériques.

---

## 5. 📉 CORE FLOW CONVERSION DROP
**La métrique de l'utilité réelle.**
- **Formule :** `% d'utilisateurs complétant le flow (Signup → CV Optimisé → ATS Check)`
- **Seuil critique :** Baisse soudaine de `> 20%` par rapport au baseline.
- **Risque :** Un bug front-end silencieux (ex: bouton inactif sur mobile Safari) ou une complexité cognitive soudaine qui tue l'usage avant même que le backend ne soit sollicité.

---

### 🚦 RÈGLE D'OR DE CE DASHBOARD
Si l'une de ces 5 métriques vire au rouge, l'équipe d'ingénierie **arrête tout nouveau développement** et se concentre à 100% sur le retour à la normale. C'est le seul moyen d'opérer un système de cette complexité sans s'auto-détruire.
