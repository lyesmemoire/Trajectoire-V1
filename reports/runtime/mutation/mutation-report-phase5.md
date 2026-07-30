# Audit par mutation Phase 5 - Mutations Métier - execution-pipeline

## Résultats

| Total | 12 |
| KILLED | 3 |
| SURVIVED | 0 |
| INVALID | 9 |
| Mutation Score | 100.00% |
| Confidence | 25.00% |

## Familles couvertes

3 familles sur 10: D, G, J

## Familles non couvertes

A, B, C, E, F, H, I

## Certification

**FAILED**

## Détail des mutations

| ID | Famille | Fichier | Ligne | Mutation | Compilation OK | Tests OK | Status | Temps |
|----|---------|--------|-------|----------|----------------|---------|--------|-------|
| A1 | A | execution-pipeline.ts | 64 | Supprimer fetch() | true | false | INVALID | 15250ms |
| A2 | A | execution-pipeline.ts | 68 | Supprimer decode() | true | false | INVALID | 11777ms |
| A3 | A | execution-pipeline.ts | 71 | Supprimer execute() | true | false | INVALID | 11747ms |
| B1 | B | execution-pipeline.ts | 64 | Permuter decode avant fetch | true | false | INVALID | 11717ms |
| C1 | C | execution-pipeline.ts | 228 | validate() → return true | true | false | INVALID | 11898ms |
| D1 | D | execution-pipeline.ts | 127 | Supprimer stop() | true | false | KILLED | 12516ms |
| E1 | E | execution-pipeline.ts | 31 | Forcer isHalted=true au démarrage | true | false | INVALID | 12852ms |
| F1 | F | execution-pipeline.ts | 93 | Remplacer throw par return | true | false | INVALID | 11280ms |
| G1 | G | execution-pipeline.ts | 105 | while(true) avec arrêt après 100 cycles | true | false | KILLED | 11264ms |
| H1 | H | execution-pipeline.ts | 144 | Retourner {} au lieu des statistiques | true | false | INVALID | 11885ms |
| I1 | I | execution-pipeline.ts | 144 | Toujours retourner 0 pour tous les compteurs | true | false | INVALID | 12131ms |
| J1 | J | execution-pipeline.ts | 133 | Transformer reset() en fonction vide | true | false | KILLED | 11267ms |

## SHA

| SHA avant | 3e22378 |
| SHA après | 3e22378 |
| Identique | OUI |
