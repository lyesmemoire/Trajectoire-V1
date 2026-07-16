# ADR-003: Supabase / Prisma / Adapters

## Statut
Accepté — Sprint 3.3.4

## Contexte
Trajectoire utilise différentes technologies : Supabase (Auth, Storage, Database via RPC), Prisma (ORM principal) et divers fournisseurs d'IA (Mistral, OpenAI).

## Décision
- **Supabase** est traité comme une plateforme globale (Auth, Storage).
- **Prisma** est l'ORM privilégié pour les requêtes relationnelles complexes.
- **Les services IA** (OpenAI, Mistral, Parsers) sont intégrés via des Adapters qui implémentent les Ports (capacités métier) définis par le domaine.

## Conséquences
- Clarification du rôle de chaque technologie.
- Les fournisseurs de services sont isolés de l'application par des Ports.

## Alternatives rejetées
- **Supabase pour tout** : L'ORM Supabase est moins puissant que Prisma pour les requêtes relationnelles.
- **API Gateway unifiée** : Overhead inutile pour un monolithe modulaire.
