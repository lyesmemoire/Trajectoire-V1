# ADR-017: Migration vers une Architecture IA 100% Server-Only

## Contexte
Lors de l'optimisation des performances (Sprint 6.4), une anomalie majeure de taille de bundle (First Load JS) a été découverte sur les routes lourdes (`/dashboard/career-copilot` et `/dashboard/interview-simulation`). L'audit a révélé que les moteurs d'intelligence artificielle (fichiers dans `core/intelligence/engines`) étaient embarqués dans le bundle JavaScript côté client, entraînant une explosion du poids (jusqu'à 120 kB superflus) et exposant potentiellement les instructions confidentielles (prompts).

## Problème
Les développeurs ont importé directement des classes de moteurs IA (ex: `CareerCopilotConversationEngine` ou `InterviewAnalyzerAIEngine`) depuis des composants React `"use client"` ou des hooks utilisés par ces derniers. Next.js, respectant le graphe de dépendances, bundle toute la logique IA pour le navigateur.

## Analyse
L'architecture actuelle manque d'une frontière physique et sémantique ferme entre le code frontend (UI) et le code backend (IA). L'approche initiale, bien que modulaire, n'impose pas l'isolation des ressources.

## Alternatives étudiées
1. **Garder l'IA sur le client en utilisant l'Edge runtime** : Non viable. Les modèles d'IA nécessitent des clés d'API qui ne doivent jamais fuiter. L'orchestration doit rester sécurisée.
2. **Utiliser des API Routes classiques (REST)** : Viable, mais introduit beaucoup de boilerplate de typage pour les requêtes/réponses internes.
3. **Architecture Next.js Server Actions (Retenue)** : Fournit le meilleur équilibre entre sécurité (exécution pure backend), typage fort de bout en bout (RPC transparent), et DX.

## Décision retenue
Nous implémentons une architecture stricte en **couches (Layered Architecture)**, totalement Server-Only pour les moteurs IA :

**UI -> Server Action -> Validation -> Use Case -> AI Engine -> LLM Provider**

### Règles Architecturales :
1. **L'UI (Client Component)** ne fait que de l'affichage et ne dépend **jamais** de `core/ai` ou `core/intelligence`.
2. **La Server Action** (point d'entrée) vérifie l'authentification et valide les inputs (Zod).
3. **Le Use Case** gère la logique d'orchestration applicative (ex: "Déclencher l'analyse puis sauvegarder en DB").
4. **L'AI Engine** gère l'intelligence métier pure, reçoit les paramètres, applique les règles métier et assemble le contexte.
5. **Le Provider LLM** s'occupe de l'abstraction technique de la requête vers Anthropic/OpenAI.
6. **Les Prompts** sont des ressources isolées (`core/ai/prompts`) utilisées par l'Engine.

## Conséquences
- **Avantages** : L'analyse laisse attendre un gain significatif de bundle (potentiellement supérieur à une centaine de kilooctets), qui devra être confirmé après migration. Clés et prompts sécurisés. Architecture testable (les moteurs peuvent être mockés pour l'UI).
- **Risques** : Refactorisation de code lourd, en particulier pour la gestion de l'état asynchrone (streaming via Route Handler, opérations ponctuelles via Server Action).
- **Contraintes** : Nécessite l'intégration de verrous CI automatiques (règles ESLint et `server-only`) de manière incrémentale.

## Plan de migration global
Le Sprint 6.6 se chargera de migrer incrémentalement :
1. Création des Use Cases et Server Actions.
2. Suppression des imports client.
3. Refonte de l'interface utilisateur pour interagir avec les nouvelles Server Actions.
4. Ajout de protections Lint.
