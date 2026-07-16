# 3. Domain Event Publisher

Date: 2026-07-11

## Status

Accepted

## Context

L'Agrégat `InterviewSessionAggregate` subit de nombreuses mutations lors du traitement d'un tour de voix. Nous avons besoin de réagir à ces mutations de manière découplée (ex: sauvegarder l'audio, incrémenter une métrique) sans bloquer le flux principal.

## Decision

Nous utilisons une approche basée sur les **Domain Events**.
1. Les méthodes de l'Agrégat enregistrent les événements en mémoire (`recordEvent`).
2. À la fin de la transaction (Use Case), le `DomainEventPublisher` récupère ces événements via `clearEvents()`.
3. Le Publisher dispatche ces événements aux souscripteurs ou à l'Outbox.

## Consequences

- Découplage fort entre la logique métier et les effets de bord.
- Facilitation du Replay (Event Sourcing allégé).
- Complexité accrue lors du debugging des flux asynchrones.
