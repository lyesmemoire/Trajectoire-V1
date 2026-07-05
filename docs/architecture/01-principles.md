# Principes d'Architecture (Constitution Technique)

Ce document est la source de vérité pour tout développement sur la plateforme Trajectoire. 

## 1. Séparation Stricte des Responsabilités
Chaque route API ou composant serveur doit déléguer la logique métier à un **Service**.
Le Service ne fait jamais de requêtes SQL ou Prisma directement. Il délègue l'accès aux données à un **Repository**.

**Flux d'une requête API :**
`Route (Next.js) → Validation (Zod) → Auth (Supabase) → Service Métier → Repository → Base de Données`

## 2. Accès aux Données (Supabase vs Prisma)
- **Supabase** gère l'infrastructure : Authentification (`auth.users`), Stockage, Realtime, Edge Functions et RLS.
- **Prisma** est l'ORM exclusif pour le métier : Relations complexes, requêtes PostgreSQL, transactions.
*Règle d'or* : Ne jamais faire de requêtes directes à Prisma (`prisma.table.findUnique()`) depuis une route API.

## 3. L'Entité vs Le DTO
Une entité de base de données (issue de Prisma) ne doit jamais être renvoyée telle quelle au client Front-End.
- Le Repository renvoie une Entité.
- Le Service la convertit en **DTO** (Data Transfer Object).
- La Route renvoie le DTO.

## 4. Gestion des Erreurs
Toutes les erreurs métier sont gérées par la couche `lib/core/errors` pour éviter les `try/catch` incontrôlables dans les services. Les erreurs 500 ne doivent survenir que pour des pannes d'infrastructure.
