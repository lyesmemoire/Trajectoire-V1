# 2. Result Pattern

Date: 2026-07-11

## Status

Accepted

## Context

Les exceptions traditionnelles (`throw new Error()`) cassent le flux d'exécution et rendent difficile la signature explicite des méthodes. Dans un système d'interview vocale, beaucoup "d'erreurs" sont en réalité des flux métier normaux (ex: transcript vide, durée trop longue).

## Decision

Nous utilisons le **Result Pattern**.
Toutes les méthodes métier et Use Cases retournent un type `Result<T, E>`.
- Les succès retournent `success(data)`.
- Les échecs connus retournent `failure(DomainError | ApplicationError)`.
- Les exceptions (`throw`) sont réservées exclusivement aux paniques de l'infrastructure (ex: out of memory, crash réseau critique).

## Consequences

- Typage strict des erreurs : le compilateur force le développeur à gérer les cas d'échec.
- Code plus verbeux (besoin de vérifier `if (!isSuccess(result))`).
- Moins de bugs en production liés à des erreurs silencieuses ou non catchées.
