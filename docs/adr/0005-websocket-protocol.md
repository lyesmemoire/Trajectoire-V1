# 5. Protocole WebSocket et Sécurité

Date: 2026-07-11

## Status

Accepted

## Context

Le module Vocal nécessite une communication bidirectionnelle en temps réel à faible latence. WebSocket est adapté, mais la gestion de la sécurité (transmission de JWT) et du versionnement peut être problématique. Transmettre un JWT dans l'URL ou dans un message initial pose des risques de sécurité et limite les options de révocation.

## Decision

1. **Authentification par Ticket Éphémère** : Le client demande un ticket en REST (`POST /voice/session`) avec son JWT. Le backend retourne un `ticketId` valide pour 60 secondes. Le WebSocket utilise ce ticket pour se connecter.
2. **Versionnement strict** : Chaque message entrant inclut un `protocolVersion` (ex: `1`) pour garantir la compatibilité ascendante si le contrat de données évolue.

## Consequences

- Réduction drastique des risques de vol de JWT persistants via les logs WS.
- Une route REST supplémentaire à maintenir et protéger.
- Flexibilité pour le Frontend sans casser les anciens clients.
