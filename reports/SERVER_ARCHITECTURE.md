# Server Architecture

## Cible : RSC + Loaders Pattern + Promise Delegation

Pour passer d'un mega-composant bloquant a une interface modulaire et extremement fluide :

```mermaid
graph TD
    A[Root Layout Sync] --> B[Dashboard Page]
    B -->|Fetch Async Pre-Cache| Z(CandidateGraph Data)
    B --> C[Suspense Boundary 1]
    B --> D[Suspense Boundary 2]
    B --> E[Suspense Boundary 3]
    
    C --> F[DailyCoachLoader Async]
    D --> G[ProgressionLoader Async]
    E --> H[ForecastLoader Async]

    F -.->|Demande Data Cachee| Z
    G -.->|Demande Data Cachee| Z
    H -.->|Demande Data Cachee| Z
    
    F --> I(DailyCoachWidget Sync)
    G --> J(ProgressionPlan Sync)
    H --> K(CareerForecast Sync)
```

**Ordre de rendu** : La Page renvoie son squelette HTML instantanement -> Node execute les Promises en arriere-plan -> React stream chaque Widget vers le client des la resolution de la promise correspondante.
