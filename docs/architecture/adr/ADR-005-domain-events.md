# ADR-005: Domain Events

## Statut
Accepté — Sprint 3.3.4

## Contexte
Les orchestrateurs avaient tendance à appeler directement d'autres services pour déclencher des effets de bord (Analytics, Notifications), créant du couplage.

## Décision
Introduction d'un système d'événements de domaine via un EventBus abstrait.
- Les événements métier (CvUploaded, CvRewritten, AtsAnalysisCompleted) appartiennent au domaine (`cv/domain/events/`).
- L'infrastructure de publication (EventBus, LocalEventBus) reste dans `core/events/`.
- Les Use Cases publient des événements ; ils ne commandent jamais d'actions directes à d'autres domaines.

## Conséquences
- Découplage fort entre le domaine émetteur et les souscripteurs.
- Facilité d'intégration de nouvelles fonctionnalités sans toucher au core métier.

## Alternatives rejetées
- **Appels directs inter-domaines** : Crée du couplage et des dépendances circulaires.
- **Kafka/Redis dès le départ** : Prématuré. Le LocalEventBus est remplaçable à terme.
