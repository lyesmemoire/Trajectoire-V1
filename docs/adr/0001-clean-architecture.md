# 1. Clean Architecture & DDD

Date: 2026-07-11

## Status

Accepted

## Context

Le module `Voice Interview Engine` est le cœur de la plateforme. Il gère des états complexes (silences, interruptions, tours de parole). L'implémenter de manière fortement couplée avec le protocole réseau (WebSocket) ou avec les fournisseurs d'IA (OpenAI) rendrait le système fragile et difficile à tester.

## Decision

Nous utilisons l'**Architecture Clean** couplée au **Domain-Driven Design (DDD)**.
- **Domain** : Entités, Value Objects, Agrégats (ex: `InterviewSessionAggregate`), Policies. Zéro dépendance technique.
- **Application** : Use Cases (ex: `ProcessVoiceTurnUseCase`). Coordonne le domaine avec l'extérieur.
- **Infrastructure** : Adapteurs (ex: `OpenAIAdapter`). Implémente les Ports définis par le Domaine/Application.
- **Integration** : Points d'entrée (WebSocket, HTTP) et Middlewares.

## Consequences

- Tests unitaires très rapides sans mocks complexes.
- Remplacement facile d'OpenAI par Groq ou un modèle local.
- Rigidité nécessaire lors de la création de nouvelles fonctionnalités (respect strict des frontières).
