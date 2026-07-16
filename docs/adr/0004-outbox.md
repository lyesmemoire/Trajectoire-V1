# 4. Outbox Pattern

Date: 2026-07-11

## Status

Accepted

## Context

L'infrastructure peut faillir de manière temporaire (base de données indisponible, webhook down). Si nous tentons d'envoyer un événement (ex: `InterviewCompleted`) et que l'envoi échoue, l'état de l'application devient asynchrone par rapport à ses intégrations externes.

## Decision

Nous implémentons le **Transactional Outbox Pattern**.
1. Les événements sont d'abord enregistrés dans la base de données transactionnelle (Supabase/Postgres) dans une table `Outbox` au sein de la même transaction qui modifie l'Agrégat.
2. Un worker asynchrone (ou un trigger / cron) scrute l'Outbox et publie les événements.
3. Une fois l'événement publié avec succès, il est marqué comme traité.

## Consequences

- Garantie de livraison ("At-least-once delivery").
- Le système distant doit être idempotent pour gérer les doublons.
- Ajout de latence dans l'intégration asynchrone.
